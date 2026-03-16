"use client"

import { useState, useEffect, useRef } from "react"
import { DayData, TaskData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Play,
  Square,
  Link,
  Check,
  BookOpen,
  FileText,
  Headphones,
  Mic,
  Video,
  PenTool,
  Star,
  Sparkles,
  ArrowLeft,
} from "lucide-react"

interface DayDetailViewProps {
  day: DayData
  dayNumber: number
  totalDays: number
  onBack: () => void
  onNavigate: (direction: "prev" | "next") => void
  onReset: () => void
  onUpdateTask: (taskId: string, updates: Partial<TaskData>) => void
  onUpdateNotes: (notes: string) => void
}

const taskIcons: Record<string, React.ReactNode> = {
  reading: <BookOpen className="h-4 w-4" />,
  article: <FileText className="h-4 w-4" />,
  listening: <Headphones className="h-4 w-4" />,
  podcast: <Mic className="h-4 w-4" />,
  live: <Video className="h-4 w-4" />,
  vocabulary: <PenTool className="h-4 w-4" />,
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

function TaskTimer({
  taskId,
  time,
  isRunning,
  onStart,
  onStop,
  onTimeUpdate,
}: {
  taskId: string
  time: number
  isRunning: boolean
  onStart: () => void
  onStop: () => void
  onTimeUpdate: (time: number) => void
}) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        onTimeUpdate(time + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, time, onTimeUpdate])

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm text-muted-foreground w-12">
        {formatTime(time)}
      </span>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-7 px-3 text-xs font-medium transition-all",
          isRunning
            ? "border-accent bg-accent/10 text-accent hover:bg-accent/20"
            : "border-primary/50 hover:border-primary hover:bg-primary/10"
        )}
        onClick={isRunning ? onStop : onStart}
      >
        {isRunning ? (
          <>
            <Square className="h-3 w-3 mr-1" />
            STOP
          </>
        ) : (
          <>
            <Play className="h-3 w-3 mr-1" />
            START
          </>
        )}
      </Button>
    </div>
  )
}

