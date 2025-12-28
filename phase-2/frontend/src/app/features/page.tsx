import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  ShieldCheck, 
  Zap, 
  LayoutDashboard, 
  BarChart3, 
  Moon 
} from "lucide-react";

const features = [
  { 
    name: 'Smart Task Management', 
    description: 'Create, prioritize, and categorize tasks with our intuitive interface. Use tags and due dates to keep everything organized.',
    icon: LayoutDashboard 
  },
  { 
    name: 'Productivity Analytics', 
    description: 'Track your progress with real-time stats on your profile. See your completion rates and pending workload at a glance.',
    icon: BarChart3 
  },
  { 
    name: 'Secure by Design', 
    description: 'Your data is yours alone. We use industry-standard authentication and strict data isolation to ensure your privacy.',
    icon: ShieldCheck 
  },
  { 
    name: 'Lightning Fast', 
    description: 'Built with Next.js and optimized for performance. Experience instant interactions with our optimistic UI updates.',
    icon: Zap 
  },
  { 
    name: 'Focus Mode', 
    description: 'Switch to Dark Mode to reduce eye strain during late-night productivity sessions. Seamlessly integrated into the experience.',
    icon: Moon 
  },
  { 
    name: 'Getting Things Done', 
    description: 'Based on proven productivity methods. Capture, clarify, and organize your tasks to free your mind.',
    icon: CheckCircle 
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Features designed for <span className="text-primary">action</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Momentum gives you the clarity and control you need to tackle your day with confidence.
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="p-8 border rounded-xl bg-card hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.name}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of users who are getting more done with Momentum.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="px-8 font-semibold">
                Start for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}