import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const separator = '...';

  // 生成要显示的页码数组
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;

    if (currentPage <= 4) {
      return [...pages.slice(0, 5), separator, totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, separator, ...pages.slice(totalPages - 5)];
    }

    return [
      1,
      separator,
      ...pages.slice(currentPage - 2, currentPage + 1),
      separator,
      totalPages,
    ];
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="flex justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${currentPage - 1}`}
          className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          Previous
        </Link>
      )}

      {visiblePages.map((page, index) => {
        if (page === separator) {
          return (
            <span
              key={`separator-${index}`}
              className="px-3 py-2 text-gray-400"
            >
              {separator}
            </span>
          );
        }

        return (
          <Link
            key={page}
            href={`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${page}`}
            className={cn(
              'px-3 py-2 rounded-md',
              currentPage === page
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            )}
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${currentPage + 1}`}
          className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          Next
        </Link>
      )}
    </nav>
  );
} 