"use client";

// Icons
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";

// First, last and a window around the current page; each hidden run collapses into one gap.
const buildPageList = (currentPage: number, totalPages: number, windowSize = 2) => {
  const pages: (number | "gap")[] = [];

  for (let page = 1; page <= totalPages; page++) {
    if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= windowSize) {
      pages.push(page);
      continue;
    }

    if (pages[pages.length - 1] !== "gap") pages.push("gap");
  }

  return pages;
};

// Slices in memory: the API returns the whole catalogue in one request.
export default function Pagination({
  currentPage,
  setCurrentPage,
  totalPages,
  totalItems,
  pageSize,
}: {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}) {
  if (totalPages <= 1) return null;

  const goTo = (page: number) => setCurrentPage(Math.min(Math.max(page, 1), totalPages));

  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);

  const buttonClass = "h-[3.2rem] min-w-[3.2rem] px-[0.6rem] flex items-center justify-center rounded-control text-[1.4rem] tabular-nums cursor-pointer";

  return (
    <div className="h-[5.2rem] w-full shrink-0 flex items-center justify-between gap-[1rem] border-t border-line">
      <span className="text-[1.3rem] text-meta tabular-nums">
        Mostrando {firstItem}–{lastItem} de {totalItems}
      </span>

      <div className="flex items-center gap-[0.4rem] select-none">
        <button type="button" aria-label="Página anterior" onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} className={`${buttonClass} text-body hover:bg-surface-2 disabled:opacity-30 disabled:cursor-default`}>
          <MdOutlineChevronLeft size={20} />
        </button>

        {buildPageList(currentPage, totalPages).map((page, index) =>
          page === "gap" ? (
            <span key={`gap_${index}`} className="px-[0.4rem] text-meta">
              …
            </span>
          ) : (
            <button
              key={`page_${page}`}
              type="button"
              onClick={() => goTo(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`${buttonClass} ${currentPage === page ? "bg-action font-semibold text-on-action" : "text-body hover:bg-surface-2"}`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          aria-label="Próxima página"
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${buttonClass} text-body hover:bg-surface-2 disabled:opacity-30 disabled:cursor-default`}
        >
          <MdOutlineChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