function TaskCard({
  task,
  index,
  onUpdate,
  runningTaskId,
  setRunningTaskId,
}: {
  task: TaskData
  index: number
  onUpdate: (updates: Partial<TaskData>) => void
  runningTaskId: string | null
  setRunningTaskId: (id: string | null) => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleStartTimer = () => {
    setRunningTaskId(task.id)
  }

  const handleStopTimer = () => {
    setRunningTaskId(null)
  }

  const handleTimeUpdate = (time: number) => {
    onUpdate({ timer: time })
  }

  const hasScore = task.maxScore !== undefined

  return (
    <div
      className={cn(
        "rounded-lg border transition-all duration-200",
        task.completed
          ? "border-success/30 bg-success/5"
          : "border-border bg-card hover:border-primary/30"
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                task.completed
                  ? "bg-success text-success-foreground"
                  : "bg-secondary text-foreground"
              )}
            >
              {index + 1}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "p-1.5 rounded-md",
                    task.completed
                      ? "bg-success/20 text-success"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {taskIcons[task.icon] || <BookOpen className="h-4 w-4" />}
                </span>
                <h3
                  className={cn(
                    "font-semibold",
                    task.completed && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TaskTimer
              taskId={task.id}
              time={task.timer}
              isRunning={runningTaskId === task.id}
              onStart={handleStartTimer}
              onStop={handleStopTimer}
              onTimeUpdate={handleTimeUpdate}
            />
            <button
              onClick={() => onUpdate({ completed: !task.completed })}
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                task.completed
                  ? "border-success bg-success text-success-foreground"
                  : "border-muted-foreground/30 hover:border-primary"
              )}
            >
              {task.completed && <Check className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* URL and Score section */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <Link className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider shrink-0">URL</span>
            <Input
              placeholder="Paste resource or article URL..."
              value={task.url}
              onChange={(e) => onUpdate({ url: e.target.value })}
              className="h-8 text-sm bg-input border-border placeholder:text-muted-foreground/50"
            />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "rotate-90"
                )}
              />
            </button>
          </div>

          {isExpanded && hasScore && (
            <div className="flex items-center gap-3 pl-6">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Score
              </span>
              <Input
                type="number"
                value={task.score ?? ""}
                onChange={(e) =>
                  onUpdate({ score: parseInt(e.target.value) || 0 })
                }
                className="h-7 w-16 text-sm text-center bg-input border-border"
                min={0}
                max={task.maxScore}
              />
              <span className="text-xs text-muted-foreground">
                / {task.maxScore} {task.label || "correct"}
              </span>
              {task.score !== undefined && task.maxScore && task.score > 0 && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    (task.score / task.maxScore) * 100 >= 70
                      ? "bg-success/20 text-success"
                      : (task.score / task.maxScore) * 100 >= 50
                        ? "bg-primary/20 text-primary"
                        : "bg-accent/20 text-accent"
                  )}
                >
                  {Math.round((task.score / task.maxScore) * 100)}%
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function DayDetailView({
  day,
  dayNumber,
  totalDays,
  onBack,
  onNavigate,
  onReset,
  onUpdateTask,
  onUpdateNotes,
}: DayDetailViewProps) {
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null)

  const completedTasks = day.tasks.filter((t) => t.completed).length
  const totalTasks = day.tasks.length
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const allCompleted = completedTasks === totalTasks && totalTasks > 0

  // Format date
  const dateStr = day.date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  // Calculate aggregate scores for tasks with scores
  const scoreTasks = day.tasks.filter((t) => t.maxScore !== undefined)

  // Get day type tags
  const getTags = () => {
    const tags = []
    if (day.dayType === "mock") {
      tags.push("Mock Test Day")
      tags.push("Full Exam")
    } else if (day.dayType === "weekend") {
      tags.push("Weekend")
    } else {
      tags.push("Weekday")
    }
    tags.push(`${totalTasks} Tasks`)
    return tags
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center justify-center bg-primary text-primary-foreground rounded-lg px-3 py-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-medium opacity-80">
                    Day
                  </span>
                  <span className="text-2xl font-bold leading-none">
                    {dayNumber}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold">{dateStr}</h1>
                <p className="text-sm text-muted-foreground">
                  {day.dayType === "mock"
                    ? "Mock Test Day — No shortcuts!"
                    : "Stay disciplined. Every task counts."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getTags().map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider",
                    tag.toLowerCase().includes("mock") ||
                      tag.toLowerCase().includes("weekend")
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">Daily Progress</span>
              <span className="font-medium">
                {completedTasks}/{totalTasks}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  allCompleted
                    ? "bg-gradient-to-r from-success to-success/80"
                    : "bg-gradient-to-r from-accent to-primary"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Scores Summary */}
      {scoreTasks.length > 0 && scoreTasks.some((t) => t.score && t.score > 0) && (
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Scores
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {scoreTasks
              .filter((t) => t.score && t.score > 0)
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border"
                >
                  <span className="text-sm text-muted-foreground">
                    {task.title.split(" ").slice(0, 2).join(" ")}
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {task.score}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / {task.maxScore} {task.label || "correct"}
                  </span>
                  {task.score !== undefined && task.maxScore && (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-xs font-semibold",
                        (task.score / task.maxScore) * 100 >= 70
                          ? "bg-success/20 text-success"
                          : (task.score / task.maxScore) * 100 >= 50
                            ? "bg-primary/20 text-primary"
                            : "bg-accent/20 text-accent"
                      )}
                    >
                      {Math.round((task.score / task.maxScore) * 100)}%
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tasks */}
      <main className="mx-auto max-w-4xl px-4 py-4">
        <div className="space-y-3">
          {day.tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onUpdate={(updates) => onUpdateTask(task.id, updates)}
              runningTaskId={runningTaskId}
              setRunningTaskId={setRunningTaskId}
            />
          ))}
        </div>

        {/* Notes Section */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Notes / Reflections
            </span>
          </div>
          <Textarea
            placeholder="Write your thoughts, new vocabulary, or reflections for today..."
            value={day.notes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            className="min-h-[120px] bg-card border-border resize-none placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Completion Banner */}
        {allCompleted && (
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-success/10 to-success/5 border border-success/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-success/20">
                  <Star className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-success">
                    All tasks complete! Great work!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Keep up the momentum
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.min(completedTasks, 7)
                        ? "text-primary fill-primary"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                Day {dayNumber}
              </span>
              <span>/</span>
              <span>{totalDays}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("prev")}
                disabled={dayNumber <= 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <Button
                size="sm"
                onClick={() => onNavigate("next")}
                disabled={dayNumber >= totalDays}
                className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
