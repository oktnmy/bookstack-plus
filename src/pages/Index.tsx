import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BookCard } from "@/components/books/BookCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock, AlertTriangle, Plus, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useBooks } from "@/hooks/useBooks";
import { useProfile } from "@/hooks/useProfile";

export default function Index() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { data: books, isLoading: booksLoading } = useBooks();
  const { data: profile } = useProfile();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your library...</p>
        </div>
      </div>
    );
  }

  const totalBooks = books?.length || 0;
  const availableBooks = books?.reduce((sum, book) => sum + book.available_copies, 0) || 0;
  const borrowedBooks = books?.reduce((sum, book) => sum + (book.total_copies - book.available_copies), 0) || 0;

  const stats = [
    {
      title: "Total Books",
      value: totalBooks.toString(),
      change: `${availableBooks} available`,
      changeType: "positive" as const,
      icon: BookOpen,
      description: "In our collection"
    },
    {
      title: "Fiction Books",
      value: books?.filter(book => book.genre === 'Fiction').length.toString() || "0",
      change: "Most popular genre",
      changeType: "positive" as const,
      icon: BookOpen,
      description: "Stories & novels"
    },
    {
      title: "Books Borrowed",
      value: borrowedBooks.toString(),
      change: `${availableBooks} available`,
      changeType: "neutral" as const,
      icon: Clock,
      description: "Currently checked out"
    },
    {
      title: "Fantasy Collection",
      value: books?.filter(book => book.genre === 'Fantasy').length.toString() || "0",
      change: "Magical adventures",
      changeType: "positive" as const,
      icon: BookOpen,
      description: "Fantasy & adventure"
    }
  ];

  const recentBooks = books?.slice(0, 6) || [];

  // Mock recent activity for now
  const recentActivity = [
    { id: 1, action: "Welcome to the library!", book: "Get started by browsing books", user: profile?.full_name || "New User", time: "Just now" },
    { id: 2, action: "System ready", book: "All features available", user: "Library System", time: "Now" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Library Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.full_name || 'User'}! Here's your library overview.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Search className="w-4 h-4" />
              Search Books
            </Button>
            <Button className="gap-2 bg-gradient-primary">
              <Plus className="w-4 h-4" />
              Add New Book
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Books */}
          <div className="lg:col-span-2">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Available Books
                </CardTitle>
                <CardDescription>
                  Browse our collection of {totalBooks} books
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {booksLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-muted rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {recentBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        book={{
                          id: book.id,
                          title: book.title,
                          author: book.author,
                          isbn: book.isbn,
                          category: book.genre || 'General',
                          location: book.location || 'Unknown',
                          status: book.available_copies > 0 ? "available" as const : "borrowed" as const,
                          dueDate: book.available_copies === 0 ? "Unknown" : undefined,
                          borrower: book.available_copies === 0 ? "Someone" : undefined,
                          copiesAvailable: book.available_copies,
                          totalCopies: book.total_copies
                        }}
                        compact
                        onView={(id) => console.log('View book:', id)}
                        onEdit={(id) => console.log('Edit book:', id)}
                        onDelete={(id) => console.log('Delete book:', id)}
                      />
                    ))}
                    <Button variant="outline" className="w-full">
                      View All Books
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.book}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common library management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-24 flex-col gap-2">
                <BookOpen className="w-6 h-6" />
                <span>Add Book</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Users className="w-6 h-6" />
                <span>Manage Users</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Clock className="w-6 h-6" />
                <span>Borrow Book</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <AlertTriangle className="w-6 h-6" />
                <span>Overdue Items</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}