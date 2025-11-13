// src/models/LabWork.js
export const STATUS = { NOT_STARTED: "не розпочато", IN_PROGRESS: "у процесі", DONE: "виконано", DEFENDED: "захищено" };
export const newLab = ({ number, topic = "", maxScore }) => ({
  number, topic, maxScore: Number(maxScore),
  obtainedScore: null,
  status: STATUS.NOT_STARTED,
  createdAt: Date.now()
});