import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, Layers, Bell, ArrowRight, Shield, Globe } from "lucide-react";
import { DashboardPreview } from "@/components/dashboard-preview";
import { CompanyLogos } from "@/components/company-logos";
import { AnalyticsChart } from "@/components/analytics-chart";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-40 bg-background overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary mb-6 animate-fade-in-up">
            v2.0 is live — New AI Features
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Build your <br className="hidden md:block" />
            <span className="text-primary">Momentum.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            The intelligent task manager designed for high-performance individuals. 
            Organize work, track progress, and achieve flow state.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-100">
            <Link href="/login">
              <Button size="lg" className="px-8 h-12 text-lg rounded-full shadow-lg hover:shadow-primary/25 transition-all">
                Start for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="px-8 h-12 text-lg rounded-full border-2">
                View Features
              </Button>
            </Link>
          </div>
          
          {/* Hero Image / Dashboard Preview */}
          <div className="mt-16 md:mt-24 relative mx-auto max-w-5xl rounded-xl border bg-card/50 shadow-2xl backdrop-blur-sm p-2 md:p-4 animate-fade-in-up delay-200">
             <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-widest">
            Trusted by productive teams at
          </p>
          <CompanyLogos />
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Focus on what matters</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've stripped away the clutter to leave you with a tool that actually helps you get things done.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-card border hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Capture tasks in milliseconds. Our keyboard-first interface ensures you never lose your flow state while organizing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-card border hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Layers className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Smart Organization</h3>
              <p className="text-muted-foreground leading-relaxed">
                Automatically categorize tasks with AI-driven tags. Keep your workspace clean.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-card border hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Bell className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Intelligent Nudges</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get reminded only when it matters. Location and context-aware notifications ensure you never miss a deadline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works / Bento Grid style */}
      <section className="w-full py-24 bg-muted/30">
        <div className="container mx-auto px-4">
           <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Designed for your workflow</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
                 {/* Large card */}
                 <div className="md:col-span-2 row-span-2 rounded-3xl bg-card border p-8 flex flex-col justify-between overflow-hidden relative group">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Visual Progress Tracking</h3>
                        <p className="text-muted-foreground">See your momentum build up over time with beautiful charts.</p>
                    </div>
                    <div className="mt-8 h-64 bg-muted rounded-xl border border-border/50 group-hover:border-primary/20 transition-colors flex items-center justify-center">
                        <AnalyticsChart />
                    </div>
                 </div>

                 {/* Small card */}
                 <div className="rounded-3xl bg-card border p-8 flex flex-col relative overflow-hidden">
                    <Shield className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-2">Bank-Grade Security</h3>
                    <p className="text-muted-foreground text-sm">Your data is encrypted at rest and in transit.</p>
                 </div>

                 {/* Small card */}
                 <div className="rounded-3xl bg-card border p-8 flex flex-col relative overflow-hidden">
                    <Globe className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-2">Sync Everywhere</h3>
                    <p className="text-muted-foreground text-sm">Access your tasks from any device, anytime.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to find your flow?</h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 relative z-10">
              Join thousands of makers, creators, and doers who trust Momentum to manage their daily work.
            </p>
            <div className="flex justify-center gap-4 relative z-10">
              <Link href="/login">
                <Button size="lg" variant="secondary" className="px-8 h-12 text-lg rounded-full font-semibold">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}