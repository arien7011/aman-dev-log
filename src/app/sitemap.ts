import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { blogApi } from "@/lib/api/blog";
import { projectsApi } from "@/lib/api/projects";
import { blogCategories } from "@/config/navigation";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];

  // Blog category pages
  const blogCategoryPages: MetadataRoute.Sitemap = blogCategories
    .filter((category) => category.slug) // Skip "All" category
    .map((category) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // Blog posts
  const blogPosts = await blogApi.getPosts({});
  const blogPostPages: MetadataRoute.Sitemap = blogPosts.data.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Projects
  const projects = await projectsApi.getProjects({});
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...blogCategoryPages,
    ...blogPostPages,
    ...projectPages,
  ];
}
