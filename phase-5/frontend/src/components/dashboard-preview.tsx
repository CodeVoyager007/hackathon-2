import { CheckCircle2, Circle, Calendar, Inbox, Plus, Search, Menu, Star, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DashboardPreview() {
  return (
    <div className="w-full rounded-xl border bg-background shadow-2xl overflow-hidden flex flex-col h-[600px] text-sm md:text-base">
       {/* Fake Browser Toolbar */}
       <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2 shrink-0">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex-1 px-4">
          <div className="mx-auto h-6 max-w-sm rounded-md bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
             momentum.app/dashboard
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden bg-background">
        {/* Sidebar (Desktop) */}
        <aside className="w-64 border-r bg-background p-4 hidden md:flex flex-col gap-4">
           <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start bg-gray-100 dark:bg-gray-800 text-primary font-medium">
                <Inbox className="mr-2 h-4 w-4" /> Inbox
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" /> Upcoming
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <CheckCircle className="mr-2 h-4 w-4" /> Completed
              </Button>
           </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-gray-50 dark:bg-black/20">
           <div className="max-w-3xl mx-auto flex flex-col gap-6">
              
              {/* Header & Controls */}
              <div className="flex flex-col gap-4">
                 <div className="flex justify-between items-center">
                    <div>
                       <h1 className="text-2xl font-bold">Inbox</h1>
                       <p className="text-muted-foreground text-sm">3 tasks found</p>
                    </div>
                    <Button className="gap-2 shadow-lg hover:shadow-primary/25">
                       <Plus className="h-4 w-4" /> Create Task
                    </Button>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                       <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                       <div className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                          Search...
                       </div>
                    </div>
                    <div className="w-[140px] h-9 rounded-md border border-input bg-background px-3 py-2 text-sm flex items-center justify-between text-muted-foreground">
                       Sort <span className="opacity-50">▼</span>
                    </div>
                 </div>
              </div>

              {/* Task List */}
              <div className="space-y-3">
                 {/* Task 1 */}
                 <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-start gap-3">
                       <div className="mt-1 h-5 w-5 rounded-full border-2 border-primary/20 hover:border-primary cursor-pointer flex items-center justify-center transition-colors" />
                       <div className="flex-1 gap-1 flex flex-col">
                          <div className="flex justify-between items-start">
                             <p className="font-medium leading-none">Review Q3 performance report</p>
                             <Badge variant="secondary" className="text-xs font-normal">Work</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                             Analyze the quarterly metrics and prepare a slide deck for Monday's all-hands meeting. Focus on the growth in the APAC region.
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                             <span className="flex items-center gap-1 text-orange-500 font-medium"><Calendar className="h-3 w-3" /> Today</span>
                             <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> High</span>
                          </div>
                       </div>
                    </CardContent>
                 </Card>

                 {/* Task 2 */}
                 <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-start gap-3">
                       <div className="mt-1 h-5 w-5 rounded-full border-2 border-muted-foreground/30 hover:border-primary cursor-pointer flex items-center justify-center transition-colors" />
                       <div className="flex-1 gap-1 flex flex-col">
                          <div className="flex justify-between items-start">
                             <p className="font-medium leading-none">Update website landing page</p>
                             <Badge variant="secondary" className="text-xs font-normal">Work</Badge>
                          </div>
                           <p className="text-xs text-muted-foreground mt-1">
                             Implement the new hero section designs and update the feature list copy.
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                             <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Tomorrow</span>
                             <span className="flex items-center gap-1">Medium</span>
                          </div>
                       </div>
                    </CardContent>
                 </Card>

                  {/* Task 3 */}
                  <Card className="hover:shadow-md transition-shadow opacity-60">
                    <CardContent className="p-4 flex items-start gap-3">
                       <div className="mt-1 h-5 w-5 rounded-full border-2 border-primary bg-primary text-primary-foreground flex items-center justify-center">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                       </div>
                       <div className="flex-1 gap-1 flex flex-col">
                          <div className="flex justify-between items-start">
                             <p className="font-medium leading-none line-through text-muted-foreground">Grocery shopping</p>
                             <Badge variant="outline" className="text-xs font-normal">Personal</Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                             <span className="flex items-center gap-1">Low</span>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </div>

           </div>
        </main>
      </div>
    </div>
  );
}
