import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    current_page: number;
    data: T[]; // Array of the actual items (EducationCenter in this case)
    first_page_url: string | null;
    from: number | null;
    last_page: number;
    last_page_url: string | null;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

const Pagination = ({ pages }: { pages: PaginatedData<any> }) => {
    return (
        <div className="mt-6 flex justify-center">
            <nav
                className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
            >
                {pages.links.map(
                    (
                        link,
                        index, // Pagination links still use original prop
                    ) =>
                        link.url && (
                            <Link
                                key={index}
                                href={link.url}
                                className={`relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                                    link.active
                                        ? 'z-10 border-indigo-500 bg-indigo-50 text-indigo-600'
                                        : ''
                                } ${link.url === null ? 'pointer-events-none opacity-50' : ''} ${index === 0 ? 'rounded-l-md' : ''} ${
                                    index === pages.links.length - 1
                                        ? 'rounded-r-md'
                                        : ''
                                } `}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                                preserveScroll
                            />
                        ),
                )}
            </nav>
        </div>
    );
};

export default Pagination;
