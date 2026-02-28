import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyAdminCookie } from '@/lib/auth/admin';
import { FilePen, LayoutList, Home, LogOut } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const tokenValue = cookieStore.get('admin-token')?.value;
  const isAdmin = await verifyAdminCookie(tokenValue);

  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="flex w-56 shrink-0 flex-col bg-gray-900 text-gray-100">
        {/* Brand */}
        <div className="border-b border-gray-700 px-4 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Admin Panel
          </p>
          <p className="mt-1 text-sm font-medium text-white">Aman Dev Blog</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          <Link
            href="/admin/blog"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <FilePen className="h-4 w-4" />
            New Post
          </Link>
          <Link
            href="/admin/blog/manage"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <LayoutList className="h-4 w-4" />
            Manage Posts
          </Link>
        </nav>

        {/* Footer links */}
        <div className="border-t border-gray-700 px-2 py-4 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <Home className="h-4 w-4" />
            Back to Site
          </Link>
          <Link
            href="/api/auth/admin/logout"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
