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
   * Urls already saved on the record. Shown so the broker can see what is there
   * before deciding to replace it. They are not editable individually: the API
   * replaces the whole gallery on write, so removing one image here would be a
   * promise the backend cannot keep.
   */
  existing?: string[];
};

export default function Dropzone({ files, setFiles, multiple = false, text = "Arraste e solte seu arquivo aqui para carregar", existing = [] }: DropzoneProps) {
  const id = React.useId();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length == 0) return;

      setFiles([
        ...files,
        ...acceptedFiles.map((file) => ({
          file,
          size: filesize(file.size),
          preview: URL.createObjectURL(file),
        })),
      ]);
    },
    [setFiles, files]
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
          {files.map((file, index) => (
            <div key={`file_${index}`} className="rounded-[1rem] overflow-hidden relative">
              <img src={file.preview} alt="" className="h-full w-full object-cover object-center" />
              {removeButton(() => removeFile(index))}
            </div>
          ))}

          {/* Saved images stay visible until new ones are chosen, since sending
              any replaces the whole gallery. */}
          {files.length === 0 &&
            existing.map((url, index) => (
              <div key={`existing_${index}`} className="rounded-[1rem] overflow-hidden relative">
                <img src={url} alt="" className="h-full w-full object-cover object-center" />
                <span className="text-[1.1rem] text-white bg-black/70 rounded-[0.5rem] px-[0.6rem] py-[0.2rem] absolute top-[0.6rem] left-[0.6rem]">Atual</span>
              </div>
            ))}
        </div>

        {dropTarget(true)}
      </div>
    );
  }

  return dropTarget();
}
