"use client";

// Components
import { Breadcrumb, NavBar, NavBarItems, SearchModal } from "@/components";
// Services
import { MapProvider, AuthGuard } from "@/services";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className={`h-full w-full flex relative`}>
        <NavBar />

        <div className="h-full min-w-0 grow flex flex-col">
          <div className="min-h-[6rem] h-[6rem] w-full flex border-b-[0.1rem] border-gray-300">
            <div className="min-w-0 grow">
              <Breadcrumb />
            </div>

            <NavBarItems />
          </div>

          <div className="min-h-0 min-w-0 grow">
            <MapProvider>{children}</MapProvider>
          </div>
        </div>

        <SearchModal />
      </div>
    </AuthGuard>
  );
}
