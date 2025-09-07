import ConfirmDialog from '@/components/ConfirmDialog';
import { Icon } from '@/components/icon';
import { useConfirm } from '@/hooks/useConfirm';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Link, useForm, router, Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Applications',
        href: '/applications',
    },
    {
        title: 'Application Documents',
        href: '/applications/documents',
    },
];

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

    // 🔧 sync local state whenever server props change
    useEffect(() => {
        setLocalDocs(documents);
    }, [documents]);

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

    const confirm = useConfirm();

    const requestDelete = (id: number) => {
        confirm.ask(id);
    };
    const performDelete = () => {
        if (confirm.payload == null) return;
        router.delete(routes.destroy.replace(':id', String(confirm.payload)), {
            preserveScroll: true,
            onFinish: () => confirm.close(),
        });
    };

    const sizeKb = (n: number) => (n / 1024).toFixed(1) + ' KB';

    const fileItemErrors = Object.entries(errors)
        .filter(([key]) => key.startsWith('files.')) // catches files.0, files.1, ...
        .map(([, msg]) => String(msg));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Application Documents" />
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
                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="file-upload"
                                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md cursor-pointer hover:bg-gray-800 transition"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                                    />
                                </svg>
                                <span>Choose Files</span>
                                <input
                                    id="file-upload"
                                    ref={fileRef}
                                    type="file"
                                    multiple
                                    onChange={onChooseFiles}
                                    className="hidden"
                                    accept={limits.types
                                        .split(',')
                                        .map(type => type.trim().startsWith('.') ? type.trim() : undefined)
                                        .filter(Boolean)
                                        .join(',') || undefined}
                                />
                            </label>
                        </div>
                        {data.files && data.files.length > 0 && (
                            <span className="text-sm text-gray-700">{data.files.length} file(s) selected</span>
                        )}
                        {errors.files && (
                            <p className="text-xs text-red-600 mt-1">{errors.files}</p>
                        )}

                        {fileItemErrors.length > 0 && (
                            <ul className="mt-1 space-y-1">
                                {fileItemErrors.map((msg, i) => (
                                    <li key={i} className="text-xs text-red-600">• {msg}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Selected files preview */}
                    {data.files && data.files.length > 0 && (
                        <ul className="text-sm text-gray-700">
                            {data.files.map((f, i) => (
                                <li key={i}>• {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)</li>
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
                                        <a href={d.url} target="_blank" rel="noreferrer" className="text-sm text-dark-600 hover:underline">
                                            <Icon iconNode={ExternalLink} className="h-5 w-5" />
                                        </a>
                                    )}
                                    <button onClick={() => requestDelete(d.id)} className="text-sm text-red-600 hover:underline">
                                        <Icon iconNode={Trash2} className="h-5 w-5" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Reusable ConfirmDialog */}
                <ConfirmDialog
                    open={confirm.open}
                    title="Delete document?"
                    description="This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                    onConfirm={performDelete}
                    onCancel={confirm.close}
                />
            </div>
        </AppLayout>

    );
}
