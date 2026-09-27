"use client";

// Next
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
// Models
import { PROPERTY_TYPES, type RealEstate } from "@/core/models";
// Hooks
import { useApiFetch, useDebounce } from "@/hooks";
// Components
import { EmptyState, FieldWrapper, Input, Pagination, SectionHeader, SelectPlain } from "@/components";
import RealEstateCard from "./_components/real_estate_card";
// Icons
import { MdOutlineSearch, MdOutlineSort, MdOutlineSearchOff } from "react-icons/md";

const PAGE_SIZE = 12;

// Module scope: a `= []` default is a new array every render.
const EMPTY: RealEstate[] = [];

const SORT_OPTIONS = [
  { value: "recent", label: "Mais recentes" },
  { value: "oldest", label: "Mais antigos" },
  { value: "price_desc", label: "Maior preço" },
  { value: "price_asc", label: "Menor preço" },
  { value: "area_desc", label: "Maior área" },
];

const TYPE_OPTIONS = [{ value: "", label: "Todos os tipos" }, ...Object.entries(PROPERTY_TYPES).map(([value, { label }]) => ({ value, label }))];

export default function RealEstatePage() {
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

  const { data, isLoading } = useApiFetch<RealEstate[]>(`/real_estate?${query}`);
  const realEstateList = data ?? EMPTY;

  const count = realEstateList.length;
  const totalPages = Math.max(Math.ceil(count / PAGE_SIZE), 1);
  // A narrower filter can leave the current page past the end; clamp so the grid never goes blank.
  const page = Math.min(currentPage, totalPages);
  const visible = realEstateList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => {
    setSearch("");
    setType("");
    setCurrentPage(1);
  };

  return (
    <div className="h-full w-full flex flex-col gap-[1.2rem]">
      <div className="h-[4.4rem] w-full shrink-0 flex gap-[1rem]">
        <FieldWrapper startIcon={<MdOutlineSearch size={18} />} className="h-full min-w-0 grow">
          <Input
            className="h-full"
            placeholder="Pesquisar por título, descrição ou endereço"
            hasStartIcon
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
          />
        </FieldWrapper>

        <SelectPlain
          className="h-full w-[22rem] shrink-0"
          placeholder="Todos os tipos"
          value={type}
          onChange={(value) => {
            setType(value);
            setCurrentPage(1);
          }}
          options={TYPE_OPTIONS}
        />

        <SelectPlain className="h-full w-[20rem] shrink-0" placeholder="Ordenar" value={sort} onChange={setSort} options={SORT_OPTIONS} startIcon={<MdOutlineSort size={18} />} />
      </div>

      <SectionHeader label={isLoading ? "Carregando" : `${count} ${count === 1 ? "imóvel" : "imóveis"}`} />

      <div className="min-h-0 grow w-full pb-[0.4rem] grid grid-cols-[repeat(auto-fill,minmax(30rem,1fr))] auto-rows-min gap-[1.2rem] overflow-y-auto scrollbar-thin">
        {isLoading &&
          [0, 1, 2, 3].map((index) => (
            <div key={`skeleton_${index}`} className="surface overflow-hidden">
              <div className="h-[17rem] bg-surface-3 animate-pulse" />
              <div className="p-[1.4rem] flex flex-col gap-[0.8rem]">
                <div className="h-[2.2rem] w-[40%] rounded-control bg-surface-3 animate-pulse" />
                <div className="h-[1.6rem] w-[80%] rounded-control bg-surface-3 animate-pulse" />
              </div>
            </div>
          ))}

        {!isLoading && count === 0 && (
          <EmptyState
            Icon={MdOutlineSearchOff}
            title="Nenhum imóvel encontrado"
            subtitle="Amplie a busca ou limpe os filtros."
            className="col-span-full"
            action={
              <button
                type="button"
                onClick={clearFilters}
                className="h-[3.6rem] px-[1.4rem] rounded-control border border-line bg-surface text-[1.4rem] font-semibold text-title hover:bg-surface-2 cursor-pointer"
              >
                Limpar filtros
              </button>
            }
          />
        )}

        {visible.map((item) => (
          <RealEstateCard key={item._id} realEstate={item} onClickCallback={() => router.push(`/real_estate/edit/${item._id}`)} />
        ))}
      </div>

      <Pagination currentPage={page} setCurrentPage={setCurrentPage} totalPages={totalPages} totalItems={count} pageSize={PAGE_SIZE} />
    </div>
  );
}
