import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Slider } from "../ui/slider";
import { EDIT_OBJECT, dispatcher, useEditorState } from "@designcombo/core";
import { useCallback, useEffect, useState } from "react";

const defaultProps = {
  border: "none",
  borderRadius: "0",
  boxShadow: "none",
  filter: "saturate(100%) brightness(100%) contrast(100%) hue-rotate(0deg)",
  height: 550,
  opacity: 100,
  preview: "",
  src: "https://ik.imagekit.io/pablituuu/resizeCat.jpg?updatedAt=1710991625522",
  transform: "translate(780px, 265px) scale(1.9636363636363636)",
};

function extractValues(filters: string) {
  const regex = {
    saturate: /saturate\((\d+)%\)/,
    brightness: /brightness\((\d+)%\)/,
    contrast: /contrast\((\d+)%\)/,
    hueRotate: /hue-rotate\((\d+)deg\)/,
  };

  const resultados = {
    saturate: parseInt(filters.match(regex.saturate)?.[1], 10) ?? 100,
    brightness: parseInt(filters.match(regex.brightness)?.[1], 10) ?? 100,
    contrast: parseInt(filters.match(regex.contrast)?.[1], 10) ?? 100,
    hueRotate: parseInt(filters.match(regex.hueRotate)?.[1], 10) ?? 0,
  };

  return resultados;
}

interface IImageProps {
  border: string;
  borderRadius: string;
  boxShadow: string;
  filter: string;
  height: number;
  opacity: number;
  preview: string;
  src: string;
  transform: string;
}

