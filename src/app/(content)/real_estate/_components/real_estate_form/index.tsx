"use client";

// Next
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MarkerF } from "@react-google-maps/api";
import type { AxiosError } from "axios";
// Models
import { SALE_TYPES, type RealEstate } from "@/core/models";
// Services
import { api } from "@/services";
// Components
import { Dropzone, Form, GoogleMaps, InputField, SelectField, StepperField, SwitchField, TagsField, TextareaField, type DropzoneFile } from "@/components";
import RealEstateCard from "../real_estate_card";
import DeleteRealEstate from "../delete_real_estate";
import TypePicker from "./components/type_picker";
import SegmentedField from "./components/segmented_field";
// Utils
import { DISTRICT_OPTIONS, FEATURE_SUGGESTIONS } from "../../_utils/options";
import { RealEstateSchema, EMPTY_REAL_ESTATE, type RealEstateFormValues } from "./schema";
// Icons
import { MdOutlineSave } from "react-icons/md";

// Must match MAX_GALLERY in the backend's real_estate route and MAX_FILES in the image service.
const MAX_GALLERY = 30;

const SALE_OPTIONS = Object.entries(SALE_TYPES).map(([value, label]) => ({ value, label }));

export default function RealEstateForm({ realEstate }: { realEstate?: RealEstate }) {
  const router = useRouter();
  const isEdit = Boolean(realEstate);

  const [thumbnail, setThumbnail] = useState<DropzoneFile[]>([]);
  const [images, setImages] = useState<DropzoneFile[]>([]);
  // The saved gallery urls to keep. The API stores exactly these plus the new uploads, and deletes the rest.
  const [keptImages, setKeptImages] = useState<string[]>(realEstate?.images ?? []);
  const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(realEstate?.address?.position ?? null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const form = useForm<RealEstateFormValues>({
    resolver: zodResolver(RealEstateSchema),
    defaultValues: realEstate ? { ...EMPTY_REAL_ESTATE, ...realEstate, address: { ...EMPTY_REAL_ESTATE.address, ...realEstate.address } } : EMPTY_REAL_ESTATE,
  });

  // Feeds the live preview; useWatch re-renders this subscription, not the whole form, per keystroke.
  const values = useWatch({ control: form.control }) as RealEstateFormValues;

  const onCreateMap = (map: google.maps.Map) => {
    map.addListener("click", (event: google.maps.MapMouseEvent) => {
      if (event.latLng) setMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    });

    if (marker) map.setCenter(marker);
  };

  const onSubmit = async (data: RealEstateFormValues) => {
    setSaveError(null);

    // The API requires a cover; on edit the saved one is kept when no new file is chosen.
    if (!isEdit && thumbnail.length === 0) return setSaveError("Selecione uma capa antes de salvar.");

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("metadata", JSON.stringify({ ...data, images: keptImages, address: { ...data.address, position: marker } }));

      if (thumbnail[0]) formData.append("thumbnail", thumbnail[0].file);
      images.forEach((image) => formData.append("images", image.file));

      const options = { headers: { "Content-Type": "multipart/form-data" } };

      if (isEdit) await api.put(`/real_estate/${realEstate!._id}`, formData, options);
      else await api.post("/real_estate", formData, options);

      router.push("/real_estate");
      router.refresh();
    } catch (error) {
      setSaveError((error as AxiosError<{ message?: string }>).response?.data?.message ?? "Não foi possível salvar o imóvel.");
    } finally {
      setIsSaving(false);
    }
  };

  const buildSection = ({ step, title, subtitle, children }: { step: number; title: string; subtitle?: string; children: React.ReactNode }) => (
    <section className="surface w-full p-[2rem]">
      <div className="mb-[1.8rem] flex items-center gap-[1.2rem]">
        <span className="h-[3.2rem] w-[3.2rem] shrink-0 flex items-center justify-center rounded-control bg-action-tint text-[1.4rem] font-bold text-action tabular-nums">{step}</span>

        <div className="min-w-0 flex flex-col">
          <span className="text-[1.6rem] font-bold text-title">{title}</span>
          {subtitle && <span className="text-[1.3rem] text-meta">{subtitle}</span>}
        </div>
      </div>

      {children}
    </section>
  );

  return (
    <div className="h-full w-full flex gap-[1.2rem]">
      <Form {...form}>
        <form id="real_estate_form" onSubmit={form.handleSubmit(onSubmit)} className="h-full min-w-0 grow pb-[1rem] flex flex-col gap-[1.2rem] overflow-y-auto scrollbar-thin">
          {buildSection({
            step: 1,
            title: "Capa",
            subtitle: "Imagem principal exibida no card e na busca.",
            children: (
              <div className="h-[40rem] w-full">
                <Dropzone files={thumbnail} setFiles={setThumbnail} existing={realEstate?.thumbnail ? [realEstate.thumbnail] : []} />
              </div>
            ),
          })}

          {buildSection({
            step: 2,
            title: "Detalhes",
            children: (
              <div className="w-full flex flex-col gap-[1.6rem]">
                <InputField name="title" label="Título" placeholder="Sobrado no Centro de Cascavel" />
                <TextareaField name="description" label="Descrição" rows={9} placeholder="Sobrado com 214 m², suíte master com hidro, espaço gourmet e 3 vagas." />
                <TypePicker />

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[1.6rem]">
                  <SegmentedField name="sale" label="Negociação" options={SALE_OPTIONS} />
                  <InputField name="price" label="Preço" type="number" startIcon={<span className="text-[1.4rem] font-semibold">R$</span>} />
                </div>

                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-[1.6rem]">
                  <StepperField name="area" label="Área m²" step={10} />
                  <StepperField name="rooms" label="Quartos" />
                  <StepperField name="bathrooms" label="Banheiros" />
                  <StepperField name="garages" label="Vagas" />
                </div>

                <div className="w-full px-[1.6rem] py-[1.4rem] flex flex-col gap-[1.4rem] rounded-control border border-line">
                  <SwitchField name="featured" label="Imóvel em destaque" description="Aparece primeiro na busca e na home" reverse />
                  <span className="h-px w-full bg-line" />
                  <SwitchField name="sold" label="Imóvel vendido" description="Marcado como vendido no site, sem sair da lista" reverse />
                </div>

                <TagsField name="features" label="Características" placeholder="Ex: Suíte master com hidro" suggestions={FEATURE_SUGGESTIONS} />
              </div>
            ),
          })}

          {buildSection({
            step: 3,
            title: "Localização",
            children: (
              <div className="w-full flex flex-col gap-[1.6rem]">
                <div className="w-full grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-[1.6rem]">
                  <InputField name="address.cep" label="CEP" placeholder="85800-001" />
                  <InputField name="address.street" label="Rua" placeholder="Rua Santa Catarina" />
                </div>

                <div className="w-full grid grid-cols-2 md:grid-cols-[1fr_1fr_10rem_10rem] gap-[1.6rem]">
                  {/* A select, not free text: the map matches listings to polygons by district name. */}
                  <SelectField name="address.district" label="Bairro" options={DISTRICT_OPTIONS} placeholder="Selecione o bairro" />
                  <InputField name="address.city" label="Cidade" placeholder="Cascavel" />
                  <InputField name="address.state" label="Estado" placeholder="PR" />
                  <InputField name="address.number" label="Nº" placeholder="1200" />
                </div>

                <InputField name="address.complement" label="Complemento" placeholder="Apto 302, bloco B" />

                <div className="w-full flex flex-col gap-[0.6rem]">
                  <span className="text-[1.3rem] font-semibold text-body">Posição no mapa</span>

                  <div className="h-[48rem] w-full rounded-card overflow-hidden">
                    <GoogleMaps onCreateMap={onCreateMap} gestureHandling="cooperative">
                      {marker && <MarkerF position={marker} />}
                    </GoogleMaps>
                  </div>

                  <span className="text-[1.3rem] text-meta tabular-nums">
                    {marker ? `Posição: ${marker.lat.toFixed(5)}, ${marker.lng.toFixed(5)}` : "Clique no mapa para marcar a posição do imóvel."}
                  </span>
                </div>
              </div>
            ),
          })}

          {buildSection({
            step: 4,
            title: "Galeria de imagens",
            subtitle: "Fotos adicionais mostradas na página do imóvel.",
            children: (
              <>
                <div className="h-[40rem] w-full">
                  <Dropzone
                    files={images}
                    setFiles={setImages}
                    multiple
                    maxFiles={MAX_GALLERY}
                    existing={keptImages}
                    onRemoveExisting={(url) => setKeptImages((current) => current.filter((kept) => kept !== url))}
                  />
                </div>

                {isEdit && <span className="mt-[0.8rem] block text-[1.3rem] text-meta">Imagens removidas são apagadas do servidor ao salvar.</span>}
              </>
            ),
          })}
        </form>
      </Form>

      {/* Beside the form, so the card takes shape without scrolling back up; the actions never leave view. */}
      <aside className="h-full w-[38rem] shrink-0 flex flex-col">
        <div className="min-h-0 grow flex flex-col gap-[1rem] overflow-y-auto scrollbar-thin">
          <span className="label px-[0.4rem]">Pré-visualização</span>
          <RealEstateCard realEstate={{ ...(realEstate ?? {}), ...(values ?? EMPTY_REAL_ESTATE) } as RealEstate} thumbnail={thumbnail[0]?.preview ?? realEstate?.thumbnail} />
        </div>

        <div className="pt-[1.2rem] pb-[0.4rem] shrink-0 flex flex-col gap-[0.8rem]">
          {saveError && <span className="px-[1.2rem] py-[1rem] rounded-control bg-negative-soft text-center text-[1.4rem] text-negative">{saveError}</span>}

          {/* Outside <form>, so the form attribute is what submits it. */}
          <button
            type="submit"
            form="real_estate_form"
            disabled={isSaving}
            className="h-[4.8rem] w-full flex items-center justify-center gap-[0.8rem] rounded-control bg-action text-[1.6rem] font-bold text-on-action hover:bg-action-hover disabled:opacity-60 cursor-pointer"
          >
            <MdOutlineSave size={20} />
            {isSaving ? "Salvando..." : "Salvar imóvel"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/real_estate")}
            className="h-[4.4rem] w-full flex items-center justify-center rounded-control border border-line bg-surface text-[1.4rem] font-semibold text-title hover:bg-surface-2 cursor-pointer"
          >
            Cancelar
          </button>

          {/* Apart from save and cancel, so it is never the button hit by reflex. */}
          {isEdit && (
            <div className="w-full mt-[0.4rem] pt-[1.2rem] border-t border-line">
              <DeleteRealEstate
                realEstateId={realEstate!._id}
                title={realEstate!.title}
                imageCount={(realEstate!.images?.length ?? 0) + (realEstate!.thumbnail ? 1 : 0)}
              />
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
