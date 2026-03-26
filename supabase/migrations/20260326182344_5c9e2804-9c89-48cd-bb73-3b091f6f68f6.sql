
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('seeker', 'recruiter');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own roles" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  headline TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  avatar_url TEXT,
  status TEXT DEFAULT 'casually_browsing',
  location TEXT DEFAULT '',
  interests TEXT[] DEFAULT '{}',
  hobbies TEXT[] DEFAULT '{}',
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  emotional_tendencies TEXT[] DEFAULT '{}',
  dream_goals TEXT[] DEFAULT '{}',
  personality_tags TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  availability TEXT DEFAULT '',
  team_or_solo TEXT DEFAULT 'both',
  pressure_tolerance TEXT DEFAULT 'medium',
  leadership TEXT DEFAULT 'adaptive',
  learning_style TEXT DEFAULT 'visual',
  linkedin TEXT DEFAULT '',
  github TEXT DEFAULT '',
  twitter TEXT DEFAULT '',
  portfolio TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 50 CHECK (level >= 0 AND level <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skills viewable by everyone" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Users can manage own skills" ON public.skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own skills" ON public.skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own skills" ON public.skills FOR DELETE USING (auth.uid() = user_id);

-- Education table
CREATE TABLE public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER,
  current BOOLEAN DEFAULT false,
  grade TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Education viewable by everyone" ON public.education FOR SELECT USING (true);
CREATE POLICY "Users can manage own education" ON public.education FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own education" ON public.education FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own education" ON public.education FOR DELETE USING (auth.uid() = user_id);

-- Experience table
CREATE TABLE public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'full-time',
  start_date TEXT NOT NULL,
  end_date TEXT,
  current BOOLEAN DEFAULT false,
  description TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Experience viewable by everyone" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Users can manage own experience" ON public.experience FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own experience" ON public.experience FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own experience" ON public.experience FOR DELETE USING (auth.uid() = user_id);

-- Certifications table
CREATE TABLE public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  credential_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Certs viewable by everyone" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Users can manage own certs" ON public.certifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own certs" ON public.certifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own certs" ON public.certifications FOR DELETE USING (auth.uid() = user_id);

-- Auto-create profile and role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'seeker'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
