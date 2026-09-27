// Components
import { EmptyState } from "@/components";
// Icons
import { MdOutlineNotifications } from "react-icons/md";

export default function Notifications() {
  return (
    <div className="surface h-full w-full flex items-center justify-center">
      <EmptyState Icon={MdOutlineNotifications} title="Nenhuma notificação" subtitle="Avisos sobre os imóveis e contatos recebidos aparecem aqui." />
    </div>
  );
}
