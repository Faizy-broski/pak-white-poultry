export function formatRelativeLabel(iso: string | null): string {
  if (!iso) return "—"
  const date = new Date(iso)
  const now = new Date()

  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) return `Today, ${time}`

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`

  const withinWeek = now.getTime() - date.getTime() < 6 * 24 * 60 * 60 * 1000
  const dayPart = withinWeek
    ? date.toLocaleDateString("en-US", { weekday: "short" })
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

  return `${dayPart}, ${time}`
}

export function formatMonthYear(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}