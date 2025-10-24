import { Link } from "react-router-dom";
import { Calendar, Trophy, Bookmark, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Hackathon } from "@/data/hackathons";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface EventCardProps {
  hackathon: Hackathon;
}

const EventCard = ({ hackathon }: EventCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setIsBookmarked(bookmarks.includes(hackathon.id));
  }, [hackathon.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const newBookmarks = isBookmarked
      ? bookmarks.filter((id: string) => id !== hackathon.id)
      : [...bookmarks, hackathon.id];
    
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
    
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-upcoming";
      case "ongoing": return "bg-ongoing";
      case "ending-soon": return "bg-ending-soon";
      case "closed": return "bg-closed";
      default: return "bg-muted";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <Link to={`/event/${hackathon.id}`} className="group block h-full">
      <Card className="relative h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Status Ribbon */}
        <div className={`absolute right-0 top-0 ${getStatusColor(hackathon.status)} px-3 py-1 text-xs font-semibold text-white`}>
          {hackathon.status.replace("-", " ").toUpperCase()}
        </div>

        <CardHeader className="space-y-3 pb-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
              {hackathon.title}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className={`shrink-0 ${isBookmarked ? "text-primary" : "text-muted-foreground"}`}
              onClick={toggleBookmark}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
          </div>
          
          <Badge variant="secondary" className="w-fit">
            {hackathon.source}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(hackathon.start_date)} - {formatDate(hackathon.end_date)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-semibold text-success">
            <Trophy className="h-4 w-4" />
            <span>{hackathon.prize}</span>
          </div>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {hackathon.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {hackathon.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full gap-2 group-hover:gap-3 transition-all" size="sm">
            View Details
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;
