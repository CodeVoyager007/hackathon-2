"use client";

import { format, isToday, isTomorrow, isPast } from "date-fns";
import { Trash2, Calendar, Star, Clock, Tag, Repeat } from "lucide-react";
import { Task } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const priorityConfig = {
  low: { color: "text-blue-500 bg-blue-500/10 border-blue-200", icon: null },
  medium: { color: "text-yellow-600 bg-yellow-500/10 border-yellow-200", icon: null },
  high: { color: "text-orange-600 bg-orange-500/10 border-orange-200", icon: <Star className="h-3 w-3 fill-orange-500" /> },
};

export function TaskCard({ task, onToggle, onDelete }: { task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void; }) {
  
  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) && !task.completed;

  const getDueDateLabel = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) return <span className="text-orange-500 font-medium">Today</span>;
    if (isTomorrow(d)) return <span>Tomorrow</span>;
    return <span className={cn(isOverdue && "text-destructive font-semibold")}>{format(d, "MMM d")}</span>;
  };

  return (
    <Card className={cn(
        "hover:shadow-md transition-all duration-200 border-border/50 group",
        isOverdue && "border-destructive/50 bg-destructive/5"
    )}>
      <CardContent className="p-4 flex items-start gap-4">
        {/* Custom Checkbox Style */}
        <div 
          onClick={() => onToggle(task.id)}
          className={`mt-1 h-5 w-5 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all shrink-0 ${
            task.completed 
              ? "bg-primary border-primary text-primary-foreground" 
              : "border-muted-foreground/30 hover:border-primary"
          }`}
        >
          {task.completed && <CheckIcon className="h-3.5 w-3.5" />}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <span
              className={`font-medium leading-tight transition-all ${
                task.completed ? "line-through text-muted-foreground/60" : "text-foreground"
              } ${isOverdue ? "text-destructive" : ""}`}
            >
              {task.title}
            </span>
            <div className="flex items-center gap-2">
                {task.recurrence && task.recurrence.pattern !== 'none' && (
                    <Repeat className="h-3 w-3 text-muted-foreground" />
                )}
                <Badge 
                variant="outline" 
                className={`capitalize text-[10px] px-1.5 py-0 h-5 font-normal shrink-0 ${priorityConfig[task.priority].color}`}
                >
                {priorityConfig[task.priority].icon && <span className="mr-1">{priorityConfig[task.priority].icon}</span>}
                {task.priority}
                </Badge>
            </div>
          </div>
          
          {task.description && (
            <p className={`text-xs leading-relaxed line-clamp-2 transition-all ${
                task.completed ? "text-muted-foreground/40" : "text-muted-foreground"
            }`}>
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 py-1">
                {task.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[9px] px-1 py-0 h-4 bg-muted/50 text-muted-foreground font-normal">
                        <Tag className="h-2 w-2 mr-1" /> {tag}
                    </Badge>
                ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-[11px] text-muted-foreground/70 pt-1">
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className={cn("h-3 w-3 opacity-70", isOverdue && "text-destructive opacity-100")} />
                {getDueDateLabel(task.due_date)}
              </div>
            )}
            <div className="flex items-center gap-1 capitalize">
               <div className={`h-1.5 w-1.5 rounded-full ${task.priority === 'high' ? 'bg-orange-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
               Inbox
            </div>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDelete(task.id)} 
          className="opacity-0 group-hover:opacity-100 h-8 w-8 text-muted-foreground hover:text-destructive transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}


function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
}