"use client";

// Components
import { NavBar, PageHeader, SearchModal } from "@/components";
// Services
import { MapProvider, AuthGuard } from "@/services";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      {/* Fixed app shell on --surface: the sidebar and header stay put and only
          the content pane scrolls. */}
      <div className="h-full w-full flex gap-[0.8rem] bg-surface p-[0.8rem]">
        <NavBar />

        <div className="h-full min-w-0 grow flex flex-col pt-[0.6rem]">
          <PageHeader />

          <div className="min-h-0 min-w-0 grow">
            <MapProvider>{children}</MapProvider>
          </div>
        </div>

        <SearchModal />
      </div>
    </AuthGuard>
  );
}
