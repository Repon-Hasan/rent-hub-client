// components/common/HeaderWrapper.jsx
'use client';

import dynamic from 'next/dynamic';
import { signOut } from 'next-auth/react';

// Original Header dynamically import করো (ssr: false)
const Header = dynamic(() => import('./Header'), { ssr: false });

export default function HeaderWrapper({ user }) {
    const handleSignOut = () => {
        signOut({ callbackUrl: '/auth/signin' });
    };

    return <Header user={user} onSignOut={handleSignOut} />;
}
