export default function Progress({ value = 0 }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="h-2 rounded-full"
        style={{ width: `${value}%`, backgroundColor: "var(--brand-accent)" }}
      />
    </div>
  );
}
