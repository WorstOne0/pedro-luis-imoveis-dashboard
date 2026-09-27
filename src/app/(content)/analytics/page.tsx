// Components
import { EmptyState } from "@/components";
// Icons
import { MdOutlineAnalytics } from "react-icons/md";

export default function Analytics() {
  return (
    <div className="surface h-full w-full flex items-center justify-center">
      <EmptyState Icon={MdOutlineAnalytics} title="Em breve" subtitle="Acessos e contatos por imóvel aparecem aqui quando o site começar a registrá-los." />
    </div>
  );
}
