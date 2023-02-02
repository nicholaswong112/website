import React from "react";

const ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played";

export default RecentlyPlayed = React.memo((props) => {
  return (
    <>
      <h3>Recently Played</h3>
      <ol>
        <li>A</li>
        <li>B</li>
        <li>C</li>
      </ol>
    </>
  );
});
