// src/utils/classUtils.js

/**
 * Get current class of student based on admission year, admission class, and current date.
 * Academic session runs April -> March.
 *
 * @param {number} admissionYear - Year of admission (e.g., 2022)
 * @param {number} admissionClass - Class at time of admission (e.g., 6)
 * @param {Date} currentDate - Optional: current date (defaults to today)
 * @returns {number} Current class
 */
export function getCurrentClass(admissionYear, admissionClass, currentDate = new Date()) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // JS months are 0-11

  // Determine academic year (April = new session start)
  const currentSessionYear = month >= 4 ? year : year - 1;

  // Calculate years passed since admission
  const yearsPassed = currentSessionYear - admissionYear;

  // Final class (capped at 12 so it doesn't exceed)
  return Math.min(admissionClass + yearsPassed, 12);
}

export function generateSerial(admissionYear, fullName, classRoll, dob) {
  // Extract first and second name initials
  const yearShort = admissionYear.toString().slice(-2);
  const parts = fullName.trim().split(/\s+/);
  const firstInitial = parts[0][0].toUpperCase();
  const secondInitial = parts[1] ? parts[1][0].toUpperCase() : "X"; // fallback if no last name

  // Class roll padded to 3 digits
  const roll = classRoll.toString().padStart(2, "0");

  // Extract last 2 digits of birth year
  const birthYear = dob.split("-")[0].slice(-2); // yyyy-mm-dd → yy

  // Final serial format
  return `${admissionYear}${firstInitial}${secondInitial}${roll}${birthYear}`;
}


