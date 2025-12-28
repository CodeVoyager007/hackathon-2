"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, deleteTask, toggleTaskComplete, Task } from "@/lib/api";
import { TaskCard } from "@/components/task-card";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Inbox, Calendar, CheckCircle, Search, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsChart } from "@/components/analytics-chart";

export default function DashboardPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [view, setView] = useState<"inbox" | "upcoming" | "completed">("inbox");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date_asc");

  const queryKey = ["tasks", { view, search, sort }];

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: queryKey,
    queryFn: () => {
        const params: any = { search, sort_by: sort };
        
        if (view === "inbox") {
            params.status = "todo";
        } else if (view === "upcoming") {
             params.status = "todo";
        } else if (view === "completed") {
             params.status = "done";
        }

        return getTasks(params);
    },
    enabled: !!isAuthenticated, 
  });

  const { data: completedTasks = [] } = useQuery<Task[]>({
    queryKey: ["tasks", "analytics"],
    queryFn: () => getTasks({ status: "done" }),
    enabled: !!isAuthenticated,
  });

  const { mutate: deleteTaskMutation } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const { mutate: toggleTaskMutation } = useMutation({
    mutationFn: toggleTaskComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
  
  if (authLoading) {
    return (
        <div className="flex h-[calc(100vh-4rem)]">
            <aside className="w-64 border-r p-4 hidden md:block">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </aside>
            <main className="flex-1 p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex justify-between">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </div>
            </main>
        </div>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') router.push('/login');
    return null;
  }

  const activeClass = "bg-primary/10 text-primary font-semibold border-r-2 border-primary rounded-none";
  const inactiveClass = "text-muted-foreground hover:text-foreground hover:bg-muted/50";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-6 flex-1">
        <div className="space-y-1">
          <h4 className="px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Tasks</h4>
          <Button 
            variant="ghost" 
            className={`w-full justify-start px-4 h-11 ${view === "inbox" ? activeClass : inactiveClass}`} 
            onClick={() => setView("inbox")}
          >
            <Inbox className={`mr-3 h-4 w-4 ${view === "inbox" ? "text-primary" : ""}`} /> Inbox
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start px-4 h-11 ${view === "upcoming" ? activeClass : inactiveClass}`} 
            onClick={() => setView("upcoming")}
          >
            <Calendar className={`mr-3 h-4 w-4 ${view === "upcoming" ? "text-primary" : ""}`} /> Upcoming
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start px-4 h-11 ${view === "completed" ? activeClass : inactiveClass}`} 
            onClick={() => setView("completed")}
          >
            <CheckCircle className={`mr-3 h-4 w-4 ${view === "completed" ? "text-primary" : ""}`} /> Completed
          </Button>
        </div>
      </div>

      <div className="mt-auto p-4 border-t">
          <h4 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Momentum Stats</h4>
          <div className="h-32">
            <AnalyticsChart tasks={completedTasks} />
          </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden border-b p-4 flex items-center justify-between bg-background shrink-0">
        <div className="flex items-center gap-2">
            <span className="font-bold text-lg capitalize">{view}</span>
            <span className="text-xs text-muted-foreground font-normal">({tasks.length})</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 pt-10 flex flex-col h-full">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 border-r bg-background pt-8 hidden md:block shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-auto bg-gray-50/50 dark:bg-black/20">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          
          {/* Controls & Header */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight capitalize">{view}</h1>
                <p className="text-muted-foreground mt-1">
                  You have {tasks.length} tasks {view === "completed" ? "completed" : "to focus on"}.
                </p>
              </div>
              <CreateTaskDialog onTaskCreated={() => queryClient.invalidateQueries({ queryKey: ["tasks"] })} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                    placeholder="Search tasks..." 
                    className="pl-10 h-11 bg-background border-border/50 focus-visible:ring-primary/20" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                />
              </div>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full sm:w-[160px] h-11 bg-background border-border/50">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_asc">Due Date (Soonest)</SelectItem>
                  <SelectItem value="date_desc">Due Date (Latest)</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Task List Container */}
          <div className="space-y-4 pb-20">
            {tasksLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-background/50">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Inbox className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Workspace Clear</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  {search ? `No results for "${search}". Try a different term.` : "Everything is under control. Enjoy your productive momentum."}
                </p>
                {!search && (
                   <div className="mt-8">
                       <CreateTaskDialog onTaskCreated={() => queryClient.invalidateQueries({ queryKey: ["tasks"] })} />
                   </div>
                )}
              </div>
            ) : (
              <div className="grid gap-3">
                {tasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onToggle={() => toggleTaskMutation(task.id)} 
                    onDelete={() => deleteTaskMutation(task.id)} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}