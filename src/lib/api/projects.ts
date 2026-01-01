import { Project, ProjectFilters } from "@/types";

// Mock data for projects
const mockProjects: Project[] = [
  {
    id: "1",
    slug: "toke-platform",
    title: "TOKE - Multi-Domain Cannabis Dispensary Platform",
    description:
      "End-to-end modernization of a multi-domain cannabis dispensary web application, scaling to handle 200k+ visitors with optimized performance.",
    longDescription:
      "Led the complete modernization of the TOKE platform, a comprehensive multi-domain cannabis dispensary solution. The project involved upgrading the frontend from Angular 12 to Angular 16, refactoring backend APIs for improved performance, and implementing secure authentication systems. The platform now serves multiple dispensaries across different domains with optimized database queries and improved API response times.",
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=450&fit=crop",
    ],
    technologies: [
      "Angular",
      "Node.js",
      "MongoDB",
      "TypeScript",
      "Socket.IO",
      "Redis",
      "Docker",
    ],
    featured: true,
    year: 2024,
    category: "fullstack",
    highlights: [
      "Led the upgrade from Angular 12 to Angular 16 with zero downtime",
      "Achieved 30% improvement in application stability and performance",
      "Implemented optimized database queries reducing API response time by 40%",
      "Built secure authentication system with JWT and OAuth 2.0",
      "Designed scalable architecture handling 200k+ monthly visitors",
    ],
  },
  {
    id: "2",
    slug: "ecommerce-dispensary-platform",
    title: "E-Commerce Dispensary Platform",
    description:
      "Fully responsive multi-domain e-commerce platform built from scratch with React 18, featuring scalable APIs and CI/CD pipelines.",
    longDescription:
      "Developed and architected a complete e-commerce solution for cannabis dispensaries from the ground up. The platform features a fully responsive design optimized for mobile users, secure payment integration, and an optimized database workflow. Implemented CI/CD pipelines for cloud-ready deployment, enabling dispensaries to expand their online sales seamlessly across devices.",
    coverImage:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=630&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=450&fit=crop",
      "https://images.unsplash.com/photo-1556742208-999815fca738?w=800&h=450&fit=crop",
    ],
    technologies: [
      "React 18",
      "Express.js",
      "MongoDB",
      "TypeScript",
      "Stripe",
      "AWS",
      "GitHub Actions",
    ],
    liveUrl: "https://example.com",
    featured: true,
    year: 2023,
    category: "fullstack",
    highlights: [
      "Built from scratch with modern React 18 features",
      "Implemented scalable APIs handling high traffic loads",
      "Integrated secure payment processing with Stripe",
      "Achieved 25% increase in mobile user engagement",
      "Set up CI/CD pipelines for automated deployments",
    ],
  },
  {
    id: "3",
    slug: "dynamic-digital-menu",
    title: "Dynamic Digital Menu System",
    description:
      "Real-time digital menu platform powered by Angular and Node.js APIs, reducing customer query handling time by 25%.",
    longDescription:
      "Designed and launched an innovative digital menu system that enables dispensaries to manage and display their products in real-time. The system features live updates powered by WebSocket connections, allowing staff to instantly update prices, availability, and product information across all displays.",
    coverImage:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=630&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=450&fit=crop",
    ],
    technologies: ["Angular", "Node.js", "MongoDB", "WebSocket", "Redis"],
    featured: false,
    year: 2023,
    category: "web",
    highlights: [
      "Real-time updates using WebSocket technology",
      "Reduced customer query handling time by 25%",
      "Boosted staff productivity by 20%",
      "Intuitive admin panel for easy menu management",
    ],
  },
  {
    id: "4",
    slug: "admin-dashboard",
    title: "Interactive Admin Dashboard",
    description:
      "Real-time analytics dashboard built with Angular and Highcharts for monitoring trip metrics, driver performance, and operational trends.",
    longDescription:
      "Architected and developed a comprehensive admin dashboard for a ride-hailing dispatch platform. The dashboard provides real-time visual insights into trip metrics, driver performance, and operational trends using interactive Highcharts visualizations. Implemented modular components for scalability and optimized API integration for faster load times.",
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    ],
    technologies: [
      "Angular",
      "Highcharts",
      "TypeScript",
      "RxJS",
      "Material UI",
    ],
    featured: false,
    year: 2022,
    category: "web",
    highlights: [
      "Real-time data visualization with Highcharts",
      "Modular component architecture for scalability",
      "Optimized API integration for faster load times",
      "Enabled data-driven decision-making for dispatch operations",
    ],
  },
  {
    id: "5",
    slug: "driver-support-module",
    title: "Real-Time Driver Support Module",
    description:
      "Socket.IO-powered real-time support system for ride-hailing app, reducing driver support response time by 30%.",
    longDescription:
      "Built a real-time driver support module using Socket.IO and SignalR for a ride-hailing dispatch application. The system enables instant communication between drivers and support staff, with features like live chat, issue tracking, and automated ticket routing. The implementation resulted in significant improvements in driver satisfaction and support efficiency.",
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop",
    images: [],
    technologies: ["Socket.IO", "SignalR", "Node.js", "Angular", "MongoDB"],
    featured: false,
    year: 2022,
    category: "backend",
    highlights: [
      "Cut driver support response time by 30%",
      "Raised customer satisfaction score (CSAT) by 15%",
      "Implemented automated ticket routing system",
      "Real-time chat with typing indicators and read receipts",
    ],
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const projectsApi = {
  // Get all projects with optional filters
  async getProjects(filters?: ProjectFilters): Promise<Project[]> {
    await delay(300);

    let filteredProjects = [...mockProjects];

    // Filter by technology
    if (filters?.technology) {
      filteredProjects = filteredProjects.filter((project) =>
        project.technologies.some(
          (tech) => tech.toLowerCase() === filters.technology?.toLowerCase()
        )
      );
    }

    // Filter by category
    if (filters?.category) {
      filteredProjects = filteredProjects.filter(
        (project) => project.category === filters.category
      );
    }

    // Filter by year
    if (filters?.year) {
      filteredProjects = filteredProjects.filter(
        (project) => project.year === filters.year
      );
    }

    // Filter by featured
    if (filters?.featured !== undefined) {
      filteredProjects = filteredProjects.filter(
        (project) => project.featured === filters.featured
      );
    }

    // Sort by year (newest first) then by featured
    filteredProjects.sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      return b.year - a.year;
    });

    return filteredProjects;
  },

  // Get a single project by slug
  async getProject(slug: string): Promise<Project | null> {
    await delay(200);
    return mockProjects.find((project) => project.slug === slug) || null;
  },

  // Get featured projects
  async getFeaturedProjects(limit: number = 3): Promise<Project[]> {
    await delay(200);
    return mockProjects.filter((project) => project.featured).slice(0, limit);
  },

  // Get all unique technologies
  async getTechnologies(): Promise<string[]> {
    await delay(100);
    const technologies = new Set<string>();
    mockProjects.forEach((project) => {
      project.technologies.forEach((tech) => technologies.add(tech));
    });
    return Array.from(technologies).sort();
  },

  // Get projects by technology
  async getProjectsByTechnology(technology: string): Promise<Project[]> {
    await delay(200);
    return mockProjects.filter((project) =>
      project.technologies.some(
        (tech) => tech.toLowerCase() === technology.toLowerCase()
      )
    );
  },
};
