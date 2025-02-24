import "./App.css";
import CharacterList from "./components/CharacterList";
import CharracterDetail from "./components/CharacterDetail";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Loader from "./components/Loader";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useFetchOne } from "./hooks/useFetch";

export default function App() {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [selectedEpisodes, setSelectedEpisodes] = useState(null);
  const [query, setQuery] = useState("");
  const [favourites, setFavourites] = useState([]);

  const { response: allCharacters, isLoading: fetchIsLoading } = useFetchOne({
    url: "https://rickandmortyapi.com/api/character/",
  });
  const { response: searchedCharacters, isLoading: searchLoading } =
    useFetchOne({
      url: "https://rickandmortyapi.com/api/character/",
      query: `name=${query}`,
      dependency: [query],
    });
  const { response: singleCh, isLoading: singleChIsLoading } = useFetchOne({
    url: `https://rickandmortyapi.com/api/character/${
      selectedCharacterId || ""
    }`,
    dependency: [selectedCharacterId],
  });

  useEffect(() => {
    allCharacters && setCharacters(allCharacters.results);
  }, []);

  useEffect(() => {
    searchedCharacters && setCharacters(searchedCharacters.results);
  }, [searchedCharacters]);

  useEffect(() => {
    async function f() {
      if (singleCh && !singleCh.results) {
        try {
          const episodeId = singleCh?.episode.map((ep) => ep.split("/").at(-1));
          const { data: episodes } = await axios.get(
            `https://rickandmortyapi.com/api/episode/${episodeId}`
          );
          setSelectedEpisodes([episodes].flat());
          setSelectedCharacter(singleCh);
        } catch (error) {
          setSelectedCharacter(null);
          toast.error(error.message);
        }
      }
    }
    f();
  }, [singleCh, selectedCharacterId]);

  async function onSelectCharacter(characterId) {
    setSelectedCharacterId(characterId);
  }

  function onAddFavourite(char) {
    const isFav = favourites.map((fav) => fav.id).includes(char?.id);
    if (isFav) {
      const cloneFav = [...favourites];
      const filteredFav = cloneFav.filter((item) => item.id !== char.id);
      setFavourites(filteredFav);
    } else {
      setFavourites((prev) => [...prev, char]);
    }
  }

  const isFavourite = favourites
    .map((fav) => fav.id)
    .includes(selectedCharacter?.id);

  return (
    <div className="app">
      <Toaster />
      <Navbar>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="search.."
          className="text-field"
        />
        <div className="navbar__result">
          found {characters?.length || 0} characters
        </div>
        <button className="heart">
          <HeartIcon className="icon" />
          <span className="badge">{favourites.length}</span>
        </button>
      </Navbar>

      <div className="main">
        <CharacterList
          characters={characters}
          isLoading={fetchIsLoading}
          onSelectCharacter={onSelectCharacter}
          selectedCharacter={selectedCharacter}
        />
        {singleChIsLoading ? (
          <Loader />
        ) : (
          <CharracterDetail
            selectedCharacter={selectedCharacter}
            selectedEpisodes={selectedEpisodes}
            onAddFavourite={onAddFavourite}
            isFavourite={isFavourite}
          />
        )}
      </div>
    </div>
  );
}
