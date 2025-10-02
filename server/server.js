// server.js

import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

import connectDB from './db.js';
import Student from './model/Student.js';
import User, { seedUsers } from './model/User.js';

import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(fileBuffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
}

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "https://sv-pddu.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


// DB connection + seed
connectDB();
seedUsers();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for in-memory uploads
const upload = multer({ storage: multer.memoryStorage() });

function parseStudentJsonFromBody(body) {
  if (body && body.studentDataJson) {
    try {
      return JSON.parse(body.studentDataJson);
    } catch {
      return null;
    }
  }
  return body || {};
}

// Create new student
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

      const admissionYear = bodyData.admissionYear;
      const name = bodyData.name || '';
      const dob = bodyData.dob || '';

      let serialNumber = '';
      if (admissionYear && name && dob) {
        const namePart = name.trim().toUpperCase().replace(/\s+/g, '').slice(0, 4);
        const dobPart = dob.replace(/-/g, '');
        const dobFormatted = dobPart.slice(6, 8) + dobPart.slice(4, 6) + dobPart.slice(0, 4);
        serialNumber = `${admissionYear}${namePart}${dobFormatted}`;
      }

      const studentData = {
        name: bodyData.name,
        dob: bodyData.dob,
        caste: bodyData.caste,
        mobileNo: bodyData.mobileNo,
        admissionYear,
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
        studentData.studentPhoto = await uploadToCloudinary(files['studentPhoto'][0].buffer, 'student/photos');
      }
      if (files['studentSignature']) {
        studentData.studentSignature = await uploadToCloudinary(files['studentSignature'][0].buffer, 'student/signatures');
      }

      if (Array.isArray(bodyData.parents) && bodyData.parents.length) {
        for (let idx = 0; idx < bodyData.parents.length; idx++) {
          const p = bodyData.parents[idx];
          const parent = {
            name: p.name,
            aadharNo: p.aadharNo,
            mobileNo: p.mobileNo,
            relation: p.relation,
            photo: undefined,
          };
          if (files[`parent_${idx}_photo`]) {
            parent.photo = await uploadToCloudinary(files[`parent_${idx}_photo`][0].buffer, 'student/parents');
          } else if (p.photo) {
            parent.photo = p.photo;
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

app.patch("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { isVerified },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Update student
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
      const bodyData = parseStudentJsonFromBody(req.body) || {};
      const files = req.files || {};

      const existing = await Student.findById(id);
      if (!existing) return res.status(404).json({ error: 'Student not found' });

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
        serialNumber: existing.serialNumber,
      };

      if (
        (bodyData.name && bodyData.name !== existing.name) ||
        (bodyData.dob && bodyData.dob !== existing.dob) ||
        (bodyData.admissionYear && bodyData.admissionYear !== existing.admissionYear)
      ) {
        const admissionYear = bodyData.admissionYear ?? existing.admissionYear;
        const name = bodyData.name ?? existing.name;
        const dob = bodyData.dob ?? existing.dob;
        const namePart = (name || '').trim().toUpperCase().replace(/\s+/g, '').slice(0, 4);
        const dobPart = (dob || '').replace(/-/g, '');
        const dobFormatted = dobPart ? dobPart.slice(6, 8) + dobPart.slice(4, 6) + dobPart.slice(0, 4) : '';
        update.serialNumber = admissionYear && namePart && dobFormatted ? `${admissionYear}${namePart}${dobFormatted}` : existing.serialNumber;
      }

      if (files['studentPhoto']) {
        update.studentPhoto = await uploadToCloudinary(files['studentPhoto'][0].buffer, 'student/photos');
      } else if (bodyData.studentPhoto) {
        update.studentPhoto = bodyData.studentPhoto;
      }

      if (files['studentSignature']) {
        update.studentSignature = await uploadToCloudinary(files['studentSignature'][0].buffer, 'student/signatures');
      } else if (bodyData.studentSignature) {
        update.studentSignature = bodyData.studentSignature;
      }

      const newParents = [];
      if (Array.isArray(bodyData.parents) && bodyData.parents.length) {
        for (let idx = 0; idx < bodyData.parents.length; idx++) {
          const p = bodyData.parents[idx];
          const parent = {
            name: p.name,
            aadharNo: p.aadharNo,
            mobileNo: p.mobileNo,
            relation: p.relation,
            photo: undefined,
          };
          if (files[`parent_${idx}_photo`]) {
            parent.photo = await uploadToCloudinary(files[`parent_${idx}_photo`][0].buffer, 'student/parents');
          } else if (p.photo) {
            parent.photo = p.photo;
          }
          if (parent.name || parent.relation) newParents.push(parent);
        }
        update.parents = newParents;
      } else {
        update.parents = existing.parents || [];
      }

      const updatedStudent = await Student.findByIdAndUpdate(id, update, { new: true, runValidators: true });
      res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ error: 'Server error during update' });
    }
  }
);

// Class strength aggregation
app.get('/api/students/class-strength', async (req, res) => {
  try {
    const classStrengths = await Student.aggregate([
      { $group: { _id: '$class', studentsCount: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', studentsCount: 1 } },
      { $sort: { name: 1 } },
    ]);
    res.json({ classes: classStrengths });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get students
app.get('/api/students', async (req, res) => {
  try {
    const filter = req.query.class ? { class: req.query.class } : {};
    const students = await Student.find(filter);
    res.status(200).json(students);
  } catch {
    res.status(500).json({ error: 'Failed to fetch student data' });
  }
});

// Get student by ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json(student);
  } catch {
    res.status(500).json({ error: 'Failed to fetch student data' });
  }
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });
    res.status(200).json({ message: 'Login successful', user: { id: user._id, email: user.email } });
  } catch {
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.listen(PORT, () => console.log(`Server running`));
