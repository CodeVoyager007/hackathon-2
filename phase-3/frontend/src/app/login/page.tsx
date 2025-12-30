"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, User, Loader2, ArrowRight, CheckCircle2, Star, Shield, Zap } from "lucide-react";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (activeTab === "login") {
        await authClient.signIn.email({
          email,
          password,
          rememberMe
        }, {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: (ctx) => {
            setError(ctx.error.message);
            setIsLoading(false);
          }
        });
      } else {
        await authClient.signUp.email({
          email,
          password,
          name: name || "User",
        }, {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: (ctx) => {
            setError(ctx.error.message);
            setIsLoading(false);
          }
        });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen grid lg:grid-cols-2">
      
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8 bg-background relative">
         {/* Mobile-only background blobs */}
         <div className="lg:hidden absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
         
         <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Welcome to Momentum
              </h1>
              <p className="mt-2 text-muted-foreground">
                {activeTab === "login" 
                  ? "Enter your credentials to access your workspace." 
                  : "Join thousands of users organizing their life."}
              </p>
            </div>

            <Card className="border-0 shadow-none bg-transparent">
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1">
                    <TabsTrigger value="login" className="rounded-sm">Login</TabsTrigger>
                    <TabsTrigger value="signup" className="rounded-sm">Sign Up</TabsTrigger>
                  </TabsList>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {activeTab === "signup" && (
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative group">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <Input
                            id="name"
                            placeholder="John Doe"
                            className="pl-10 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all duration-200"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all duration-200"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        {activeTab === "login" && (
                          <Button variant="link" className="p-0 h-auto text-xs font-normal text-muted-foreground hover:text-primary" type="button">
                            Forgot password?
                          </Button>
                        )}
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all duration-200"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {activeTab === "login" && (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="remember" 
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">Remember me for 30 days</Label>
                      </div>
                    )}

                    {error && (
                      <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md animate-in fade-in zoom-in-95">
                        {error}
                      </div>
                    )}

                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/20" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {activeTab === "login" ? "Signing in..." : "Creating account..."}
                        </>
                      ) : (
                        <>
                          {activeTab === "login" ? "Sign In" : "Create Account"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-border pt-6 mt-6">
                <p className="text-xs text-muted-foreground text-center">
                  By clicking continue, you agree to our{" "}
                  <a href="#" className="underline hover:text-primary transition-colors">Terms of Service</a> and{" "}
                  <a href="#" className="underline hover:text-primary transition-colors">Privacy Policy</a>.
                </p>
              </CardFooter>
            </Card>
         </div>
      </div>

      {/* Right Side - Hero / Visuals */}
      <div className="hidden lg:flex relative bg-slate-900 overflow-hidden items-center justify-center p-12">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
        
        {/* Glass Card Content */}
        <div className="relative z-10 w-full max-w-lg space-y-8 text-white animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
           <div className="space-y-4">
             <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white backdrop-blur-md">
               <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
               AI-Powered Productivity
             </div>
             <h2 className="text-4xl font-bold leading-tight">
               Master your day with intelligent task management.
             </h2>
             <p className="text-lg text-slate-300">
               Momentum helps you organize, prioritize, and track your work with the power of AI assistance.
             </p>
           </div>

           {/* Features Grid */}
           <div className="grid grid-cols-1 gap-4 pt-8">
             {[
               { icon: Zap, title: "Smart Scheduling", desc: "AI automatically prioritizes your day." },
               { icon: Shield, title: "Private & Secure", desc: "Your data is encrypted and safe." },
               { icon: Star, title: "Focus Mode", desc: "Eliminate distractions and get things done." }
             ].map((feature, i) => (
               <div key={i} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                 <div className="p-2 rounded-lg bg-white/10">
                   <feature.icon className="h-5 w-5 text-blue-300" />
                 </div>
                 <div>
                   <h3 className="font-semibold text-white">{feature.title}</h3>
                   <p className="text-sm text-slate-400">{feature.desc}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>

    </div>
  );
}


