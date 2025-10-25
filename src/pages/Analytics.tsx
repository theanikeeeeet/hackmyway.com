import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Users, Calendar, TrendingUp } from "lucide-react";

const Analytics = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    upcomingEvents: 0,
    completedEvents: 0,
  });
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    // Fetch all events by organizer
    const { data: eventsData, error: eventsError } = await supabase
      .from("hackathons")
      .select("*, registrations(count)")
      .eq("organizer_id", user?.id);

    if (!eventsError && eventsData) {
      setEvents(eventsData);
      
      const totalParticipants = eventsData.reduce(
        (sum, event) => sum + (event.registrations?.[0]?.count || 0),
        0
      );

      setStats({
        totalEvents: eventsData.length,
        totalParticipants,
        upcomingEvents: eventsData.filter((e) => e.status === "upcoming").length,
        completedEvents: eventsData.filter((e) => e.status === "completed").length,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Overview of your hackathon events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <p className="text-xs text-muted-foreground">All hackathons created</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalParticipants}</div>
                <p className="text-xs text-muted-foreground">Across all events</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
                <p className="text-xs text-muted-foreground">Active hackathons</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Events</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedEvents}</div>
                <p className="text-xs text-muted-foreground">Past hackathons</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Events</CardTitle>
              <CardDescription>Performance of all your hackathons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-muted-foreground">No events created yet</p>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between border-b pb-4 cursor-pointer hover:bg-accent/50 p-2 rounded"
                      onClick={() => navigate(`/manage-event/${event.id}`)}
                    >
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} • {event.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {event.registrations?.[0]?.count || 0} participants
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">{event.status}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Analytics;
