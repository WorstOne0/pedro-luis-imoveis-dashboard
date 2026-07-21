/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { filesize } from "filesize";
//
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";

type DropzoneProps = {
  files: any[];
  setFiles: any;
  multiple?: boolean;
  text?: string;
  /**
   * Urls already saved on the record. Pass `onRemoveExisting` to let the broker
   * drop them individually; without it they are read-only.
   */
  existing?: string[];
  onRemoveExisting?: (url: string) => void;
  /** Cap on kept + new files. Must match the backend's gallery limit. */
  maxFiles?: number;
};

export default function Dropzone({
  files,
  setFiles,
  multiple = false,
  text = "Arraste e solte seu arquivo aqui para carregar",
  existing = [],
  onRemoveExisting,
  maxFiles,
}: DropzoneProps) {
  const id = React.useId();

  // Kept images count against the cap: the backend receives both in one write.
  const used = files.length + existing.length;
  const remaining = maxFiles === undefined ? Infinity : Math.max(maxFiles - used, 0);

  const [rejected, setRejected] = React.useState<number>(0);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length == 0) return;

      // Trim to what still fits rather than refusing the whole drop — dragging
      // 40 photos should add 30, not nothing.
      const room = maxFiles === undefined ? acceptedFiles.length : Math.max(maxFiles - (files.length + existing.length), 0);
      const accepted = acceptedFiles.slice(0, room);

      setRejected(acceptedFiles.length - accepted.length);
      if (accepted.length === 0) return;

      setFiles([
        ...files,
        ...accepted.map((file) => ({
          file,
          size: filesize(file.size),
          preview: URL.createObjectURL(file),
        })),
      ]);
    },
    [setFiles, files, existing.length, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
    multiple,
  });

  const removeFile = (index: number) => {
    if (!multiple) return setFiles([]);

    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const removeButton = (onClick: () => void, label?: string) => (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[0.6rem] bg-destructive text-white rounded-[0.8rem] px-[1rem] py-[0.5rem] absolute top-[0.8rem] right-[0.8rem] cursor-pointer hover:opacity-90"
    >
      <AiOutlineDelete size={16} />
      {label && <span className="text-[1.2rem]">{label}</span>}
    </button>
  );

  const dropTarget = (compact = false) => (
    <div className={compact ? "min-h-[9rem] h-[9rem] w-full" : "h-full w-full"} {...getRootProps({})}>
      <input {...getInputProps()} style={{ display: "none" }} type="file" />

      <div
        className={`h-full w-full flex flex-col items-center justify-center gap-[0.8rem] border-dashed border-2 rounded-[1rem] transition-colors
          ${isDragAccept ? "border-green-500 bg-green-500/5" : isDragReject ? "border-destructive bg-destructive/5" : "border-border hover:border-primary"}`}
      >
        {isDragActive ? (
          <span className="text-[1.6rem] font-semibold">{isDragAccept ? "Pode soltar!" : "Arquivo inválido"}</span>
        ) : compact ? (
          <div className="flex items-center gap-[1rem] text-muted-foreground">
            <AiOutlineCloudUpload size={24} />
            <span className="text-[1.5rem]">Arraste mais arquivos ou clique para selecionar</span>
          </div>
        ) : (
          <>
            <AiOutlineCloudUpload size={48} className="text-muted-foreground" />
            <span className="font-bold text-[1.8rem]">{text}</span>
            <span className="text-[1.3rem] text-muted-foreground">Fotos são redimensionadas automaticamente</span>
            <span className="text-[1.3rem] text-muted-foreground">JPEG, PNG, WebP, HEIC · vídeo MP4 ou MOV até 300MB</span>
            <label
              className="h-[4.4rem] w-[20rem] mt-[1rem] flex items-center justify-center bg-primary text-white rounded-[1rem] cursor-pointer text-[1.5rem]"
              htmlFor={`fileUpload${id}`}
            >
              Selecionar arquivo
            </label>
          </>
        )}
      </div>
    </div>
  );

  // Single file — the cover. A chosen file wins over whatever is saved.
  if (!multiple) {
    const preview = files[0]?.preview ?? existing[0];
    if (!preview) return dropTarget();

    return (
      <div className="h-full w-full rounded-[1rem] overflow-hidden relative">
        <img src={preview} alt="" className="h-full w-full object-cover object-center" />

        {files[0]
          ? removeButton(() => removeFile(0), "Remover")
          : <span className="text-[1.2rem] text-white bg-black/70 rounded-[0.6rem] px-[0.8rem] py-[0.4rem] absolute top-[0.8rem] left-[0.8rem]">Capa atual</span>}

        {!files[0] && (
          <div className="w-full bg-black/60 px-[1.2rem] py-[1rem] absolute bottom-0 left-0" {...getRootProps({})}>
            <input {...getInputProps()} style={{ display: "none" }} type="file" />
            <span className="text-[1.3rem] text-white cursor-pointer">Clique ou arraste um arquivo para substituir a capa</span>
          </div>
        )}
      </div>
    );
  }

  // Gallery.
  if (files.length > 0 || existing.length > 0) {
    return (
      <div className="h-full w-full flex flex-col gap-[1rem]">
        <div className="min-h-0 grow w-full grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] auto-rows-[14rem] gap-[1rem] overflow-y-auto">
          {/* Saved images first, so the gallery reads in the order it will be
              stored: kept images, then the new ones appended after them. */}
          {existing.map((url) => (
            <div key={`existing_${url}`} className="rounded-[1rem] overflow-hidden relative">
              <img src={url} alt="" className="h-full w-full object-cover object-center" />
              <span className="text-[1.1rem] text-white bg-black/70 rounded-[0.5rem] px-[0.6rem] py-[0.2rem] absolute top-[0.6rem] left-[0.6rem]">Atual</span>
              {onRemoveExisting && removeButton(() => onRemoveExisting(url))}
            </div>
          ))}

          {files.map((file, index) => (
            <div key={`file_${index}`} className="rounded-[1rem] overflow-hidden relative">
              <img src={file.preview} alt="" className="h-full w-full object-cover object-center" />
              {removeButton(() => removeFile(index))}
            </div>
          ))}
        </div>

        <div className="w-full flex items-center justify-between gap-[1rem]">
          {maxFiles !== undefined && (
            <span className={`text-[1.3rem] shrink-0 ${remaining === 0 ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
              {used} de {maxFiles} imagens
            </span>
          )}

          {rejected > 0 && (
            <span className="text-[1.3rem] text-destructive">
              {rejected === 1 ? "1 arquivo ignorado" : `${rejected} arquivos ignorados`} — limite de {maxFiles} imagens
            </span>
          )}
        </div>

        {remaining > 0 ? (
          dropTarget(true)
        ) : (
          <div className="min-h-[9rem] h-[9rem] w-full flex items-center justify-center border-dashed border-2 border-border rounded-[1rem] text-[1.4rem] text-muted-foreground">
            Limite de {maxFiles} imagens atingido — remova uma para adicionar outra
          </div>
        )}
      </div>
    );
  }

  return dropTarget();
}
