export interface TaskData {
  id: string
  title: string
  description: string
  icon: "reading" | "article" | "listening" | "podcast" | "live" | "vocabulary"
  completed: boolean
  timer: number // in seconds
  url: string
  score?: number
  maxScore?: number
  label?: string // e.g., "questions", "correct", "words learned"
}

export interface DayData {
  id: number
  date: Date
  dayType: "weekday" | "weekend" | "mock"
  tasks: TaskData[]
  notes: string
  completed: boolean
}

export interface StudyData {
  programName: string
  startDate: Date
  endDate: Date
  days: DayData[]
  currentStreak: number
  quote: {
    text: string
    author: string
  }
}
