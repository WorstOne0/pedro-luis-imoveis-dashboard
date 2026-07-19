"use client";

import { MdChevronLeft, MdChevronRight } from "react-icons/md";

/**
 * Client-side pagination. The API returns the whole (small) catalogue in one
 * request, so this only slices what is already in memory.
 *
 * Renders first/last plus a window around the current page, with ellipses.
 */
const buildPageList = (currentPage: number, totalPages: number, windowSize = 2) => {
  const pages: (number | "gap")[] = [];

  for (let page = 1; page <= totalPages; page++) {
    const isEdge = page === 1 || page === totalPages;
    const isNearCurrent = Math.abs(page - currentPage) <= windowSize;

    if (isEdge || isNearCurrent) {
      pages.push(page);
      continue;
    }

    // Collapse each run of hidden pages into a single ellipsis.
    if (pages[pages.length - 1] !== "gap") pages.push("gap");
  }

  return pages;
};

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

  const buildPageButton = (page: number) => (
    <button
      key={`page_${page}`}
      type="button"
      onClick={() => goTo(page)}
      aria-current={currentPage === page ? "page" : undefined}
      className={`min-h-[3rem] h-[3rem] min-w-[3rem] w-[3rem] rounded-[0.8rem] flex justify-center items-center cursor-pointer ${
        currentPage === page ? "bg-primary" : "hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      <span className={`${currentPage === page ? "text-white" : "text-gray-500"} text-[1.4rem]`}>{page}</span>
    </button>
  );

  const buildArrow = (direction: "prev" | "next") => {
    const isPrev = direction === "prev";
    const isDisabled = isPrev ? currentPage === 1 : currentPage === totalPages;

    return (
      <button
        type="button"
        onClick={() => goTo(currentPage + (isPrev ? -1 : 1))}
        disabled={isDisabled}
        aria-label={isPrev ? "Página anterior" : "Próxima página"}
        className="min-h-[3rem] h-[3rem] min-w-[3rem] w-[3rem] rounded-[0.8rem] flex justify-center items-center cursor-pointer disabled:opacity-30 disabled:cursor-default"
      >
        {isPrev ? <MdChevronLeft size={20} /> : <MdChevronRight size={20} />}
      </button>
    );
  };

  return (
    <div className="min-h-[4rem] h-[4rem] w-full flex">
      <div className="h-full w-[25rem] flex items-center">
        <span className="text-[1.4rem] font-bold pl-[1.6rem]">
          Mostrando {firstItem}-{lastItem} de {totalItems}
        </span>
      </div>

      <div className="h-full min-w-0 grow flex justify-center items-center gap-[0.8rem] select-none">
        {buildArrow("prev")}

        {buildPageList(currentPage, totalPages).map((page, index) =>
          page === "gap" ? (
            <span key={`gap_${index}`} className="text-gray-500">
              ...
            </span>
          ) : (
            buildPageButton(page)
          ),
        )}

        {buildArrow("next")}
      </div>

      <div className="h-full w-[25rem]" />
    </div>
  );
}
