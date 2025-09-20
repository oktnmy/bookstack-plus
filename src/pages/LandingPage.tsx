import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Shield, GraduationCap, Users, Search, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">Library System</span>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
              <Link to="/admin-auth">Admin</Link>
            </Button>
            <Button asChild className="bg-white text-primary hover:bg-white/90">
              <Link to="/student-auth">Student Login</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Welcome to Your Digital Library
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Access thousands of books, manage your reading, and explore knowledge with our modern library management system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/student-auth">
                <GraduationCap className="w-5 h-5 mr-2" />
                Student Access
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/admin-auth">
                <Shield className="w-5 h-5 mr-2" />
                Admin Portal
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <CardTitle>Smart Search</CardTitle>
              <CardDescription className="text-white/70">
                Find books quickly with our advanced search and filtering system
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <CardTitle>Track Borrowing</CardTitle>
              <CardDescription className="text-white/70">
                Keep track of borrowed books, due dates, and reading history
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <CardTitle>User Management</CardTitle>
              <CardDescription className="text-white/70">
                Comprehensive user management for students and administrators
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Access Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="shadow-strong bg-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">Student Portal</CardTitle>
              <CardDescription>
                Browse books, manage your reading list, and track your borrowing history
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                <li>• Browse the book catalog</li>
                <li>• View borrowing history</li>
                <li>• Check due dates</li>
                <li>• Discover new books</li>
              </ul>
              <Button asChild className="w-full bg-gradient-accent">
                <Link to="/student-auth">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Student Login
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-strong bg-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription>
                Manage the library system, books, users, and borrowing records
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                <li>• Manage book catalog</li>
                <li>• User administration</li>
                <li>• Borrowing management</li>
                <li>• System analytics</li>
              </ul>
              <Button asChild className="w-full bg-gradient-primary">
                <Link to="/admin-auth">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Login
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/20 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-white/60">
          <p>&copy; 2024 Library Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}