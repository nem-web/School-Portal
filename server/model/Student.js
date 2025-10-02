import mongoose from 'mongoose';

// Parent schema
const parentSchema = new mongoose.Schema({
  name: String,
  aadharNo: String,
  mobileNo: String,
  relation: String,
  photo: { type: String }, // Cloudinary URL
});

// Student schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNo: String,
  dob: String,
  caste: String,
  address: String,
  village: String,
  block: String,
  district: String,
  state: String,
  class: String,
  isVerified: { type: Boolean, default: false },
  isGraduated: { type: Boolean, default: false },
  serialNumber: { type: String, unique: true, required: true },
  admissionYear: { type: String, required: true },

  studentPhoto: { type: String },     // Cloudinary URL
  studentSignature: { type: String }, // Cloudinary URL

  parents: [parentSchema],
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
