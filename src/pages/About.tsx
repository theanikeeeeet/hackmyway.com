import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Database, Shield } from "lucide-react";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="container py-12">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
              About HackMyWay
            </h1>
            <p className="mb-12 text-lg text-muted-foreground">
              Your one-stop destination for discovering hackathons worldwide
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <Code2 className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We make it easy for developers, students, and innovators to find and participate in hackathons from around the world.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Database className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Data Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We aggregate hackathons from Devpost, MLH, Unstop, DoraHacks, Hack2skill, Devfolio, and LabAI.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>Privacy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Your bookmarks are stored locally on your device. We don't collect or store personal data.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-12">
              <CardHeader>
                <CardTitle>Data Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Data Collection</h3>
                  <p className="text-sm text-muted-foreground">
                    HackMyWay aggregates publicly available hackathon information from various platforms. We collect and display:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Hackathon titles and descriptions</li>
                    <li>Start and end dates</li>
                    <li>Prize information</li>
                    <li>Registration links</li>
                    <li>Platform and organizer details</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">User Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    We respect your privacy. Bookmarks and preferences are stored locally in your browser using localStorage. We do not:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Track your browsing activity</li>
                    <li>Collect personal information</li>
                    <li>Share data with third parties</li>
                    <li>Require account registration</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Data Accuracy</h3>
                  <p className="text-sm text-muted-foreground">
                    While we strive to provide accurate and up-to-date information, hackathon details may change. Always verify information on the official platform before registering.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Contact</h3>
                  <p className="text-sm text-muted-foreground">
                    Questions or concerns? Reach out to us at{" "}
                    <a href="mailto:contact@hackmyway.com" className="text-primary hover:underline">
                      contact@hackmyway.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
