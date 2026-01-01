import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import type { Project } from '@/types';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div>
      {/* Back Button */}
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center text-sm text-gray-600 transition-colors hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all projects
      </Link>

      {/* Header */}
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">{project.year}</Badge>
          <Badge variant="outline" className="capitalize">
            {project.category}
          </Badge>
          {project.featured && (
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
              Featured Project
            </Badge>
          )}
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
          {project.title}
        </h1>

        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 md:text-xl">
          {project.description}
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-4">
          {project.liveUrl && (
            <Button size="lg" asChild>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                View Live Demo
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button variant="outline" size="lg" asChild>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-5 w-5" />
                View Source Code
              </a>
            </Button>
          )}
        </div>
      </header>

      {/* Cover Image */}
      {project.coverImage && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>
      )}

      {/* Content */}
      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Long Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              About This Project
            </h2>
            <div className="prose prose-gray mt-4 max-w-none dark:prose-invert">
              <p>{project.longDescription}</p>
            </div>
          </section>

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Key Highlights
              </h2>
              <ul className="mt-4 space-y-3">
                {project.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start text-gray-600 dark:text-gray-400"
                  >
                    <span className="mr-3 mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-600 dark:bg-teal-400" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Gallery */}
          {project.images && project.images.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Screenshots
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {project.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-video overflow-hidden rounded-lg"
                  >
                    <Image
                      src={image}
                      alt={`${project.title} screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Technologies */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Technologies Used
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Project Info */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Project Info
            </h3>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Year</dt>
                <dd className="mt-1 font-medium text-gray-900 dark:text-white">
                  {project.year}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Category</dt>
                <dd className="mt-1 font-medium capitalize text-gray-900 dark:text-white">
                  {project.category}
                </dd>
              </div>
              {project.liveUrl && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Live URL</dt>
                  <dd className="mt-1">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-teal-600 hover:underline dark:text-teal-400"
                    >
                      Visit Site →
                    </a>
                  </dd>
                </div>
              )}
              {project.githubUrl && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Repository</dt>
                  <dd className="mt-1">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-teal-600 hover:underline dark:text-teal-400"
                    >
                      View Code →
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
