"use client"

import { StudyData } from "@/lib/types"
import { Flame, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardViewProps {
  data: StudyData
  totalTasksDone: number
  daysDone: number
  streak: number
  progress: number
  onSelectDay: (dayId: number) => void
}

export function DashboardView({
  data,
  totalTasksDone,
  daysDone,
  streak,
  progress,
  onSelectDay,
}: DashboardViewProps) {
  const formatDateRange = () => {
    const start = data.startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    const end = data.endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    return `${start} – ${end}`
  }

  const getDayStatus = (day: (typeof data.days)[0]) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dayDate = new Date(day.date)
    dayDate.setHours(0, 0, 0, 0)

    const hasCompletedTasks = day.tasks.some((t) => t.completed)
    const allCompleted = day.tasks.every((t) => t.completed)

    if (allCompleted && day.tasks.length > 0) return "completed"
    if (dayDate.getTime() === today.getTime()) return "current"
    if (hasCompletedTasks) return "partial"
    if (dayDate < today) return "missed"
    return "upcoming"
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <span className="rounded border border-accent bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
              30-Day Program
            </span>
            <span className="text-sm text-muted-foreground">
              {formatDateRange()}
            </span>
          </div>

          <div className="mb-2 flex items-end gap-4">
            <div>
              <h1 className="text-4xl font-light tracking-tight md:text-5xl lg:text-6xl">
                DAILY
              </h1>
              <h2 className="text-4xl font-black tracking-tight text-primary md:text-5xl lg:text-6xl">
                CHECKLIST
              </h2>
            </div>
            <span className="mb-2 rounded border border-primary bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
              {data.programName}
            </span>
          </div>

          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Track · Study · Conquer · Repeat
          </p>
        </header>

        {/* Quote */}
        <div className="mb-8 rounded-lg border border-border bg-card p-4 md:p-6">
          <div className="flex gap-3">
            <Quote className="h-6 w-6 shrink-0 text-primary opacity-50" />
            <div>
              <p className="text-lg font-medium italic text-primary">
                &ldquo;{data.quote.text}&rdquo;
              </p>
              <p className="mt-2 text-sm text-accent">— {data.quote.author}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Tasks Done" value={totalTasksDone} />
          <StatCard label="Days Done" value={daysDone} />
          <StatCard label="Streak" value={streak} />
          <StatCard label="Progress" value={`${progress}%`} highlight />
        </div>

        {/* Streak Banner */}
        <div className="mb-8 overflow-hidden rounded-lg bg-gradient-to-r from-accent/20 to-accent/5 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-accent/20 p-2">
                <Flame className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-accent">
                  {streak} DAY STREAK
                </h3>
                <p className="text-sm uppercase tracking-wide text-accent/70">
                  Keep the momentum going!
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-accent/20">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${Math.min((streak / 7) * 100, 100)}%` }}
                />
              </div>
              <span className="text-sm text-accent/70">Goal: 7</span>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground">
              Overall Progress
            </h3>
            <span className="text-2xl font-bold text-primary">{progress}%</span>
          </div>
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {data.days.map((day) => {
              const status = getDayStatus(day)
              return (
                <button
                  key={day.id}
                  onClick={() => onSelectDay(day.id)}
                  className={cn(
                    "h-4 w-4 rounded-sm border transition-all hover:scale-110 md:h-5 md:w-5",
                    status === "completed" && "border-primary bg-primary",
                    status === "current" && "border-primary bg-primary",
                    status === "partial" && "border-primary bg-primary/50",
                    status === "missed" && "border-accent bg-accent",
                    status === "upcoming" && "border-border bg-secondary"
                  )}
                  title={`Day ${day.id}`}
                />
              )
            })}
          </div>
        </div>




        {/* Calendar Grid */}
        <div className="mb-8">
          <h3 className="mb-4 text-sm uppercase tracking-wider text-muted-foreground">
            Select Day
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {data.days.map((day) => {
              const status = getDayStatus(day)
              const dayOfWeek = day.date
                .toLocaleDateString("en-US", { weekday: "short" })
                .slice(0, 2)
                .toUpperCase()

              return (
                <button
                  key={day.id}
                  onClick={() => onSelectDay(day.id)}
                  className={cn(
                    "group relative flex flex-col items-center rounded-lg border p-2 transition-all hover:border-primary md:p-3",
                    status === "completed" && "border-primary/50 bg-primary/10",
                    status === "current" &&
                      "border-primary bg-primary text-primary-foreground",
                    status === "partial" && "border-primary/50 bg-primary/10",
                    status === "missed" && "border-accent/50 bg-accent/10",
                    status === "upcoming" &&
                      "border-border bg-card hover:bg-secondary"
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] uppercase",
                      status === "current"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {dayOfWeek}
                  </span>
                  <span
                    className={cn(
                      "text-lg font-bold md:text-xl",
                      status === "current" && "text-primary-foreground"
                    )}
                  >
                    {day.id}
                  </span>
                  {day.dayType === "mock" && (
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Today's Preview */}
        <TodayPreview data={data} onSelectDay={onSelectDay} />
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string
  value: string | number
  highlight?: boolean
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-center">
      <div
        className={cn(
          "text-2xl font-bold md:text-3xl",
          highlight ? "text-primary" : "text-foreground"
        )}
      >
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  )
}

function TodayPreview({
  data,
  onSelectDay,
}: {
  data: StudyData
  onSelectDay: (dayId: number) => void
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayData = data.days.find((day) => {
    const dayDate = new Date(day.date)
    dayDate.setHours(0, 0, 0, 0)
    return dayDate.getTime() === today.getTime()
  })

  if (!todayData) return null

  const completedTasks = todayData.tasks.filter((t) => t.completed).length
  const dateStr = todayData.date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-4 md:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-[10px] uppercase">Day</span>
            <span className="text-2xl font-bold">{todayData.id}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">{dateStr}</h3>
            <p className="text-sm text-muted-foreground">
              {todayData.dayType === "mock"
                ? "Mock Test Day — No shortcuts!"
                : "Stay disciplined. Every task counts."}
            </p>
            <div className="mt-2 flex gap-2">
              <span className="rounded bg-accent/20 px-2 py-0.5 text-xs font-medium uppercase text-accent">
                {todayData.dayType === "mock"
                  ? "Mock Test Day"
                  : todayData.dayType}
              </span>
              <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {todayData.tasks.length} Tasks
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {completedTasks}/{todayData.tasks.length} tasks completed
          </span>
          <button
            onClick={() => onSelectDay(todayData.id)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View Day
          </button>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${(completedTasks / todayData.tasks.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
