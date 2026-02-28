import Link from 'next/link';
import Image from 'next/image';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import { siteConfig, footerNavItems } from '@/config/site';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center" aria-label="Aman Mishra — Home">
              <Image
                src="/assets/images/blog-app-logo.png"
                alt="Aman Dev Blog logo"
                width={2912}
                height={1472}
                quality={100}
                className="h-12 w-auto object-contain drop-shadow-md transition-all duration-300 ease-out hover:scale-110 hover:drop-shadow-[0_0_12px_rgba(13,148,136,0.6)] active:scale-95"
              />
            </Link>
            <p className="mt-4 max-w-md text-sm text-gray-600 dark:text-gray-400">
              Frontend Engineer passionate about building scalable, high-performance
              web applications. Sharing knowledge, experiences, and insights from
              my journey in software development.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://github.com/arien7011"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/aman-mishra-bb239b211"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:amanmishra01234@gmail.com"
                className="text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {footerNavItems.main.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 transition-colors hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              {footerNavItems.resources.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 transition-colors hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} {siteConfig.name}. All rights reserved.
            </p>
            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              Built with{' '}
              <Heart className="mx-1 h-4 w-4 text-red-500" fill="currentColor" />{' '}
              using Next.js & TypeScript
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
