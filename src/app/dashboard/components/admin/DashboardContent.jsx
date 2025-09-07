'use client';

import { useState } from 'react';
import RentalsTable from './RentalsTable';
import Chart from './Chart';

export default function AdminContent({ rentals }) {
    const [activeTab, setActiveTab] = useState('rentals');
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: [65, 59, 80, 81, 56, 55],
    };

    return (
        <div>
            <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('rentals')}
                    className={`px-4 py-2 rounded-md ${
                        activeTab === 'rentals'
                            ? 'bg-white text-blue-600'
                            : 'text-gray-600'
                    }`}
                >
                    Rentals
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-4 py-2 rounded-md ${
                        activeTab === 'analytics'
                            ? 'bg-white text-blue-600'
                            : 'text-gray-600'
                    }`}
                >
                    Analytics
                </button>
            </div>
            {activeTab === 'rentals' && <RentalsTable rentals={rentals} />}
            {activeTab === 'analytics' && (
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">
                        Rentals Trend
                    </h3>
                    <Chart data={chartData} />
                </div>
            )}
        </div>
    );
}
