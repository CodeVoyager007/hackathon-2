import { Task } from "@/lib/api";
import { format, subDays, isSameDay, startOfDay } from "date-fns";
import { useMemo } from "react";

// Mock data for the landing page
const DEMO_TASKS: Partial<Task>[] = [
    { completed: true, updated_at: subDays(new Date(), 0).toISOString() },
    { completed: true, updated_at: subDays(new Date(), 0).toISOString() },
    { completed: true, updated_at: subDays(new Date(), 0).toISOString() },
    { completed: true, updated_at: subDays(new Date(), 1).toISOString() },
    { completed: true, updated_at: subDays(new Date(), 1).toISOString() },
    { completed: true, updated_at: subDays(new Date(), 1).toISOString() },
    { completed: true, updated_at: subDays(new Date(), 1).toISOString() },
    { completed: true, updated_at: subDays(new Date(), 2).toISOString() },
    { completed: true, updated_at: subDays(new Date(), 2).toISOString() },
    { completed: true, updated_at: subDays(new Date(), 3).toISOString() },
    { completed: true, updated_at: subDays(new Date(), 3).toISOString() },
    { completed: true, updated_at: subDays(new Date(), 3).toISOString() },
    { completed: true, updated_at: subDays(new Date(), 4).toISOString() },
    { completed: true, updated_at: subDays(new Date(), 4).toISOString() },
    { completed: true, updated_at: subDays(new Date(), 5).toISOString() },
    { completed: true, updated_at: subDays(new Date(), 6).toISOString() },
];

export function AnalyticsChart({ tasks }: { tasks?: Task[] }) {
  const chartData = useMemo(() => {
    // If no tasks provided, use demo data
    const sourceTasks = tasks || (DEMO_TASKS as Task[]);
    
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      return {
        date: d,
        label: format(d, "EEEEE"), // "M", "T", "W", etc.
        fullLabel: format(d, "EEE"), // "Mon", "Tue"
        count: 0,
        isToday: isSameDay(d, new Date())
      };
    });

    sourceTasks.forEach(task => {
      if (task.completed && task.updated_at) {
        const taskDate = new Date(task.updated_at);
        const dayStat = days.find(d => isSameDay(d.date, taskDate));
        if (dayStat) {
          dayStat.count++;
        }
      }
    });

    const maxCount = Math.max(...days.map(d => d.count), 1); // Avoid div by zero

    return days.map(day => ({
      ...day,
      heightPercentage: Math.round((day.count / maxCount) * 100)
    }));
  }, [tasks]);

  return (
    <div className="w-full h-full p-4 flex flex-col items-center justify-center">
      <div className="w-full h-40 relative flex items-end justify-between gap-2">
        {/* Y-axis lines (Background) */}
        <div className="absolute inset-0 flex flex-col justify-between text-xs text-muted-foreground/10 pointer-events-none z-0">
           <div className="border-b w-full h-0"></div>
           <div className="border-b w-full h-0"></div>
           <div className="border-b w-full h-0"></div>
           <div className="border-b w-full h-0"></div>
           <div className="border-b w-full h-0"></div>
        </div>

        {chartData.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col justify-end h-full group relative z-10">
             {/* Bar */}
             <div 
               className={`w-full rounded-t-sm transition-all duration-500 min-h-[4px] relative ${
                 data.isToday ? "bg-primary shadow-[0_0_10px_-2px_var(--color-primary)]" : "bg-primary/30 hover:bg-primary/60"
               }`}
               style={{ height: `${data.heightPercentage}%` }}
             >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                  {data.count} tasks
                </div>
             </div>
          </div>
        ))}
      </div>
      
      {/* X-axis labels */}
      <div className="w-full flex justify-between mt-3 text-[10px] text-muted-foreground font-medium uppercase px-1">
        {chartData.map((data, index) => (
          <span key={index} className={`flex-1 text-center ${data.isToday ? "text-primary font-bold" : ""}`}>
            {data.label}
          </span>
        ))}
      </div>
    </div>
  );
}