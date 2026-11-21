export function Input({ label, value, onChange, type = "text", placeholder, required }) {
  return (
    <div className="mb-3">
      <label htmlFor={label} className="block text-xs font-bold text-white/60 mb-1 uppercase tracking-wider">
        {label}
      </label>
      <input
        id={label}
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        required={required}
        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
    </div>
  );
}
