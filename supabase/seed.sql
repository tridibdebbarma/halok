-- ==========================================
-- Halok Construction — Seed Data
-- Safe to re-run (uses ON CONFLICT DO NOTHING)
-- ==========================================

-- 1. Site Settings
INSERT INTO public.site_settings (site_name, tagline, contact_email)
VALUES (
  'Halok Construction',
  'Building Tripura''s Future',
  'contact-us@halok.co.in'
)
ON CONFLICT DO NOTHING;

-- 2. Company Profile
INSERT INTO public.company_profile (
  name, description, mission, vision, 
  address_line_1, city, state, zip_code,
  phone_primary, phone_secondary, email_primary, email_secondary,
  years_of_experience, total_projects, certifications
) VALUES (
  'Halok Construction Co.',
  'We are a premier construction company based in Tripura, bringing modern design and sturdy engineering to every project. With over a decade of trust from local communities, we handle everything from residential to large commercial builds.',
  'To deliver high-quality, sustainable, and innovative construction solutions that empower communities across Tripura and Northeast India.',
  'To be the most trusted and sought-after construction partner in the region.',
  'Agartala Main Road', 'Agartala', 'Tripura', '799001',
  '+91-9774254272', '+91-7005723632', 'contact-us@halok.co.in', 'tridib@halok.co.in',
  10, 50, ARRAY['ISO 9001:2015', 'Tripura State PWD Class 1 Contractor']
)
ON CONFLICT DO NOTHING;

-- 3. Menus & Submenus
INSERT INTO public.menus (id, label, href, order_index) VALUES ('11111111-1111-1111-1111-111111111111', 'Home', '/', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.menus (id, label, href, order_index) VALUES ('22222222-2222-2222-2222-222222222222', 'About Us', '/about', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.menus (id, label, href, order_index) VALUES ('33333333-3333-3333-3333-333333333333', 'Services', '/services', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.menus (id, label, href, order_index) VALUES ('44444444-4444-4444-4444-444444444444', 'Products', '/products', 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.menus (id, label, href, order_index) VALUES ('55555555-5555-5555-5555-555555555555', 'Portfolio', '/portfolio', 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.menus (id, label, href, order_index) VALUES ('66666666-6666-6666-6666-666666666666', 'Contact', '/contact', 6) ON CONFLICT (id) DO NOTHING;

-- Submenus for Services
INSERT INTO public.sub_menus (menu_id, label, href, order_index) VALUES ('33333333-3333-3333-3333-333333333333', 'Residential Buildings', '/services/residential-buildings', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.sub_menus (menu_id, label, href, order_index) VALUES ('33333333-3333-3333-3333-333333333333', 'Commercial Spaces', '/services/commercial-spaces', 2) ON CONFLICT DO NOTHING;
INSERT INTO public.sub_menus (menu_id, label, href, order_index) VALUES ('33333333-3333-3333-3333-333333333333', 'Renovations', '/services/renovations', 3) ON CONFLICT DO NOTHING;

-- 4. Hero Slides
INSERT INTO public.hero_slides (title, subtitle, cta_text, cta_link, image_url, order_index)
VALUES 
  ('Building Tripura''s Future', '50+ Projects | 10+ Years Experience | Tripura Trusted', 'View Services', '/services', 'https://images.unsplash.com/photo-1541888086225-f674ce8824f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', 1),
  ('Modern Residential Villas', 'Crafting luxury homes designed for your vision.', 'See Portfolio', '/portfolio', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', 2)
ON CONFLICT DO NOTHING;

-- 5. Services
INSERT INTO public.services (name, slug, category, short_description, full_description, main_image_url, features, price_range, is_featured)
VALUES 
  ('Residential Construction', 'residential-buildings', 'Residential', 'Custom independent houses, villas, and apartments tailored to your lifestyle.', 'We specialize in building modern, durable residential properties. Our expert team ensures every house is structurally sound and built to the highest standards in Tripura.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', ARRAY['Custom Design', 'Modern Engineering', 'Turnkey Solutions', 'Vastu Compliant'], '₹2000 - ₹3500 per sq.ft', true),
  ('Commercial Spaces', 'commercial-spaces', 'Commercial', 'Offices, retail stores, and commercial complexes built for business success.', 'From boutique hotels to large office spaces, we provide end-to-end commercial construction services with a focus on timely delivery and premium finishes.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', ARRAY['Corporate Offices', 'Retail Malls', 'Hotel Construction', 'Warehouse Building'], 'Contact for Quote', true),
  ('Renovations', 'renovations', 'Renovation', 'Complete home and commercial renovation services including interior remodeling, structural upgrades, and modern makeovers.', 'Transform your existing space with our comprehensive renovation services. Whether it is a kitchen remodel, bathroom upgrade, or full-scale building renovation, our experienced team delivers stunning results that breathe new life into your property.', 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', ARRAY['Interior Remodeling', 'Structural Upgrades', 'Kitchen & Bath Renovation', 'Facade Restoration', 'Office Fit-out'], 'Contact for Quote', true)
ON CONFLICT (slug) DO NOTHING;

-- 6. Products
INSERT INTO public.products (name, slug, category, short_description, price, main_image_url)
VALUES 
  ('Premium Cement Blocks', 'premium-cement-blocks', 'Materials', 'High-density cement blocks suitable for load-bearing walls.', '₹45 per piece', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
  ('TMT Rebars (FE500)', 'tmt-rebars', 'Steel', 'High-strength deformed steel bars for foundation and columns.', '₹65,000 per MT', 'https://images.unsplash.com/photo-1518175402434-d02fe75cce7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')
ON CONFLICT (slug) DO NOTHING;

-- 7. Portfolio (Projects)
INSERT INTO public.portfolio (title, slug, client_name, service_type, location, short_description, main_image_url, is_featured)
VALUES 
  ('Pine Ridge Villa', 'pine-ridge-villa', 'Private Client', 'Residential', 'Agartala', 'A modern 4-bedroom luxury villa with premium finishes.', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true),
  ('Cloud Nine Corporate Park', 'cloud-nine-park', 'TechHub Ltd.', 'Commercial', 'Agartala', 'State-of-the-art office complex with sustainable energy solutions.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true)
ON CONFLICT (slug) DO NOTHING;

-- 8. Team Members (sample)
INSERT INTO public.team_members (name, role, bio, order_index)
VALUES 
  ('Tridib Debbarma', 'Founder & CEO', 'Leading Halok Construction with over 15 years of experience in the construction industry.', 1)
ON CONFLICT DO NOTHING;
