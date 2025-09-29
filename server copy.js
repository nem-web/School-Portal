// server.js (or index.js) — corrected version

import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './db.js';
import Student from './model/Student.js';
import User, { seedUsers } from './model/User.js';
// import studentRoutes from './routes/studentRoutes.js'; // Optional: use if you prefer separate router file

import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const app = express();
const PORT = process.env.PORT || 3001;

// __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ensure uploads dir exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json()); // for JSON endpoints that use application/json
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// Connect DB + seed
connectDB();
seedUsers();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// If you use a separate router file, mount it here (pick one approach)
// app.use("/api/students", studentRoutes);

// ----------------- Helper: parse structured JSON from multipart -----------------
function parseStudentJsonFromBody(body) {
  // If frontend stored entire JSON inside 'studentDataJson'
  if (body && body.studentDataJson) {
    try {
      return JSON.parse(body.studentDataJson);
    } catch (err) {
      console.warn('Failed parsing studentDataJson:', err);
      return null;
    }
  }
  // Fallback: assume body already has fields
  return body || {};
}

// ----------------- POST: create new student -----------------
app.post(
  '/api/students',
  upload.fields([
    { name: 'studentPhoto', maxCount: 1 },
    { name: 'studentSignature', maxCount: 1 },
    { name: 'parent_0_photo', maxCount: 1 },
    { name: 'parent_1_photo', maxCount: 1 },
    { name: 'parent_2_photo', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const bodyData = parseStudentJsonFromBody(req.body) || {};
      const files = req.files || {};

      // Generate serial number if possible
      const admissionYear = bodyData.admissionYear;
      const name = bodyData.name || '';
      const dob = bodyData.dob || '';

      let serialNumber = '';
      if (admissionYear && name && dob) {
        const namePart = name.trim().toUpperCase().replace(/\s+/g, '').slice(0, 4);
        const dobPart = dob.replace(/-/g, ''); // yyyymmdd
        const dobFormatted = dobPart.slice(6, 8) + dobPart.slice(4, 6) + dobPart.slice(0, 4); // ddmmyyyy
        serialNumber = `${admissionYear}${namePart}${dobFormatted}`;
      }

      const studentData = {
        name: bodyData.name,
        dob: bodyData.dob,
        caste: bodyData.caste,
        mobileNo: bodyData.mobileNo,
        admissionYear: admissionYear,
        address: bodyData.address,
        village: bodyData.village,
        block: bodyData.block,
        district: bodyData.district,
        state: bodyData.state,
        class: bodyData.class,
        serialNumber,
        parents: [],
      };

      if (files['studentPhoto']) {
        studentData.studentPhoto = files['studentPhoto'][0].path;
      }
      if (files['studentSignature']) {
        studentData.studentSignature = files['studentSignature'][0].path;
      }

      // If frontend sends parents as an array in JSON (preferred):
      if (Array.isArray(bodyData.parents) && bodyData.parents.length) {
        // Attach photo paths for those parent indexes if present
        bodyData.parents.forEach((p, idx) => {
          const parent = {
            name: p.name,
            aadharNo: p.aadharNo,
            mobileNo: p.mobileNo,
            relation: p.relation,
            photo: undefined
          };
          if (files[`parent_${idx}_photo`]) {
            parent.photo = files[`parent_${idx}_photo`][0].path;
          } else if (p.photo) {
            parent.photo = p.photo; // keep existing URL/string if provided
          }
          if (parent.name || parent.relation) studentData.parents.push(parent);
        });
      } else {
        // Fallback to legacy flat fields like parents[0][name]
        for (let i = 0; i < 3; i++) {
          const parent = {
            name: req.body[`parents[${i}][name]`],
            aadharNo: req.body[`parents[${i}][aadharNo]`],
            mobileNo: req.body[`parents[${i}][mobileNo]`],
            relation: req.body[`parents[${i}][relation]`],
            photo: undefined
          };
          if (files[`parent_${i}_photo`]) {
            parent.photo = files[`parent_${i}_photo`][0].path;
          }
          if (parent.name || parent.relation) studentData.parents.push(parent);
        }
      }

      const newStudent = new Student(studentData);
      await newStudent.save();

      res.status(201).json({ message: 'Student registered successfully', student: newStudent });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Server error during registration' });
    }
  }
);

// ----------------- PUT: update student (accepts multipart and files) -----------------
app.put(
  '/api/students/:id',
  upload.fields([
    { name: 'studentPhoto', maxCount: 1 },
    { name: 'studentSignature', maxCount: 1 },
    { name: 'parent_0_photo', maxCount: 1 },
    { name: 'parent_1_photo', maxCount: 1 },
    { name: 'parent_2_photo', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ error: 'Missing student ID for update.' });

      const bodyData = parseStudentJsonFromBody(req.body) || {};
      const files = req.files || {};

      // Fetch existing student to merge
      const existing = await Student.findById(id);
      if (!existing) return res.status(404).json({ error: 'Student not found for update.' });

      // Build update object by merging existing and provided fields
      const update = {
        name: bodyData.name ?? existing.name,
        dob: bodyData.dob ?? existing.dob,
        caste: bodyData.caste ?? existing.caste,
        mobileNo: bodyData.mobileNo ?? existing.mobileNo,
        admissionYear: bodyData.admissionYear ?? existing.admissionYear,
        address: bodyData.address ?? existing.address,
        village: bodyData.village ?? existing.village,
        block: bodyData.block ?? existing.block,
        district: bodyData.district ?? existing.district,
        state: bodyData.state ?? existing.state,
        class: bodyData.class ?? existing.class,
        // serialNumber can be re-generated if critical fields changed; keep existing by default
        serialNumber: existing.serialNumber,
      };

      // If name/admissionYear/dob changed, regenerate serialNumber
      if ((bodyData.name && bodyData.name !== existing.name) ||
          (bodyData.dob && bodyData.dob !== existing.dob) ||
          (bodyData.admissionYear && bodyData.admissionYear !== existing.admissionYear)) {
        const admissionYear = bodyData.admissionYear ?? existing.admissionYear;
        const name = bodyData.name ?? existing.name;
        const dob = bodyData.dob ?? existing.dob;
        const namePart = (name || '').trim().toUpperCase().replace(/\s+/g, '').slice(0, 4);
        const dobPart = (dob || '').replace(/-/g, '');
        const dobFormatted = dobPart ? (dobPart.slice(6,8) + dobPart.slice(4,6) + dobPart.slice(0,4)) : '';
        update.serialNumber = admissionYear && namePart && dobFormatted ? `${admissionYear}${namePart}${dobFormatted}` : existing.serialNumber;
      }

      // Student files (replace if new file present)
      if (files['studentPhoto']) update.studentPhoto = files['studentPhoto'][0].path;
      else if (bodyData.studentPhoto) update.studentPhoto = bodyData.studentPhoto; // keep URL string

      if (files['studentSignature']) update.studentSignature = files['studentSignature'][0].path;
      else if (bodyData.studentSignature) update.studentSignature = bodyData.studentSignature;

      // Parents: prefer bodyData.parents array if present
      const newParents = [];
      if (Array.isArray(bodyData.parents) && bodyData.parents.length) {
        bodyData.parents.forEach((p, idx) => {
          const parent = {
            name: p.name,
            aadharNo: p.aadharNo,
            mobileNo: p.mobileNo,
            relation: p.relation,
            photo: undefined
          };
          if (files[`parent_${idx}_photo`]) parent.photo = files[`parent_${idx}_photo`][0].path;
          else if (p.photo) parent.photo = p.photo; // keep existing photo URL string if present
          if (parent.name || parent.relation) newParents.push(parent);
        });
        update.parents = newParents;
      } else {
        // fallback: keep existing parents unless explicit flat fields are present
        update.parents = existing.parents || [];
        for (let i = 0; i < 3; i++) {
          if (req.body[`parents[${i}][name]`] || req.body[`parents[${i}][relation]`]) {
            const parent = {
              name: req.body[`parents[${i}][name]`],
              aadharNo: req.body[`parents[${i}][aadharNo]`],
              mobileNo: req.body[`parents[${i}][mobileNo]`],
              relation: req.body[`parents[${i}][relation]`],
              photo: files[`parent_${i}_photo`] ? files[`parent_${i}_photo`][0].path : undefined
            };
            update.parents[i] = parent;
          }
        }
      }

      const updatedStudent = await Student.findByIdAndUpdate(id, update, { new: true, runValidators: true });
      res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
    } catch (err) {
      console.error('Update error:', err);
      if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid student ID format.' });
      res.status(500).json({ error: 'Server error during update.' });
    }
  }
);

app.get("/api/students/class-strength", async (req, res) => {
  try {
    const classStrengths = await Student.aggregate([
      {
        $group: {
          _id: "$class", // group by class field
          studentsCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: { $concat: ["$_id"] }, // format name as "Class X"
          studentsCount: 1,
        },
      },
      { $sort: { name: 1 } }, // optional: sort by class
    ]);

    res.json({ classes: classStrengths });
  } catch (error) {
    console.error("Error fetching class strength:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// ----------------- GET list / GET by id / DELETE -----------------
app.get('/api/students', async (req, res) => {
  try {
    const classNumber = req.query.class;
    const filter = classNumber ? { class: classNumber } : {};
    const students = await Student.find(filter);
    res.status(200).json(students);
  } catch (err) {
    console.error('Fetch students error:', err);
    res.status(500).json({ error: 'Failed to fetch student data.' });
  }
});

app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json(student);
  } catch (err) {
    console.error('Fetch student by id error:', err);
    res.status(500).json({ error: 'Failed to fetch student data' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// ----------------- LOGIN route -----------------
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });
    res.status(200).json({ message: 'Login successful', user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
