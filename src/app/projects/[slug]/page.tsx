import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/projects';
import { projectsApi } from '@/lib/api/projects';
import { generateSEOMetadata } from '@/lib/utils';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await projectsApi.getProject(slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }
  
  return generateSEOMetadata({
    title: project.title,
    description: project.description,
    ogImage: project.coverImage,
    keywords: project.technologies,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await projectsApi.getProject(slug);
  
  if (!project) {
    notFound();
  }
  
  return (
    <div className="container max-w-5xl py-12">
      <ProjectDetail project={project} />
    </div>
  );
}
