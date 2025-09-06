
import Header from './components/common/Header';
import AdminSidebar from './components/admin/Sidebar';
import VendorSidebar from './components/vendor/Sidebar';
import UserSidebar from './components/user/Sidebar';
import { rentals } from '../data/rentals';
import Image from 'next/image';

export default function DashboardPage() {
    const userRole = 'admin'; // পরে auth context থেকে dynamic হবে

    let SidebarComponent;
    if (userRole === 'admin') SidebarComponent = AdminSidebar;
    else if (userRole === 'vendor') SidebarComponent = VendorSidebar;
    else SidebarComponent = UserSidebar;

    return (
        <div style={{ display: 'flex' }}>
            <SidebarComponent />
            <div style={{ flex: 1 }}>
                <Header />
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div
                        style={{
                            padding: '20px',
                            border: '1px solid #ccc',
                            margin: '10px',
                            borderRadius: '8px',
                        }}
                    >
                        <h3>Total Rentals</h3>
                        <p>{rentals.length}</p>
                    </div>
                    <div
                        style={{
                            padding: '20px',
                            border: '1px solid #ccc',
                            margin: '10px',
                            borderRadius: '8px',
                        }}
                    >
                        <h3>Total Users</h3>
                        <p>100</p>
                    </div>
                </div>

                {/* Rentals list */}
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {rentals.map((rental) => (
                        <div
                            key={rental.id}
                            style={{
                                border: '1px solid #ccc',
                                margin: '10px',
                                padding: '10px',
                                width: '250px',
                            }}
                        >
                            <img
                                src={rental.imageUrl}
                                alt={rental.title}
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    objectFit: 'cover',
                                }}
                            />
                            <h3>{rental.title}</h3>
                            <p>
                                {rental.type} - {rental.location}
                            </p>
                            <p>Rent: ৳{rental.rentPrice}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
