import "./App.css";
import CharacterList from "./components/CharacterList";
import CharracterDetail from "./components/CharacterDetail";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Loader from "./components/Loader";
import { HeartIcon } from "@heroicons/react/24/outline";
import useFetch, { useFetchOne } from "./hooks/useFetch";

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
          console.log(singleCh);
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
    setFavourites((prev) => [...prev, char]);
  }
  const isFavourite = favourites
    .map((fav) => fav.id)
    .includes(selectedCharacter);
  return (
    <div className="app">
      <Toaster />
      <Navbar numOfResults={characters.length}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="search.."
          className="text-field"
        />
        <div className="navbar__result">
          found {characters.length} characters
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
