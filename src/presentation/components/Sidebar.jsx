import { GraduationCap, BadgeCheck, BarChart3, LayoutDashboard } from "lucide-react";

export default function Sidebar({ onOpenDashboard, onOpenSemesters, onOpenSubjects, onOpenGrades }) {
  return (
    <aside className="hidden md:block w-[240px]">
      <div className="rounded-[28px] p-4" style={{ backgroundColor: "var(--brand-primary)" }}>
        <div className="space-y-3">
          <button
            onClick={onOpenDashboard}
            className="w-full bg-white text-black rounded-[16px] px-4 py-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Дашборд</span>
            </div>
          </button>

          <button
            onClick={onOpenSemesters}
            className="w-full bg-white text-black rounded-[16px] px-4 py-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5" />
              <span className="font-medium">Семестри</span>
            </div>
          </button>

          <button
            onClick={onOpenSubjects}
            className="w-full bg-white text-black rounded-[16px] px-4 py-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <BadgeCheck className="w-5 h-5" />
              <span className="font-medium">Предмети</span>
            </div>
          </button>

          <button
            onClick={onOpenGrades}
            className="w-full bg-white text-black rounded-[16px] px-4 py-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Оцінки по предметах</span>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
