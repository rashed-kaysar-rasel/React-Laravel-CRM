import { Link, useForm, Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Applications',
    href: '/applications',
  },
  {
    title: 'Edit Applications',
    href: '/applications/edit',
  },
];

interface Application {
    id: number;
    full_name: string;
    passport_no: string;
    country: string;
    visa_type: string;
    travel_date: string | null;
    status: 'new' | 'screening' | 'submitted' | 'decision';
    notes: string | null;
}

interface EditProps {
    application: Application;
    options: {
        countries: string[];
        visaTypes: string[];
        statuses: Array<'new' | 'screening' | 'submitted' | 'decision'>;
    };
    routes: {
        index: string;
        update: string;
    };
}

export default function Edit({ application, options, routes }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        full_name: application.full_name,
        passport_no: application.passport_no,
        country: application.country,
        visa_type: application.visa_type,
        travel_date: application.travel_date ?? '',
        status: application.status,
        notes: application.notes ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(routes.update, { preserveScroll: true });
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Application" />
                    <div className="p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">Edit Application</h1>
                <Link href={routes.index} className="text-sm text-gray-600 hover:underline">
                    Back to list
                </Link>
            </div>

            <form onSubmit={submit} className="space-y-4 bg-white p-6 border rounded-lg">
                {/* Full Name */}
                <div>
                    <label className="block text-sm mb-1">Full Name</label>
                    <input
                        value={data.full_name}
                        onChange={(e) => setData('full_name', e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                        required
                    />
                    {errors.full_name && <p className="text-xs text-red-600 mt-1">{errors.full_name}</p>}
                </div>

                {/* Passport No */}
                <div>
                    <label className="block text-sm mb-1">Passport No</label>
                    <input
                        value={data.passport_no}
                        onChange={(e) => setData('passport_no', e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                        pattern="^[A-Za-z0-9]{6,12}$"
                        title="6–12 letters or numbers"
                        required
                    />
                    {errors.passport_no && <p className="text-xs text-red-600 mt-1">{errors.passport_no}</p>}
                </div>

                {/* Country */}
                <div>
                    <label className="block text-sm mb-1">Country</label>
                    <select
                        value={data.country}
                        onChange={(e) => setData('country', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 bg-white"
                        required
                    >
                        {options.countries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    {errors.country && <p className="text-xs text-red-600 mt-1">{errors.country}</p>}
                </div>

                {/* Visa Type */}
                <div>
                    <label className="block text-sm mb-1">Visa Type</label>
                    <select
                        value={data.visa_type}
                        onChange={(e) => setData('visa_type', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 bg-white"
                        required
                    >
                        {options.visaTypes.map((v) => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                    {errors.visa_type && <p className="text-xs text-red-600 mt-1">{errors.visa_type}</p>}
                </div>

                {/* Travel Date */}
                <div>
                    <label className="block text-sm mb-1">Travel Date (optional)</label>
                    <input
                        type="date"
                        value={data.travel_date}
                        onChange={(e) => setData('travel_date', e.target.value)}
                        className="w-full border rounded-md px-3 py-2"
                        min={new Date().toISOString().slice(0, 10)}
                    />
                    {errors.travel_date && <p className="text-xs text-red-600 mt-1">{errors.travel_date}</p>}
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm mb-1">Status</label>
                    <select
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value as Application['status'])}
                        className="w-full border rounded-md px-3 py-2 bg-white"
                        required
                    >
                        {options.statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    {errors.status && <p className="text-xs text-red-600 mt-1">{errors.status}</p>}
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm mb-1">Notes</label>
                    <textarea
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        className="w-full border rounded-md px-3 py-2 h-28"
                    />
                    {errors.notes && <p className="text-xs text-red-600 mt-1">{errors.notes}</p>}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
                    >
                        {processing ? 'Saving…' : 'Save changes'}
                    </button>
                </div>
            </form>
        </div>
        </AppLayout>

    );
}