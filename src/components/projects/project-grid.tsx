import { ProjectCard } from './project-card';
import type { Project } from '@/types';

interface ProjectGridProps {
  projects: Project[];
  showFeatured?: boolean;
}

export function ProjectGrid({ projects, showFeatured = false }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">No projects found.</p>
      </div>
    );
  }

  // If showFeatured, make the first project featured
  const featuredProject = showFeatured ? projects[0] : null;
  const regularProjects = showFeatured ? projects.slice(1) : projects;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featuredProject && (
        <ProjectCard project={featuredProject} featured />
      )}
      {regularProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
