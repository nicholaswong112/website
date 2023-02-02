import React from "react";

const SpotifyTrack = React.memo(({ track }) => {
  if (track == null) {
    return <></>;
  }
  const { albumImages, songName, songUrl, artists } = track;
  return (
    <div className="columns">
      <div className="column">
        <a href={songUrl}>
          <img src={albumImages[albumImages.length - 1].url}></img>
        </a>
      </div>
      <div className="column">
        <a href={songUrl}>
          <h4>{songName}</h4>
        </a>
        <ul>
          {artists.map(({ artistName, artistUrl }, idx) => {
            return (
              <li key={idx}>
                <p>
                  <a href={artistUrl}>{artistName}</a>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
});

export default SpotifyTrack;
