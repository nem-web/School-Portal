// src/utils/classUtils.js

/**
 * Get current class of student based on admission year, admission class, and current date.
 * Academic session runs April -> March.
 *
 * @param {string|number} admissionYear - Year of admission (e.g., "2022" or 2022)
 * @param {string|number} admissionClass - Class at time of admission (e.g., "6" or 6)
 * @param {Date} currentDate - Optional: current date (defaults to today)
 * @returns {number} Current class (max 12)
 */
export function getCurrentClass(admissionYear, admissionClass, currentDate = new Date()) {
  // Convert strings to numbers
  const admissionYearNum = parseInt(admissionYear, 10);
  const admissionClassNum = parseInt(admissionClass, 10);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // JS months are 0-11

  // Determine academic year (April = new session start)
  const currentSessionYear = month >= 4 ? year : year - 1;

  // Calculate years passed since admission
  const yearsPassed = currentSessionYear - admissionYearNum;

  // Final class (capped at 12 so it doesn't exceed)
  return Math.min(admissionClassNum + yearsPassed, 12);
}
