import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Calendar, 
  User, 
  MapPin, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  location: string;
  status: "available" | "borrowed" | "reserved" | "maintenance";
  dueDate?: string;
  borrower?: string;
  coverUrl?: string;
  copiesAvailable: number;
  totalCopies: number;
}

interface BookCardProps {
  book: Book;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

const statusConfig = {
  available: {
    label: "Available",
    icon: CheckCircle,
    className: "bg-status-available text-white",
  },
  borrowed: {
    label: "Borrowed",
    icon: Clock,
    className: "bg-status-borrowed text-white",
  },
  reserved: {
    label: "Reserved",
    icon: AlertCircle,
    className: "bg-status-reserved text-white",
  },
  maintenance: {
    label: "Maintenance",
    icon: XCircle,
    className: "bg-muted text-muted-foreground",
  },
};

export function BookCard({ book, onView, onEdit, onDelete, compact = false }: BookCardProps) {
  const statusInfo = statusConfig[book.status];
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="shadow-soft hover:shadow-medium transition-smooth group">
      <CardHeader className={cn("pb-3", compact && "pb-2")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3 flex-1 min-w-0">
            {/* Book Cover */}
            <div className="w-12 h-16 bg-gradient-primary rounded-md flex items-center justify-center flex-shrink-0">
              {book.coverUrl ? (
                <img 
                  src={book.coverUrl} 
                  alt={book.title}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              )}
            </div>

            {/* Book Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate" title={book.title}>
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate" title={book.author}>
                by {book.author}
              </p>
              {!compact && (
                <p className="text-xs text-muted-foreground mt-1">
                  ISBN: {book.isbn}
                </p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <Badge className={cn("flex items-center gap-1", statusInfo.className)}>
            <StatusIcon className="w-3 h-3" />
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={cn("pt-0", compact && "pt-0")}>
        {/* Book Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{book.location}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>{book.category}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="w-3 h-3" />
            <span>
              {book.copiesAvailable} of {book.totalCopies} copies available
            </span>
          </div>

          {book.status === "borrowed" && book.dueDate && book.borrower && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="w-3 h-3" />
                <span>Borrowed by {book.borrower}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>Due: {book.dueDate}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
          {onView && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onView(book.id)}
              className="h-8 px-2"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
          {onEdit && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(book.id)}
              className="h-8 px-2"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(book.id)}
              className="h-8 px-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}