export default function Button({ children, variant="default", className="", ...props }) {
  const variants = {
    default: "btn",
    primary: "btn btn-primary",
    subtle:  "btn",
    danger:  "btn bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  };
  return (
    <button className={`${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </button>
  );
}
