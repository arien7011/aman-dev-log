import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Briefcase, GraduationCap, Award, ExternalLink, Download, ArrowRight } from 'lucide-react';
import { Button, Badge, Card } from '@/components/ui';
import { generateSEOMetadata } from '@/lib/utils';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = generateSEOMetadata({
  title: 'About',
  description: 'Learn more about Aman Mishra, a passionate frontend engineer with 3.9 years of experience building modern web applications.',
  keywords: ['about', 'frontend engineer', 'web developer', 'react developer', 'angular developer'],
});

const experiences = [
  {
    id: '1',
    company: 'Taazaa Tech Pvt. Ltd',
    position: 'Software Engineer',
    location: 'Noida, India',
    startDate: 'Mar 2022',
    endDate: 'Present',
    description: [
      'Architected and developed multi-tenant e-commerce platforms using React 18, Next.js (SSR/SSG), Express, and MongoDB, serving 200K+ monthly users.',
      'Implemented SSR and SEO optimization with Next.js and Angular Universal, increasing organic traffic by ~20% and improving Core Web Vitals scores.',
      'Reduced bundle size and improved Time-to-Interactive by ~40% using dynamic imports, lazy loading, and code splitting strategies.',
      'Built real-time dispatch and driver-support systems using Socket.IO and SignalR, improving operational response time by 30%.',
      'Designed scalable admin dashboards with React and Highcharts, enabling operational analytics across multiple business units.',
      'Engineered secure payment integrations (Stripe, Fluidpay) with hardened backend validation using Node.js and Express.',
      'Refactored Angular application from v12 to v16, improving maintainability and achieving 30% improvement in application stability.',
      'Implemented CI/CD pipelines with GitHub Actions, Docker, and AWS for production-grade release automation.',
      'Mentored junior engineers and enforced frontend architecture standards across the team.',
    ],
    technologies: ['React 18', 'Next.js', 'Angular', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Socket.IO', 'Redux', 'NgRx', 'Docker', 'AWS', 'GitHub Actions'],
  },
];

const education = [
  {
    institution: 'Dr. A.P.J Abdul Kalam Technical University',
    degree: 'Bachelor of Technology',
    field: 'Computer Science and Engineering',
    year: '2018 - 2022',
    grade: '8.5 CGPA',
  },
];

const certifications = [
  {
    name: 'Meta Frontend Developer Professional Certificate',
    issuer: 'Meta (Coursera)',
    year: '2023',
    url: '#',
  },
  {
    name: 'JavaScript Algorithms and Data Structures',
    issuer: 'freeCodeCamp',
    year: '2022',
    url: '#',
  },
];

const skills = {
  frontend: ['React', 'Angular', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3'],
  styling: ['Tailwind CSS', 'SCSS', 'Material-UI', 'Styled Components', 'CSS Modules'],
  stateManagement: ['Redux', 'RxJS', 'Zustand', 'React Query', 'Context API'],
  tools: ['Git', 'VS Code', 'Figma', 'Postman', 'Chrome DevTools', 'npm/yarn'],
  backend: ['Node.js', 'Express', 'REST APIs', 'MongoDB', 'Firebase'],
  other: ['Agile/Scrum', 'CI/CD', 'Testing (Jest/RTL)', 'Web3/Ethers.js'],
};

export default function AboutPage() {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="container">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_400px]">
          <div>
            <Badge variant="secondary" className="mb-4">
              <Briefcase className="mr-1 h-3 w-3" />
              Software Engineer
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">
              Hi, I&apos;m {siteConfig.author.name}
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
              A <strong className="text-gray-900 dark:text-white">Frontend-Focused Full Stack Engineer</strong> with{' '}
              {siteConfig.author.experience} of experience building production-grade MERN/MEAN stack
              applications. Specialized in Next.js SSR/SSG, Angular Universal, Core Web Vitals
              optimization, and real-time systems — with a strong focus on clean architecture and
              exceptional user experiences.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Delhi, India
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {siteConfig.author.experience} Experience
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/contact">
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="/aman_mishra_resume.pdf" download target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </a>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-100 overflow-hidden rounded-2xl bg-linear-to-br from-teal-400 to-blue-500 lg:mx-0">
            <div className="absolute inset-2 overflow-hidden rounded-xl bg-white dark:bg-gray-900">
              <Image
                src="/avatar-placeholder.jpg"
                alt={siteConfig.author.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-teal-100 to-blue-100 dark:from-teal-900/50 dark:to-blue-900/50">
                <span className="text-8xl font-bold text-teal-600 dark:text-teal-400">
                  {siteConfig.author.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section className="container mt-20">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Technical Skills</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Technologies and tools I work with on a daily basis
        </p>
        
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">Frontend Frameworks</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.frontend.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">Styling & UI</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.styling.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">State Management</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.stateManagement.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">Development Tools</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.tools.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">Backend & APIs</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.backend.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">Other Skills</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.other.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </section>
      
      {/* Experience Section */}
      <section className="container mt-20">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Work Experience</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          My professional journey in software development
        </p>
        
        <div className="mt-8 space-y-8">
          {experiences.map((exp, index) => (
            <Card key={exp.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {exp.position}
                  </h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    {exp.company}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {exp.startDate} - {exp.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {exp.location}
                    </span>
                  </div>
                </div>
                {index === 0 && (
                  <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400">
                    Current
                  </Badge>
                )}
              </div>
              
              <ul className="mt-4 space-y-2">
                {exp.description.map((item, i) => (
                  <li key={i} className="flex gap-2 text-gray-600 dark:text-gray-400">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {exp.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" size="sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Education & Certifications */}
      <section className="container mt-20">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Education */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Education</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              My academic background
            </p>
            
            <div className="mt-8 space-y-6">
              {education.map((edu) => (
                <Card key={edu.institution} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-teal-100 p-3 dark:bg-teal-900/30">
                      <GraduationCap className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {edu.degree}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{edu.field}</p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                        {edu.institution}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                        <span>{edu.year}</span>
                        <span>•</span>
                        <span>{edu.grade}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Certifications — temporarily commented out until verified credentials are added
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Certifications</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Professional certifications and courses
            </p>
            
            <div className="mt-8 space-y-6">
              {certifications.map((cert) => (
                <Card key={cert.name} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-900/30">
                      <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {cert.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                        {cert.year}
                      </p>
                    </div>
                    <a
                      href={cert.url}
                      className="text-teal-600 hover:text-teal-700 dark:text-teal-400"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          */}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mt-20">
        <Card className="overflow-hidden">
          <div className="relative bg-linear-to-br from-teal-500 to-blue-600 px-8 py-12 text-center text-white">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            <div className="relative">
              <h2 className="text-3xl font-bold">Let&apos;s Work Together</h2>
              <p className="mx-auto mt-4 max-w-xl text-teal-100">
                I&apos;m always open to discussing new projects, creative ideas, or opportunities 
                to be part of your vision. Let&apos;s create something amazing together!
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/contact">
                    Start a Conversation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer">
                    Connect on LinkedIn
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
