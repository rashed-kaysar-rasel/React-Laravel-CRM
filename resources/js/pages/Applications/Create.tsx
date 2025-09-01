import { Link, useForm } from '@inertiajs/react';

interface ApplicationFormData {
  full_name: string;
  passport_no: string;
  country: string;
  visa_type: string;
  travel_date: string;
}

export default function Create() {
  const { data, setData, post, processing, errors } = useForm<ApplicationFormData>({
    full_name: '',
    passport_no: '',
    country: '',
    visa_type: '',
    travel_date: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/applications');
  };

  return (
    <form onSubmit={submit} className="p-6 space-y-4">
      {/* Full Name */}
      <div>
        <input
          value={data.full_name}
          onChange={(e) => setData('full_name', e.target.value)}
          placeholder="Full Name"
          className="border p-2 w-full rounded"
        />
        {errors.full_name && <div className="text-red-500 text-sm">{errors.full_name}</div>}
      </div>

      {/* Passport No */}
      <div>
        <input
          value={data.passport_no}
          onChange={(e) => setData('passport_no', e.target.value)}
          placeholder="Passport No"
          className="border p-2 w-full rounded"
        />
        {errors.passport_no && <div className="text-red-500 text-sm">{errors.passport_no}</div>}
      </div>

      {/* Country */}
      <div>
        <input
          value={data.country}
          onChange={(e) => setData('country', e.target.value)}
          placeholder="Country"
          className="border p-2 w-full rounded"
        />
        {errors.country && <div className="text-red-500 text-sm">{errors.country}</div>}
      </div>

      {/* Visa Type */}
      <div>
        <input
          value={data.visa_type}
          onChange={(e) => setData('visa_type', e.target.value)}
          placeholder="Visa Type"
          className="border p-2 w-full rounded"
        />
        {errors.visa_type && <div className="text-red-500 text-sm">{errors.visa_type}</div>}
      </div>

      {/* Travel Date */}
      <div>
        <input
          type="date"
          value={data.travel_date}
          onChange={(e) => setData('travel_date', e.target.value)}
          className="border p-2 w-full rounded"
        />
        {errors.travel_date && <div className="text-red-500 text-sm">{errors.travel_date}</div>}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={processing}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {processing ? 'Saving...' : 'Save'}
        </button>

        <Link
          href="/applications"
          className="text-sm text-gray-600 hover:underline"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
