import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ADD_AUDIO, dispatcher } from "@designcombo/core";
import { nanoid } from "nanoid";
import { ScrollArea } from "../ui/scroll-area";

export const Audios = () => {
  const [tracks, setTracks] = useState([]);
  const [query, setQuery] = useState("rock");
  const [page, setPage] = useState(1);
  const API_KEY = "9ad97885";

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get(
          `https://api.jamendo.com/v3.0/tracks?client_id=${API_KEY}&search=${query}&limit=20&page=${page}`
        );
        setTracks(response.data.results);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };
    fetchTracks();
  }, [query, page]);

  const addItem = useCallback((src: string) => {
    dispatcher?.dispatch(ADD_AUDIO, {
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
      <div className="text-md text-[#e4e4e7]  font-medium h-11 border-b border-border flex items-center px-4 text-muted-foreground">
        Audios
      </div>
      <ScrollArea>
        {tracks.map((track, i) => (
          <div
            className="flex cursor-pointer gap-2 items-center"
            key={i}
            onClick={() => addItem(track.audio)}
          >
            <img className="size-10" src={track.image} alt="image" />
            <p>
              {track.name} - {track.artist_name}
            </p>
            <audio className="hidden" controls>
              <source src={track.preview} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        ))}
        <button onClick={() => setPage(page + 1)}>Cargar más</button>
      </ScrollArea>
    </div>
  );
};
