import html2pdf from 'html2pdf.js';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

// Helper to ensure all images are fully loaded before capturing
const waitForImages = (element) => {
  const images = element.querySelectorAll('img');
  const promises = Array.from(images).map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve; // Resolve even on error so we don't get stuck
    });
  });
  return Promise.all(promises);
};

export const generateStudentPDF = async (studentName) => {
  const element = document.getElementById('print-area');

  if (!element) {
    alert('Error: Print template not found.');
    return;
  }

  // 1. Wait for images to load inside the hidden div
  await waitForImages(element);

  const fileName = `${studentName.replace(/\s+/g, '_')}_Profile.pdf`;

  // 2. Options
  const opt = {
    margin: 0, // No margin because we added padding in the div itself
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
        scale: 2, // Higher resolution
        useCORS: true, // Essential for loading external images (Unsplash/Cloudinary)
        scrollY: 0,
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    if (Capacitor.isNativePlatform()) {
      // --- MOBILE LOGIC ---
      const pdfWorker = html2pdf().set(opt).from(element).toPdf();
      const pdfBlob = await pdfWorker.output('datauristring');
      const base64Data = pdfBlob.split(',')[1];

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      await Share.share({
        title: `Student Profile: ${studentName}`,
        url: savedFile.uri,
      });

    } else {
      // --- WEB LOGIC ---
      // We use .save() which automatically downloads the file
      await html2pdf().set(opt).from(element).save();
    }
  } catch (error) {
    console.error("PDF Gen Error:", error);
    alert("Could not generate PDF. Please check image permissions.");
  }
};