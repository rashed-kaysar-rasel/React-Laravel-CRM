import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Applications',
    href: '/applications',
  },
  {
    title: 'Create Applications',
    href: '/applications/create',
  },
];
interface PageProps {
  options: {
    countries: string[];
    visaTypes: string[];
  };
  routes: {
    index: string;
    store: string;
  };
}

interface ApplicationFormData {
  full_name: string;
  passport_no: string;
  country: string;
  visa_type: string;
  travel_date: string; // empty string or 'YYYY-MM-DD'
  notes: string;
}

export default function Create({ options, routes }: PageProps) {
  const { props } = usePage(); // contains flash, auth, etc. if you need them
  const { data, setData, post, processing, errors, reset } = useForm<ApplicationFormData>({
    full_name: '',
    passport_no: '',
    country: options.countries[0] ?? '',
    visa_type: options.visaTypes[0] ?? '',
    travel_date: '',
    notes: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(routes.store, {
      onSuccess: () => {
        // after redirect to index, flash message will show; optional local reset if you stayed here
        reset();
      },
      onError: () => {
        // errors are already populated; you could focus the first errored field here
      },
      preserveScroll: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Application" />
      <div className="p-6 max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">New Application</h1>
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
              placeholder="Enter your full name"
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
              placeholder="e.g., AB123456"
              // optional client hint; server still enforces regex
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
              min={new Date().toISOString().slice(0, 10)} // hint: today or later
            />
            {errors.travel_date && <p className="text-xs text-red-600 mt-1">{errors.travel_date}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm mb-1">Notes</label>
            <textarea
              value={data.notes}
              onChange={(e) => setData('notes', e.target.value)}
              className="w-full border rounded-md px-3 py-2 h-28"
              placeholder="Anything special about this application?"
            />
            {errors.notes && <p className="text-xs text-red-600 mt-1">{errors.notes}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
            >
              {processing ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
