import { EDIT_OBJECT, dispatcher, useEditorState } from "@designcombo/core";
import { useCallback, useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { HexColorPicker } from "react-colorful";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  ALargeSmall,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  ChevronsUpDown,
  Italic,
  Underline,
  UnfoldVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { set, transform, upperCase } from "lodash";
import { Toggle } from "../ui/toggle";
import { ScrollArea } from "../ui/scroll-area";
import { Slider } from "../ui/slider";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface ITextProps {
  backgroundColor: string;
  border: string;
  color: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: string;
  fontWeight: string;
  height: number;
  letterSpacing: string;
  lineHeight: string;
  opacity: number;
  text: string;
  textAlign: string;
  textDecoration: string;
  textShadow: string;
  width: number;
  wordSpacing: string;
  transform: string;
}

const defaultProps = {
  backgroundColor: "transparent",
  border: "none",
  color: "#ffffff",
  fontFamily: "Roboto-Bold",
  fontSize: 64,
  fontStyle: "normal",
  fontWeight: "normal",
  height: 400,
  letterSpacing: "normal",
  lineHeight: "normal",
  opacity: 100,
  text: "Heading",
  textAlign: "left",
  textDecoration: "none",
  textShadow:
    "0px 0px 0px #ffffff, 0px 0px 0px #ffffff, 0px 0px 0px #ffffff, 0px 0px 0px #ffffff, 0px 0px 0px #ffffff",
  width: 500,
  wordSpacing: "normal",
  transform: "scale(1) rotate(0deg) translateX(0) translateY(0)",
};

const stringContent = [
  "fontFamily",
  "fontWeight",
  "fontStyle",
  "textAlign",
  "text",
  "backgroundColor",
  "color",
  "textShadow",
  "strokeColor",
  "textDecoration",
  "shadowColor",
];

const extractNumbersToTransform = (
  transformString: string
): {
  scale?: number;
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  rotate?: number;
} => {
  const regex = /(scale|translateX|translateY|translateZ|rotate)\(([^)]+)\)/g;
  let match;
  const transformations = {};
  while ((match = regex.exec(transformString)) !== null) {
    const transformType = match[1];
    const transformValue = match[2];
    if (transformType === "rotate") {
      transformations[transformType] = transformValue.replace("deg", "");
    } else {
      transformations[transformType] = transformValue;
    }
  }
  return transformations;
};

