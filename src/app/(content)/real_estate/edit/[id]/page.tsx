"use client";

// Next
import { useParams } from "next/navigation";

export default function Edit() {
  const { id } = useParams<{ id: string }>();

  return <div className="h-full w-full">Edit {id}</div>;
}
