// Components
import { EmptyState } from "@/components";
// Icons
import { MdOutlineSettings } from "react-icons/md";

export default function Settings() {
  return (
    <div className="surface h-full w-full flex items-center justify-center">
      <EmptyState Icon={MdOutlineSettings} title="Em breve" subtitle="Preferências da conta e do site ficam aqui." />
    </div>
  );
}
