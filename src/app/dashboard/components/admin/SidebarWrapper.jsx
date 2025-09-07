
'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from './Sidebar';

export default function AdminSidebarWrapper() {
    const currentPath = usePathname();
    return <AdminSidebar currentPath={currentPath} />;
}
