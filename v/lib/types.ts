export interface TaskData {
  id: string
  title: string
  description: string
  icon: "reading" | "article" | "listening" | "podcast" | "live" | "vocabulary"
  completed: boolean
  timer: number 
  url: string
  score?: number
  maxScore?: number
  label?: string 
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
