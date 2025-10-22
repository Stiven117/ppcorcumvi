'use client';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isDisabled?: boolean;
}

export function PaginationControls({ currentPage, totalPages, onPageChange, isDisabled = false }: PaginationControlsProps) {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage || isDisabled}
        className={`px-4 py-2 rounded-md text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          hasPreviousPage
            ? 'bg-[#0470bd] hover:bg-[#035da7]'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        ← Anterior
      </button>

      <span className="text-lg font-medium">
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage || isDisabled}
        className={`px-4 py-2 rounded-md text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          hasNextPage
            ? 'bg-[#0470bd] hover:bg-[#035da7]'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Siguiente →
      </button>
    </div>
  );
}