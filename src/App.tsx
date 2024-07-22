import { Timeline, Provider, Scene, useEditorState } from "@designcombo/core";
import MenuList from "./components/menu-list";
import { MenuItem } from "./components/menu-item";
import { useEffect } from "react";
import useDataState from "./store/use-data-state";
import { getCompactFontData } from "./utils/fonts";
import { FONTS } from "./data/fonts";
import { Button } from "./components/ui/button";
import ControlItem from "./components/control-item/item";
import { ToolboxlItem } from "./components/toolbox-item";

export const theme = {
  colors: {
    gray: {
      50: "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
      300: "#d4d4d8",
      400: "#a1a1aa",
      500: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b",
      950: "#09090b",
      1000: "#040405",
      1100: "#010101",
    },
  },
};

function App() {
  const { setCompactFonts, setFonts } = useDataState();

  useEffect(() => {
    setCompactFonts(getCompactFontData(FONTS));
    setFonts(FONTS);
  }, []);

  return (
    <Provider theme={theme}>
      <div className="h-screen w-screen flex flex-col">
        {/* <Navbar /> */}
        <div className="h-14  border-b border-border flex items-center justify-between px-2">
          <Button size="icon" variant="ghost">
            <svg
              width="20"
              height="20"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11ZM11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0ZM11 15C13.2091 15 15 13.2091 15 11C15 8.79086 13.2091 7 11 7C8.79086 7 7 8.79086 7 11C7 13.2091 8.79086 15 11 15Z"
                fill="white"
              />
            </svg>
          </Button>
          <Button size="sm" variant="secondary">
            Export
          </Button>
        </div>
        <div className="flex-1 relative overflow-hidden">
          <MenuList />
          <MenuItem />
          <ControlItem />
          <ToolboxlItem />
          <Scene />
        </div>
        <div className="h-80 flex" style={{ zIndex: 201 }}>
          <Timeline />
        </div>
      </div>
    </Provider>
  );
}

export default App;
