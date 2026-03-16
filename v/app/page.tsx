"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { DashboardView } from "@/components/dashboard-view"
import { DayDetailView } from "@/components/day-detail-view"
import { StudyData, DayData, TaskData } from "@/lib/types"

function generateInitialData(): StudyData {
  const startDate = new Date(2025, 2, 12) 
  const days: DayData[] = []

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isMockTestDay = dayOfWeek === 0 

    let tasks: TaskData[]

    if (isMockTestDay) {
      tasks = [
        {
          id: `${i}-1`,
          title: "Full Reading Mock Test",
          description: "Simulate real exam — timed and scored",
          icon: "reading",
          completed: false,
          timer: 0,
          url: "",
          score: 0,
          maxScore: 40,
        },
        {
          id: `${i}-2`,
          title: "Full Listening Mock Test",
          description: "Complete practice test with all sections",
          icon: "listening",
          completed: false,
          timer: 0,
          url: "",
          score: 0,
          maxScore: 40,
        },
      ]
    } else {
      tasks = [
        {
          id: `${i}-1`,
          title: "Morning Reading Passage",
          description: "Read carefully and annotate key ideas",
          icon: "reading",
          completed: false,
          timer: 0,
          url: "",
          score: 0,
          maxScore: 14,
        },
        {
          id: `${i}-2`,
          title: "Daily Article Analysis",
          description: "Identify structure, tone and arguments",
          icon: "article",
          completed: false,
          timer: 0,
          url: "",
        },
        {
          id: `${i}-3`,
          title: "Solving a Full Listening Test",
          description: "Full timed test with self-marking",
          icon: "listening",
          completed: false,
          timer: 0,
          url: "",
          score: 0,
          maxScore: 40,
        },
        {
          id: `${i}-4`,
          title: "Listening to Podcast",
          description: "Active listening — note new vocabulary",
          icon: "podcast",
          completed: false,
          timer: 0,
          url: "",
        },
        {
          id: `${i}-5`,
          title: "Coding",
          description: "Engage, ask questions, take notes",
          icon: "live",
          completed: false,
          timer: 0,
          url: "",
        },
        {
          id: `${i}-6`,
          title: "Daily Vocabulary List",
          description: "Learn, review and use words in sentences",
          icon: "vocabulary",
          completed: false,
          timer: 0,
          url: "",
          score: 0,
          maxScore: 20,
          label: "words learned",
        },
      ]
    }

    days.push({
      id: i + 1,
      date,
      dayType: isMockTestDay ? "mock" : isWeekend ? "weekend" : "weekday",
      tasks,
      notes: "",
      completed: false,
    })
  }

  
  return {
    programName: "IELTS",
    startDate,
    endDate: new Date(2025, 3, 10), 
    days,
    currentStreak: 0,
    quote: {
      text: "Hard work beats talent when talent doesn't work hard.",
      author: "Tim Notke",
    },
  }
}


export default function StudyTracker() {
  const [data, setData] = useState<StudyData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("studyData")
      if (saved) {
        const parsed = JSON.parse(saved)
        parsed.startDate = new Date(parsed.startDate)
        parsed.endDate = new Date(parsed.endDate)
        parsed.days = parsed.days.map((day: DayData) => ({
          ...day,
          date: new Date(day.date),
        }))
        return parsed
      }
    }
    return generateInitialData()
  })

  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [view, setView] = useState<"dashboard" | "day">("dashboard")

  useEffect(() => {
    localStorage.setItem("studyData", JSON.stringify(data))
  }, [data])

  const totalTasksDone = data.days.reduce(
    (acc, day) => acc + day.tasks.filter((t) => t.completed).length,
    0
  )
  const daysDone = data.days.filter((day) => day.completed).length
  const totalTasks = data.days.reduce((acc, day) => acc + day.tasks.length, 0)
  const progress = Math.round((totalTasksDone / totalTasks) * 100)

  const calculateStreak = useCallback(() => {
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = data.days.length - 1; i >= 0; i--) {
      const day = data.days[i]
      const dayDate = new Date(day.date)
      dayDate.setHours(0, 0, 0, 0)

      if (dayDate > today) continue
      if (day.completed) {
        streak++
      } else if (dayDate < today) {
        break
      }
    }
    return streak
  }, [data.days])

  const updateTask = (dayId: number, taskId: string, updates: Partial<TaskData>) => {
    setData((prev) => {
      const newDays = prev.days.map((day) => {
        if (day.id !== dayId) return day
        const newTasks = day.tasks.map((task) => {
          if (task.id !== taskId) return task
          return { ...task, ...updates }
        })
        const allCompleted = newTasks.every((t) => t.completed)
        return { ...day, tasks: newTasks, completed: allCompleted }
      })
      return { ...prev, days: newDays }
    })
  }

  const updateNotes = (dayId: number, notes: string) => {
    setData((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.id === dayId ? { ...day, notes } : day
      ),
    }))
  }
  const resetDay = (dayId: number) => {
    setData((prev) => ({
      ...prev,
      days: prev.days.map((day) => {
        if (day.id !== dayId) return day
        return {
          ...day,
          completed: false,
          notes: "",
          tasks: day.tasks.map((task) => ({
            ...task,
            completed: false,
            timer: 0,
            url: "",
            score: task.maxScore !== undefined ? 0 : undefined,
          })),
        }
      }),
    }))
  }

  const selectDay = (dayId: number) => {
    setSelectedDay(dayId)
    setView("day")
  }

  const goToDashboard = () => {
    setView("dashboard")
    setSelectedDay(null)
  }

  const navigateDay = (direction: "prev" | "next") => {
    if (selectedDay === null) return
    const newDay = direction === "prev" ? selectedDay - 1 : selectedDay + 1
    if (newDay >= 1 && newDay <= 30) {
      setSelectedDay(newDay)
    }
  }

  const currentDayData = selectedDay ? data.days.find((d) => d.id === selectedDay) : null

  return (
    <main className="min-h-screen bg-background text-foreground">
      {view === "dashboard" ? (
        <DashboardView
          data={data}
          totalTasksDone={totalTasksDone}
          daysDone={daysDone}
          streak={calculateStreak()}
          progress={progress}
          onSelectDay={selectDay}
        />
      ) : currentDayData ? (
        <DayDetailView
          day={currentDayData}
          dayNumber={selectedDay!}
          totalDays={30}
          onBack={goToDashboard}
          onNavigate={navigateDay}
          onUpdateTask={(taskId, updates) => updateTask(selectedDay!, taskId, updates)}
          onUpdateNotes={(notes) => updateNotes(selectedDay!, notes)}
          onReset={() => resetDay(selectedDay!)}
        />
      ) : null}
    </main>
  )
}
