import dayjs from "dayjs";
import { STATUS } from "../../models/LabWork";

export default function DashboardExtra({ activeSemester, subjects, labsBySubject }) {
  const allLabs = subjects.flatMap(s => labsBySubject[s.id] || []);
  const isDone = (st) => [STATUS?.DONE, STATUS?.DEFENDED, "�?���?�?���?�?", "�����:��%��?�?"].includes(st);
  const remainingCount = allLabs.filter(l => !isDone(l.status)).length;
  const daysLeft = activeSemester?.endDate ? Math.max(0, dayjs(activeSemester.endDate).diff(dayjs(), 'day')) : null;

  const byMonth = {};
  allLabs.forEach(l => { if (isDone(l.status)) { const m = dayjs(l.createdAt || 0).format('YYYY-MM'); byMonth[m] = (byMonth[m] || 0) + 1; } });
  const entries = Object.entries(byMonth).sort((a,b)=>a[0].localeCompare(b[0]));
  const maxVal = entries.length ? Math.max(...entries.map(([,v])=>v)) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[20px] px-5 py-4 shadow-lg">
        <h2 className="text-xl font-semibold">
          Статистика по {activeSemester?.number ?? 'невідомому'} семестру
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-[20px] px-5 py-4 shadow-lg">
          <div className="text-gray-700 font-medium mb-1">Залишилось лабораторних</div>
          <div className="text-3xl font-bold">{remainingCount}</div>
        </div>
        <div className="bg-white rounded-[20px] px-5 py-4 shadow-lg">
          <div className="text-gray-700 font-medium mb-1">Днів до завершення семестру</div>
          <div className="text-3xl font-bold">{daysLeft ?? '—'}</div>
        </div>
      </div>

      <div className="bg-white rounded-[20px] px-5 py-4 shadow-lg">
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
    </div>
  );
}

