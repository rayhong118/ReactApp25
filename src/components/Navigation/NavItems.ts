import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faGift,
  faImage,
  faUserGroup,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";

export interface NavItemProps {
  label: string;
  to: string;
  icon?: IconProp;
  nested?: boolean;
  onClick?: () => void;
}

export const mainNavItems: NavItemProps[] = [
  { label: "navbar.eat", to: "/eat", icon: faUtensils },
  { label: "navbar.drawings", to: "/drawings", icon: faImage },
  { label: "navbar.gifts", to: "/gifts", icon: faGift },
  { label: "navbar.friends", to: "/friends", icon: faUserGroup },
];

export const experimentsNavItems: NavItemProps[] = [
  { label: "navbar.lab.formValidation", to: "/experiments/formValidation" },
  { label: "navbar.lab.moveLists", to: "/experiments/moveLists" },
  { label: "navbar.lab.stopWatch", to: "/experiments/stopWatch" },
  { label: "navbar.lab.imageCarousels", to: "/experiments/imageCarousels" },
  { label: "navbar.lab.fileUpload", to: "/experiments/fileUpload" },
  {
    label: "navbar.lab.calendarEventGenerator",
    to: "/experiments/calendarEventGenerator",
  },
  { label: "navbar.lab.ticTacToe", to: "/experiments/ticTacToe" },
];
