import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Icon } from '@/components/icon';
import { FolderInput, SquarePen, Trash, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useConfirm } from '@/hooks/useConfirm';

type Status = 'new' | 'screening' | 'submitted' | 'decision';

interface Application {
  id: number;
  full_name: string;
  passport_no: string;
  country: string;
  visa_type: string;
  travel_date?: string | null;
  status: Status;
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
  filters: { q?: string; status?: string; country?: string };
  options: { statuses: Status[]; countries: string[] };
  routes: {
    create: string;
    edit: string;
    delete: string;
    status: string;
    index: string;
  };
}

const STATUSES: Status[] = ['new', 'screening', 'submitted', 'decision'];

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

export default function Index({ apps, routes, filters, options }: IndexProps) {
  const { props } = usePage();
  const flash = props.flash;
  const [q, setQ] = useState(filters.q ?? '');
  const [status, setStatus] = useState(filters.status ?? '');
  const [country, setCountry] = useState(filters.country ?? '');

  const [rows, setRows] = useState<Application[]>(apps.data);
  const setLocalStatus = (id: number, status: Status) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
  };

  const changeStatus = (id: number, status: Status) => {
    // optimistic update
    const prev = rows.find(r => r.id === id)?.status;
    setLocalStatus(id, status);

    router.patch(routes.status.replace(':id', String(id)), { status }, {
      preserveScroll: true,
      // if server fails, revert local change
      onError: () => prev && setLocalStatus(id, prev),
    });
  };
  const confirm = useConfirm();

  const requestDelete = (id: number) => {
    confirm.ask(id);
  };

  const performDelete = () => {
    if (confirm.payload == null) return;
    router.delete(routes.delete.replace(':id', String(confirm.payload)), {
      preserveScroll: true,
      onFinish: () => confirm.close(),
    });
  };

  // Submit helper
  const submit = (params?: { replace?: boolean }) => {
    router.get(routes.index,
      { q, status, country },
      {
        preserveState: true,   // keep component state (so inputs don’t flicker)
        preserveScroll: true,
        replace: params?.replace ?? true, // avoid polluting history on every keystroke/filter
      },
    );
  };

  // Optional: small debounce on search typing
  useEffect(() => {
    const t = setTimeout(() => {
      // only auto-fire on q change; status/country fire on change event below
      if ((filters.q ?? '') !== q) submit({ replace: true });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const clear = () => {
    setQ('');
    setStatus('');
    setCountry('');
    router.get(routes.index, {}, { preserveState: false, replace: true, preserveScroll: true });
  };

    useEffect(() => {
    if (flash?.success) {
      (window as any).addToast(flash.success, 'success');
    }
    if (flash?.error) {
      (window as any).addToast(flash.error, 'error');
    }
  }, [flash]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Applications" />
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Applications</h1>

        <div className="flex justify-between items-center mb-4">
          <div className="grid gap-2 md:grid-cols-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, passport, visa..."
              className="border rounded px-3 py-2"
            />

            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); }}
              className="border rounded px-3 py-2 bg-white"
            >
              <option value="">All statuses</option>
              {options.statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select
              value={country}
              onChange={(e) => { setCountry(e.target.value); }}
              className="border rounded px-3 py-2 bg-white"
            >
              <option value="">All countries</option>
              {options.countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => submit()}
                className="px-3 py-2 border rounded bg-black text-white"
              >
                Apply
              </button>
              <button
                onClick={clear}
                className="px-3 py-2 border rounded"
              >
                Clear
              </button>
            </div>
          </div>
          <Link
            href={routes.create}
            className="px-3 py-2 bg-black text-white rounded"
          >
            + New
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border rounded">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                <th className="px-4 py-2 border-b text-gray-900 dark:text-gray-100">Full Name</th>
                <th className="px-4 py-2 border-b text-gray-900 dark:text-gray-100">Passport No</th>
                <th className="px-4 py-2 border-b text-gray-900 dark:text-gray-100">Country</th>
                <th className="px-4 py-2 border-b text-gray-900 dark:text-gray-100">Visa Type</th>
                <th className="px-4 py-2 border-b text-gray-900 dark:text-gray-100">Travel Date</th>
                <th className="px-4 py-2 border-b text-gray-900 dark:text-gray-100">Status</th>
                <th className="px-4 py-2 border-b text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-3 text-center text-gray-500">
                    No applications found.
                  </td>
                </tr>
              ) : (
                apps.data.map((app) => (
                  <tr key={app.id} className="border-b">
                    <td className="px-4 py-2">{app.full_name}</td>
                    <td className="px-4 py-2">{app.passport_no}</td>
                    <td className="px-4 py-2">{app.country}</td>
                    <td className="px-4 py-2">{app.visa_type}</td>
                    <td className="px-4 py-2">{app.travel_date || '-'}</td>
                    <td className="px-4 py-2">
                      <select
                        value={app.status}
                        onChange={e => changeStatus(app.id, e.target.value as Status)}
                        className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <Link href={`/applications/${app.id}/documents`} className="text-sm text-gray-700 hover:underline">
                          <Icon iconNode={FolderInput} className="h-5 w-5" />
                        </Link>
                        <Link
                          href={routes.edit.replace(':id', app.id.toString())}
                          className="text-dark-600 dark:text-white hover:underline"
                        >
                          <Icon iconNode={SquarePen} className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => requestDelete(app.id)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          <Icon iconNode={Trash2} className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Reusable ConfirmDialog */}
          <ConfirmDialog
            open={confirm.open}
            title="Delete application?"
            description="This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            variant="danger"
            onConfirm={performDelete}
            onCancel={confirm.close}
          />
        </div>

        <Pagination links={apps.links} />
      </div>
    </AppLayout>

  );
}
