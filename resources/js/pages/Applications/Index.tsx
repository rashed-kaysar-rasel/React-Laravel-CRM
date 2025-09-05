import { Head, Link, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

interface Application {
  id: number;
  full_name: string;
  passport_no: string;
  country: string;
  visa_type: string;
  travel_date?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface PaginationLink {
  url: string | null;
  label: string;   // often contains «, », page numbers (HTML entities)
  active: boolean;
}

interface Paginated<T> {
  data: T[];
  links: PaginationLink[];
  current_page: number;
  last_page: number;
  total: number;
}

interface IndexProps {
  flash: {
    success?: string;
    error?: string;
  };
  apps: Paginated<Application>;
  routes: {
    create: string;
    edit: string;
  };
}

function Pagination({ links }: { links: PaginationLink[] }) {
  if (!links || links.length === 0) return null;

  return (
    <nav className="mt-6 flex flex-wrap gap-2" aria-label="Pagination">
      {links.map((lnk, i) => {
        const baseClasses =
          'px-3 py-1.5 border rounded text-sm transition';
        const activeClasses = lnk.active
          ? 'bg-black text-white border-black'
          : 'bg-white text-gray-800 hover:bg-gray-50';

        // Disabled (no URL) → render as <span>
        if (!lnk.url) {
          return (
            <span
              key={i}
              className={`${baseClasses} opacity-50 cursor-not-allowed`}
              dangerouslySetInnerHTML={{ __html: lnk.label }}
            />
          );
        }

        // Normal page link
        return (
          <Link
            key={i}
            href={lnk.url}
            preserveScroll
            preserveState
            className={`${baseClasses} ${activeClasses}`}
            // labels contain HTML (&laquo; &raquo; and numbers)
            dangerouslySetInnerHTML={{ __html: lnk.label }}
          />
        );
      })}
    </nav>
  );
}
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Applications',
    href: '/applications',
  },
];

export default function Index({ apps, routes }: IndexProps) {
  const { props } = usePage();
  const flash = props.flash;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Applications" />
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Applications</h1>

        {/* Flash message */}
        {flash?.success && (
          <div className="mb-4 rounded bg-green-100 text-green-800 px-4 py-2 text-sm">
            {flash.success}
          </div>
        )}
        {flash?.error && (
          <div className="mb-4 rounded bg-red-100 text-red-800 px-4 py-2 text-sm">
            {flash.error}
          </div>
        )}
        
        <Link
          href={routes.create}
          className="px-3 py-2 bg-black text-white rounded"
        >
          + New
        </Link>

        <ul className="mt-4 space-y-2">
          {apps.data.map((app) => (
            <li key={app.id} className="border p-3 rounded">
              {app.full_name} — {app.country} — {app.status}

              <Link
                href={routes.edit.replace(':id', app.id.toString())}
                className="ml-4 text-blue-600 hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
          {apps.data.length === 0 && (
            <li className="text-sm text-gray-500">No applications found.</li>
          )}
        </ul>

        <Pagination links={apps.links} />
      </div>
    </AppLayout>

  );
}
