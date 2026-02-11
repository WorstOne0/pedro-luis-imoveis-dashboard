import {
  MdSpaceDashboard,
  MdApartment,
  MdAnalytics,
  MdNotifications,
  MdOutlineSettings,
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

import type { IconType } from "react-icons";
const icons = {
  MdSpaceDashboard,
  MdApartment,
  MdAnalytics,
  MdNotifications,
  MdOutlineSettings,
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  FiLogOut,
};

export type IconName = keyof typeof icons;

export default function Icon({ name, ...props }: { name: IconName } & React.ComponentProps<IconType>) {
  const IconComponent = icons[name];
  return <IconComponent {...props} />;
}
