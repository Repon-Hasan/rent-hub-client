'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function AdminChart({ data }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Rentals',
                            data: data.values,
                            backgroundColor: 'rgba(59, 130, 246, 0.5)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: { beginAtZero: true },
                    },
                },
            });
            return () => chart.destroy();
        }
    }, [data]);

    return <canvas ref={canvasRef} className="w-full h-64" />;
}