const extractNumbersToShadow = (
  shadowString: string
): {
  offsetX?: number;
  offsetY?: number;
  blur?: number;
  color?: string;
} => {
  const regex = /(-?\d+px) (-?\d+px) (\d+px) (#[0-9a-fA-F]{3,6})/;
  const match = shadowString.match(regex);
  if (match) {
    const [_, offsetX, offsetY, blurRadius, color] = match;
    return {
      offsetX: parseInt(offsetX, 10),
      offsetY: parseInt(offsetY, 10),
      blur: parseInt(blurRadius, 10),
      color: color,
    };
  } else {
    return null;
  }
};

const updateTransform = (
  transformString: string,
  transformationType: string,
  newValue: string | number
) => {
  const regex = new RegExp(`(${transformationType}\\([^\\)]+\\))`, "g");
  if (transformationType === "rotate") {
    return transformString.replace(
      regex,
      `${transformationType}(${newValue}deg)`
    );
  }
  return transformString.replace(regex, `${transformationType}(${newValue})`);
};

const TextProps = () => {
  const { activeIds, trackItemsMap } = useEditorState();
  const [scalePrev, setScalePrev] = useState<number | "">(100);
  const [isBackgroundTransparent, setIsBackgroundTransparent] = useState(true);
  const [props, setProps] = useState<ITextProps>(defaultProps);
  const [openFontFamily, setOpenFontFamily] = useState(false);
  const [openTextAlign, setOpenTextAlign] = useState(false);
  const [openTextDistance, setOpenTextDistance] = useState(false);
  const [openFontCase, setOpenFontCase] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#ffffff");
  const [openStrokeColor, setOpenStrokeColor] = useState(false);
  const [openTextColor, setOpenTextColor] = useState(false);
  const [openBackgroundColor, setOpenBackgroundColor] = useState(false);
  const [shadowColor, setShadowColor] = useState("#ffffff");
  const [openShadowColor, setOpenShadowColor] = useState(false);
  const [opacityPrev, setOpacityPrev] = useState<number | "">(100);
  const [shadowOffsetXPrev, setShadowOffsetXPrev] = useState<number | "">(0);
  const [shadowOffsetX, setShadowOffsetX] = useState<number | "">(0);
  const [shadowOffsetY, setShadowOffsetY] = useState<number | "">(0);
  const [shadowOffsetYPrev, setShadowOffsetYPrev] = useState<number | "">(0);
  const [shadowBlur, setShadowBlur] = useState<number | "">(0);
  const [shadowBlurPrev, setShadowBlurPrev] = useState<number | "">(0);
  const [strokeWidth, setStrokeWidth] = useState<number | "">(0);
  const [strokeWidthPrev, setStrokeWidthPrev] = useState<number | "">(0);
  const [rotatePrev, setRotatePrev] = useState<number | "">(0);
  const fontFamilyTypes = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
    {
      value: "Roboto-Bold",
      label: "Roboto-Bold",
    },
  ];
  const textAlignTypes = [
    { icon: <AlignLeft />, type: "left" },
    { icon: <AlignCenter />, type: "center" },
    { icon: <AlignRight />, type: "right" },
  ];
  const fontSizeTypes = [64, 72, 80, 96, 128, 144, 160, 192, 256, 288, 320];
  const fontCaseTypes = [
    "Lowercase",
    "Uppercase",
    // , "Sentence case"
  ];

  useEffect(() => {
    const [id] = activeIds;
    const trackItem = trackItemsMap[id];
    if (trackItem) {
      setProps({ ...(trackItem.details as ITextProps), ...defaultProps });
      setOpacityPrev(trackItem.details.opacity);
      trackItem.details.backgroundColor === "transparent"
        ? setIsBackgroundTransparent(true)
        : setIsBackgroundTransparent(false);
      const transform = extractNumbersToTransform(trackItem.details.transform);
      if (transform.scale) {
        setScalePrev(transform.scale * 100);
      }
      if (transform.rotate) {
        setRotatePrev(transform.rotate);
      }
      if (trackItem.details.textShadow) {
        let textShadow = defaultProps.textShadow;
        if (trackItem.details.textShadow !== "none")
          textShadow = trackItem.details.textShadow;
        const splitString = textShadow.split(", ");
        const propStroke = extractNumbersToShadow(splitString[1]);
        const propShadow = extractNumbersToShadow(splitString[4]);
        const strokeWidth = propStroke.offsetX;
        const strokeColor = propStroke.color;
        const shadowOffsetX = propShadow.offsetX;
        const shadowOffsetY = propShadow.offsetY;
        const shadowBlur = propShadow.blur;
        const shadowColor = propShadow.color;
        setStrokeWidth(strokeWidth);
        setStrokeWidthPrev(strokeWidth);
        setStrokeColor(strokeColor);
        setShadowOffsetX(shadowOffsetX);
        setShadowOffsetXPrev(shadowOffsetX);
        setShadowOffsetYPrev(shadowOffsetY);
        setShadowOffsetY(shadowOffsetY);
        setShadowBlur(shadowBlur);
        setShadowBlurPrev(shadowBlur);
        setShadowColor(shadowColor);
      }
    }
  }, []);

  const handleChange = useCallback(
    (type: string, e: string | number) => {
      if (!stringContent.includes(type)) {
        e = Number(e);
      }
      if (type === "opacity") {
        setOpacityPrev(Number(e));
      }
      if (type === "strokeWidth") {
        setStrokeWidth(Number(e));
        setStrokeWidthPrev(Number(e));
        type = "textShadow";
        e = `-${e}px -${e}px 0px ${strokeColor}, ${e}px -${e}px 0px ${strokeColor}, -${e}px ${e}px 0px ${strokeColor}, ${e}px ${e}px 0px ${strokeColor}, ${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}`;
      }
      if (type === "strokeColor") {
        setStrokeColor(String(e));
        type = "textShadow";
        e = `-${strokeWidth}px -${strokeWidth}px 0px ${e}, ${strokeWidth}px -${strokeWidth}px 0px ${e}, -${strokeWidth}px ${strokeWidth}px 0px ${e}, ${strokeWidth}px ${strokeWidth}px 0px ${e}, ${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}`;
      }
      if (type === "shadowOffsetX") {
        setShadowOffsetX(Number(e));
        setShadowOffsetXPrev(Number(e));
        type = "textShadow";
        e = `-${strokeWidth}px -${strokeWidth}px 0px ${strokeColor}, ${strokeWidth}px -${strokeWidth}px 0px ${strokeColor}, -${strokeWidth}px ${strokeWidth}px 0px ${strokeColor}, ${strokeWidth}px ${strokeWidth}px 0px ${strokeColor}, ${e}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}`;
      }
      if (type === "shadowOffsetY") {
        setShadowOffsetY(Number(e));
        setShadowOffsetYPrev(Number(e));
        type = "textShadow";
        e = `-${strokeWidth}px -${strokeWidth}px 0px ${strokeColor}, ${strokeWidth}px -${strokeWidth}px 0px ${strokeColor}, -${strokeWidth}px ${strokeWidth}px 0px ${strokeColor}, ${strokeWidth}px ${strokeWidth}px 0px ${strokeColor}, ${shadowOffsetX}px ${e}px ${shadowBlur}px ${shadowColor}`;
      }
      if (type === "shadowBlur") {
        setShadowBlur(Number(e));
        setShadowBlurPrev(Number(e));
        type = "textShadow";
        e = `-${strokeWidth}px -${strokeWidth}px 0px ${strokeColor}, ${strokeWidth}px -${strokeWidth}px 0px ${strokeColor}, -${strokeWidth}px ${strokeWidth}px 0px ${strokeColor}, ${strokeWidth}px ${strokeWidth}px 0px ${strokeColor}, ${shadowOffsetX}px ${shadowOffsetY}px ${e}px ${shadowColor}`;
      }
      if (type === "shadowColor") {
        setShadowColor(String(e));
        type = "textShadow";
        e = `-${strokeWidth}px -${strokeWidth}px 0px ${strokeColor}, ${strokeWidth}px -${strokeWidth}px 0px ${strokeColor}, -${strokeWidth}px ${strokeWidth}px 0px ${strokeColor}, ${strokeWidth}px ${strokeWidth}px 0px ${strokeColor}, ${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${e}`;
      }
      if (type === "transformScale") {
        setScalePrev(Number(e));
        type = "transform";
        e = updateTransform(props.transform, "scale", Number(e) / 100);
      }
      if (type === "transformRotate") {
        setRotatePrev(Number(e));
        type = "transform";
        e = updateTransform(props.transform, "rotate", Number(e));
      }
      dispatcher.dispatch(EDIT_OBJECT, {
        payload: {
          details: {
            [type]: e,
          },
        },
      });
      setProps({ ...props, [e]: e });
    },
    [
      props,
      strokeColor,
      strokeWidth,
      shadowOffsetX,
      shadowOffsetY,
      shadowBlur,
      shadowColor,
    ]
  );

  const validateString = useCallback((type: string, e: string) => {
    const regex = /^[0-9 ]*$/;
    if (regex.test(e)) {
      if (type === "opacity") {
        setOpacityPrev(e === "" ? "" : Number(e));
      }
      if (type === "strokeWidth") {
        setStrokeWidthPrev(e === "" ? "" : Number(e));
      }
      if (type === "shadowOffsetX") {
        setShadowOffsetXPrev(e === "" ? "" : Number(e));
      }
      if (type === "shadowOffsetY") {
        setShadowOffsetYPrev(e === "" ? "" : Number(e));
      }
      if (type === "shadowBlur") {
        setShadowBlurPrev(e === "" ? "" : Number(e));
      }
    }
  }, []);

  return (
    <div className="flex flex-col overflor-auto">
      <div className="text-md text-[#e4e4e7] font-medium h-11 border-b  border-border flex items-center px-4 text-muted-foreground">
        Properties
      </div>
      <div className="flex flex-col gap-2 p-4">
        <Textarea
          placeholder="Type your message here."
          defaultValue={props?.text}
          onBlur={(e) => handleChange("text", e.target.value)}
        />
        <div className="flex gap-2">
          <Popover open={openFontFamily} onOpenChange={setOpenFontFamily}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openFontFamily}
                className="w-[200px] justify-between"
              >
                {props?.fontFamily
                  ? fontFamilyTypes.find(
                      (framework) => framework.value === props?.fontFamily
                    )?.label
                  : "Select framework..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              style={{ zIndex: 300 }}
              className="flex w-[200px] p-0"
            >
              <Command>
                <CommandGroup>
                  <CommandList>
                    {fontFamilyTypes.map((fontFamilyType) => (
                      <CommandItem
                        key={fontFamilyType.value}
                        defaultValue={props?.fontFamily}
                        value={fontFamilyType.value}
                        onSelect={(currentValue) => {
                          setProps({ ...props, fontFamily: currentValue });
                          setOpenFontFamily(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            props?.fontFamily === fontFamilyType.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {fontFamilyType.label}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <Select onValueChange={(e) => handleChange("fontSize", e)}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={props.fontSize} />
            </SelectTrigger>
            <SelectContent
              style={{ zIndex: 300 }}
              className="flex w-[80px] p-0"
            >
              <SelectGroup>
                {fontSizeTypes.map((fontSize, i) => (
                  <SelectItem key={i} value={String(fontSize)}>
                    {fontSize}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-6">
          <Toggle
            onClick={() => handleChange("fontWeight", "bold")}
            size="sm"
            className="w-[45px]"
            variant="outline"
          >
            <Bold />
          </Toggle>
          <Toggle size="sm" className="w-[45px]" variant="outline">
            <Italic />
          </Toggle>
          <Toggle
            pressed={props?.textDecoration === "underline" ? true : false}
            onClick={() => handleChange("textDecoration", "underline")}
            size="sm"
            className="w-[45px]"
            variant="outline"
          >
            <Underline />
          </Toggle>
          <Popover open={openTextAlign} onOpenChange={setOpenTextAlign}>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                role="combobox"
                aria-expanded={openTextAlign}
                className="w-[45px] justify-between"
              >
                {props?.textAlign
                  ? textAlignTypes.find(
                      (textAlign) => textAlign.type === props?.textAlign
                    ).icon
                  : "Select Text Align..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent style={{ zIndex: 300 }} className="flex w-auto p-0">
              {textAlignTypes.map((textAlign, i) => (
                <Toggle
                  onClick={() => handleChange("textAlign", textAlign.type)}
                  pressed={props?.textAlign === textAlign.type ? true : false}
                  key={i}
                >
                  {textAlign.icon}
                </Toggle>
              ))}
            </PopoverContent>
          </Popover>
          <Popover open={openFontCase} onOpenChange={setOpenFontCase}>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                role="combobox"
                aria-expanded={openFontCase}
                className="w-[45px] justify-between"
              >
                <ALargeSmall />
              </Button>
            </PopoverTrigger>
            <PopoverContent style={{ zIndex: 300 }} className="flex w-auto p-0">
              <div className="flex flex-col">
                {fontCaseTypes.map((fontCase, i) => (
                  <Button
                    onClick={() =>
                      fontCase === "Lowercase"
                        ? handleChange("text", props?.text.toLowerCase())
                        : handleChange("text", props?.text.toUpperCase())
                    }
                    variant="ghost"
                    key={i}
                  >
                    {fontCase}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Popover open={openTextDistance} onOpenChange={setOpenTextDistance}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                size="sm"
                aria-expanded={openTextDistance}
                className="w-[45px] justify-between"
              >
                <UnfoldVertical />
              </Button>
            </PopoverTrigger>
            <PopoverContent style={{ zIndex: 300 }} className="flex w-auto p-0">
              <div className="flex flex-col">
                {fontCaseTypes.map((fontCase, i) => (
                  <Button variant="ghost" key={i}>
                    {fontCase}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-md text-[#e4e4e7] font-medium flex items-center text-muted-foreground">
            Text Color
          </div>
          <div className="flex justify-center">
            <Popover open={openTextColor} onOpenChange={setOpenTextColor}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openTextColor}
                  style={{ backgroundColor: props?.color }}
                  className="w-[40px] justify-between"
                />
              </PopoverTrigger>
              <PopoverContent
                style={{ zIndex: 300 }}
                className="flex w-auto p-3"
              >
                <HexColorPicker
                  color={props?.color}
                  onChange={(e) => handleChange("color", e)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-md text-[#e4e4e7] font-medium flex items-center text-muted-foreground">
            Stroke Color
          </div>
          <div className="flex justify-center">
            <Popover open={openStrokeColor} onOpenChange={setOpenStrokeColor}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openStrokeColor}
                  style={{ backgroundColor: strokeColor }}
                  className="w-[40px] justify-between"
                />
              </PopoverTrigger>
              <PopoverContent
                style={{ zIndex: 300 }}
                className="flex w-auto p-3 flex-col gap-3"
              >
                <HexColorPicker
                  color={strokeColor}
                  onChange={(e) => handleChange("strokeColor", e)}
                />

                <div className="flex flex-col gap-1">
                  <div className="text-md text-[#e4e4e7] font-medium h-11 flex items-center text-muted-foreground">
                    Stroke Width
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <div className="flex col-span-1 w-[60px]">
                      <Input
                        className="w-[100%]"
                        value={Math.round(Number(strokeWidthPrev))}
                        onChange={(e) =>
                          validateString("strokeWidth", e.target.value)
                        }
                        onBlur={() =>
                          handleChange("strokeWidth", strokeWidthPrev)
                        }
                        size="sm"
                      />
                    </div>
                    <div className="flex justify-center col-span-2">
                      <Slider
                        defaultValue={[
                          strokeWidthPrev === "" ? 0 : Number(strokeWidthPrev),
                        ]}
                        value={[
                          strokeWidthPrev === "" ? 0 : Number(strokeWidthPrev),
                        ]}
                        onValueChange={(e) => handleChange("strokeWidth", e[0])}
                        max={6}
                        min={0}
                        step={1}
                        className={cn("w-[60%]")}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-center ">
                  <Checkbox
                    checked={strokeWidth === 0 ? true : false}
                    onCheckedChange={() => handleChange("strokeWidth", 0)}
                  />
                  <Label>Remove Stroke</Label>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-md text-[#e4e4e7] font-medium flex items-center text-muted-foreground">
            Background Color
          </div>
          <div className="flex justify-center">
            <Popover
              open={openBackgroundColor}
              onOpenChange={setOpenBackgroundColor}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openBackgroundColor}
                  style={{ backgroundColor: props?.backgroundColor }}
                  className="w-[40px] justify-between"
                />
              </PopoverTrigger>
              <PopoverContent
                style={{ zIndex: 300 }}
                className="flex w-auto p-3 flex-col gap-3"
              >
                <HexColorPicker
                  color={props?.backgroundColor}
                  onChange={(e) => handleChange("backgroundColor", e)}
                />
                <div className="flex gap-2 items-center ">
                  <Checkbox
                    checked={isBackgroundTransparent}
                    onCheckedChange={(e) =>
                      handleChange(
                        "backgroundColor",
                        e ? "transparent" : "#000000"
                      )
                    }
                  />
                  <Label>Transparent Background</Label>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-md text-[#e4e4e7] font-medium flex items-center text-muted-foreground">
            Shadow Color
          </div>
          <div className="flex justify-center">
            <Popover open={openShadowColor} onOpenChange={setOpenShadowColor}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openShadowColor}
                  style={{ backgroundColor: shadowColor }}
                  className="w-[40px] justify-between"
                />
              </PopoverTrigger>
              <PopoverContent
                style={{ zIndex: 300 }}
                className="flex flex-col w-auto p-3"
              >
                <HexColorPicker
                  color={shadowColor}
                  onChange={(e) => handleChange("shadowColor", e)}
                />
                <div className="text-md text-[#e4e4e7] font-medium h-11 flex items-center text-muted-foreground">
                  Offset X
                </div>
                <div className="grid grid-cols-3 items-center">
                  <div className="flex col-span-1 w-[60px]">
                    <Input
                      value={shadowOffsetXPrev}
                      onChange={(e) =>
                        validateString("shadowOffsetX", e.target.value)
                      }
                      onBlur={() =>
                        handleChange("shadowOffsetX", shadowOffsetXPrev)
                      }
                      size="sm"
                    />
                  </div>
                  <div className="flex justify-center col-span-2">
                    <Slider
                      defaultValue={[
                        shadowOffsetXPrev === "" ? 0 : shadowOffsetXPrev,
                      ]}
                      value={[shadowOffsetXPrev === "" ? 0 : shadowOffsetXPrev]}
                      onValueChange={(e) => handleChange("shadowOffsetX", e[0])}
                      max={100}
                      min={-100}
                      step={1}
                      className={cn("w-[60%]")}
                    />
                  </div>
                </div>
                <div className="text-md text-[#e4e4e7] font-medium h-11 flex items-center text-muted-foreground">
                  Offset Y
                </div>
                <div className="grid grid-cols-3 items-center">
                  <div className="flex col-span-1 w-[60px]">
                    <Input
                      value={shadowOffsetYPrev}
                      onChange={(e) =>
                        validateString("shadowOffsetY", e.target.value)
                      }
                      onBlur={() =>
                        handleChange("shadowOffsetY", shadowOffsetYPrev)
                      }
                      size="sm"
                    />
                  </div>
                  <div className="flex justify-center col-span-2">
                    <Slider
                      defaultValue={[
                        shadowOffsetYPrev === "" ? 0 : shadowOffsetYPrev,
                      ]}
                      value={[shadowOffsetYPrev === "" ? 0 : shadowOffsetYPrev]}
                      onValueChange={(e) => handleChange("shadowOffsetY", e[0])}
                      max={100}
                      min={-100}
                      step={1}
                      className={cn("w-[60%]")}
                    />
                  </div>
                </div>
                <div className="text-md text-[#e4e4e7] font-medium h-11 flex items-center text-muted-foreground">
                  Blur
                </div>
                <div className="grid grid-cols-3 items-center">
                  <div className="flex col-span-1 w-[60px]">
                    <Input
                      value={shadowBlurPrev}
                      onChange={(e) =>
                        validateString("shadowBlur", e.target.value)
                      }
                      onBlur={() => handleChange("shadowBlur", shadowBlurPrev)}
                      size="sm"
                    />
                  </div>
                  <div className="flex justify-center col-span-2">
                    <Slider
                      defaultValue={[
                        shadowBlurPrev === "" ? 0 : shadowBlurPrev,
                      ]}
                      value={[shadowBlurPrev === "" ? 0 : shadowBlurPrev]}
                      onValueChange={(e) => handleChange("shadowBlur", e[0])}
                      max={100}
                      step={1}
                      className={cn("w-[60%]")}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="text-md text-[#e4e4e7] font-medium h-11 flex items-center text-muted-foreground">
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
              step={1}
              className={cn("w-[60%]")}
            />
          </div>
        </div>

        <div className="text-md text-[#e4e4e7] font-medium h-11 flex items-center text-muted-foreground">
          Scale
        </div>
        <div className="grid grid-cols-4 items-center mx-4">
          <div className="flex">
            <Input
              className="w-[100%]"
              value={Math.round(Number(scalePrev))}
              onChange={(e) => validateString("scale", e.target.value)}
              onBlur={() => handleChange("transformScale", scalePrev)}
              size="sm"
            />
          </div>
          <div className="flex justify-center col-span-3">
            <Slider
              defaultValue={[scalePrev === "" ? 0 : Number(scalePrev)]}
              value={[scalePrev === "" ? 0 : Number(scalePrev)]}
              onValueChange={(e) => handleChange("transformScale", e[0])}
              max={500}
              min={0}
              step={1}
              className={cn("w-[60%]")}
            />
          </div>
        </div>

        <div className="text-md text-[#e4e4e7] font-medium h-11 flex items-center text-muted-foreground">
          Rotate
        </div>
        <div className="grid grid-cols-4 items-center mx-4">
          <div className="flex">
            <Input
              className="w-[100%]"
              value={Math.round(Number(rotatePrev))}
              onChange={(e) => validateString("rotate", e.target.value)}
              onBlur={() => handleChange("transformRotate", rotatePrev)}
              size="sm"
            />
          </div>
          <div className="flex justify-center col-span-3">
            <Slider
              defaultValue={[rotatePrev === "" ? 0 : Number(rotatePrev)]}
              value={[rotatePrev === "" ? 0 : Number(rotatePrev)]}
              onValueChange={(e) => handleChange("transformRotate", e[0])}
              max={360}
              min={0}
              step={1}
              className={cn("w-[60%]")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextProps;
