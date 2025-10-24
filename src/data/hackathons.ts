export interface Hackathon {
  id: string;
  title: string;
  source: string;
  start_date: string;
  end_date: string;
  tags: string[];
  prize: string;
  organizer: string;
  registration_url: string;
  description: string;
  status: "upcoming" | "ongoing" | "closed" | "ending-soon";
}

export const hackathons: Hackathon[] = [
  {
    id: "1",
    title: "AI Innovation Hackathon 2025",
    source: "Devpost",
    start_date: "2025-11-01",
    end_date: "2025-11-15",
    tags: ["AI", "Machine Learning"],
    prize: "$10,000",
    organizer: "AI Labs Global",
    registration_url: "https://devpost.com/ai-innovation-hackathon",
    description: "A 2-week global AI hackathon focused on innovative ML projects.",
    status: "upcoming"
  },
  {
    id: "2",
    title: "MLH Global Hack Week",
    source: "MLH",
    start_date: "2025-10-25",
    end_date: "2025-10-31",
    tags: ["Student", "Open Source"],
    prize: "Swag, Internships",
    organizer: "Major League Hacking",
    registration_url: "https://mlh.io/global-hack-week",
    description: "Join hackers around the world in MLH's week-long hackathon experience.",
    status: "ongoing"
  },
  {
    id: "3",
    title: "Web3 Builders Challenge",
    source: "DoraHacks",
    start_date: "2025-09-15",
    end_date: "2025-10-10",
    tags: ["Blockchain", "Web3"],
    prize: "$25,000 in crypto",
    organizer: "DoraHacks",
    registration_url: "https://dorahacks.io/web3-builders",
    description: "Build decentralized apps and smart contracts to shape the future of Web3.",
    status: "closed"
  },
  {
    id: "4",
    title: "Hack2Skill National Coding Sprint",
    source: "Hack2Skill",
    start_date: "2025-11-10",
    end_date: "2025-11-20",
    tags: ["Student", "Coding"],
    prize: "₹1 Lakh + Internship Offers",
    organizer: "Hack2Skill India",
    registration_url: "https://hack2skill.com/sprint",
    description: "An India-wide hackathon for students passionate about competitive programming.",
    status: "upcoming"
  },
  {
    id: "5",
    title: "Sustainability Hack 2025",
    source: "Unstop",
    start_date: "2025-10-28",
    end_date: "2025-11-05",
    tags: ["Environment", "Sustainability"],
    prize: "$5,000",
    organizer: "Unstop",
    registration_url: "https://unstop.com/sustainability-hack",
    description: "Innovate for a greener planet — sustainability-themed global hackathon.",
    status: "ending-soon"
  }
];
