import Link from "next/link";
import { LayoutDashboard, KanbanSquare, FileText, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Course<span className="text-blue-600">Admin</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavLink href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavLink href="/admin/courses" icon={<FileText size={20} />} label="Courses" />
          <NavLink href="/admin/category" icon={<Settings size={20} />} label="Category" />
          <NavLink href="/admin/orders" icon={<FileText size={20} />} label="Orders" />
          <NavLink href="/admin/pipeline" icon={<KanbanSquare size={20} />} label="Pipeline" />
          <NavLink href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

// Component link nhỏ để code gọn hơn
function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors group"
    >
      <span className="text-gray-400 group-hover:text-blue-600 mr-3">{icon}</span>
      {label}
    </Link>
  );
}
