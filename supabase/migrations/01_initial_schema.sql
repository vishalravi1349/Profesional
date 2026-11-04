-- Create custom ENUM for enquiry status
CREATE TYPE enquiry_status AS ENUM (
  'Pending',
  'Reviewing',
  'Contacted',
  'Responded',
  'Approved',
  'Closed'
);

-- Create custom ENUM for user roles
CREATE TYPE user_role AS ENUM (
  'user',
  'admin'
);

-- 1. Create Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role DEFAULT 'user' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Create Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email TEXT NOT NULL,
  student_age INT NOT NULL CHECK (student_age > 0),
  current_class TEXT NOT NULL,
  interested_class TEXT NOT NULL,
  preferred_contact_method TEXT DEFAULT 'Email' NOT NULL,
  message TEXT NOT NULL,
  status enquiry_status DEFAULT 'Pending' NOT NULL,
  admin_response TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexing for high performance querying
CREATE INDEX IF NOT EXISTS idx_enquiries_user_id ON public.enquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_email ON public.enquiries(email);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Enable Supabase Realtime for Enquiries Table
ALTER PUBLICATION supabase_realtime ADD TABLE public.enquiries;

-- 3. Row Level Security Policies (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Enquiries Policies
CREATE POLICY "Users can view their own enquiries"
  ON public.enquiries FOR SELECT
  USING (
    auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can create enquiries"
  ON public.enquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all enquiries"
  ON public.enquiries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all enquiries"
  ON public.enquiries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Trigger to automatically create a profile record when a new user registers in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_role public.user_role := 'user';
  meta_role text;
BEGIN
  meta_role := NEW.raw_user_meta_data->>'role';
  
  -- Safe conversion of string to user_role enum (email containing 'admin' gets admin role automatically)
  IF NEW.email LIKE '%admin%' THEN
    default_role := 'admin';
  ELSIF meta_role = 'admin' THEN
    default_role := 'admin';
  ELSIF meta_role = 'user' THEN
    default_role := 'user';
  END IF;

  INSERT INTO public.profiles (id, full_name, mobile_number, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student / Parent'),
    COALESCE(NEW.raw_user_meta_data->>'mobile_number', ''),
    NEW.email,
    default_role
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    mobile_number = EXCLUDED.mobile_number,
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
