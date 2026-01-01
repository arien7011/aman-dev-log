import Link from 'next/link';
import { FileQuestion, Home, Search } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="max-w-md p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <FileQuestion className="h-10 w-10 text-gray-600 dark:text-gray-400" />
        </div>
        
        <h1 className="mt-6 text-6xl font-bold text-gray-900 dark:text-white">
          404
        </h1>
        
        <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
          Page Not Found
        </h2>
        
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let&apos;s get you back on track.
        </p>
        
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/blog">
              <Search className="mr-2 h-4 w-4" />
              Browse Blog
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Looking for something specific? Try these:
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link
              href="/projects"
              className="text-sm text-teal-600 hover:underline dark:text-teal-400"
            >
              Projects
            </Link>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <Link
              href="/about"
              className="text-sm text-teal-600 hover:underline dark:text-teal-400"
            >
              About Me
            </Link>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <Link
              href="/contact"
              className="text-sm text-teal-600 hover:underline dark:text-teal-400"
            >
              Contact
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
