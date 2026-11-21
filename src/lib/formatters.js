export const currency = {
  format(value, locale = 'es-DO', currency = 'DOP') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value || 0))
  },
}

export function formatDate(value, fallback = '') {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) return fallback
  return date.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatDay(value, fallback = '') {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) return fallback
  return date.toISOString().slice(0, 10)
}
