import { createLab, deleteLab, listenLabs, updateLab } from "../../data/repositories/LabRepository";
import { newLab, STATUS } from "../../models/LabWork";

export const LabService = {
  listen(uid, semesterId, subjectId, cb) { return listenLabs(uid, semesterId, subjectId, cb); },

  async add(uid, semesterId, subjectId, existingLabs, payload) {
    const maxNumber = existingLabs.reduce((m, l) => Math.max(m, l.number || 0), 0);
    const lab = newLab({ number: maxNumber + 1, ...payload });
    if (!lab.maxScore || lab.maxScore <= 0) throw new Error("Макс. бал має бути > 0");
    return createLab(uid, semesterId, subjectId, lab);
  },

  async patch(uid, semesterId, subjectId, labId, patch) {
    return updateLab(uid, semesterId, subjectId, labId, patch);
  },

  async remove(uid, semesterId, subjectId, labId) {
    return deleteLab(uid, semesterId, subjectId, labId);
  },

  STATUS
};
