import { Search } from "lucide-react";
import { Input } from "./ui/input";
import logoImage from "@/assets/logo.png";

interface HeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const Hero = ({ searchQuery, onSearchChange }: HeroProps) => {
  return (
    <section className="relative bg-gradient-hero py-20 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 20%, hsl(330 100% 63% / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(270 80% 65% / 0.3) 0%, transparent 50%)',
        }} />
      </div>

      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <img src={logoImage} alt="HackMyWay" className="h-24 w-24 drop-shadow-2xl" />
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
            All Hackathons. <span className="bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent">One Place.</span>
          </h1>
          <p className="mb-8 text-xl text-white/90">
            Discover, track, and join hackathons from Devpost, MLH, Unstop, and beyond.
          </p>

          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search hackathons by name, tag, or description..."
              className="h-14 pl-12 text-base bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-white/60"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
