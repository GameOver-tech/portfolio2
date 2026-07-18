-- Portfolio Database Schema
-- Run this in Supabase SQL Editor
--
-- AFTER running this migration, create an admin user:
-- 1. Go to Supabase Dashboard → Authentication → Users → Add User
-- 2. Email: admin@abdulwaheed.design
-- 3. Password: Admin@786
-- 4. Or run: node server/scripts/create-admin.js

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (managed by Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hero Section
CREATE TABLE IF NOT EXISTS public.hero (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT DEFAULT 'Abdul Waheed',
    title TEXT DEFAULT 'Graphic Designer',
    subtitle TEXT,
    badge_text TEXT DEFAULT 'Available for Freelance Projects',
    typing_titles JSONB DEFAULT '["Graphic Designer", "Brand Identity Designer", "UI Designer", "Motion Designer"]',
    intro_paragraph TEXT DEFAULT 'Crafting premium visual identities and digital experiences that make brands unforgettable.',
    photo_url TEXT,
    resume_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add new columns if table already exists (safe re-run)
DO $$ BEGIN
    ALTER TABLE public.hero ADD COLUMN IF NOT EXISTS badge_text TEXT DEFAULT 'Available for Freelance Projects';
    ALTER TABLE public.hero ADD COLUMN IF NOT EXISTS typing_titles JSONB DEFAULT '["Graphic Designer", "Brand Identity Designer", "UI Designer", "Motion Designer"]';
    ALTER TABLE public.hero ADD COLUMN IF NOT EXISTS intro_paragraph TEXT DEFAULT 'Crafting premium visual identities and digital experiences that make brands unforgettable.';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Stats / Metrics Counters
CREATE TABLE IF NOT EXISTS public.stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label TEXT NOT NULL,
    value INTEGER NOT NULL DEFAULT 0,
    suffix TEXT DEFAULT '',
    "order" INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- About Section
CREATE TABLE IF NOT EXISTS public.about (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    bio TEXT,
    mission TEXT,
    vision TEXT,
    photo_url TEXT,
    cv_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    featured BOOLEAN DEFAULT false,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT,
    client TEXT,
    duration TEXT,
    software TEXT,
    thumbnail_url TEXT,
    project_url TEXT,
    case_study_url TEXT,
    github_url TEXT,
    problem TEXT,
    solution TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add project_url column if table already exists (safe re-run)
DO $$ BEGIN
    ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_url TEXT;
    ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS case_study_url TEXT;
    ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS github_url TEXT;
    ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS pdf_url TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Project Images Gallery
CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    level INTEGER CHECK (level >= 1 AND level <= 100),
    category TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT,
    location TEXT,
    start_date DATE,
    end_date DATE,
    description TEXT,
    current BOOLEAN DEFAULT false,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education
CREATE TABLE IF NOT EXISTS public.education (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    degree TEXT NOT NULL,
    institution TEXT,
    year TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members
CREATE TABLE IF NOT EXISTS public.team (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    description TEXT,
    photo_url TEXT,
    social_links JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    company TEXT,
    content TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    photo_url TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    cover_image TEXT,
    category TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social Links
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    platform TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    icon TEXT,
    active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    "order" INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    site_name TEXT DEFAULT 'Abdul Waheed',
    site_description TEXT,
    contact_email TEXT,
    phone TEXT,
    address TEXT,
    whatsapp TEXT,
    copyright_text TEXT,
    section_titles JSONB DEFAULT '{"featured_projects":"Featured Projects","services":"Services & Expertise","testimonials":"What Clients Say","cta_title":"Let''s Create Something Amazing","cta_subtitle":"Ready to elevate your brand?"}',
    logo_text TEXT DEFAULT 'AW',
    logo_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns if they don't exist (for re-runs after table already created)
DO $$ BEGIN
    ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS copyright_text TEXT;
    ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS section_titles JSONB DEFAULT '{"featured_projects":"Featured Projects","services":"Services & Expertise","testimonials":"What Clients Say","cta_title":"Let''s Create Something Amazing","cta_subtitle":"Ready to elevate your brand?"}';
    ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS logo_text TEXT DEFAULT 'AW';
    ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS logo_image_url TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- SEO Settings
CREATE TABLE IF NOT EXISTS public.seo (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    meta_title TEXT,
    meta_description TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    keywords TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chatbot Configuration
CREATE TABLE IF NOT EXISTS public.chatbot_config (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    greeting TEXT DEFAULT '👋 Hi! How can I help you today?',
    system_prompt TEXT,
    model TEXT DEFAULT 'llama-3.3-70b-versatile',
    temperature REAL DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 500,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics (page views)
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    page TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (safe to re-run, does nothing if already enabled)
ALTER TABLE public.hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first so this migration is idempotent (safe to re-run)
DROP POLICY IF EXISTS "Public read access" ON public.hero;
DROP POLICY IF EXISTS "Public read access" ON public.about;
DROP POLICY IF EXISTS "Public read access" ON public.services;
DROP POLICY IF EXISTS "Public read access" ON public.projects;
DROP POLICY IF EXISTS "Public read access" ON public.project_images;
DROP POLICY IF EXISTS "Public read access" ON public.skills;
DROP POLICY IF EXISTS "Public read access" ON public.team;
DROP POLICY IF EXISTS "Public read access" ON public.testimonials;
DROP POLICY IF EXISTS "Public read access" ON public.social_links;
DROP POLICY IF EXISTS "Public read access" ON public.categories;
DROP POLICY IF EXISTS "Public read access" ON public.settings;
DROP POLICY IF EXISTS "Public read access" ON public.seo;
DROP POLICY IF EXISTS "Public read access" ON public.chatbot_config;
DROP POLICY IF EXISTS "Admin full access" ON public.hero;
DROP POLICY IF EXISTS "Admin full access" ON public.about;
DROP POLICY IF EXISTS "Admin full access" ON public.services;
DROP POLICY IF EXISTS "Admin full access" ON public.projects;
DROP POLICY IF EXISTS "Admin full access" ON public.project_images;
DROP POLICY IF EXISTS "Admin full access" ON public.skills;
DROP POLICY IF EXISTS "Admin full access" ON public.team;
DROP POLICY IF EXISTS "Admin full access" ON public.testimonials;
DROP POLICY IF EXISTS "Admin full access" ON public.messages;
DROP POLICY IF EXISTS "Admin full access" ON public.newsletter;
DROP POLICY IF EXISTS "Admin full access" ON public.social_links;
DROP POLICY IF EXISTS "Admin full access" ON public.settings;
DROP POLICY IF EXISTS "Admin full access" ON public.seo;
DROP POLICY IF EXISTS "Admin full access" ON public.chatbot_config;
DROP POLICY IF EXISTS "Admin full access" ON public.categories;
DROP POLICY IF EXISTS "Public read access" ON public.stats;
DROP POLICY IF EXISTS "Admin full access" ON public.stats;

-- Public read access for published data
CREATE POLICY "Public read access" ON public.hero FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.about FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.services FOR SELECT USING (status = 'published');
CREATE POLICY "Public read access" ON public.projects FOR SELECT USING (status = 'published');
CREATE POLICY "Public read access" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.skills FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON public.team FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON public.testimonials FOR SELECT USING (status = 'published');
CREATE POLICY "Public read access" ON public.social_links FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.seo FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.chatbot_config FOR SELECT USING (true);

-- Admin full access (authenticated users only)
CREATE POLICY "Admin full access" ON public.hero FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.about FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.project_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.team FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.newsletter FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.social_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.seo FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.chatbot_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON public.categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public read access" ON public.stats FOR SELECT USING (active = true);
CREATE POLICY "Admin full access" ON public.stats FOR ALL USING (auth.role() = 'authenticated');

-- Insert default social links
INSERT INTO public.social_links (platform, url) VALUES
    ('behance', 'https://behance.net/abdulwaheed'),
    ('linkedin', 'https://linkedin.com/in/abdulwaheed'),
    ('dribbble', 'https://dribbble.com/abdulwaheed'),
    ('whatsapp', 'https://wa.me/923291966097')
ON CONFLICT (platform) DO NOTHING;

-- ============================================================
-- SINGLE-ROW SEED DATA (settings, hero, about, seo, chatbot_config)
-- These use fixed IDs + ON CONFLICT (id) so re-running the
-- migration NEVER creates duplicate rows. Only inserts if missing.
-- ============================================================

-- First, deduplicate any existing rows (keep only the latest)
-- This is safe to re-run; if only 1 row exists it does nothing.
DELETE FROM public.settings WHERE id NOT IN (SELECT id FROM public.settings ORDER BY created_at DESC LIMIT 1);
DELETE FROM public.hero WHERE id NOT IN (SELECT id FROM public.hero ORDER BY created_at DESC LIMIT 1);
DELETE FROM public.about WHERE id NOT IN (SELECT id FROM public.about ORDER BY created_at DESC LIMIT 1);
DELETE FROM public.seo WHERE id NOT IN (SELECT id FROM public.seo ORDER BY created_at DESC LIMIT 1);
DELETE FROM public.chatbot_config WHERE id NOT IN (SELECT id FROM public.chatbot_config ORDER BY created_at DESC LIMIT 1);

-- Insert default settings (only if table is empty — ON CONFLICT (id) prevents duplicates)
INSERT INTO public.settings (id, site_name, site_description, contact_email, phone, address, whatsapp, copyright_text)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Abdul Waheed',
    'Professional Graphic Designer & Brand Identity Designer — crafting premium visual identities and brand experiences for businesses worldwide.',
    'abdulwaheedgraphics097@gmail.com',
    '+923291966097',
    'Lahore, Pakistan',
    '923291966097',
    '© 2026 Abdul Waheed. Crafting brands that matter.'
) ON CONFLICT (id) DO NOTHING;

-- Insert default chatbot config
INSERT INTO public.chatbot_config (id, greeting, system_prompt, enabled)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    '👋 Hi! I''m Abdul''s AI assistant. Ask me about his work, skills, or how to get started!',
    'You are a professional portfolio assistant for Abdul Waheed, a senior Graphic Designer.',
    true
) ON CONFLICT (id) DO NOTHING;

-- Insert default SEO
INSERT INTO public.seo (id, meta_title, meta_description, keywords)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    'Abdul Waheed | Graphic Designer - Brand Identity Designer',
    'Professional Graphic Designer specializing in brand identity, logo design, and visual communication.',
    'graphic designer, brand identity, logo design, UI design, Pakistan'
) ON CONFLICT (id) DO NOTHING;

-- Insert default hero
INSERT INTO public.hero (id, name, title, subtitle, photo_url, resume_url)
VALUES (
    '00000000-0000-0000-0000-000000000004',
    'Abdul Waheed',
    'Graphic Designer',
    'Crafting premium visual identities and digital experiences',
    NULL, NULL
) ON CONFLICT (id) DO NOTHING;

-- Insert default about
INSERT INTO public.about (id, bio, mission, vision, photo_url, cv_url)
VALUES (
    '00000000-0000-0000-0000-000000000005',
    'I''m a passionate graphic designer with over 8 years of experience creating visual identities that resonate. My approach combines strategic thinking with creative execution to deliver designs that not only look beautiful but achieve real results.',
    'To empower brands with compelling visual identities that communicate their unique story and connect with their audience on a deeper level.',
    'To be the most sought-after design studio known for creating iconic brands that shape industries.',
    NULL, NULL
) ON CONFLICT (id) DO NOTHING;

-- Insert default stats
INSERT INTO public.stats (label, value, suffix, "order", active) VALUES
  ('Years Experience', 8, '+', 1, true),
  ('Projects Completed', 500, '+', 2, true),
  ('Happy Clients', 200, '+', 3, true),
  ('Design Awards', 15, '', 4, true)
ON CONFLICT DO NOTHING;

-- Insert sample categories
INSERT INTO public.categories (name) VALUES
  ('Branding'), ('Logo'), ('Social Media'), ('Packaging'), ('Print'), ('UI')
ON CONFLICT (name) DO NOTHING;

-- Insert sample services
INSERT INTO public.services (title, description, icon, status, "order") VALUES
  ('Graphic Design', 'Eye-catching visual designs that communicate your brand message effectively and leave a lasting impression on your audience.', 'FiPenTool', 'published', 1),
  ('Brand Identity', 'Complete brand identity systems including logos, colors, typography, and comprehensive brand guidelines.', 'FiLayers', 'published', 2),
  ('Logo Design', 'Unique, memorable logos that capture the essence of your brand and make you instantly recognizable.', 'FiTrendingUp', 'published', 3),
  ('Social Media Design', 'Engaging social media graphics that stop the scroll, drive engagement, and grow your following.', 'FiSmartphone', 'published', 4),
  ('UI Design', 'Beautiful, intuitive user interfaces for web and mobile applications that users love to interact with.', 'FiMonitor', 'published', 5),
  ('Print Design', 'Professional print materials from business cards to billboards that make a tangible impact.', 'FiPrinter', 'published', 6)
ON CONFLICT DO NOTHING;

-- Insert sample skills
INSERT INTO public.skills (name, level, category, active) VALUES
  ('Adobe Photoshop', 95, 'Design', true),
  ('Adobe Illustrator', 92, 'Design', true),
  ('Figma', 88, 'Design', true),
  ('After Effects', 75, 'Motion', true),
  ('Brand Strategy', 90, 'Strategy', true),
  ('Typography', 85, 'Design', true),
  ('Logo Design', 93, 'Design', true),
  ('Packaging Design', 80, 'Design', true)
ON CONFLICT DO NOTHING;

-- Insert sample projects (using high-quality 4K Unsplash images)
INSERT INTO public.projects (title, slug, description, category, client, duration, software, thumbnail_url, problem, solution, status, featured) VALUES
  (
    'Luxury Brand Identity',
    'luxury-brand-identity',
    'Complete brand identity overhaul for a premium luxury fashion label. The project encompassed everything from logo design to packaging and digital presence.',
    'Branding',
    'Velora Fashion House',
    '3 months',
    'Photoshop, Illustrator, Figma',
    'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'The client had an outdated brand identity that no longer reflected their premium positioning in the luxury market. Their existing visuals were inconsistent across all touchpoints.',
    'Developed a comprehensive brand system with a refined logo, custom typography, curated color palette, and detailed brand guidelines. The result was a cohesive, sophisticated identity that elevated their market position.',
    'published', true
  ),
  (
    'Modern Tech Logo',
    'modern-tech-logo',
    'Minimalist, futuristic logo design for an AI-driven SaaS startup targeting enterprise clients.',
    'Logo',
    'NexMind AI',
    '2 weeks',
    'Illustrator',
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'The startup needed a logo that communicated cutting-edge AI technology while remaining approachable and professional for enterprise sales.',
    'Created a geometric mark combining neural network patterns with a human-centric approach. The final logo used a custom gradient and clean sans-serif wordmark.',
    'published', true
  ),
  (
    'Organic Product Packaging',
    'organic-product-packaging',
    'Sustainable packaging design for an organic skincare line, using eco-friendly materials and natural aesthetics.',
    'Packaging',
    'PureGlow Organics',
    '6 weeks',
    'Photoshop, Illustrator, Cinema 4D',
    'https://images.unsplash.com/photo-1541873676-a18131494184?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'The client wanted packaging that reflected their commitment to sustainability while standing out on crowded retail shelves.',
    'Designed a series of minimalist packages using kraft paper textures, botanical illustrations, and a warm earth-toned color palette. Each package included seed-embedded paper for planting.',
    'published', true
  ),
  (
    'Social Media Campaign',
    'social-media-campaign',
    'Comprehensive social media design system for a fitness brand targeting Gen Z audiences across Instagram, TikTok, and LinkedIn.',
    'Social Media',
    'FitPulse',
    '1 month',
    'Photoshop, After Effects',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'The brand had no cohesive social media presence. Posts were inconsistent in style, quality, and messaging across platforms.',
    'Created a versatile template system with modular carousel designs, animated stories, and platform-specific optimizations. Engagement increased by 340% in the first month.',
    'published', false
  ),
  (
    'Restaurant Brand & Menu',
    'restaurant-brand-menu',
    'Full brand identity and menu design for a contemporary Mediterranean restaurant in downtown Dubai.',
    'Print',
    'Oliva Restaurant',
    '2 months',
    'Illustrator, InDesign, Photoshop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'The restaurant was opening a new location and needed everything from the logo to menu design, signage, and promotional materials.',
    'Developed a warm, inviting brand inspired by Mediterranean coastlines. The menu featured hand-drawn illustrations of signature dishes, textured paper stocks, and elegant typography.',
    'published', false
  ),
  (
    'Fintech App UI Design',
    'fintech-app-ui',
    'End-to-end UI/UX design for a mobile banking app focused on financial literacy for young adults.',
    'UI',
    'CoinWise',
    '3 months',
    'Figma, Protopie',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'The app needed to make complex financial concepts accessible and engaging for users aged 18-25 who found traditional banking apps intimidating.',
    'Designed a playful, gamified interface with educational micro-interactions, spending visualizations, and achievement badges. User testing showed a 92% satisfaction rate.',
    'published', true
  )
ON CONFLICT DO NOTHING;

-- Insert sample project images
INSERT INTO public.project_images (project_id, url, "order") 
SELECT id, thumbnail_url, 0 FROM public.projects WHERE slug = 'luxury-brand-identity'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', 1 FROM public.projects WHERE slug = 'luxury-brand-identity'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1534670007418-fbb7f6cf1673?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', 2 FROM public.projects WHERE slug = 'luxury-brand-identity'
ON CONFLICT DO NOTHING;

-- Insert sample testimonials
INSERT INTO public.testimonials (name, role, company, content, rating, status) VALUES
  ('Sarah Mitchell', 'CEO', 'Velora Fashion House', 'Abdul completely transformed our brand identity. The attention to detail and strategic thinking behind every design decision was remarkable. Our sales increased by 45% after the rebrand.', 5, 'published'),
  ('James Chen', 'Founder', 'NexMind AI', 'Working with Abdul was a game-changer for our startup. He understood our complex technology and translated it into a visual identity that resonates with enterprise clients.', 5, 'published'),
  ('Priya Sharma', 'Marketing Director', 'PureGlow Organics', 'The packaging design exceeded our expectations. Our customers constantly compliment the beautiful, sustainable packaging. Abdul is a true artist.', 5, 'published'),
  ('Ahmed Al-Rashid', 'Owner', 'Oliva Restaurant', 'From the logo to the menu design, everything was perfect. Our restaurant has a distinct personality thanks to Abdul''s incredible work.', 4, 'published')
ON CONFLICT DO NOTHING;

-- Insert sample FAQs
INSERT INTO public.faqs (question, answer, category, "order", active) VALUES
  ('What is your design process?', 'I start with a discovery phase to understand your brand, followed by research, concept development, refinement, and final delivery. Each project is tailored to your specific needs.', 'Process', 1, true),
  ('How long does a typical project take?', 'Timelines vary by project scope. A logo design typically takes 1-2 weeks, while a full brand identity can take 4-6 weeks. I''ll provide a detailed timeline during our initial consultation.', 'Timeline', 2, true),
  ('What software do you use?', 'I primarily work with Adobe Creative Suite (Photoshop, Illustrator, InDesign, After Effects) and Figma for UI/UX projects.', 'Tools', 3, true),
  ('Do you offer revisions?', 'Yes! My process includes structured revision rounds to ensure you''re completely satisfied with the final deliverables.', 'Process', 4, true),
  ('How do I get started?', 'Simply reach out through the contact form or send an email to abdulwaheedgraphics097@gmail.com. We''ll schedule a free consultation to discuss your project.', 'General', 5, true)
ON CONFLICT DO NOTHING;

-- Create function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
