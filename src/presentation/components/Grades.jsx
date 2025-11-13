import { useEffect, useMemo, useState } from "react";
import { SubjectService } from "../../business/services/SubjectService";
import Button from "./ui/Button";

export default function Grades({ uid, activeSemester, subjects = [], labsBySubject = {} }) {
  const [local, setLocal] = useState({}); // { [subjectId]: { modules: [...] } }
  useEffect(() => {
    const map = {};
    (subjects || []).forEach(s => {
      map[s.id] = { modules: Array.isArray(s.modules) ? s.modules.map(m => ({ ...m })) : [] };
    });
    setLocal(map);
  }, [subjects]);

  if (!activeSemester) return <div className="card">Оберіть активний семестр</div>;

  const setModuleField = (sid, idx, key, value) => {
    setLocal(prev => {
      const mods = [...(prev[sid]?.modules || [])];
      mods[idx] = { ...(mods[idx] || {}), [key]: key === 'name' ? value : (value) };
      return { ...prev, [sid]: { modules: mods } };
    });
  };

  const addModule = (sid) => {
    setLocal(prev => {
      const mods = [...(prev[sid]?.modules || [])];
      mods.push({ name: `Модуль ${mods.length + 1}`, max: "", obtained: "" });
      return { ...prev, [sid]: { modules: mods } };
    });
  };

  const removeModule = (sid, idx) => {
    setLocal(prev => {
      const mods = [...(prev[sid]?.modules || [])];
      mods.splice(idx, 1);
      return { ...prev, [sid]: { modules: mods } };
    });
  };

  const save = async (sid) => {
    const mods = (local[sid]?.modules || []).map(m => ({
      name: String(m.name || "Модуль"),
      max: Number(m.max || 0) || 0,
      obtained: Number(m.obtained || 0) || 0,
    }));
    await SubjectService.patch(uid, activeSemester.id, sid, { modules: mods });
  };

  const totalsFor = (sid) => {
    const mods = local[sid]?.modules || [];
    const max = mods.reduce((s, m) => s + (Number(m.max) || 0), 0);
    const obt = mods.reduce((s, m) => s + (Number(m.obtained) || 0), 0);
    const pct = max ? Math.round((obt / max) * 100) : 0;
    return { max, obt, pct };
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Оцінки по предметах</h3>
      </div>

      <div className="mt-3 space-y-4">
        {subjects.map(s => {
          const mods = local[s.id]?.modules || [];
          const labs = labsBySubject[s.id] || [];
          const labsMax = labs.reduce((sum, l)=> sum + (Number(l.maxScore)||0), 0);
          const labsObt = labs.reduce((sum, l)=> sum + (Number(l.obtainedScore)||0), 0);
          const modulesMax = mods.reduce((sum, m)=> sum + (Number(m.max)||0), 0);
          const modulesObt = mods.reduce((sum, m)=> sum + (Number(m.obtained)||0), 0);
          const totalMax = labsMax + modulesMax;
          const totalObt = labsObt + modulesObt;
          const pct = totalMax ? Math.round((totalObt/totalMax)*100) : 0;

          return (
            <div key={s.id} className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">{s.title}</div>
                <div className="text-sm text-gray-600">Разом: {totalObt}/{totalMax} ({pct}%)</div>
              </div>

              {/* Table-like grades */}
              <div className="overflow-x-auto">
                <div className="min-w-[520px]">
                  <div className="grid grid-cols-[1fr_120px_120px] gap-2 text-sm font-medium text-gray-600 mb-2">
                    <div>Лабораторні</div>
                    <div className="text-right">Отримано</div>
                    <div className="text-right">Макс</div>
                  </div>
                  {labs.map(l => (
                    <div key={l.id} className="grid grid-cols-[1fr_120px_120px] gap-2 py-1 border-t border-gray-100">
                      <div>Робота №{l.number} {l.topic ? `— ${l.topic}`: ''}</div>
                      <div className="text-right">{l.obtainedScore ?? '—'}</div>
                      <div className="text-right">{l.maxScore}</div>
                    </div>
                  ))}

                  <div className="grid grid-cols-[1fr_120px_120px] gap-2 text-sm font-medium text-gray-600 mt-4 mb-2">
                    <div>Модульні</div>
                    <div className="text-right">Отримано</div>
                    <div className="text-right">Макс</div>
                  </div>
                  {mods.map((m, i) => (
                    <div key={i} className="grid grid-cols-[1fr_120px_120px_auto] items-center gap-2 py-1 border-t border-gray-100">
                      <input className="input" placeholder="Назва" value={m.name ?? ''} onChange={e=>setModuleField(s.id, i, 'name', e.target.value)} />
                      <input className="input text-right" placeholder="Отримано" value={m.obtained ?? ''} onChange={e=>setModuleField(s.id, i, 'obtained', e.target.value)} />
                      <input className="input text-right" placeholder="Макс" value={m.max ?? ''} onChange={e=>setModuleField(s.id, i, 'max', e.target.value)} />
                      <Button className="ml-2" onClick={()=>removeModule(s.id, i)}>Видалити</Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <Button onClick={()=>addModule(s.id)}>+ Додати модуль</Button>
                <Button variant="primary" onClick={()=>save(s.id)}>Зберегти</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
