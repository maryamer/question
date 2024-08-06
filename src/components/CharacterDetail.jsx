import React, { useState } from "react";
import { episodes } from "../../data/data";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";

function CharacterDetail({
  selectedCharacter,
  selectedEpisodes,
  onAddFavourite,
  isFavourite,
}) {
  console.log(selectedEpisodes, "episodes");
  return (
    <div style={{ flex: 1 }}>
      {!selectedCharacter ? (
        "please select the character"
      ) : (
        <>
          <CharacterSubInfo
            selectedCharacter={selectedCharacter}
            isFavourite={isFavourite}
            onAddFavourite={onAddFavourite}
          />
          <CharacterEpisodes selectedEpisodes={selectedEpisodes} />
        </>
      )}
    </div>
  );
}

export default CharacterDetail;

function CharacterSubInfo({ selectedCharacter, isFavourite, onAddFavourite }) {
  return (
    <div className="character-detail">
      <img
        src={selectedCharacter.image}
        alt={selectedCharacter.name}
        className="character-detail__image"
      />
      <div className="character-detail__info">
        <h3 className="name">
          <span>{selectedCharacter.gender === "Male" ? "👨" : "👩"}</span>
          <span>&nbsp;{selectedCharacter.name}</span>
        </h3>
        <div className="info">
          <span
            className={`status ${
              selectedCharacter.status === "Dead " && "red"
            }`}
          ></span>
          <span>{selectedCharacter.status}</span>
          <span>-{selectedCharacter.species}</span>
        </div>
        <div className="location">
          <p>last known location:</p>
          <p>{selectedCharacter.location.name}</p>
        </div>
        <div className="actions">
          <button
            onClick={() => onAddFavourite(selectedCharacter)}
            className="btn btn--primary"
          >
            {isFavourite ? "alredy added" : "add to favourite"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CharacterEpisodes({ selectedEpisodes }) {
  const [sortBy, setSortBy] = useState(false);
  // let sortedEpisodes = selectedEpisodes;
  // if (sortBy) {
  //   sortedEpisodes = [...selectedEpisodes].sort(
  //     (a, b) => new Date(b.created) - new Date(a.created)
  //   );
  // }
  const [sortedEpisodes, setSortedEpisodes] = useState(selectedEpisodes);

  if (sortBy) {
    console.log();
    setSortedEpisodes((prev) =>
      [...prev].sort((a, b) => new Date(b.created) - new Date(a.created))
    );
  }
  // else {
  //   setSortedEpisodes((prev) =>
  //     [...prev].sort((a, b) => new Date(a.created) - new Date(b.created))
  //   );
  // }
  return (
    <div className="character-episodes">
      <div className="title">
        <h2>List of episodes:</h2>
        <button onClick={() => setSortBy(!sortBy)}>
          <ArrowDownCircleIcon className="icon" />
        </button>
      </div>
      <ul>
        {sortedEpisodes.map((item, index) => (
          <li key={item.id}>
            <div>
              {String(index + 1).padStart(2, 0)} - {item.episode} :
              <strong>{item.name}</strong>
            </div>
            <div className="badge badge--secondary">{item.air_date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
