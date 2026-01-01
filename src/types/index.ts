// Blog Types
export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  email: string;
  social: SocialLinks;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  updatedAt: string;
  author: Author;
  tags: Tag[];
  category: Category;
  readingTime: number;
  featured: boolean;
  views?: number;
  likes?: number;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "newest" | "oldest" | "popular";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Project Types
export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  coverImage: string;
  images: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  year: number;
  category: "web" | "mobile" | "backend" | "fullstack" | "other";
  highlights?: string[];
}

export interface ProjectFilters {
  technology?: string;
  category?: string;
  year?: number;
  featured?: boolean;
}

// Experience Types
export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  companyLogo?: string;
}

// Skills Types
export interface Skill {
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  category: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

// Contact Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Newsletter Types
export interface NewsletterSubscription {
  email: string;
}

// API Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

// SEO Types
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}
