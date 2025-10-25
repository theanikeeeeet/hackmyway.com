import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";

const CreateEvent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    prize_pool: "",
    difficulty: "Beginner",
    category: "",
    max_team_size: 4,
    registration_deadline: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create an event",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("hackathons").insert({
      ...formData,
      organizer_id: user.id,
    });

    setSubmitting(false);

    if (error) {
      toast({
        title: "Error creating event",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Event created successfully!",
        description: "Your hackathon is now live",
      });
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Create Hackathon Event</CardTitle>
              <CardDescription>Fill in the details to create your hackathon</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="AI Innovation Challenge 2025"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your hackathon..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Event Date</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="registration_deadline">Registration Deadline</Label>
                    <Input
                      id="registration_deadline"
                      type="datetime-local"
                      value={formData.registration_deadline}
                      onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Virtual / City, Country"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="AI, Blockchain, Web3..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="prize_pool">Prize Pool</Label>
                    <Input
                      id="prize_pool"
                      value={formData.prize_pool}
                      onChange={(e) => setFormData({ ...formData, prize_pool: e.target.value })}
                      placeholder="$10,000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="max_team_size">Max Team Size</Label>
                    <Input
                      id="max_team_size"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.max_team_size}
                      onChange={(e) => setFormData({ ...formData, max_team_size: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Event"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateEvent;
