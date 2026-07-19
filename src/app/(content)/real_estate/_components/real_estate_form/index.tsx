/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// Next
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MarkerF } from "@react-google-maps/api";
// Components
import { Form, InputField, TextareaField, StepperField, SwitchField, TagsField, Dropzone, GoogleMaps } from "@/components";
import RealEstateCard from "@/app/(content)/real_estate/_components/real_estate_card";
import TypePicker from "./components/type_picker";
import SegmentedField from "./components/segmented_field";
// Services
import { apiService } from "@/services";
import { SALE_OPTIONS, FEATURE_SUGGESTIONS } from "@/lib/real_estate_options";
import { RealEstateSchema, EMPTY_REAL_ESTATE, type RealEstateFormValues } from "./schema";
import type { RealEstate } from "@/store/useRealEstateStore";
// Icons
import { MdOutlineSave } from "react-icons/md";

type DropzoneFile = { file: File; preview: string };

/** One numbered step of the form. */
const Section = ({
  step,
  title,
  subtitle,
  children,
}: {
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section className="w-full bg-card border border-border rounded-[1.6rem] p-[2rem]">
    <div className="w-full flex items-center gap-[1.2rem] mb-[1.6rem]">
      <span className="h-[2.8rem] w-[2.8rem] shrink-0 flex justify-center items-center rounded-[0.8rem] bg-muted text-[1.4rem] font-bold text-muted-foreground">
        {step}
      </span>

      <div className="min-w-0 flex flex-col">
        <span className="text-[1.8rem] font-bold leading-[2.2rem]">{title}</span>
        {subtitle && <span className="text-[1.3rem] text-muted-foreground">{subtitle}</span>}
      </div>
    </div>

    {children}
  </section>
);

export default function RealEstateForm({ realEstate }: { realEstate?: RealEstate }) {
  const router = useRouter();
  const isEdit = Boolean(realEstate);

  const [thumbnail, setThumbnail] = useState<DropzoneFile[]>([]);
  const [images, setImages] = useState<DropzoneFile[]>([]);
  const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(
    realEstate?.address?.position ? { lat: realEstate.address.position.lat, lng: realEstate.address.position.lng } : null
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const form = useForm<RealEstateFormValues>({
    resolver: zodResolver(RealEstateSchema),
    defaultValues: realEstate
      ? { ...EMPTY_REAL_ESTATE, ...realEstate, address: { ...EMPTY_REAL_ESTATE.address, ...realEstate.address } }
      : EMPTY_REAL_ESTATE,
  });

  // Drives the live preview; useWatch re-renders only this subscription rather
  // than the whole form on every keystroke.
  const values = useWatch({ control: form.control }) as RealEstateFormValues;

  const onCreateMap = (map: google.maps.Map) => {
    map.addListener("click", (event: any) => setMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() }));

    if (marker) map.setCenter(marker);
  };

  const onSubmit = async (data: RealEstateFormValues) => {
    setSaveError(null);

    // The API requires a thumbnail; on edit the existing one is kept when no
    // new file is chosen.
    if (!isEdit && thumbnail.length === 0) {
      setSaveError("Selecione uma capa antes de salvar.");
      return;
    }

    setIsSaving(true);

    try {
      const payload = { ...data, address: { ...data.address, position: marker } };

      const formData = new FormData();
      formData.append("metadata", JSON.stringify(payload));

      if (thumbnail[0]) formData.append("thumbnail", thumbnail[0].file);
      images.forEach((image) => formData.append("images", image.file));

      const options = { headers: { "Content-Type": "multipart/form-data" } };

      if (isEdit) await apiService.put(`/real_estate/${realEstate!._id}`, formData, options);
      else await apiService.post("/real_estate", formData, options);

      router.push("/real_estate");
      router.refresh();
    } catch (error: any) {
      setSaveError(error?.response?.data?.message ?? "Não foi possível salvar o imóvel.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full w-full flex gap-[1.2rem]">
      <Form {...form}>
        <form
          id="real_estate_form"
          className="h-full min-w-0 grow flex flex-col gap-[1.2rem] overflow-y-auto pb-[1rem]"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Section step={1} title="Capa (thumbnail)" subtitle="Imagem principal exibida no card e na busca.">
            <div className="h-[42rem] w-full">
              {/* On edit the saved cover shows here until a new file replaces it. */}
              <Dropzone files={thumbnail} setFiles={setThumbnail} existing={realEstate?.thumbnail ? [realEstate.thumbnail] : []} />
            </div>
          </Section>

          <Section step={2} title="Detalhes">
            <div className="w-full flex flex-col gap-[1.6rem]">
              <InputField name="title" label="Título" placeholder="Sobrado no Centro de Cascavel" />

              <TextareaField name="description" label="Descrição" rows={9} placeholder="Sobrado com 214 m², suíte master com hidro, espaço gourmet e 3 vagas." />

              <TypePicker />

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[1.6rem]">
                <SegmentedField name="sale" label="Negociação" options={SALE_OPTIONS} />
                <InputField name="price" label="Preço" type="number" startIcon={<span className="text-[1.5rem] font-semibold">R$</span>} />
              </div>

              {/* Steppers, not plain number inputs: these four are nudged far
                  more often than typed. */}
              <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-[1.6rem]">
                <StepperField name="area" label="Área m²" step={10} />
                <StepperField name="rooms" label="Quartos" />
                <StepperField name="bathrooms" label="Banheiros" />
                <StepperField name="garages" label="Vagas" />
              </div>

              <div className="w-full flex items-center justify-between gap-[1.5rem] border border-border rounded-[1rem] px-[1.6rem] py-[1.4rem]">
                <SwitchField name="featured" label="Imóvel em destaque" description="Aparece primeiro na busca e na home" reverse />
              </div>

              <TagsField name="features" label="Características" placeholder="Ex: Suíte master com hidro" suggestions={FEATURE_SUGGESTIONS} />
            </div>
          </Section>

          <Section step={3} title="Localização">
            <div className="w-full flex flex-col gap-[1.6rem]">
              <div className="w-full grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-[1.6rem]">
                <InputField name="address.cep" label="CEP" placeholder="85800-001" />
                <InputField name="address.street" label="Rua" placeholder="Rua Santa Catarina" />
              </div>

              <div className="w-full grid grid-cols-2 md:grid-cols-[1fr_1fr_10rem_10rem] gap-[1.6rem]">
                <InputField name="address.district" label="Bairro" placeholder="Centro" />
                <InputField name="address.city" label="Cidade" placeholder="Cascavel" />
                <InputField name="address.state" label="Estado" placeholder="PR" />
                <InputField name="address.number" label="Nº" placeholder="1200" />
              </div>

              <InputField name="address.complement" label="Complemento" placeholder="Apto 302, bloco B" />

              <div className="w-full flex flex-col gap-[0.8rem]">
                <span className="text-[1.4rem] text-muted-foreground px-[0.4rem]">Posição no mapa</span>
                <div className="h-[72rem] w-full rounded-[1rem] overflow-hidden">
                  <GoogleMaps onCreateMap={onCreateMap} gestureHandling="cooperative">
                    {marker && <MarkerF position={marker} />}
                  </GoogleMaps>
                </div>
                <span className="text-[1.3rem] italic text-muted-foreground px-[0.4rem]">
                  {marker ? `Posição: ${marker.lat.toFixed(5)}, ${marker.lng.toFixed(5)}` : "Clique no mapa para marcar a posição do imóvel."}
                </span>
              </div>
            </div>
          </Section>

          <Section step={4} title="Galeria de imagens" subtitle="Fotos adicionais mostradas na página do imóvel.">
            <div className="h-[42rem] w-full">
              <Dropzone files={images} setFiles={setImages} multiple existing={realEstate?.images ?? []} />
            </div>
            {isEdit && (
              <span className="text-[1.3rem] italic text-muted-foreground mt-[0.8rem] block">
                Enviar novas imagens substitui a galeria atual ({realEstate?.images?.length ?? 0} imagens).
              </span>
            )}
          </Section>
        </form>
      </Form>

      {/* Preview — sticky beside the form so the broker sees the card taking
          shape without scrolling back up. */}
      <div className="h-full w-[38rem] shrink-0 flex flex-col">
        {/* Preview scrolls; the actions below never leave the viewport. */}
        <div className="min-h-0 grow flex flex-col gap-[1.2rem] overflow-y-auto">
          <span className="text-[1.4rem] text-muted-foreground px-[0.4rem]">Pré-visualização</span>

          {/* The same `preview` card both apps ship, fed from the live form
              values rather than a saved record. */}
          <RealEstateCard
            variant="preview"
            realEstate={{ ...(realEstate ?? {}), ...(values ?? EMPTY_REAL_ESTATE) } as RealEstate}
            thumbnail={thumbnail[0]?.preview ?? realEstate?.thumbnail}
          />
        </div>

        <div className="shrink-0 flex flex-col gap-[1rem] pt-[1.2rem] pb-[0.4rem]">
          {saveError && (
            <span className="text-[1.4rem] text-destructive text-center border border-destructive/40 rounded-[1rem] px-[1.2rem] py-[1rem]">{saveError}</span>
          )}

          {/* Outside <form>, so it needs the form attribute to submit it. */}
          <button
            type="submit"
            form="real_estate_form"
            disabled={isSaving}
            className="h-[5.4rem] w-full flex justify-center items-center gap-[1rem] rounded-[1rem] bg-primary text-white font-bold text-[1.7rem] disabled:opacity-60 cursor-pointer hover:opacity-90"
          >
            <MdOutlineSave size={20} />
            {isSaving ? "Salvando..." : "Salvar imóvel"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/real_estate")}
            className="h-[4.6rem] w-full flex justify-center items-center rounded-[1rem] border border-border text-[1.5rem] font-semibold cursor-pointer hover:bg-muted"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
