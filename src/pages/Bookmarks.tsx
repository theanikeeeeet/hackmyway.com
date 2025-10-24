import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { hackathons } from "@/data/hackathons";
import { BookmarkX } from "lucide-react";

const Bookmarks = () => {
  const navigate = useNavigate();
  const [bookmarkedHackathons, setBookmarkedHackathons] = useState<typeof hackathons>([]);

  useEffect(() => {
    const loadBookmarks = () => {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      const bookmarked = hackathons.filter(h => bookmarks.includes(h.id));
      setBookmarkedHackathons(bookmarked);
    };

    loadBookmarks();

    // Listen for storage changes to update bookmarks in real-time
    window.addEventListener("storage", loadBookmarks);
    return () => window.removeEventListener("storage", loadBookmarks);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              Bookmarked Hackathons
            </h1>
            <p className="text-muted-foreground">
              Your saved hackathons ({bookmarkedHackathons.length})
            </p>
          </div>

          {bookmarkedHackathons.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarkedHackathons.map((hackathon) => (
                <EventCard key={hackathon.id} hackathon={hackathon} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20">
              <div className="text-center">
                <BookmarkX className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <p className="text-lg font-semibold text-foreground">No bookmarks yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start bookmarking hackathons to see them here
                </p>
                <Button className="mt-6" onClick={() => navigate("/")}>
                  Discover Hackathons
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Bookmarks;
