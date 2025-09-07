import { Link, useForm, router } from '@inertiajs/react';
import { useRef, useState } from 'react';

type Doc = {
  id: number;
  title?: string | null;
  url?: string | null;
  original_name: string;
  mime?: string | null;
  size: number;
  created_at: string;
};

type Application = {
  id: number;
  full_name: string;
};

type Props = {
  application: Application;
  documents: Doc[];
  routes: {
    index: string;
    store: string;
    destroy: string; // '/documents/:id'
  };
  limits: {
    maxFiles: number;
    maxSizeMb: number;
    types: string; // for display only
  };
  flash?: { success?: string; error?: string };
};

export default function Documents({ application, documents, routes, limits, flash }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [localDocs, setLocalDocs] = useState<Doc[]>(documents);

  const { data, setData, post, progress, processing, errors, reset } = useForm<{
    title: string;
    files: File[] | null;
  }>({
    title: '',
    files: null,
  });

  const onChooseFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    // Limit count on client (server also enforces)
    if (files.length > limits.maxFiles) {
      alert(`Select up to ${limits.maxFiles} files.`);
      return;
    }
    setData('files', Array.from(files));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(routes.store, {
      forceFormData: true,         // IMPORTANT for file uploads
      onSuccess: () => {
        // Refresh list after upload
        router.reload({ only: ['documents'] });
        setData('files', null);
        reset('files');
        if (fileRef.current) fileRef.current.value = '';
      },
      preserveScroll: true,
    });
  };

  const destroy = (id: number) => {
    if (!confirm('Delete this document?')) return;

    setLocalDocs(prev => prev.filter(d => d.id !== id)); // optimistic
    router.delete(routes.destroy.replace(':id', String(id)), {
      preserveScroll: true,
      onError: () => router.reload({ only: ['documents'] }), // rollback by refresh
    });
  };

  const sizeKb = (n: number) => (n / 1024).toFixed(1) + ' KB';

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Documents — {application.full_name}</h1>
        <Link href={routes.index} className="text-sm text-gray-600 hover:underline">Back</Link>
      </div>

      {/* Flash */}
      {flash?.success && <div className="mt-3 rounded bg-green-100 text-green-800 px-4 py-2 text-sm">{flash.success}</div>}
      {flash?.error && <div className="mt-3 rounded bg-red-100 text-red-800 px-4 py-2 text-sm">{flash.error}</div>}

      {/* Upload form */}
      <form onSubmit={onSubmit} className="mt-6 space-y-4 bg-white p-6 border rounded-lg">
        <div>
          <label className="block text-sm mb-1">Title (optional)</label>
          <input
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="e.g., Passport, Photo"
          />
          {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">
            Files <span className="text-gray-500">(up to {limits.maxFiles}; {limits.types}; ≤ {limits.maxSizeMb}MB each)</span>
          </label>
          <input
            ref={fileRef}
            type="file"
            multiple
            onChange={onChooseFiles}
            className="block w-full text-sm"
            // optional accept for UX (server still validates)
            accept=".pdf,.jpg,.jpeg,.png,.webp"
          />
          {errors.files && <p className="text-xs text-red-600 mt-1">{errors.files}</p>}
          {errors['files.*'] && <p className="text-xs text-red-600 mt-1">{errors['files.*']}</p>}
        </div>

        {/* Selected files preview */}
        {data.files && data.files.length > 0 && (
          <ul className="text-sm text-gray-700">
            {data.files.map((f, i) => (
              <li key={i}>• {f.name} ({(f.size/1024/1024).toFixed(2)} MB)</li>
            ))}
          </ul>
        )}

        {/* Progress bar */}
        {progress && (
          <div className="mt-2 h-2 w-full bg-gray-200 rounded">
            <div
              className="h-2 bg-black rounded"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={processing || !data.files || data.files.length === 0}
          className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
        >
          {processing ? 'Uploading…' : 'Upload'}
        </button>
      </form>

      {/* List */}
      <div className="mt-6 bg-white border rounded-lg">
        <div className="p-4 border-b font-medium">Uploaded</div>
        <ul className="divide-y">
          {localDocs.length === 0 && (
            <li className="p-4 text-sm text-gray-500">No documents yet.</li>
          )}

          {localDocs.map((d) => (
            <li key={d.id} className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-medium truncate">
                  {d.title ?? d.original_name}
                </div>
                <div className="text-xs text-gray-500">
                  {d.mime ?? 'file'} · {sizeKb(d.size)} · {d.created_at}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {d.url && (
                  <a href={d.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                    View
                  </a>
                )}
                <button onClick={() => destroy(d.id)} className="text-sm text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
