import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface HeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const Hero = ({ searchQuery, onSearchChange }: HeroProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-16 md:py-24">
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
            All Hackathons. One Place.
          </h1>
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            Discover, track, and join hackathons from Devpost, MLH, Unstop, and beyond.
          </p>
          
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search hackathons by keyword, tag, or platform..."
                className="h-14 rounded-2xl border-0 bg-white pl-12 pr-4 text-base shadow-xl ring-0 focus-visible:ring-2 focus-visible:ring-white/50"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
    </section>
  );
};

export default Hero;
