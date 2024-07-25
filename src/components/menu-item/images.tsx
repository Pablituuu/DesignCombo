import { useCallback } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ADD_IMAGE, dispatcher, useEditorState } from "@designcombo/core";
import { nanoid } from "nanoid";
import { IMAGES } from "@/data/images";

export const Images = () => {
  const addItem = useCallback((src: string) => {
    dispatcher?.dispatch(ADD_IMAGE, {
      payload: {
        id: nanoid(),
        details: {
          src: src,
        },
      },
      options: {},
    });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="text-md text-[#e4e4e7] font-medium h-11 border-b border-border flex items-center px-4 text-muted-foreground">
        Photos
      </div>
      <ScrollArea>
        <div className="grid grid-cols-2 items-center gap-2 m-2">
          {IMAGES.map((image, index) => (
            <div
              onClick={() => addItem(image.src)}
              key={index}
              className="relative cursor-pointer w-full h-auto rounded-lg overflow-hidden"
            >
              <img src={image.src} alt="image" />
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <div className="text-sm text-white bg-black opacity-50 rounded-lg px-2 py-1">
                  {image.width}x{image.height}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
