// src/models/Semester.js
export const newSemester = ({ number, title = "", startDate = "", endDate = "" }) => ({
  number, title, startDate, endDate,
  active: false,
  createdAt: Date.now()
});