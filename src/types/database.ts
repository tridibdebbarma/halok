export interface SiteSettings {
    id: string;
    site_name: string;
    tagline: string | null;
    favicon_url: string | null;
    logo_url: string | null;
    default_meta_description: string | null;
    contact_email: string | null;
}

export interface CompanyProfile {
    id: string;
    name: string;
    description: string;
    mission: string | null;
    vision: string | null;
    address_line_1: string | null;
    address_line_2: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    phone_primary: string | null;
    phone_secondary: string | null;
    email_primary: string | null;
    email_secondary: string | null;
    facebook_url: string | null;
    instagram_url: string | null;
    linkedin_url: string | null;
    certifications: string[] | null;
    years_of_experience: number;
    total_projects: number;
}

export interface MenuItem {
    id: string;
    label: string;
    href: string;
    order_index: number;
    is_visible: boolean;
}

export interface SubMenuItem {
    id: string;
    menu_id: string;
    label: string;
    href: string;
    order_index: number;
    is_visible: boolean;
}

export interface Service {
    id: string;
    name: string;
    slug: string;
    category: string;
    short_description: string;
    full_description: string | null;
    main_image_url: string | null;
    features: string[] | null;
    price_range: string | null;
    is_featured: boolean;
    is_visible: boolean;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    category: string;
    short_description: string | null;
    full_description: string | null;
    specs: any;
    main_image_url: string | null;
    price: string | null;
    is_visible: boolean;
}

export interface PortfolioProject {
    id: string;
    title: string;
    slug: string;
    client_name: string | null;
    service_type: string | null;
    location: string | null;
    completion_date: string | null;
    short_description: string | null;
    full_description: string | null;
    main_image_url: string | null;
    gallery_urls: string[] | null;
    is_featured: boolean;
    is_visible: boolean;
}

export interface ContactInquiry {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    status: 'unread' | 'read' | 'replied';
    created_at: string;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string | null;
    image_url: string | null;
    linkedin_url: string | null;
    order_index: number;
}

export interface HeroSlide {
    id: string;
    title: string;
    subtitle: string | null;
    cta_text: string | null;
    cta_link: string | null;
    image_url: string;
    order_index: number;
    is_visible: boolean;
}
