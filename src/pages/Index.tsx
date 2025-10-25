import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FilterBar from "@/components/FilterBar";
import EventCard from "@/components/EventCard";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hackathons")
      .select("*")
      .order("date", { ascending: true });

    if (!error && data) {
      setHackathons(data);
    }
    setLoading(false);
  };

  const handleRefresh = () => {
    fetchHackathons();
    setLastRefreshed(new Date());
    toast.success("Data refreshed successfully!");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStatus(null);
    setSelectedPlatform(null);
  };

  const filteredHackathons = hackathons.filter((hackathon) => {
    const matchesSearch = searchQuery === "" || 
      hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !selectedStatus || hackathon.status === selectedStatus;
    const matchesDifficulty = !selectedPlatform || hackathon.difficulty === selectedPlatform;

    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <FilterBar
        selectedStatus={selectedStatus}
        selectedPlatform={selectedPlatform}
        onStatusChange={setSelectedStatus}
        onPlatformChange={setSelectedPlatform}
        onReset={handleResetFilters}
      />
      
      <main className="flex-1 bg-background">
        <div className="container py-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <p>Found {filteredHackathons.length} hackathon{filteredHackathons.length !== 1 ? 's' : ''}</p>
              <p className="mt-1">Last refreshed: {lastRefreshed.toLocaleString()}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredHackathons.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredHackathons.map((hackathon) => (
                <EventCard key={hackathon.id} hackathon={hackathon} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20">
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">No hackathons found</p>
                <p className="mt-2 text-sm text-muted-foreground">Try changing your filters or search query</p>
                {(searchQuery || selectedStatus || selectedPlatform) && (
                  <Button variant="outline" className="mt-4" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
