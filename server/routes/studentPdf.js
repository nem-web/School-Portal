import express from "express";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import Student from "../model/Student.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get("/students/:id/pdf", async (req, res) => {
  try {
    // 1. Fetch Data
    // Use .lean() to get a plain JS object, easier to manipulate
    const student = await Student.findById(req.params.id).lean();
    
    if (!student) {
      return res.status(404).send("Student not found");
    }

    // 2. Read Template
    let template = fs.readFileSync(
      path.join(__dirname, "../templates/studentPdf.html"),
      "utf8"
    );

    // 3. Generate Parents HTML Block Manually
    // We cannot use simple replaceAll for arrays, so we build the HTML string here
    let parentsHtmlString = "";
    
    if (student.parents && student.parents.length > 0) {
      parentsHtmlString = student.parents.map(parent => {
        // Use a placeholder if parent photo is missing
        const pPhoto = parent.photo || "https://res.cloudinary.com/dlhauofrz/image/upload/v1767507804/blue-circle-with-white-user_78370-4707_om7kmv.jpg";
        const pAadhar = parent.aadharNo || "N/A";
        const pMobile = parent.mobileNo || "N/A";
        
        return `
          <div class="parent-card">
            <img src="${pPhoto}" class="parent-photo" onerror="this.src='https://res.cloudinary.com/dlhauofrz/image/upload/v1767507804/blue-circle-with-white-user_78370-4707_om7kmv.jpg'" />
            <div class="parent-info">
              <h4>${parent.name}</h4>
              <div class="parent-relation">${parent.relation}</div>
              <p>Aadhar: ${pAadhar}</p>
              <p>Mobile: ${pMobile}</p>
            </div>
          </div>
        `;
      }).join('');
    } else {
      parentsHtmlString = `<div style="grid-column: span 2; color: #94a3b8; font-style: italic;">No guardian details available.</div>`;
    }

    // 4. Replace Placeholders
    // First, inject the complex Parents HTML we just built
    template = template.replace('{{parentsHtml}}', parentsHtmlString);

    // Handle Student Photo specifically (ensure fallback)
    const studentPhotoUrl = student.studentPhoto || "https://res.cloudinary.com/dlhauofrz/image/upload/v1767507804/blue-circle-with-white-user_78370-4707_om7kmv.jpg";
    template = template.replaceAll('{{studentPhoto}}', studentPhotoUrl);

    // Handle standard text fields
    // We exclude 'parents' and 'studentPhoto' as we handled them above
    const keysToIgnore = ['parents', 'studentPhoto', '_id', '__v'];
    
    Object.keys(student).forEach((key) => {
      if (!keysToIgnore.includes(key)) {
        // Handle dates specifically if needed, or other formatting
        let value = student[key];
        if(key === 'dob' && value) {
            // Format date nicely if it's a date object/string
            value = new Date(value).toLocaleDateString();
        }
        template = template.replaceAll(`{{${key}}}`, value || "—");
      }
    });

    // Clean up any remaining braces if keys were missing in DB but present in HTML
    // template = template.replace(/{{.*?}}/g, "—"); 

    // 5. Puppeteer Generation
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new",
    });

    const page = await browser.newPage();
    
    // Set content and wait for network to be idle (ensures images load)
    await page.setContent(template, { 
      waitUntil: "load",
      timeout: 30000 
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true, // Crucial for background colors
      margin: {
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px"
      }
    });

    await browser.close();

    // 6. Send Response
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=${student.name.replace(/\s/g, '_')}_Profile.pdf`,
      "Content-Length": pdf.length,
    });

    res.send(pdf);

  } catch (err) {
    console.error("PDF Gen Error:", err);
    res.status(500).send("PDF generation failed: " + err.message);
  }
});

export default router;