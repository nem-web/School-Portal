// User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Function to seed initial users (run once)
export const seedUsers = async () => {
  try {
    const existingUsersCount = await User.countDocuments();
    if (existingUsersCount === 0) {
      const passwordHash = await bcrypt.hash('password123', 10);
      await User.create([
        { email: 'student@example.com', passwordHash },
        { email: 'teacher@example.com', passwordHash },
      ]);
      console.log('Dummy users seeded to the database.');
    }
  } catch (err) {
    console.error("Error seeding users:", err);
  }
};

export default User;