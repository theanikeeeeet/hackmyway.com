import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Trophy, ExternalLink, Share2, Bookmark } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { hackathons } from "@/data/hackathons";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import EventCard from "@/components/EventCard";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hackathon = hackathons.find(h => h.id === id);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!hackathon) return;
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setIsBookmarked(bookmarks.includes(hackathon.id));
  }, [hackathon]);

  if (!hackathon) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Hackathon not found</h1>
            <Button onClick={() => navigate("/")}>Go back home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const newBookmarks = isBookmarked
      ? bookmarks.filter((bookmarkId: string) => bookmarkId !== hackathon.id)
      : [...bookmarks, hackathon.id];
    
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: hackathon.title,
        text: hackathon.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  const relatedHackathons = hackathons
    .filter(h => 
      h.id !== hackathon.id && 
      (h.tags.some(tag => hackathon.tags.includes(tag)) || h.source === hackathon.source)
    )
    .slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="container py-8">
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all hackathons
          </Button>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <Badge variant="secondary" className="mb-3">
                        {hackathon.source}
                      </Badge>
                      <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
                        {hackathon.title}
                      </h1>
                      <p className="text-muted-foreground">Organized by {hackathon.organizer}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className={isBookmarked ? "text-primary" : ""}
                      onClick={toggleBookmark}
                    >
                      <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
                    </Button>
                  </div>

                  <div className="mb-6 space-y-4">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="h-5 w-5" />
                      <span>
                        {formatDate(hackathon.start_date)} - {formatDate(hackathon.end_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-success">
                      <Trophy className="h-5 w-5" />
                      <span className="font-semibold">{hackathon.prize}</span>
                    </div>
                  </div>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {hackathon.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mb-6">
                    <h2 className="mb-3 text-xl font-bold text-foreground">About</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {hackathon.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      className="flex-1 gap-2"
                      onClick={() => window.open(hackathon.registration_url, "_blank")}
                    >
                      Register Now
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => window.open(hackathon.registration_url, "_blank")}
                    >
                      Visit Source
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="mb-4 text-lg font-bold text-foreground">Quick Info</h3>
                  <dl className="space-y-4 text-sm">
                    <div>
                      <dt className="font-semibold text-foreground">Status</dt>
                      <dd className="mt-1">
                        <Badge variant={
                          hackathon.status === "ongoing" ? "default" : "secondary"
                        }>
                          {hackathon.status.replace("-", " ").toUpperCase()}
                        </Badge>
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground">Platform</dt>
                      <dd className="mt-1 text-muted-foreground">{hackathon.source}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground">Organizer</dt>
                      <dd className="mt-1 text-muted-foreground">{hackathon.organizer}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground">Prize Pool</dt>
                      <dd className="mt-1 text-success font-semibold">{hackathon.prize}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </div>

          {relatedHackathons.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold text-foreground">Related Hackathons</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedHackathons.map((related) => (
                  <EventCard key={related.id} hackathon={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
