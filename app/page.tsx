"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  BarChart3,
  MessageSquare,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PublicHeader from "@/components/public-header";
import Footer from "@/components/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <PublicHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          Now with real-time collaboration
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Project management
          <br />
          <span className="text-primary">made simple</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Plan, track, and manage your team's work with our intuitive project
          management platform. Built for teams who want to ship faster.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sign-up">
            <Button size="lg" className="gap-2">
              Sign Up <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => alert("This is a demo - no real signup required!")}
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Everything you need to ship
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From planning to deployment, manage your entire development workflow
            in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Kanban Boards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Visualize your workflow with drag-and-drop Kanban boards. Track
                progress from idea to deployment.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Team Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Assign tasks, mention teammates, and keep everyone aligned with
                real-time updates and notifications.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Sprint Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Plan sprints, estimate work, and track velocity with built-in
                agile tools and reporting.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Issue Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create, prioritize, and resolve issues with detailed tracking,
                comments, and status updates.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <GitBranch className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Roadmaps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Plan your product roadmap and communicate progress with
                stakeholders using timeline views.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Automate repetitive tasks and workflows to keep your team
                focused on what matters most.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

     <Footer />

    </div>
  );
}
