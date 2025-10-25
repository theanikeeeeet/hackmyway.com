import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Mail, Calendar, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Registration {
  id: string;
  user_id: string;
  status: string;
  registered_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

const ManageEvent = () => {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (id && user) {
      fetchEventDetails();
      fetchRegistrations();
      fetchTeams();
    }
  }, [id, user]);

  const fetchEventDetails = async () => {
    const { data, error } = await supabase
      .from("hackathons")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast({
        title: "Error fetching event",
        description: error.message,
        variant: "destructive",
      });
    } else if (data.organizer_id !== user?.id) {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to manage this event",
        variant: "destructive",
      });
      navigate("/dashboard");
    } else {
      setEvent(data);
    }
  };

  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from("registrations")
      .select("*, profiles:user_id(full_name)")
      .eq("hackathon_id", id);

    if (!error && data) {
      setRegistrations(data as any);
    }
  };

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from("teams")
      .select("*, team_members(count), profiles:leader_id(full_name)")
      .eq("hackathon_id", id);

    if (!error && data) {
      setTeams(data);
    }
  };

  if (loading || !event) {
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
            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
            <div className="flex gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{registrations.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Teams Formed</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teams.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Event Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="text-lg capitalize">
                  {event.status}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="participants" className="space-y-4">
            <TabsList>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>

            <TabsContent value="participants" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Participants</CardTitle>
                  <CardDescription>All users registered for this event</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {registrations.length === 0 ? (
                      <p className="text-muted-foreground">No registrations yet</p>
                    ) : (
                      registrations.map((reg) => (
                        <div key={reg.id} className="flex items-center justify-between border-b pb-4">
                          <div>
                            <p className="font-medium">{reg.profiles?.full_name || "Anonymous"}</p>
                            <p className="text-sm text-muted-foreground">
                              Registered: {new Date(reg.registered_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge>{reg.status}</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Teams</CardTitle>
                  <CardDescription>All teams formed for this hackathon</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teams.length === 0 ? (
                      <p className="text-muted-foreground">No teams formed yet</p>
                    ) : (
                      teams.map((team) => (
                        <div key={team.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{team.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Leader: {team.profiles?.full_name || "Unknown"}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {team.team_members?.[0]?.count || 0} members
                            </Badge>
                          </div>
                          {team.description && (
                            <p className="text-sm text-muted-foreground mt-2">{team.description}</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ManageEvent;
