import React from "react";

const ENDPOINT = "https://api.spotify.com/v1/me/top";

export default TopX = React.memo((props) => {
  return (
    <>
      <h3>Top {props.which}</h3>
      <ol>
        <li>A</li>
        <li>B</li>
        <li>C</li>
      </ol>
    </>
  );
});
