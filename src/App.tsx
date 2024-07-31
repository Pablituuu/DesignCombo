import {
  Timeline,
  Provider,
  Scene,
  useEditorState,
  dispatcher,
  DESIGN_RESIZE,
} from "@designcombo/core";
import MenuList from "./components/menu-list";
import { MenuItem } from "./components/menu-item";
import { useCallback, useEffect } from "react";
import useDataState from "./store/use-data-state";
import { getCompactFontData } from "./utils/fonts";
import { FONTS } from "./data/fonts";
import { Button } from "./components/ui/button";
import ControlItem from "./components/control-item/item";
import { ToolboxlItem } from "./components/toolbox-item";
import { nanoid } from "nanoid";
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { Icons } from "./components/shared/icons";
interface ResizeOptionProps {
  label: string;
  icon: string;
  value: ResizeValue;
}
interface ResizeValue {
  width: number;
  height: number;
  name: string;
}

const RESIZE_OPTIONS: ResizeOptionProps[] = [
  {
    label: "16:9",
    icon: "landscape",
    value: {
      width: 1920,
      height: 1080,
      name: "16:9",
    },
  },
  {
    label: "9:16",
    icon: "portrait",
    value: {
      width: 1080,
      height: 1920,
      name: "9:16",
    },
  },
  {
    label: "1:1",
    icon: "square",
    value: {
      width: 1080,
      height: 1080,
      name: "1:1",
    },
  },
];

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
  const {
    sceneSize,
    fps,
    duration,
    trackItemIds,
    trackItemsMap,
    transitionIds,
    transitionsMap,
  } = useEditorState();

  useEffect(() => {
    setCompactFonts(getCompactFontData(FONTS));
    setFonts(FONTS);
  }, []);

  const exportProject = useCallback(async () => {
    {
      const json = {
        id: nanoid(),
        projectId: "pablituuu",
        size: sceneSize,
        fps,
        duration,
        trackItemIds,
        trackItemsMap,
        transitionIds,
        transitionsMap,
      };
      const response = await axios.post(`https://api.x-eight.xyz/`, json);
      const id = response.data.render.id;
      let resolve = false;
      do {
        const status = await axios.get(`https://api.x-eight.xyz/${id}/status`);
        if (status.data.render.progress === 100) {
          resolve = true;
        }
      } while (!resolve);
      const videoURL = await fetch(response.data.render.url);
      const blob = await videoURL.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "video.mp4");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  }, [
    trackItemIds,
    trackItemsMap,
    transitionIds,
    transitionsMap,
    sceneSize,
    fps,
    duration,
  ]);

  const handleResize = (payload: ResizeValue) => {
    dispatcher.dispatch(DESIGN_RESIZE, {
      payload,
    });
  };

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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Resize</Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 z-[250]">
              <div className="grid gap-4 text-sm">
                {RESIZE_OPTIONS.map((option, index) => (
                  <ResizeOption
                    key={index}
                    label={option.label}
                    icon={option.icon}
                    value={option.value}
                    handleResize={handleResize}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Button size="sm" onClick={exportProject} variant="secondary">
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

const ResizeOption = ({
  label,
  icon,
  value,
  handleResize,
}: ResizeOptionProps & { handleResize: (payload: ResizeValue) => void }) => {
  const Icon = Icons[icon];
  return (
    <div
      onClick={() => handleResize(value)}
      className="flex items-center gap-4 hover:bg-zinc-50/10 cursor-pointer"
    >
      <div className="text-muted-foreground">
        <Icon />
      </div>
      <div>
        <div>{label}</div>
        <div className="text-muted-foreground">Tiktok, Instagram</div>
      </div>
    </div>
  );
};

export default App;
