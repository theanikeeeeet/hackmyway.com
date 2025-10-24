import { Link, useNavigate } from "react-router-dom";
import { Bookmark, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@/assets/logo.png";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <img src={logoImage} alt="HackMyWay" className="h-8 w-8" />
          <span className="text-xl font-bold text-foreground">HackMyWay</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link to="/about">
            <Button variant="ghost" size="sm">About</Button>
          </Link>
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
              <Link to="/bookmarks">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline">Bookmarks</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/bookmarks">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline">Bookmarks</span>
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
