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
