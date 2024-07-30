import { useCallback, useEffect } from "react";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { ADD_TEXT, dispatcher, loadFonts } from "@designcombo/core";
import { nanoid } from "nanoid";
import { DEFAULT_FONT, FONTS } from "@/data/fonts";

export const Texts = () => {
  const addItem = useCallback(
    async (url: string, fontFamily: string, text?: string) => {
      dispatcher?.dispatch(ADD_TEXT, {
        payload: {
          id: nanoid(),
          details: {
            text: text ?? "Heading",
            fontSize: 128,
            fontUrl: url,
            fontFamily: fontFamily,
            color: "#ffffff",
            wordWrap: "break-word",
            wordBreak: "break-all",
          },
        },
        options: {},
      });
    },
    []
  );

  return (
    <div className="flex flex-col h-full">
      <div className="text-md text-[#e4e4e7] font-medium h-11 border-b border-border flex items-center px-4 text-muted-foreground">
        Text
      </div>
      <ScrollArea>
        <div
          onClick={() => addItem(DEFAULT_FONT.url, DEFAULT_FONT.postScriptName)}
          className="flex w-full items-center justify-center"
        >
          <Label className="border-4 cursor-pointer rounded-xl p-3 m-3 font-bold text-[28px]">
            Add text
          </Label>
        </div>
        <div className="text-md mb-3 text-[#e4e4e7] px-4 font-medium flex items-center text-muted-foreground">
          Font Styles
        </div>
        <div className="grid grid-cols-1 gap-3 px-3 items-center justify-center">
          {FONTS.map(
            (font, i) =>
              font.fullName.includes("Regular") && (
                <img
                  onClick={() => addItem(font.url, font.postScriptName)}
                  className="border-4 h-10 p-1 bg-white cursor-pointer rounded-xl flex font-medium items-center justify-center "
                  key={i}
                  src={font.preview}
                  alt={font.fullName}
                />
              )
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
