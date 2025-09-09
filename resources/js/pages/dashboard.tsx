import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];


type DashboardProps = {
    statusData: Record<string, number>;
    countryData: Record<string, number>;
};

export default function Dashboard({ statusData, countryData }: DashboardProps) {
    const [data, setData] = useState({
        statusData: [] as { name: string; value: number }[],
        countryData: [] as { name: string; value: number }[],
    });

    useEffect(() => {
        // Convert data from Laravel format into Recharts format
        setData({
            statusData: Object.entries(statusData).map(([key, value]) => ({
                name: key,
                value,
            })),
            countryData: Object.entries(countryData).map(([key, value]) => ({
                name: key,
                value,
            })),
        });
    }, [statusData, countryData]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="mb-4 p-4">
                            <h2 className="text-lg font-semibold mb-4">Applications by Status</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data.statusData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#0D0A0A" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="mb-4 p-4">
                            <h2 className="text-lg font-semibold">Applications by Country</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={data.countryData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#0D0A0A"
                                        label
                                    >
                                        {data.countryData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={`hsl(${(index / data.countryData.length) * 360}, 50%, 20%)`}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
