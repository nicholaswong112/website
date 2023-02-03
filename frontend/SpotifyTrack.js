import React from "react";

const SpotifyTrack = React.memo(({ track }) => {
  if (track == null) {
    return <></>;
  }
  const { albumImages, songName, songUrl, artists } = track;
  return (
    <div className="columns spotify-track">
      <div className="column">
        <a href={songUrl}>
          {/* index 1 contains 300x300px image */}
          <img className="album-pic" src={albumImages[1].url}></img>
        </a>
      </div>
      <div className="column is-three-quarters">
        <a href={songUrl}>
          <h4>{songName}</h4>
        </a>
        <ul>
          <p>
            {artists
              .map(({ artistName, artistUrl }, idx) => {
                return <a href={artistUrl}>{artistName}</a>;
              })
              .reduce((prev, curr) => [prev, ", ", curr])}
          </p>
        </ul>
      </div>
    </div>
  );
});

export default SpotifyTrack;
