import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import React from "react";
import Loader from "./Loader";

function CharacterList({
  characters,
  isLoading,
  onSelectCharacter,
  selectedCharacter,
}) {
  // console.log(isLoading);
  return (
    <div className="characters-list">
      {!characters ? (
        <Loader />
      ) : (
        characters.map((item) => (
          <Character
            onSelectCharacter={onSelectCharacter}
            selectedCharacter={selectedCharacter}
            key={item.id}
            character={item}
          />
        ))
      )}
    </div>
  );
}

export default CharacterList;

function Character({ character, onSelectCharacter, selectedCharacter }) {
  return (
    <div className="list__item" onClick={() => onSelectCharacter(character.id)}>
      <img src={character.image} alt={character.name} />
      <h3 className="name">
        <span>{character.gender === "Male" ? "🧑" : "👩"}</span>
        <span>{character.name}</span>
      </h3>
      <div className="list-item__info info">
        <span
          className={`status ${character.status === "Dead " && "red"}`}
        ></span>
        <span>{character.status}</span>
        <span>-{character.species}</span>
      </div>
      <button className="icon red">
        {character.id === selectedCharacter?.id ? (
          <EyeSlashIcon />
        ) : (
          <EyeIcon />
        )}
      </button>
    </div>
  );
}