export default function ImageProps() {
  const { activeIds, trackItemsMap } = useEditorState();
  const [saturatePrev, setSaturatePrev] = useState<number | "">(100);
  const [hueRotatePrev, setHueRotatePrev] = useState<number | "">(0);
  const [brightnessPrev, setBrightnessPrev] = useState<number | "">(100);
  const [constrastPrev, setConstrastPrev] = useState<number | "">(100);
  const [opacityPrev, setOpacityPrev] = useState<number | "">(100);

  useEffect(() => {
    const [id] = activeIds;
    const trackItem = trackItemsMap[id];
    if (trackItem) {
      let filters = trackItem.details.filter;
      if (!filters) filters = defaultProps.filter;
      const currentFilters = extractValues(filters);
      if (currentFilters.saturate) setSaturatePrev(currentFilters.saturate);
      if (currentFilters.hueRotate) setHueRotatePrev(currentFilters.hueRotate);
      if (currentFilters.brightness)
        setBrightnessPrev(currentFilters.brightness);
      if (currentFilters.contrast) setConstrastPrev(currentFilters.contrast);
    }
  }, []);

  const validateString = useCallback((type: string, e: string) => {
    const regex = /^[0-9 ]*$/;
    if (regex.test(e)) {
      if (type === "saturate") {
        setSaturatePrev(e === "" ? "" : Number(e));
      }
      if (type === "hueRotate") {
        setHueRotatePrev(e === "" ? "" : Number(e));
      }
      if (type === "brightness") {
        setBrightnessPrev(e === "" ? "" : Number(e));
      }
      if (type === "contrast") {
        setConstrastPrev(e === "" ? "" : Number(e));
      }
      if (type === "opacity") {
        setOpacityPrev(e === "" ? "" : Number(e));
      }
    }
  }, []);

  const handleChange = useCallback(
    (type: string, e: string | number) => {
      if (type === "saturate") {
        setSaturatePrev(Number(e));
        type = "filter";
        e = `saturate(${e}%) hue-rotate(${hueRotatePrev}deg) brightness(${brightnessPrev}%) contrast(${constrastPrev}%)`;
      }
      if (type === "hueRotate") {
        setHueRotatePrev(Number(e));
        type = "filter";
        e = `saturate(${saturatePrev}%) hue-rotate(${e}deg) brightness(${brightnessPrev}%) contrast(${constrastPrev}%)`;
      }
      if (type === "brightness") {
        setBrightnessPrev(Number(e));
        type = "filter";
        e = `saturate(${saturatePrev}%) hue-rotate(${hueRotatePrev}deg) brightness(${e}%) contrast(${constrastPrev}%)`;
      }
      if (type === "contrast") {
        setConstrastPrev(Number(e));
        type = "filter";
        e = `saturate(${saturatePrev}%) hue-rotate(${hueRotatePrev}deg) brightness(${brightnessPrev}%) contrast(${e}%)`;
      }
      if (type === "opacity") {
        setOpacityPrev(Number(e));
      }
      dispatcher.dispatch(EDIT_OBJECT, {
        payload: {
          details: {
            [type]: e,
          },
        },
      });
    },
    [saturatePrev, hueRotatePrev, brightnessPrev, constrastPrev]
  );

  return (
    <div className="flex flex-col overflor-auto">
      <div className="text-md text-[#e4e4e7] font-medium h-11 border-b  border-border flex items-center px-4 text-muted-foreground">
        Properties
      </div>
      <div className="text-md text-[#e4e4e7] font-medium h-11 flex items-center px-4 text-muted-foreground">
        Saturation
      </div>
      <div className="grid grid-cols-4 items-center mx-4">
        <div className="flex">
          <Input
            value={saturatePrev}
            onChange={(e) => validateString("saturate", e.target.value)}
            onBlur={() => handleChange("saturate", saturatePrev)}
            size="sm"
          />
        </div>
        <div className="flex justify-center col-span-3">
          <Slider
            defaultValue={[saturatePrev === "" ? 0 : Number(saturatePrev)]}
            value={[saturatePrev === "" ? 0 : Number(saturatePrev)]}
            onValueChange={(e) => handleChange("saturate", e[0])}
            max={200}
            min={0}
            step={1}
            className={cn("w-[60%]")}
          />
        </div>
      </div>

      <div className="text-md text-[#e4e4e7] font-medium h-11 flex items-center px-4 text-muted-foreground">
        Temperature
      </div>
      <div className="grid grid-cols-4 items-center mx-4">
        <div className="flex">
          <Input
            value={hueRotatePrev}
            onChange={(e) => validateString("hueRotate", e.target.value)}
            onBlur={() => handleChange("hueRotate", hueRotatePrev)}
            size="sm"
          />
        </div>
        <div className="flex justify-center col-span-3">
          <Slider
            defaultValue={[hueRotatePrev === "" ? 0 : Number(hueRotatePrev)]}
            value={[hueRotatePrev === "" ? 0 : Number(hueRotatePrev)]}
            onValueChange={(e) => handleChange("hueRotate", e[0])}
            max={360}
            min={0}
            step={1}
            className={cn("w-[60%]")}
          />
        </div>
      </div>

      <div className="text-md text-[#e4e4e7] font-medium h-11 flex items-center px-4 text-muted-foreground">
        Brillights
      </div>
      <div className="grid grid-cols-4 items-center mx-4">
        <div className="flex">
          <Input
            value={brightnessPrev}
            onChange={(e) => validateString("brightness", e.target.value)}
            onBlur={() => handleChange("brightness", brightnessPrev)}
            size="sm"
          />
        </div>
        <div className="flex justify-center col-span-3">
          <Slider
            defaultValue={[brightnessPrev === "" ? 0 : Number(brightnessPrev)]}
            value={[brightnessPrev === "" ? 0 : Number(brightnessPrev)]}
            onValueChange={(e) => handleChange("brightness", e[0])}
            max={200}
            min={0}
            step={1}
            className={cn("w-[60%]")}
          />
        </div>
      </div>

      <div className="text-md text-[#e4e4e7] font-medium h-11 flex items-center px-4 text-muted-foreground">
        Contrast
      </div>
      <div className="grid grid-cols-4 items-center mx-4">
        <div className="flex">
          <Input
            value={constrastPrev}
            onChange={(e) => validateString("contrast", e.target.value)}
            onBlur={() => handleChange("contrast", constrastPrev)}
            size="sm"
          />
        </div>
        <div className="flex justify-center col-span-3">
          <Slider
            defaultValue={[constrastPrev === "" ? 0 : Number(constrastPrev)]}
            value={[constrastPrev === "" ? 0 : Number(constrastPrev)]}
            onValueChange={(e) => handleChange("contrast", e[0])}
            max={200}
            min={0}
            step={1}
            className={cn("w-[60%]")}
          />
        </div>
      </div>

      <div className="text-md text-[#e4e4e7] font-medium h-11 flex items-center px-4 text-muted-foreground">
        Opacity
      </div>
      <div className="grid grid-cols-4 items-center mx-4">
        <div className="flex">
          <Input
            className="w-[100%]"
            value={opacityPrev}
            onChange={(e) => validateString("opacity", e.target.value)}
            onBlur={() => handleChange("opacity", opacityPrev)}
            size="sm"
          />
        </div>
        <div className="flex justify-center col-span-3">
          <Slider
            defaultValue={[opacityPrev === "" ? 0 : Number(opacityPrev)]}
            value={[opacityPrev === "" ? 0 : Number(opacityPrev)]}
            onValueChange={(e) => handleChange("opacity", e[0])}
            max={100}
            min={1}
            step={1}
            className={cn("w-[60%]")}
          />
        </div>
      </div>
    </div>
  );
}
