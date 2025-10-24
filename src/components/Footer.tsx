import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div className="text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-1 md:justify-start">
              Built with <Heart className="h-4 w-4 fill-danger text-danger" /> by HackMyWay
            </p>
            <p className="mt-1">Data sourced from public hackathon listings</p>
          </div>
          
          <nav className="flex gap-6 text-sm">
            <Link to="/about" className="text-muted-foreground transition-colors hover:text-foreground">
              About
            </Link>
            <Link to="/about" className="text-muted-foreground transition-colors hover:text-foreground">
              Data Policy
            </Link>
            <a href="mailto:contact@hackmyway.com" className="text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </a>
          </nav>
        </div>
        
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} HackMyWay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
