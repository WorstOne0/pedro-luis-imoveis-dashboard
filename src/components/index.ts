// Global components only — anything used by a single feature belongs in that
// feature's _components folder (see app/(content)/real_estate/_components).

// Layout / chrome
import NavBar from "./nav_bar";
import NavBarItems from "./nav_bar_items";
import PageHeader from "./page_header";
import Modal from "./modal";
import SearchModal from "./search_modal";
import Icon from "./icon";
import Pagination from "./pagination";
// Maps
import GoogleMaps from "./google_maps";
import DistrictPolygons from "./district_polygons";
// Form fields
import FieldWrapper from "./field_wrapper";
import InputField from "./input_field";
import SelectField from "./select_field";
import SelectPlain from "./select_plain";
import TextareaField from "./textarea_field";
import SwitchField from "./switch_field";
import StepperField from "./stepper_field";
import TagsField from "./tags_field";
import Dropzone from "./dropzone";
// SVGS
import ApartamentSVG from "./svgs/apartament";
import HouseSVG from "./svgs/house";
import LandSVG from "./svgs/land";
import ShopSVG from "./svgs/shop";
import SobradoSVG from "./svgs/sobrado";
// Shadcn
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle } from "./ui/chart";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

export {
  // Layout / chrome
  NavBar,
  NavBarItems,
  PageHeader,
  Modal,
  SearchModal,
  Icon,
  Pagination,
  // Maps
  GoogleMaps,
  DistrictPolygons,
  // Form fields
  FieldWrapper,
  InputField,
  SelectField,
  SelectPlain,
  TextareaField,
  SwitchField,
  StepperField,
  TagsField,
  Dropzone,
  // SVGS
  ApartamentSVG,
  HouseSVG,
  LandSVG,
  ShopSVG,
  SobradoSVG,
  // Shadcn
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  Input,
  Textarea,
  Slider,
  Switch,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Checkbox,
};
