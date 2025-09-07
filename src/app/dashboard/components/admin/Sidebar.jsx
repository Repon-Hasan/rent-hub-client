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

