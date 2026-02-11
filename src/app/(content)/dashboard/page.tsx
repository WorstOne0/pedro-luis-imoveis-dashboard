"use client";

export default function Dashboard() {
  return (
    <div className="h-full w-full flex flex-col p-[1rem] gap-[1rem]">
      <div className="h-[20rem] w-full flex rounded-[0.8rem] bg-primary"></div>
      <div className="min-h-0 grow w-full flex gap-[1rem]">
        <div className="h-full w-[75%] flex flex-col gap-[1rem]">
          <div className="h-[50%] w-full flex rounded-[0.8rem] bg-primary"></div>
          <div className="h-[50%] w-full flex rounded-[0.8rem] bg-primary"></div>
        </div>
        <div className="h-full w-[25%] flex flex-col rounded-[0.8rem] bg-primary"></div>
      </div>
    </div>
  );
}
