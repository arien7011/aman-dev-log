import { NavItem } from "@/types";

export const navigationConfig: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Blog",
    href: "/blog",
    description:
      "Technical articles, tutorials, and insights on web development",
    children: [
      {
        title: "All Posts",
        href: "/blog",
        description: "Browse all blog posts",
      },
      {
        title: "React",
        href: "/blog/category/react",
        description: "React.js tutorials and best practices",
      },
      {
        title: "TypeScript",
        href: "/blog/category/typescript",
        description: "TypeScript tips and advanced patterns",
      },
      {
        title: "Performance",
        href: "/blog/category/performance",
        description: "Web performance optimization techniques",
      },
    ],
  },
  {
    title: "Projects",
    href: "/projects",
    description: "Showcase of my professional and personal projects",
  },
  {
    title: "About",
    href: "/about",
    description: "Learn about my journey, skills, and experience",
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Get in touch with me",
  },
];

export const blogCategories = [
  { name: "All", slug: "" },
  { name: "React", slug: "react" },
  { name: "Angular", slug: "angular" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Next.js", slug: "nextjs" },
  { name: "Performance", slug: "performance" },
  { name: "Career", slug: "career" },
  { name: "Tutorials", slug: "tutorials" },
];

export const projectCategories = [
  { name: "All", value: "" },
  { name: "Web Apps", value: "web" },
  { name: "Full Stack", value: "fullstack" },
  { name: "Backend", value: "backend" },
  { name: "Mobile", value: "mobile" },
];
