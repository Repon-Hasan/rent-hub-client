<<<<<<< HEAD
import Link from 'next/link';

const AdminSidebar = () => (
    <nav
        style={{
            width: '220px',
            background: '#333',
            color: 'white',
            minHeight: '100vh',
            padding: '20px',
        }}
    >
        <h2>Admin Panel</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
                <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
                <Link href="/dashboard/users">Manage Users</Link>
            </li>
            <li>
                <Link href="/dashboard/reports">Reports</Link>
            </li>
            <li>
                <Link href="/dashboard/rentals">All Rentals</Link>
            </li>
        </ul>
    </nav>
);

export default AdminSidebar;
=======
import Link from "next/link";

export default function AdminSidebar() {
    return (
        <div className="w-64 min-h-screen bg-base-100 shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
            <ul className="menu">
                <li>
                    <a>Overview</a>
                </li>
                <li>
                    <a>Users</a>
                </li>
                <li><Link href="/dashboard/admin/">Vendor list</Link></li>
                <li>
                    <a>Rentals</a>
                </li>
                <li>
                    <a>Settings</a>
                </li>
            </ul>
        </div>
    );
}
>>>>>>> 5be7c9a0987938644751d22e17bcf21ac7c524d5
