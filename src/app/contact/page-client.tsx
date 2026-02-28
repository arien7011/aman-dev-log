'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MapPin, Send, Github, Linkedin, Twitter, CheckCircle2, Loader2, MessageSquare, Clock, Globe } from 'lucide-react';
import { Button, Input, Textarea, Card, Badge } from '@/components/ui';
import { siteConfig } from '@/config/site';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: siteConfig.author.email,
    href: `mailto:${siteConfig.author.email}`,
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Delhi, India',
    href: null,
  },
  {
    icon: Clock,
    label: 'Timezone',
    value: 'IST (UTC+5:30)',
    href: null,
  },
  {
    icon: Globe,
    label: 'Languages',
    value: 'English, Hindi',
    href: null,
  },
];

const socialLinks = [
  {
    icon: Github,
    label: 'GitHub',
    href: siteConfig.links.github,
    color: 'hover:text-gray-900 dark:hover:text-white',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: siteConfig.links.linkedin,
    color: 'hover:text-blue-600',
  },
  // {
  //   icon: Twitter,
  //   label: 'Twitter',
  //   href: siteConfig.links.twitter,
  //   color: 'hover:text-sky-500',
  // },
];

const services = [
  {
    title: 'Frontend Development',
    description: 'Building responsive and performant web applications with React, Angular, and Next.js',
  },
  {
    title: 'UI/UX Implementation',
    description: 'Translating design mockups into pixel-perfect, accessible interfaces',
  },
  {
    title: 'Code Review & Consulting',
    description: 'Reviewing codebases and providing guidance on best practices and architecture',
  },
  {
    title: 'Technical Writing',
    description: 'Creating documentation, tutorials, and technical blog posts',
  },
];

export function ContactPageClient() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });
  
  const onSubmit = async (data: ContactFormData) => {
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Contact form submitted:', data);
    setIsSubmitted(true);
    reset();
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };
  
  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            <MessageSquare className="mr-1 h-3 w-3" />
            Get in Touch
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Let&apos;s Start a Conversation
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Have a project in mind or want to discuss a collaboration? 
            I&apos;d love to hear from you. Fill out the form below or reach out through 
            any of my social channels.
          </p>
        </div>
        
        {/* Main Content */}
        <div className="mt-12">
          {/* Contact Form — temporarily disabled until email integration is implemented */}
          {/*
          <Card className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Send a Message
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Fill out the form below and I&apos;ll get back to you as soon as possible.
            </p>
            ...
          </Card>
          */}

          {/* Sidebar */}
          <div className="mx-auto max-w-lg space-y-8">
            {/* Contact Info */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h3>
              <div className="mt-4 space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-center gap-3">
                    <div className="rounded-lg bg-teal-100 p-2 dark:bg-teal-900/30">
                      <info.icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-500">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-gray-900 hover:text-teal-600 dark:text-white dark:hover:text-teal-400"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-900 dark:text-white">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Social Links */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Connect with Me
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Find me on these platforms
              </p>
              <div className="mt-4 flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-lg border border-gray-200 p-3 text-gray-600 transition-colors hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </Card>
            
            {/* Services */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                What I Can Help With
              </h3>
              <div className="mt-4 space-y-4">
                {services.map((service) => (
                  <div key={service.title}>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {service.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Response Time */}
            <Card className="border-teal-200 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Quick Response
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    I typically respond within 24-48 hours
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {/* FAQ Section */}
        <section className="mt-20">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                What services do you offer?
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                I specialize in frontend development, UI implementation, code review, 
                and technical consulting. I work with React, Angular, Next.js, and modern 
                web technologies.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Are you available for freelance work?
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Yes, I&apos;m open to freelance projects and consulting opportunities. 
                Feel free to reach out to discuss your project requirements and timeline.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                What is your typical project timeline?
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Project timelines vary based on scope and complexity. After our initial 
                discussion, I&apos;ll provide a detailed estimate with milestones and deliverables.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Do you work with international clients?
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Absolutely! I&apos;ve worked with clients across different time zones and am 
                comfortable with asynchronous communication and flexible meeting schedules.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
