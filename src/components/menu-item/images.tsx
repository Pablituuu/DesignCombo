import { useCallback } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ADD_IMAGE, dispatcher, useEditorState } from "@designcombo/core";
import { nanoid } from "nanoid";

export const Images = () => {
  const images = [
    {
      src: "https://ik.imagekit.io/pablituuu/resizeCat.jpg?updatedAt=1710991625522",
      width: 360,
      height: 550,
    },
    {
      src: "https://ik.imagekit.io/cliqdev/e/1/images/bki6ow7w-pexels-andrea-piacquadio-3811855.jpg?tr=q-60",
      width: 1024,
      height: 1024,
    },
    {
      src: "https://ik.imagekit.io/pablituuu/bmw-gs.jpg?updatedAt=1708469797613",
      width: 1024,
      height: 1024,
    },
  ];

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
          {images.map((image, index) => (
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
