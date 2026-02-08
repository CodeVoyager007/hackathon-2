"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Tag, Clock, Flag, AlignLeft } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { createTask, Task } from "@/lib/api";
import { Label } from "@/components/ui/label";

export function CreateTaskDialog({ onTaskCreated }: { onTaskCreated: () => void }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [date, setDate] = useState<Date>();
  const [tags, setTags] = useState(""); // Comma separated string for simplicity
  const [recurrence, setRecurrence] = useState<"none" | "daily" | "weekly" | "monthly">("none");

  const mutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      onTaskCreated(); // Invalidates parent query
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Ensure global refresh
      setOpen(false);
      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDate(undefined);
      setTags("");
      setRecurrence("none");
    },
    onError: (error) => {
        console.error("Failed to create task:", error);
        alert("Failed to create task. Check console for details.");
    }
  });

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    // Parse tags
    const tagList = tags.split(",").map(t => t.trim()).filter(t => t);

    mutation.mutate({
      title,
      description: description || undefined,
      priority,
      due_date: date ? date.toISOString() : undefined,
      tags: tagList,
      recurrence,
      completed: false
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="shadow-sm">
          + New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Task</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium border-0 border-b rounded-none px-0 focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/50"
              autoFocus
            />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Flag className="w-3 h-3" /> Priority
                </Label>
                <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" /> Due Date
                </Label>
                <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                    >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    />
                </PopoverContent>
                </Popover>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <AlignLeft className="w-3 h-3" /> Description
            </Label>
            <Textarea
              placeholder="Add details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none min-h-[80px]"
            />
          </div>

          {/* Advanced: Tags & Recurrence */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Tags (comma separated)
                </Label>
                <Input
                    placeholder="work, urgent..."
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
             </div>
             <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Recurrence
                </Label>
                <Select value={recurrence} onValueChange={(v: any) => setRecurrence(v)}>
                <SelectTrigger>
                    <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
                </Select>
             </div>
          </div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}