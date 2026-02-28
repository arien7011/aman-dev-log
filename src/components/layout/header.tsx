'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Github, Linkedin, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { mainNavItems } from '@/config/site';
import { useTheme } from '../providers/theme-provider';


export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
          aria-label="Aman Mishra — Home"
        >

          
          <Image
            src="/assets/images/blog-app-logo.png"
            alt="Aman Dev Blog logo"
            width={2912}
            height={1472}
            priority
            quality={100}
            className="h-14 w-auto object-contain drop-shadow-md transition-all duration-300 ease-out hover:scale-110 hover:drop-shadow-[0_0_12px_rgba(13,148,136,0.6)] active:scale-95"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
                pathname === item.href
                  ? 'text-teal-600 dark:text-teal-400'
                  : 'text-gray-600 dark:text-gray-300'
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Social Links */}
          <div className="hidden items-center space-x-1 sm:flex">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/arien7011"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://linkedin.com/in/aman-mishra-bb239b211"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:hidden">
          <nav className="container mx-auto flex flex-col space-y-1 px-4 py-4">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                )}
              >
                {item.title}
              </Link>
            ))}
            <div className="flex items-center space-x-2 pt-4">
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://github.com/arien7011"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://linkedin.com/in/aman-mishra-bb239b211"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
