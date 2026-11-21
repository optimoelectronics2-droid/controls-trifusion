export function Textarea({ label, value, onChange, placeholder }) {
  return (
    <div className="mb-3">
      <label htmlFor={label} className="block text-xs font-bold text-white/60 mb-1 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        id={label}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        rows={3}
        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
    </div>
  );
}
