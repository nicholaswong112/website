import React from "react";

const SpotifyArtist = React.memo(
  ({ artistImages, artistName, artistUrl, genres }) => {
    return (
      <a href={artistUrl}>
        <div className="columns spotify-artist">
          <div className="column">
            {/* index 1 contains 300x300px image */}
            <img className="artist-pic" src={artistImages[1].url}></img>
          </div>
          <div className="column is-two-thirds">
            <h4>{artistName}</h4>
            <p>{genres.join(", ")}</p>
          </div>
        </div>
      </a>
    );
  }
);

export default SpotifyArtist;
