'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Swal from 'sweetalert2';
import ThemeToggle from './ThemeToggle'; // Assuming your ThemeToggle component is here

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const routes = [
    { href: '/', label: 'Home' },
    { href: '/rent-posts', label: 'Listings' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const navLinks = session ? [...routes, { href: '/dashboard', label: 'Dashboard' }] : routes;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, log out',
    });

    if (result.isConfirmed) {
      signOut();
      Swal.fire('Logged Out!', 'You have been logged out.', 'success');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b shadow-sm bg-base-100 border-base-200">
      <div className="flex items-center h-16 mx-auto max-w-7xl">
        {/* Left: Logo */}
        <div className="flex-none">
          <Link href="/" className="p-0 text-xl font-bold normal-case btn btn-ghost">
            RentHub
          </Link>
        </div>

        {/* Center: Desktop Nav Links */}
        <div className="justify-center flex-1 hidden md:flex">
          <ul className="flex gap-6 font-medium text-base-content">
            {navLinks.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className={pathname === r.href ? 'text-primary' : 'hover:text-primary'}
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Theme & Auth */}
        <div className="flex items-center flex-none gap-2 ml-auto">
          {/* Desktop Theme toggle */}
          <div className="hidden md:flex">
            <ThemeToggle />
          </div>

          {/* Desktop Auth Buttons */}
          {session ? (
            <button onClick={handleLogout} className="hidden btn btn-destructive md:flex">
              Logout
            </button>
          ) : (
            <>
              <Link href="/login">
                <button className="hidden btn btn-primary md:flex">Login</button>
              </Link>
              <Link href="/register">
                <button className="hidden btn btn-secondary md:flex">Register</button>
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden btn btn-ghost btn-square"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-base-100 shadow-lg transform transition-transform duration-300 z-50 md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-base-200">
          <span className="text-lg font-bold">Menu</span>
          <button onClick={() => setMobileOpen(false)} className="btn btn-ghost btn-square">
            <X className="w-5 h-5" />
          </button>
        </div>
        <ul className="flex flex-col gap-4 p-4">
          {navLinks.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                onClick={() => setMobileOpen(false)}
                className={pathname === r.href ? 'text-primary' : 'text-base-content'}
              >
                {r.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-col items-start gap-4 p-4 mt-auto">
          <ThemeToggle />
          {session ? (
            <button
              className="w-full btn btn-destructive"
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="w-full">
                <button className="w-full btn btn-primary" onClick={() => setMobileOpen(false)}>
                  Login
                </button>
              </Link>
              <Link href="/register" className="w-full">
                <button className="w-full btn btn-secondary" onClick={() => setMobileOpen(false)}>
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
    </nav>
  );
}
