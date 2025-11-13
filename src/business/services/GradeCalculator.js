export const GradeCalculator = {
  subjectTotals(labs) {
    const maxTotal = labs.reduce((s, l) => s + (Number(l.maxScore) || 0), 0);
    const obtained = labs.reduce((s, l) => s + (Number(l.obtainedScore) || 0), 0);
    const percent = maxTotal ? Math.round((obtained / maxTotal) * 100) : 0;
    const remainingNotDefended = labs.filter(l => l.status !== "захищено").length;
    return { obtained, maxTotal, percent, remainingNotDefended };
  },
  dashboardCounters(subjectsWithLabs) {
    let labsTotal = 0, notDone = 0;
    subjectsWithLabs.forEach(({ labs }) => {
      labsTotal += labs.length;
      notDone += labs.filter(l => l.status !== "виконано" && l.status !== "захищено").length;
    });
    return { labsTotal, notDone };
  }
};
