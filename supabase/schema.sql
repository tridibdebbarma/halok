-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Site Settings (Global configurations)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT NOT NULL,
  tagline TEXT,
  favicon_url TEXT,
  logo_url TEXT,
  default_meta_description TEXT,
  contact_email TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Company Profile
CREATE TABLE public.company_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  mission TEXT,
  vision TEXT,
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone_primary TEXT,
  phone_secondary TEXT,
  email_primary TEXT,
  email_secondary TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  certifications TEXT[],
  years_of_experience INTEGER DEFAULT 0,
  total_projects INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Menus (Top-level Navigation)
CREATE TABLE public.menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Sub Menus (Dropdown Navigation Items)
CREATE TABLE public.sub_menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id UUID NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- e.g., 'Residential', 'Commercial', 'General'
  short_description TEXT NOT NULL,
  full_description TEXT,
  main_image_url TEXT,
  features TEXT[],
  price_range TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Products / Materials
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  specs JSONB, -- Flexible specs like dimensions, materials, etc.
  main_image_url TEXT,
  price TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Portfolio / Projects
CREATE TABLE public.portfolio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  client_name TEXT,
  service_type TEXT,
  location TEXT,
  completion_date DATE,
  short_description TEXT,
  full_description TEXT,
  main_image_url TEXT,
  gallery_urls TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Hero Slides (Homepage Carousel)
CREATE TABLE public.hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_text TEXT,
  cta_link TEXT,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Team Members
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  linkedin_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Contacts (Form Submissions)
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread', -- 'unread', 'read', 'replied'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Access (Anon and Authenticated can READ everything except contacts)
CREATE POLICY "Public read access for site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read access for company_profile" ON public.company_profile FOR SELECT USING (true);
CREATE POLICY "Public read access for menus" ON public.menus FOR SELECT USING (true);
CREATE POLICY "Public read access for sub_menus" ON public.sub_menus FOR SELECT USING (true);
CREATE POLICY "Public read access for services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public read access for products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read access for portfolio" ON public.portfolio FOR SELECT USING (true);
CREATE POLICY "Public read access for hero_slides" ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Public read access for team_members" ON public.team_members FOR SELECT USING (true);

-- 2. Contacts Policies
-- Anyone can insert a contact form submission
CREATE POLICY "Anyone can insert contacts" ON public.contacts FOR INSERT WITH CHECK (true);
-- Only authenticated users (admins) can read or update contacts
CREATE POLICY "Authenticated users can select contacts" ON public.contacts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update contacts" ON public.contacts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete contacts" ON public.contacts FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Admin Full Access (Authenticated users can INSERT, UPDATE, DELETE on all tables)
CREATE POLICY "Admin full access for site_settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for company_profile" ON public.company_profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for menus" ON public.menus FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for sub_menus" ON public.sub_menus FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for services" ON public.services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for products" ON public.products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for portfolio" ON public.portfolio FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for hero_slides" ON public.hero_slides FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for team_members" ON public.team_members FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- STORAGE BUCKETS (Need to be run in Supabase SQL editor)
-- ==========================================
-- insert into storage.buckets (id, name, public) values ('images', 'images', true);
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'images' );
-- create policy "Auth Insert" on storage.objects for insert with check ( auth.role() = 'authenticated' AND bucket_id = 'images' );
-- create policy "Auth Update" on storage.objects for update using ( auth.role() = 'authenticated' AND bucket_id = 'images' );
-- create policy "Auth Delete" on storage.objects for delete using ( auth.role() = 'authenticated' AND bucket_id = 'images' );
