import { VIDEO } from "@/constants/constants";
import { ScrollArea } from "../ui/scroll-area";
import { useCallback } from "react";
import { ADD_VIDEO, dispatcher } from "@designcombo/core";
import { nanoid } from "nanoid";

export const Videos = () => {
  const addItem = useCallback(({ url, id }: { url: string; id: string }) => {
    dispatcher?.dispatch(ADD_VIDEO, {
      payload: {
        id: nanoid(),
        details: {
          src: url,
        },
        metadata: {
          resourceId: id,
        },
      },
      options: {},
    });
  }, []);

  return (
    <div>
      <div className="text-md text-[#e4e4e7] font-medium h-11 border-b border-border flex items-center px-4 text-muted-foreground">
        Videos
      </div>
      <ScrollArea>
        <div className="grid grid-cols-2 items-center gap-2 m-2">
          {VIDEO.map((video, index) => (
            <div
              onClick={() => addItem({ url: video.src, id: video.resourceId })}
              key={index}
              className="relative cursor-pointer w-full h-auto rounded-lg overflow-hidden"
            >
              <video src={video.src} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
