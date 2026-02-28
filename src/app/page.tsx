import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Code2, Briefcase, BookOpen, Sparkles, Github, Linkedin, Mail } from 'lucide-react';
import { Button, Badge, Card, CardContent } from '@/components/ui';
import { blogApi } from '@/lib/api/blog';
import { projectsApi } from '@/lib/api/projects';
import { siteConfig, authorConfig } from '@/config/site';
import { formatDate, formatReadingTime } from '@/lib/utils';

export default async function HomePage() {
  // Fetch data on the server
  const [recentPosts, featuredProjects] = await Promise.all([
    blogApi.getRecentPosts(3),
    projectsApi.getFeaturedProjects(2),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-gray-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative py-20 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Content */}
            <div className="flex flex-col justify-center">
              <Badge variant="secondary" className="mb-4 w-fit">
                <Sparkles className="mr-1 h-3 w-3" />
                Available for opportunities
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                Hi, I&apos;m{' '}
                <span className="gradient-text">Aman Mishra</span>
              </h1>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 md:text-2xl">
                Frontend-Focused Full Stack Engineer (MEAN / MERN)
              </p>
              <p className="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400">
                I build scalable, high-performance web applications using{' '}
                <strong className="text-gray-900 dark:text-white">Next.js</strong>,{' '}
                <strong className="text-gray-900 dark:text-white">React</strong>,{' '}
                <strong className="text-gray-900 dark:text-white">Angular</strong>,{' '}
                <strong className="text-gray-900 dark:text-white">TypeScript</strong>,{' '}
                <strong className="text-gray-900 dark:text-white">Node.js</strong>,{' '}
                <strong className="text-gray-900 dark:text-white">Express</strong>, and{' '}
                <strong className="text-gray-900 dark:text-white">MongoDB</strong>.
              </p>
              <p className="mt-4 max-w-xl text-base text-gray-600 dark:text-gray-400">
                Specialized in{' '}
                <strong className="text-gray-900 dark:text-white">SSR/SSG</strong> (Next.js &amp; Angular Universal),
                SEO optimization, state management (Redux, NgRx), and real-time integrations,
                while delivering robust backend APIs using the{' '}
                <strong className="text-gray-900 dark:text-white">MERN/MEAN stack</strong>.
                Passionate about Core Web Vitals, exceptional UX, and production-grade full-stack systems.
              </p>
              
              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/blog">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Read My Blog
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/projects">
                    <Code2 className="mr-2 h-5 w-5" />
                    View Projects
                  </Link>
                </Button>
              </div>

              {/* Social Links */}
              <div className="mt-8 flex items-center gap-4">
                <a
                  href="https://github.com/arien7011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  aria-label="GitHub"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a
                  href="https://linkedin.com/in/aman-mishra-bb239b211"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  href="mailto:amanmishra01234@gmail.com"
                  className="text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  aria-label="Email"
                >
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Stats/Highlights */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <Card className="p-6 text-center">
                  <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">3.9+</div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">40%</div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">Faster Load Times</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">200k+</div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">Users Served</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">20%</div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">SEO Improvement</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Latest Articles
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Thoughts on web development, career, and technology
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/blog">
                View all posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <Card key={post.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <Link href={`/blog/${post.slug}`} className="relative block aspect-video overflow-hidden">
                  <Image
                    src={post.coverImage || '/images/placeholder-blog.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </Link>
                <CardContent className="p-5">
                  <Link href={`/blog/category/${post.category.slug}`}>
                    <Badge variant="secondary" className="mb-2 hover:bg-teal-100 dark:hover:bg-teal-900/30">
                      {post.category.name}
                    </Badge>
                  </Link>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-bold text-gray-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400 line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>{formatReadingTime(post.readingTime)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/blog">
                View all posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900/50 md:py-24">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Featured Projects
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Some of my recent work and side projects
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/projects">
                View all projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <Link href={`/projects/${project.slug}`} className="relative block aspect-16/10 overflow-hidden">
                  <Image
                    src={project.coverImage || '/images/placeholder-project.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
                <CardContent className="p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="secondary">{project.year}</Badge>
                    <Badge variant="outline" className="capitalize">{project.category}</Badge>
                  </div>
                  <Link href={`/projects/${project.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="text-xs font-medium text-teal-600 dark:text-teal-400">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/projects">
                View all projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              About Me
            </h2>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
              I&apos;m a <strong className="text-gray-900 dark:text-white">Frontend-Focused Full Stack Engineer</strong> with{' '}
              <strong className="text-gray-900 dark:text-white">3.9+ years of experience</strong> building
              production-grade MERN/MEAN stack applications. Currently at{' '}
              <strong className="text-gray-900 dark:text-white">Taazaa Tech Pvt. Ltd</strong>,
              architecting Next.js SSR platforms and Angular Universal apps serving 200K+ monthly users.
            </p>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Expert in Core Web Vitals optimization, SSR/SSG/ISR with Next.js, state management
              (Redux, NgRx), real-time systems (Socket.IO), and CI/CD pipelines with Docker and AWS.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/about">
                  Learn more about me
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900/50 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
              Technical Expertise
            </h2>
            <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
              Technologies I work with on a daily basis
            </p>
            
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                  <Code2 className="h-7 w-7 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Frontend</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  React, Angular, TypeScript, Next.js, Redux, RxJS, Tailwind CSS
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                  <Briefcase className="h-7 w-7 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Backend</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Node.js, Express, MongoDB, GraphQL, REST APIs, WebSockets
                </p>
              </div>
              <div className="text-center sm:col-span-2 lg:col-span-1">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                  <Sparkles className="h-7 w-7 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Tools & Others</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Git, Docker, AWS, CI/CD, Jest, Testing Library, Webpack, Vite
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
