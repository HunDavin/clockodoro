import clockIcon from "./assets/Clock.png";
import coffeeIcon from "./assets/Coffee-white.png";
import restIcon from "./assets/rest.png";

export const modes = [
  {
    id: 1,
    mode: "Focus",
    btnColor: "#FF5C5C",
    icon: clockIcon,
    minutes: 25,
    background: "#FFF3E2"
  },
  {
    id: 2,
    mode: "Short Break",
    btnColor: "#7684FF",
    icon: coffeeIcon,
    minutes: 5,
    background: "#7684FF"
  },
  {
    id: 3,
    mode: "Long Break",
    btnColor: "#28282D",
    icon: restIcon,
    minutes: 30,
    background: "#696A74"
  }
];