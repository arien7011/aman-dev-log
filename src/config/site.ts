import { Author, NavItem, SocialLinks } from "@/types";

export const siteConfig = {
  name: "Aman Mishra",
  title: "Aman Mishra | Frontend Engineer & Software Developer",
  description:
    "Frontend Engineer with 3.9+ years of experience building scalable, high-performance web applications using React, Angular, and TypeScript. Explore my blog, projects, and technical insights.",
  url: "https://amandevlog.com",
  ogImage: "/og-image.jpg",
  creator: "Aman Mishra",
  keywords: [
    "Frontend Engineer",
    "React Developer",
    "Angular Developer",
    "TypeScript",
    "Next.js",
    "Web Development",
    "Software Engineer",
    "JavaScript",
    "Node.js",
    "Full Stack Developer",
  ],
  themeColor: "#0d9488",
  language: "en-US",
  author: {
    name: "Aman Mishra",
    email: "amanmishra01234@gmail.com",
    experience: "3.9+ years",
  },
  links: {
    github: "https://github.com/arien7011",
    linkedin: "https://linkedin.com/in/aman-mishra-bb239b211",
    twitter: "https://twitter.com/amandevlog",
  },
};

export const authorConfig: Author = {
  id: "1",
  name: "Aman Mishra",
  avatar: "/assets/images/avatar_image.jpg",
  bio: "Frontend Engineer with 3.9+ years of experience building scalable, high-performance web applications using React, Angular, and TypeScript. Passionate about creating exceptional user experiences, optimizing performance, and implementing SSR/SEO best practices.",
  email: "amanmishra01234@gmail.com",
  social: {
    github: "https://github.com/arien7011",
    linkedin: "https://linkedin.com/in/aman-mishra-bb239b211",
    twitter: undefined,
  },
};

export const socialLinks: SocialLinks = {
  github: "https://github.com/arien7011",
  linkedin: "https://linkedin.com/in/aman-mishra-bb239b211",
};

export const mainNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Blog",
    href: "/blog",
    description: "Technical articles, tutorials, and insights",
  },
  {
    title: "Projects",
    href: "/projects",
    description: "Showcase of my work and side projects",
  },
  {
    title: "About",
    href: "/about",
    description: "Learn more about me and my journey",
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Get in touch with me",
  },
];

export const footerNavItems = {
  main: [
    { title: "Home", href: "/" },
    { title: "Blog", href: "/blog" },
    { title: "Projects", href: "/projects" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ],
  resources: [
    { title: "RSS Feed", href: "/rss.xml" },
    { title: "Sitemap", href: "/sitemap.xml" },
  ],
  legal: [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
  ],
};
