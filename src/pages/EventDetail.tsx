import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Trophy, ExternalLink, Share2, Bookmark, MapPin, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hackathon, setHackathon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");

  useEffect(() => {
    if (id) {
      fetchEventDetails();
      fetchTeams();
      if (user) {
        checkRegistrationStatus();
      }
    }
  }, [id, user]);

  useEffect(() => {
    if (hackathon) {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      setIsBookmarked(bookmarks.includes(hackathon.id));
    }
  }, [hackathon]);

  const fetchEventDetails = async () => {
    const { data, error } = await supabase
      .from("hackathons")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setHackathon(data);
    }
    setLoading(false);
  };

  const fetchTeams = async () => {
    const { data } = await supabase
      .from("teams")
      .select("*, profiles:leader_id(full_name), team_members(count)")
      .eq("hackathon_id", id);

    if (data) {
      setTeams(data);
    }
  };

  const checkRegistrationStatus = async () => {
    const { data } = await supabase
      .from("registrations")
      .select("*")
      .eq("hackathon_id", id)
      .eq("user_id", user?.id)
      .maybeSingle();

    setIsRegistered(!!data);
  };

  const handleRegister = async () => {
    if (!user) {
      toast.error("Please log in to register for this event");
      navigate("/auth");
      return;
    }

    const { error } = await supabase.from("registrations").insert({
      hackathon_id: id,
      user_id: user.id,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setIsRegistered(true);
      toast.success("Successfully registered!");
    }
  };

  const handleCreateTeam = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const { error } = await supabase.from("teams").insert({
      hackathon_id: id,
      name: teamName,
      description: teamDescription,
      leader_id: user.id,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Team created!");
      setShowCreateTeam(false);
      setTeamName("");
      setTeamDescription("");
      fetchTeams();
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const { error } = await supabase.from("team_members").insert({
      team_id: teamId,
      user_id: user.id,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Joined team!");
      fetchTeams();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
    if (!hackathon) return;
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
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

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
                        {hackathon.category}
                      </Badge>
                      <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
                        {hackathon.title}
                      </h1>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(hackathon.date)}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {hackathon.location}
                        </div>
                      </div>
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
                    <div className="flex items-center gap-3 text-success">
                      <Trophy className="h-5 w-5" />
                      <span className="font-semibold">{hackathon.prize_pool || "TBA"}</span>
                    </div>
                    <Badge variant="secondary" className="text-sm capitalize">
                      {hackathon.difficulty}
                    </Badge>
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
                      onClick={handleRegister}
                      disabled={isRegistered}
                    >
                      {isRegistered ? "Already Registered" : "Register Now"}
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
                      <dt className="font-semibold text-foreground">Difficulty</dt>
                      <dd className="mt-1 text-muted-foreground">{hackathon.difficulty}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground">Max Team Size</dt>
                      <dd className="mt-1 text-muted-foreground">{hackathon.max_team_size} members</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground">Prize Pool</dt>
                      <dd className="mt-1 text-success font-semibold">{hackathon.prize_pool || "TBA"}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Teams</CardTitle>
                  <CardDescription>Join or create a team for this hackathon</CardDescription>
                </div>
                <Dialog open={showCreateTeam} onOpenChange={setShowCreateTeam}>
                  <DialogTrigger asChild>
                    <Button>Create Team</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a Team</DialogTitle>
                      <DialogDescription>Create a new team for this hackathon</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="teamName">Team Name</Label>
                        <Input
                          id="teamName"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          placeholder="Enter team name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="teamDescription">Description</Label>
                        <Textarea
                          id="teamDescription"
                          value={teamDescription}
                          onChange={(e) => setTeamDescription(e.target.value)}
                          placeholder="Describe your team..."
                        />
                      </div>
                      <Button onClick={handleCreateTeam} className="w-full">
                        Create Team
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teams.length === 0 ? (
                  <p className="text-muted-foreground">No teams yet. Be the first to create one!</p>
                ) : (
                  teams.map((team) => (
                    <div key={team.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{team.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Leader: {team.profiles?.full_name || "Unknown"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Members: {team.team_members?.[0]?.count || 0}/{hackathon.max_team_size}
                          </p>
                          {team.description && (
                            <p className="text-sm mt-2">{team.description}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleJoinTeam(team.id)}
                          disabled={!user || (team.team_members?.[0]?.count || 0) >= hackathon.max_team_size}
                        >
                          Join Team
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
