// Project display names and their default Tailwind color classes.

export const projectColors: Record<string, string> = {
  "Work & Office": "bg-blue-500",
  "Personal": "bg-emerald-500",
  "Health & Fitness": "bg-orange-500",
}

// Fallback color for unknown projects
export const defaultProjectColor = "bg-slate-500"

// All available project names (used in the dialog Select)
export const projectNames = Object.keys(projectColors)
