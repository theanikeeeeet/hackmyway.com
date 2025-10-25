-- Create hackathons table
CREATE TABLE public.hackathons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  prize_pool TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  category TEXT NOT NULL,
  image_url TEXT,
  organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  max_team_size INTEGER DEFAULT 4,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hackathon_id, name)
);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Create registrations table (for individual registrations)
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hackathon_id, user_id)
);

-- Enable RLS
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Hackathons policies
CREATE POLICY "Hackathons are viewable by everyone"
  ON public.hackathons FOR SELECT
  USING (true);

CREATE POLICY "Organizers can create hackathons"
  ON public.hackathons FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'organizer') AND auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their own hackathons"
  ON public.hackathons FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete their own hackathons"
  ON public.hackathons FOR DELETE
  TO authenticated
  USING (auth.uid() = organizer_id);

-- Teams policies
CREATE POLICY "Teams are viewable by everyone"
  ON public.teams FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create teams"
  ON public.teams FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Team leaders can update their teams"
  ON public.teams FOR UPDATE
  TO authenticated
  USING (auth.uid() = leader_id);

CREATE POLICY "Team leaders can delete their teams"
  ON public.teams FOR DELETE
  TO authenticated
  USING (auth.uid() = leader_id);

-- Team members policies
CREATE POLICY "Team members are viewable by everyone"
  ON public.team_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join teams"
  ON public.team_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave teams"
  ON public.team_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Registrations policies
CREATE POLICY "Registrations viewable by participant and organizer"
  ON public.registrations FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.hackathons
      WHERE hackathons.id = registrations.hackathon_id
      AND hackathons.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can register for hackathons"
  ON public.registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their registrations"
  ON public.registrations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can cancel their registrations"
  ON public.registrations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger for hackathons updated_at
CREATE TRIGGER update_hackathons_updated_at
  BEFORE UPDATE ON public.hackathons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();