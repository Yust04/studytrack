export const ProgressTracker = {
  bySemester(subjects) {
    const sum = subjects.reduce((acc, s) => acc + (s._calc?.percent || 0), 0);
    return subjects.length ? Math.round(sum / subjects.length) : 0;
  }
};
