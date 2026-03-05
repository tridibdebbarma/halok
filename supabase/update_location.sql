-- ==========================================
-- Run this in Supabase SQL Editor to update
-- existing data from Shillong to Agartala/Tripura
-- ==========================================

-- Update company profile
UPDATE public.company_profile SET
  description = 'We are a premier construction company based in Tripura, bringing modern design and sturdy engineering to every project. With over a decade of trust from local communities, we handle everything from residential to large commercial builds.',
  mission = 'To deliver high-quality, sustainable, and innovative construction solutions that empower communities across Tripura and Northeast India.',
  address_line_1 = 'Agartala Main Road',
  city = 'Agartala',
  state = 'Tripura',
  zip_code = '799006',
  phone_primary = '+91-9774254272',
  phone_secondary = '+91-7005723632',
  certifications = ARRAY['ISO 9001:2015', 'Tripura State PWD Class 1 Contractor'];

-- Update site settings
UPDATE public.site_settings SET
  tagline = 'Building Tripura''s Future';

-- Update hero slides
UPDATE public.hero_slides SET
  title = 'Building Tripura''s Future',
  subtitle = '50+ Projects | 10+ Years Experience | Tripura Trusted'
WHERE title LIKE '%Shillong%';

-- Update services
UPDATE public.services SET
  full_description = 'We specialize in building modern, durable residential properties. Our expert team ensures every house is structurally sound and built to the highest standards in Tripura.',
  features = ARRAY['Custom Design', 'Modern Engineering', 'Turnkey Solutions', 'Vastu Compliant']
WHERE slug = 'residential-buildings';

-- Update portfolio locations
UPDATE public.portfolio SET location = 'Agartala' WHERE location LIKE '%Shillong%';
