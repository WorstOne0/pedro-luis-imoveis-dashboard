"use client";

// Next
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
// Components
import { Card, Pagination, Input, SelectPlain } from "@/components";
import RealEstateCard from "@/app/(content)/real_estate/_components/real_estate_card";
import { useApiFetch, useDebounce } from "@/hooks";
import { PROPERTY_TYPE_OPTIONS } from "@/lib/real_estate_options";
import type { RealEstate } from "@/store/useRealEstateStore";
//
import { FaSortAmountDown } from "react-icons/fa";
import { IoAdd, IoSearch } from "react-icons/io5";

const PAGE_SIZE = 12;

const SORTS = [
  { value: "recent", label: "Mais recentes" },
  { value: "oldest", label: "Mais antigos" },
  { value: "price_desc", label: "Maior preço" },
  { value: "price_asc", label: "Menor preço" },
  { value: "area_desc", label: "Maior área" },
];

export default function RealEstate() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(search);

  const query = useMemo(() => {
    const params = new URLSearchParams({ sort });
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (type) params.set("type", type);

    return params.toString();
  }, [debouncedSearch, type, sort]);

  const { data: realEstateList = [], isLoading } = useApiFetch<RealEstate[]>(`/real_estate?${query}`);

  const totalPages = Math.max(Math.ceil(realEstateList.length / PAGE_SIZE), 1);
  // Filtering can shrink the list below the current page; clamp so the grid
  // never ends up empty while pages still exist.
  const page = Math.min(currentPage, totalPages);
  const visible = realEstateList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="h-full w-full flex flex-col relative">
      {/* Search Bar */}
      <div className="min-h-[5rem] h-[5rem] w-full flex gap-[1rem]">
        <div className="min-w-0 grow relative">
          <div className="h-full w-[4rem] absolute top-0 left-0 flex justify-center items-center text-muted-foreground pointer-events-none">
            <IoSearch size={18} />
          </div>
          <Input
            className="h-full w-full md:text-[1.6rem] rounded-[1rem]"
            placeholder="Pesquisar por título, descrição ou endereço"
            hasStartIcon
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <SelectPlain
          className="h-full w-[22rem] shrink-0"
          placeholder="Todos os tipos"
          value={type}
          onChange={(value) => {
            setType(value);
            setCurrentPage(1);
          }}
          options={[{ value: "", label: "Todos os tipos" }, ...PROPERTY_TYPE_OPTIONS]}
        />

        <SelectPlain
          className="h-full w-[20rem] shrink-0"
          placeholder="Ordenar"
          value={sort}
          onChange={setSort}
          options={SORTS}
          startIcon={<FaSortAmountDown />}
        />
      </div>

      {/* List */}
      <div className="flex justify-between mt-[1.5rem] mb-[0.5rem]">
        <div className="flex items-baseline gap-[1rem]">
          <span className="text-[3.2rem] font-bold">{realEstateList.length}</span>
          <span className="text-[1.5rem] text-muted-foreground">{realEstateList.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}</span>
        </div>
      </div>

      {/* 32rem, not 50rem: the preview card is far narrower than the old one,
          and the wider track left a single column on a 1000px pane. */}
      <div className="min-h-0 grow w-full grid grid-cols-[repeat(auto-fill,minmax(32rem,1fr))] auto-rows-min gap-[1.5rem] overflow-y-auto">
        {isLoading && <span className="italic text-gray-500">Carregando imóveis...</span>}

        {!isLoading && realEstateList.length === 0 && <span className="italic text-gray-500">Nenhum imóvel encontrado.</span>}

        {visible.map((item) => (
          <RealEstateCard
            key={`real_estate_card_${item._id}`}
            realEstate={item}
            variant="preview"
            onClickCallback={() => router.push(`/real_estate/edit/${item._id}`)}
          />
        ))}
      </div>

      {/* No floating add button: the page header carries the primary action, and
          two of them competing on one screen is one too many. */}
      <Pagination
        currentPage={page}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={realEstateList.length}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
