import clock from "./assets/Clock.png";
import coffeeWhite from "./assets/Coffee-white.png";
import rest from "./assets/rest.png";

export const modes = [
  {
    id: 1,
    mode: "Focus",
    btnColor: "#FF5C5C",
    icon: clock,
    background: "#FFF3E2"
  },
  {
    id: 2,
    mode: "Short Break",
    btnColor: "#7684FF",
    icon: coffeeWhite,
    background: "#7684FF"
  },
  {
    id: 3,
    mode: "Long Break",
    btnColor: "#28282D",
    icon: rest,
    background: "#696A74"
  }
];