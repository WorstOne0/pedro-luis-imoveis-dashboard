"use client";

// Components
import AuthGuard from "./_components/auth_guard";
import NavBar from "./_components/nav_bar";
import PageHeader from "./_components/page_header";
import SearchModal from "./_components/search_modal";

// A fixed shell: the sidebar and the header stay put and only the content pane scrolls.
export default function ContentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuard>
      <div className="h-full w-full p-[1rem] flex gap-[1rem] bg-background">
        <NavBar />

        <div className="h-full min-w-0 grow flex flex-col">
          <PageHeader />

          <div className="min-h-0 min-w-0 grow">{children}</div>
        </div>

        <SearchModal />
      </div>
    </AuthGuard>
  );
}
