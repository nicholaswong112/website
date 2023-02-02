import React from "react";

const SpotifyArtist = React.memo(
  ({ artistImages, artistName, artistUrl, genres }) => {
    return (
      <a href={artistUrl}>
        <div className="columns">
          <div className="column">
            <img src={artistImages[artistImages.length - 1].url}></img>
          </div>
          <div className="column">
            <h4>{artistName}</h4>
            <p>{genres.join(", ")}</p>
          </div>
        </div>
      </a>
    );
  }
);

export default SpotifyArtist;
