import Link from "next/link";

/**
 * Admin layout — clean sidebar with nav links, main content area.
 * Professional and utilitarian. No public-site design language.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-gray-200">
          <Link href="/admin" className="text-base font-semibold text-gray-900">
            Admin
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <SidebarLink href="/admin" label="Dashboard" icon="grid" />
          <SidebarLink href="/admin/books" label="Books" icon="book" />
          <SidebarLink href="/admin/news" label="News" icon="newspaper" />
          <SidebarLink href="/admin/videos" label="Videos" icon="video" />
          <SidebarLink href="/admin/picks" label="Picks" icon="file" />
          <SidebarLink href="/admin/insights" label="Insights" icon="pen" />
        </nav>

        <div className="px-3 py-4 border-t border-gray-200 space-y-0.5">
          <SidebarLink href="/" label="View Site" icon="external" />
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  disabled,
}: {
  href: string;
  label: string;
  icon: string;
  disabled?: boolean;
}) {
  const icons: Record<string, React.ReactNode> = {
    grid: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
    ),
    book: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
    ),
    newspaper: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z" /></svg>
    ),
    video: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
    ),
    file: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
    ),
    pen: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
    ),
    external: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
    ),
  };

  if (disabled) {
    return (
      <span className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 rounded-md cursor-not-allowed">
        {icons[icon]}
        {label}
        <span className="ml-auto text-[0.65rem] uppercase tracking-wider font-medium text-gray-300">Soon</span>
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
    >
      {icons[icon]}
      {label}
    </Link>
  );
}

function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        const { destroySession } = await import("@/lib/auth");
        await destroySession();
        const { redirect } = await import("next/navigation");
        redirect("/admin/login");
      }}
    >
      <button
        type="submit"
        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors w-full"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
        Sign out
      </button>
    </form>
  );
}
