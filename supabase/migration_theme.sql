-- ==========================================
-- Migration: Add theme and about highlights columns
-- Safe to re-run (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS)
-- ==========================================

-- Add active_theme to site_settings
DO $$ BEGIN
  ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS active_theme TEXT DEFAULT 'blue';
EXCEPTION WHEN others THEN NULL;
END $$;

-- Add about_highlights to company_profile
DO $$ BEGIN
  ALTER TABLE public.company_profile ADD COLUMN IF NOT EXISTS about_highlights TEXT[];
EXCEPTION WHEN others THEN NULL;
END $$;

-- Add google_maps_embed_url to company_profile
DO $$ BEGIN
  ALTER TABLE public.company_profile ADD COLUMN IF NOT EXISTS google_maps_embed_url TEXT;
EXCEPTION WHEN others THEN NULL;
END $$;

-- Insert the renovations service if missing
INSERT INTO public.services (name, slug, category, short_description, full_description, main_image_url, features, price_range, is_featured)
VALUES (
  'Renovations',
  'renovations',
  'Renovation',
  'Complete home and commercial renovation services including interior remodeling, structural upgrades, and modern makeovers.',
  'Transform your existing space with our comprehensive renovation services. Whether it is a kitchen remodel, bathroom upgrade, or full-scale building renovation, our experienced team delivers stunning results that breathe new life into your property.',
  'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  ARRAY['Interior Remodeling', 'Structural Upgrades', 'Kitchen & Bath Renovation', 'Facade Restoration', 'Office Fit-out'],
  'Contact for Quote',
  true
)
ON CONFLICT (slug) DO NOTHING;
