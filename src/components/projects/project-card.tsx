import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        featured ? 'md:col-span-2 md:grid md:grid-cols-2' : ''
      }`}
    >
      {/* Cover Image */}
      <Link
        href={`/projects/${project.slug}`}
        className={`relative block overflow-hidden ${
          featured ? 'aspect-[16/10] md:aspect-auto' : 'aspect-[16/9]'
        }`}
      >
        <Image
          src={project.coverImage || '/images/placeholder-project.jpg'}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
        />
        {project.featured && (
          <div className="absolute left-4 top-4">
            <Badge variant="default" className="bg-teal-600 text-white">
              Featured
            </Badge>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      {/* Content */}
      <CardContent className={`flex flex-col ${featured ? 'justify-center' : ''} p-6`}>
        {/* Year & Category */}
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary">{project.year}</Badge>
          <Badge variant="outline" className="capitalize">
            {project.category}
          </Badge>
        </div>

        {/* Title */}
        <Link href={`/projects/${project.slug}`}>
          <h3
            className={`font-bold text-gray-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400 ${
              featured ? 'text-2xl md:text-3xl' : 'text-xl'
            }`}
          >
            {project.title}
          </h3>
        </Link>

        {/* Description */}
        <p
          className={`mt-3 text-gray-600 dark:text-gray-400 ${
            featured ? 'line-clamp-3' : 'line-clamp-2'
          }`}
        >
          {project.description}
        </p>

        {/* Technologies */}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="text-xs font-medium text-teal-600 dark:text-teal-400"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 5 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{project.technologies.length - 5} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3">
          {project.liveUrl && (
            <Button size="sm" asChild>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                Code
              </a>
            </Button>
          )}
          <Link
            href={`/projects/${project.slug}`}
            className="ml-auto inline-flex items-center text-sm font-medium text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
          >
            Details
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
