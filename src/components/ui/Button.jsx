export function Button({ children, variant = "default", className = "", onClick, disabled, type = "button", loading, ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-[#0A0A0F] text-white hover:bg-white/10 border border-white/10",
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    ghost: "bg-white/5 text-white hover:bg-white/10 border border-white/10",
    red: "bg-red-500 text-white hover:bg-red-600",
    green: "bg-green-500 text-white hover:bg-green-600",
  };
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} onClick={onClick} disabled={disabled || loading} {...props}>
      {loading && <span className="mr-2">⟳</span>}
      {children}
    </button>
  );
}
