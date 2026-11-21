export function Select({ label, value, onChange, options, placeholder }) {
  return (
    <div className="mb-3">
      <label htmlFor={label} className="block text-xs font-bold text-white/60 mb-1 uppercase tracking-wider">
        {label}
      </label>
      <select
        id={label}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value || opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
