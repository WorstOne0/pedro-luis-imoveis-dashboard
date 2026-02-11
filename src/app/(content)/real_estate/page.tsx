"use client";

// Next
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// Components
import { Card, Form, InputWithLabel, Pagination, RealEstateCard } from "@/components";
import { useApiFetch } from "@/hooks";
import { useRealEstateStore } from "@/store";
//
import { BsListUl, BsGrid1X2Fill } from "react-icons/bs";
import { FaSortAmountDown } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";

const FormSchema = z.object({
  search: z.string().email("Invalid email address"),
});

export default function RealEstate() {
  const router = useRouter();

  const { realEstateList, setRealEstateList } = useRealEstateStore((state) => state);
  const { isLoading } = useApiFetch({ url: "http://localhost:4000/real_estate", method: "get" }, setRealEstateList);

  const [currentPage, setCurrentPage] = useState(1);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { search: "" },
  });

  const buildLabel = ({ label }: { label: string; left?: string }) => {
    return <label className={`absolute top-0 left-[0.8rem] translate-y-[-50%] text-[1.4rem] bg-background text-primary px-[1rem]`}>{label}</label>;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col relative">
      {/* Search Bar */}
      <div className="min-h-[5.8rem] h-[5.8rem] w-full flex mt-[3rem] px-[1.5rem]">
        <Form {...form}>
          <form className="h-full w-full gap-[1rem] flex justify-center items-center mr-[1.5rem] " onSubmit={form.handleSubmit(() => {})}>
            <div className="min-w-0 grow">
              <InputWithLabel name="search" label="Pesquisar" className="h-[5.8rem] w-full" />
            </div>

            <Card className="h-full w-[28rem] flex justify-center items-center relative">
              <span>R$ 250.000 - R$ 1.000.000</span>
              {buildLabel({ label: "Preço" })}
            </Card>

            <Card className="h-full w-[20rem] flex justify-center items-center relative">
              <span>Apartamento</span>
              {buildLabel({ label: "Tipo" })}
            </Card>
            <Card className="h-full w-[12rem] flex justify-center items-center relative">
              <span>2-3</span>
              {buildLabel({ label: "Quartos" })}
            </Card>
            <Card className="h-full w-[12rem] flex justify-center items-center relative">
              <span>250m2</span>
              {buildLabel({ label: "Area" })}
            </Card>

            <Card className="h-full w-[18rem] rounded-[0.8rem] flex justify-center items-center bg-primary cursor-pointer">
              <span className="text-white text-[2rem] font-bold select-none">Procurar</span>
            </Card>
          </form>
        </Form>
      </div>

      {/* List */}
      <div className="flex justify-between px-[1.5rem] mt-[1.5rem]">
        <div className="flex items-end">
          <span className="text-[5rem] font-bold mr-[1rem]">{realEstateList.length}</span>
          <span className="mb-[1.5rem] italic ">Imóveis encontrados</span>
        </div>

        <div className="h-full w-[25rem] flex justify-end items-center gap-[1.5rem] mr-[1.5rem]">
          <Card className="h-[4.5rem] w-[4.5rem] flex justify-center items-center cursor-pointer">
            <FaSortAmountDown />
          </Card>
          <Card className="h-[4.5rem] w-[4.5rem] flex justify-center items-center cursor-pointer">
            <BsListUl />
          </Card>
          <Card className="h-[4.5rem] w-[4.5rem] flex justify-center items-center cursor-pointer">
            <BsGrid1X2Fill size={16} />
          </Card>
        </div>
      </div>
      <div className="min-h-0 grow w-full grid grid-cols-[repeat(auto-fill,minmax(50rem,1fr))] gap-[1.5rem] px-[1.5rem] overflow-y-auto">
        {realEstateList.map((item, index) => (
          <RealEstateCard key={`real_estate_card_${index}`} realEstate={item} onClickCallback={() => router.push(`/real_estate/edit/${item._id}`)} />
        ))}
      </div>

      {/* Add Button */}
      <Card
        className="h-[6rem] w-[25rem] flex justify-center items-center gap-[1.5rem] rounded-[0.8rem] bg-primary shadow-xl cursor-pointer absolute bottom-[6.5rem] right-[2.5rem]"
        onClick={() => router.push("/real_estate/add")}
      >
        <IoAdd color="white" size={30} />
        <span className="text-white text-[2rem] font-bold select-none">Adicionar</span>
      </Card>

      {/* Pagination */}
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={26} />
    </div>
  );
}
