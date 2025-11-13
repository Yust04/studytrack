import { BookOpen, FlaskConical, Gauge, Clock } from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { STATUS } from "../../models/LabWork";

function StatCard({ icon: Icon, title, children }) {
  const displayedTitle = Icon === Clock ? "Днів до кінця семестру" : title;
  return (
    <div className="bg-white rounded-[20px] px-5 py-4 shadow-lg flex-1">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <Icon className="w-5 h-5 shrink-0" />
        <span className="font-medium whitespace-nowrap">{displayedTitle}</span>
      </div>
      <div className="text-center">{children}</div>
    </div>
  );
}

export default function Dashboard({ activeSemesterNumber, activeSemester, subjects, labsBySubject }) {
  const subjectsCount = subjects.length;

  const allLabs = subjects.flatMap((s) => labsBySubject[s.id] || []);
  const doneCount = allLabs.filter((l) => [STATUS.DONE, STATUS.DEFENDED].includes(l.status)).length;
  const totalCount = allLabs.length;
  const percentDone = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  const obtained = allLabs.reduce((sum, l) => sum + (Number(l.obtainedScore) || 0), 0);
  const max = allLabs.reduce((sum, l) => sum + (Number(l.maxScore) || 0), 0);
  const avg = max ? Math.round((obtained / max) * 100) : 0;

  const remainingCount = allLabs.filter((l) => ![STATUS.DONE, STATUS.DEFENDED].includes(l.status)).length;

  // month aggregation for done labs
  const byMonth = {};
  allLabs.forEach(l => {
    if ([STATUS.DONE, STATUS.DEFENDED].includes(l.status)) {
      const m = dayjs(l.createdAt || 0).format("YYYY-MM");
      byMonth[m] = (byMonth[m] || 0) + 1;
    }
  });
  const entries = Object.entries(byMonth).sort((a,b)=>a[0].localeCompare(b[0]));
  const maxVal = entries.length ? Math.max(...entries.map(([,v])=>v)) : 0;

  return (
    <div
      className="rounded-[28px] p-6 md:p-8"
      style={{ backgroundColor: "var(--brand-primary)" }}
    >
      <h2 className="text-white text-2xl md:text-[32px] font-semibold mb-5">
        Статистика по {activeSemesterNumber ?? "невідомому"} семестру
      </h2>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard icon={BookOpen} title="Кількість предметів">
          <div className="stat-number">{subjectsCount}</div>
        </StatCard>

        <StatCard icon={FlaskConical} title="Лабораторні виконано">
          <div className="stat-number">
            {doneCount} / {totalCount || 0}
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${percentDone}%`,
                  backgroundColor: "var(--brand-accent)",
                }}
              />
            </div>
          </div>
        </StatCard>

        <StatCard icon={Gauge} title="Середній відсоток">
          <div className="stat-number">{avg}</div>
        </StatCard>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatCard icon={FlaskConical} title="Залишилось лабораторних">
          <div className="stat-number">{remainingCount}</div>
        </StatCard>
        <StatCard icon={Clock} title="Днів до завершення семестру">
          <div className="stat-number">{activeSemester?.endDate ? Math.max(0, dayjs(activeSemester.endDate).diff(dayjs(), "day")) : "-"}</div>
        </StatCard>
      </div>

      {/* Monthly chart before subjects */}
      <div className="bg-white rounded-[20px] px-5 py-4 shadow-lg mt-2 mb-6">
        <div className="font-medium mb-3">Виконані лабораторні по місяцях</div>
        {entries.length === 0 ? (
          <div className="text-sm text-gray-500">Немає даних</div>
        ) : (
          <div className="space-y-2">
            {entries.map(([m, v]) => (
              <div key={m} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-600">{m}</div>
                <div className="flex-1 bg-gray-200 h-2 rounded-full">
                  <div className="h-2 rounded-full" style={{ width: `${Math.round((v/maxVal)*100)}%`, backgroundColor: 'var(--brand-accent)' }} />
                </div>
                <div className="w-8 text-right text-sm">{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <h3 className="text-white text-2xl font-semibold mb-4">Предмети</h3>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject, i) => {
          const labs = labsBySubject[subject.id] || [];
          const subMax = labs.reduce((s, l) => s + (Number(l.maxScore) || 0), 0);
          const subObt = labs.reduce((s, l) => s + (Number(l.obtainedScore) || 0), 0);
          const p = subMax ? Math.round((subObt / subMax) * 100) : 0;

          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-[20px] px-5 py-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                  {subject.iconUrl ? (
                    <img src={subject.iconUrl} alt="icon" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded" />
                  )}
                </div>
                <div className="font-medium">{subject.title}</div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${p}%`,
                      backgroundColor: "var(--brand-accent)",
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Виконано: {labs.filter(l => [STATUS.DONE, STATUS.DEFENDED].includes(l.status)).length} з {labs.length || 0}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
    </div>
  );
}
