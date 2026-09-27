/* eslint-disable @next/next/no-img-element */
"use client";

// Next
import { useCallback, useId, useState } from "react";
import { useDropzone } from "react-dropzone";
import { filesize } from "filesize";
// Icons
import { MdOutlineCloudUpload, MdOutlineDelete } from "react-icons/md";

export type DropzoneFile = { file: File; size?: string; preview: string };

type DropzoneProps = {
  files: DropzoneFile[];
  setFiles: (files: DropzoneFile[]) => void;
  multiple?: boolean;
  text?: string;
  // Urls already saved on the record; with onRemoveExisting each can be dropped, without it they are read-only.
  existing?: string[];
  onRemoveExisting?: (url: string) => void;
  // Kept + new files. Must match the backend's gallery limit.
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
  const id = useId();
  const [rejected, setRejected] = useState(0);

  // Kept images count against the cap: the backend receives both in one write.
  const used = files.length + existing.length;
  const remaining = maxFiles === undefined ? Infinity : Math.max(maxFiles - used, 0);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length == 0) return;

      // Trim to what still fits instead of refusing the drop: 40 photos should add 30, not nothing.
      const room = maxFiles === undefined ? acceptedFiles.length : Math.max(maxFiles - (files.length + existing.length), 0);
      const accepted = acceptedFiles.slice(0, room);

      setRejected(acceptedFiles.length - accepted.length);
      if (accepted.length === 0) return;

      setFiles([...files, ...accepted.map((file) => ({ file, size: filesize(file.size), preview: URL.createObjectURL(file) }))]);
    },
    [setFiles, files, existing.length, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop, accept: { "image/*": [], "video/*": [] }, multiple });

  const removeFile = (index: number) => {
    if (!multiple) return setFiles([]);

    setFiles(files.filter((_, fileIndex) => fileIndex !== index));
  };

  const buildRemoveButton = (onClick: () => void, label?: string) => (
    <button
      type="button"
      onClick={onClick}
      className="h-[3rem] px-[0.8rem] flex items-center gap-[0.4rem] rounded-control bg-negative text-white text-[1.2rem] font-semibold absolute top-[0.8rem] right-[0.8rem] hover:opacity-90 cursor-pointer"
    >
      <MdOutlineDelete size={16} />
      {label}
    </button>
  );

  const buildDropTarget = (compact = false) => (
    <div className={compact ? "h-[9rem] w-full shrink-0" : "h-full w-full"} {...getRootProps({})}>
      <input {...getInputProps()} style={{ display: "none" }} type="file" />

      <div
        className={`h-full w-full flex flex-col items-center justify-center gap-[0.8rem] rounded-card border-2 border-dashed transition-colors
          ${isDragAccept ? "border-action bg-action-tint" : isDragReject ? "border-negative bg-negative-soft" : "border-line hover:border-action"}`}
      >
        {isDragActive && <span className="text-[1.5rem] font-semibold text-title">{isDragAccept ? "Pode soltar!" : "Arquivo inválido"}</span>}

        {!isDragActive && compact && (
          <span className="flex items-center gap-[1rem] text-[1.4rem] text-meta">
            <MdOutlineCloudUpload size={22} />
            Arraste mais arquivos ou clique para selecionar
          </span>
        )}

        {!isDragActive && !compact && (
          <>
            <MdOutlineCloudUpload size={44} className="text-soft" />
            <span className="text-[1.7rem] font-bold text-title">{text}</span>
            <span className="text-[1.3rem] text-meta">Fotos são redimensionadas automaticamente</span>
            <span className="text-[1.3rem] text-meta">JPEG, PNG, WebP, HEIC · vídeo MP4 ou MOV até 300MB</span>
            <label
              htmlFor={`fileUpload${id}`}
              className="h-[4.4rem] px-[2rem] mt-[1rem] flex items-center justify-center rounded-control bg-action text-[1.5rem] font-semibold text-on-action hover:bg-action-hover cursor-pointer"
            >
              Selecionar arquivo
            </label>
          </>
        )}
      </div>
    </div>
  );

  // Single file: the cover. A chosen file wins over the saved one.
  if (!multiple) {
    const preview = files[0]?.preview ?? existing[0];
    if (!preview) return buildDropTarget();

    return (
      <div className="h-full w-full rounded-card overflow-hidden relative">
        <img src={preview} alt="" className="h-full w-full object-cover" />

        {files[0] && buildRemoveButton(() => removeFile(0), "Remover")}

        {!files[0] && (
          <>
            <span className="h-[2.6rem] px-[0.8rem] flex items-center rounded-control bg-black/70 text-[1.2rem] font-semibold text-white absolute top-[0.8rem] left-[0.8rem]">Capa atual</span>

            <div className="w-full px-[1.2rem] py-[1rem] bg-black/60 absolute bottom-0 left-0 cursor-pointer" {...getRootProps({})}>
              <input {...getInputProps()} style={{ display: "none" }} type="file" />
              <span className="text-[1.3rem] text-white">Clique ou arraste um arquivo para substituir a capa</span>
            </div>
          </>
        )}
      </div>
    );
  }

  if (files.length === 0 && existing.length === 0) return buildDropTarget();

  return (
    <div className="h-full w-full flex flex-col gap-[1rem]">
      {/* Saved images first: the order they will be stored in, new uploads appended after. */}
      <div className="min-h-0 grow w-full grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] auto-rows-[14rem] gap-[1rem] overflow-y-auto scrollbar-thin">
        {existing.map((url) => (
          <div key={`existing_${url}`} className="rounded-card overflow-hidden relative">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <span className="h-[2.2rem] px-[0.6rem] flex items-center rounded-control bg-black/70 text-[1.1rem] font-semibold text-white absolute top-[0.6rem] left-[0.6rem]">Atual</span>
            {onRemoveExisting && buildRemoveButton(() => onRemoveExisting(url))}
          </div>
        ))}

        {files.map((file, index) => (
          <div key={`file_${index}`} className="rounded-card overflow-hidden relative">
            <img src={file.preview} alt="" className="h-full w-full object-cover" />
            {buildRemoveButton(() => removeFile(index))}
          </div>
        ))}
      </div>

      <div className="w-full flex items-center justify-between gap-[1rem] text-[1.3rem]">
        {maxFiles !== undefined && (
          <span className={`shrink-0 tabular-nums ${remaining === 0 ? "font-semibold text-negative" : "text-meta"}`}>
            {used} de {maxFiles} imagens
          </span>
        )}

        {rejected > 0 && (
          <span className="text-negative">
            {rejected === 1 ? "1 arquivo ignorado" : `${rejected} arquivos ignorados`} — limite de {maxFiles} imagens
          </span>
        )}
      </div>

      {remaining > 0 && buildDropTarget(true)}

      {remaining === 0 && (
        <div className="h-[9rem] w-full shrink-0 flex items-center justify-center rounded-card border-2 border-dashed border-line text-[1.4rem] text-meta">
          Limite de {maxFiles} imagens atingido — remova uma para adicionar outra
        </div>
      )}
    </div>
  );
}
