import React from "react";
import useFetchCached from "./useFetchCached";

const ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";

export default CurrentlyPlaying = React.memo(
  ({ shouldShowData, accessToken, isCurrStale, setIsCurrStale }) => {
    const [currentPlaying, isLoading, error] = useFetchCached(
      ENDPOINT,
      accessToken,
      isCurrStale,
      setIsCurrStale
    );
    return (
      <>
        <h3>Currently Playing</h3>
        <ol>
          <li>A</li>
        </ol>
      </>
    );
  }
);
