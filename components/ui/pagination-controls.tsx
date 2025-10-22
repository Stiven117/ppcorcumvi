'use client';

import Link from 'next/link';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <Link
        href={`/?page=${currentPage - 1}`}
        className={`px-4 py-2 rounded-md text-white font-semibold transition-colors ${
          hasPreviousPage
            ? 'bg-[#0470bd] hover:bg-[#035da7]'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
        aria-disabled={!hasPreviousPage}
        onClick={(e) => !hasPreviousPage && e.preventDefault()}
      >
        ← Anterior
      </Link>

      <span className="text-lg font-medium">
        Página {currentPage} de {totalPages}
      </span>

      <Link
        href={`/?page=${currentPage + 1}`}
        className={`px-4 py-2 rounded-md text-white font-semibold transition-colors ${
          hasNextPage
            ? 'bg-[#0470bd] hover:bg-[#035da7]'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
        aria-disabled={!hasNextPage}
        onClick={(e) => !hasNextPage && e.preventDefault()}
      >
        Siguiente →
      </Link>
    </div>
  );
}