export function Card({ className="", children }) {
  return <div className={`card ${className}`}>{children}</div>;
}
export function CardHeader({ children, className="" }) {
  return <div className={`mb-3 ${className}`}>{children}</div>;
}
export function CardTitle({ children, className="" }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}
export function CardContent({ children, className="" }) {
  return <div className={`${className}`}>{children}</div>;
}
