'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

export default function AdminChart({ data }) {
    // Recharts data format: array of objects
    const chartData = data.labels.map((label, index) => ({
        name: label,
        Rentals: data.values[index],
    }));

    return (
        <ResponsiveContainer width="100%" height={256}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Rentals" fill="#3b82f6" />
            </BarChart>
        </ResponsiveContainer>
    );
}
