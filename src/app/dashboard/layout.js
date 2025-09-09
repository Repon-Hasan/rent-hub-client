'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; 
import { useEffect } from 'react'; 
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AdminSidebar from './components/admin/Sidebar';
import VendorSidebar from './components/vendor/Sidebar';
import UserSidebar from './components/user/Sidebar';

export default function DashboardLayout({ children }) {
    const router = useRouter(); 
    const { data: session, status } = useSession();

   
    useEffect(() => {
        if (status === 'loading') return; 

        if (status === 'unauthenticated' || !session) {
            router.push('/auth/signin'); 
            return;
        }
    }, [status, session, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100 text-base-content">
                <div className="text-lg text-base-content">
                    Loading Dashboard...
                </div>
            </div>
        );
    }

    if (!session) {
        return null; 
    }

    const role = session.user?.role || 'renter';
    let SidebarComponent = UserSidebar;
    if (role === 'admin') SidebarComponent = AdminSidebar;
    else if (role === 'owner') SidebarComponent = VendorSidebar;

    return (
        <div className="flex min-h-screen bg-base-100 text-base-content">
            <SidebarComponent />
            <div className="flex-1 flex flex-col bg-base-100 text-base-content">
                <Header user={session.user} />
                <main className="flex-1 p-6 overflow-y-auto bg-base-100 text-base-content">{children}</main>
                <Footer />
            </div>
        </div>
    );
}
