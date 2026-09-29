export const priorityConfig: Record<string, { className: string; label: string }> = {
  HIGH: { className: "bg-orange-500/10 text-orange-500", label: "HIGH" },
  URGENT: { className: "bg-red-500/10 text-red-500", label: "URGENT" },
  MEDIUM: { className: "bg-blue-500/10 text-blue-500", label: "MEDIUM" },
  LOW: { className: "bg-slate-500/10 text-slate-400", label: "LOW" },
}

export function normalizePriority(value?: string) {
  const key = (value || "MEDIUM").toUpperCase()
  return key in priorityConfig ? key : "MEDIUM"
}

export function formatDueDate(iso?: string | null) {
  if (!iso) return null
  return new Date(iso).toISOString().split("T")[0]
}

export function isTaskOverdue(iso?: string | null, completed = false) {
  if (completed || !iso) return false
  const due = new Date(iso)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today
}
