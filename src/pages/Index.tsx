import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BookCard } from "@/components/books/BookCard";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const stats = [
  {
    title: "Total Books",
    value: "12,547",
    change: "+2.3%",
    changeType: "positive" as const,
    icon: BookOpen,
    description: "from last month",
  },
  {
    title: "Active Members",
    value: "3,421",
    change: "+5.1%",
    changeType: "positive" as const,
    icon: Users,
    description: "from last month",
  },
  {
    title: "Books Borrowed",
    value: "1,847",
    change: "-1.2%",
    changeType: "negative" as const,
    icon: Calendar,
    description: "this month",
  },
  {
    title: "Overdue Items",
    value: "23",
    change: "-12%",
    changeType: "positive" as const,
    icon: AlertTriangle,
    description: "from last week",
  },
];

const recentBooks = [
  {
    id: "1",
    title: "The Art of Computer Programming",
    author: "Donald E. Knuth",
    isbn: "978-0201896831",
    category: "Computer Science",
    location: "A1-CS-101",
    status: "available" as const,
    copiesAvailable: 3,
    totalCopies: 5,
  },
  {
    id: "2",
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    category: "Programming",
    location: "A1-PROG-045",
    status: "borrowed" as const,
    dueDate: "2024-01-15",
    borrower: "John Smith",
    copiesAvailable: 0,
    totalCopies: 3,
  },
  {
    id: "3",
    title: "Design Patterns",
    author: "Gang of Four",
    isbn: "978-0201633612",
    category: "Software Engineering",
    location: "A1-SE-023",
    status: "reserved" as const,
    copiesAvailable: 1,
    totalCopies: 2,
  },
];

const recentActivity = [
  {
    id: "1",
    type: "borrow",
    book: "JavaScript: The Good Parts",
    member: "Alice Johnson",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: "2",
    type: "return",
    book: "The Pragmatic Programmer",
    member: "Bob Wilson",
    time: "4 hours ago",
    status: "completed",
  },
  {
    id: "3",
    type: "reserve",
    book: "You Don't Know JS",
    member: "Carol Davis",
    time: "6 hours ago",
    status: "pending",
  },
  {
    id: "4",
    type: "overdue",
    book: "Eloquent JavaScript",
    member: "David Brown",
    time: "1 day ago",
    status: "overdue",
  },
];

const Index = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, Sarah! Here's what's happening in your library today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              View Reports
            </Button>
            <Button className="gap-2 bg-gradient-primary">
              <BookOpen className="w-4 h-4" />
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
                  Recently Added Books
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentBooks.map((book) => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    compact
                    onView={(id) => console.log("View book:", id)}
                    onEdit={(id) => console.log("Edit book:", id)}
                  />
                ))}
                <Button variant="outline" className="w-full">
                  View All Books
                </Button>
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
                    {activity.type === "borrow" && <Calendar className="w-4 h-4 text-primary" />}
                    {activity.type === "return" && <CheckCircle className="w-4 h-4 text-success" />}
                    {activity.type === "reserve" && <Clock className="w-4 h-4 text-warning" />}
                    {activity.type === "overdue" && <AlertTriangle className="w-4 h-4 text-destructive" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.book}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.member} • {activity.time}
                    </p>
                  </div>
                  <Badge 
                    variant={activity.status === "completed" ? "default" : 
                            activity.status === "overdue" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {activity.status}
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
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-24 flex-col gap-2">
                <BookOpen className="w-6 h-6" />
                <span>Add Book</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Users className="w-6 h-6" />
                <span>Add Member</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Calendar className="w-6 h-6" />
                <span>Borrow Book</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <DollarSign className="w-6 h-6" />
                <span>Manage Fines</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;
