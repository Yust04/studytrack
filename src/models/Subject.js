// src/models/Subject.js
export const newSubject = ({ title, teacher = "", controlType = "", iconUrl = "", modules = [] }) => ({
  title, teacher, controlType, iconUrl, modules,
  createdAt: Date.now()
});
