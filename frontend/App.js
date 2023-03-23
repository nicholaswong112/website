import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import useLocalStorageState from "use-local-storage-state";

// /** Custom pure components */
import PersonalCard from "./PersonalCard";
import SpotifyTrack from "./SpotifyTrack";
import SpotifyArtist from "./SpotifyArtist";

import hash from "./hash";

import useFetchCachedLocalStorage from "./useFetchCachedLocalStorage";
const SPOTIFY_PREFIX = "https://api.spotify.com/v1";
const NICK_PREFIX = "";
const SPOTIFY_PERSONAL_ENDPOINT = SPOTIFY_PREFIX + "/me";
const SPOTIFY_CURRENTLY_ENDPOINT =
  SPOTIFY_PREFIX + "/me/player/currently-playing";
const SPOTIFY_RECENTLY_ENDPOINT = SPOTIFY_PREFIX + "/me/player/recently-played";
const SPOTIFY_TOP_TRACKS_ENDPOINT = SPOTIFY_PREFIX + "/me/top/tracks";
const SPOTIFY_TOP_ARTISTS_ENDPOINT = SPOTIFY_PREFIX + "/me/top/artists";
const NICK_PERSONAL_ENDPOINT = NICK_PREFIX + "/me";
const NICK_CURRENTLY_ENDPOINT = NICK_PREFIX + "/me/player/currently-playing";
const NICK_RECENTLY_ENDPOINT = NICK_PREFIX + "/me/player/recently-played";
const NICK_TOP_TRACKS_ENDPOINT = NICK_PREFIX + "/me/top/tracks";
const NICK_TOP_ARTISTS_ENDPOINT = NICK_PREFIX + "/me/top/artists";

export default function App() {
  // TODO: IS THIS A SECURITY RISK? MANUALLY CHANGE DOM IS_STAFF == True
  /** constants passed through by Django, see spotify/index.html */
  const IS_STAFF = JSON.parse(document.getElementById("is_staff").textContent);
  const USER_LOGGED_IN = JSON.parse(
    document.getElementById("user_logged_in").textContent
  );
  const NICK_LOGGED_IN = JSON.parse(
    document.getElementById("nick_logged_in").textContent
  );

  /** Top-level state to be persisted across refreshes
   * If admin is logged in (isStaff=True), we never use nickMode,
   * the toggle is not displayed
   */
  const [nickMode, setNickMode] = useLocalStorageState(false);

  if (IS_STAFF && nickMode) {
    setNickMode(false);
  }

  const shouldShowData = nickMode ? NICK_LOGGED_IN : USER_LOGGED_IN;

  /** USER_LOGGED_IN iff 'access_token' in cookies invariant is
   * maintained by Django -- will break if cookies aren't allowed
   *
   * [cookies] is read-only because any log-in/out activity will
   * result in a reload of the page
   */
  const [cookies] = useCookies();
  // We set AT to "" in the case that it's undefined, prevent an
  // issue when hashing it for storage keys
  const accessToken = cookies["access_token"] || "";

  // const expiresAt = cookies["expires_at"];

  //   if (expiresAt <= new Date().getTime() / 1000) {
  //     // TODO: provide a "refresh_token" button
  //      // and also notify that data is stale
  //     return;
  //   }

  const spotifyOptions = {
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
  };

  /*************************************************
   * Initializing many fetch-and-cache data stores *
   *************************************************/

  /** Refer to https://developer.spotify.com/documentation/web-api/reference/#/operations/get-current-users-profile
   * for structure of JSON response */
  const transformPersonal = ({ display_name, external_urls, images }) => {
    return {
      displayName: display_name,
      profileImage: images[0].url,
      profileUrl: external_urls.spotify,
    };
  };
  const userPersonal = useFetchCachedLocalStorage(
    SPOTIFY_PERSONAL_ENDPOINT,
    "personal: " + hash(accessToken),
    transformPersonal,
    spotifyOptions
  );
  const nickPersonal = useFetchCachedLocalStorage(
    NICK_PERSONAL_ENDPOINT,
    "personal: nick",
    transformPersonal
  );

  const extractTrackData = (item) => {
    const {
      album: { images: albumImages },
      artists: artistsArr,
      external_urls: { spotify: songUrl },
      name: songName,
    } = item;
    const artists = artistsArr.map(
      ({ name: artistName, external_urls: { spotify: artistUrl } }) => {
        return { artistName, artistUrl };
      }
    );
    return { albumImages, songName, songUrl, artists };
  };

  /** Refer to https://developer.spotify.com/documentation/web-api/reference/#/operations/get-the-users-currently-playing-track
   * for structure of JSON response */
  const transformCurrent = ({ item, is_playing }) => {
    return { track: extractTrackData(item), isPlaying: is_playing };
  };
  const userCurrent = useFetchCachedLocalStorage(
    SPOTIFY_CURRENTLY_ENDPOINT,
    "currently: " + hash(accessToken),
    transformCurrent,
    spotifyOptions
  );
  const nickCurrent = useFetchCachedLocalStorage(
    NICK_CURRENTLY_ENDPOINT,
    "currently: nick",
    transformCurrent
  );

  /** Refer to https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recently-played
   * for structure of JSON response */
  const transformRecent = ({ items }) => {
    return items.map(({ track }) => {
      return extractTrackData(track);
    });
  };
  const userRecent = useFetchCachedLocalStorage(
    SPOTIFY_RECENTLY_ENDPOINT,
    "recently: " + hash(accessToken),
    transformRecent,
    spotifyOptions
  );
  const nickRecent = useFetchCachedLocalStorage(
    NICK_RECENTLY_ENDPOINT,
    "recently: nick",
    transformRecent
  );

  /** Refer to https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks
   * for structure of JSON response */
  const transformTopTracks = ({ items }) => {
    return items.map(extractTrackData);
  };
  const userTopTracks = useFetchCachedLocalStorage(
    SPOTIFY_TOP_TRACKS_ENDPOINT,
    "top tracks: " + hash(accessToken),
    transformTopTracks,
    spotifyOptions
  );
  const nickTopTracks = useFetchCachedLocalStorage(
    NICK_TOP_TRACKS_ENDPOINT,
    "top tracks: nick",
    transformTopTracks
  );

  const extractArtistData = (artist) => {
    const {
      external_urls: { spotify: artistUrl },
      genres,
      images: artistImages,
      name: artistName,
    } = artist;
    return { artistImages, artistName, artistUrl, genres };
  };

  /** Refer to https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks
   * for structure of JSON response */
  const transformTopArtists = ({ items }) => {
    return items.map(extractArtistData);
  };
  const userTopArtists = useFetchCachedLocalStorage(
    SPOTIFY_TOP_ARTISTS_ENDPOINT,
    "top artists: " + hash(accessToken),
    transformTopArtists,
    spotifyOptions
  );
  const nickTopArtists = useFetchCachedLocalStorage(
    NICK_TOP_ARTISTS_ENDPOINT,
    "top artists: nick",
    transformTopArtists
  );

  const [personal, current, recent, topTracks, topArtists] = nickMode
    ? [nickPersonal, nickCurrent, nickRecent, nickTopTracks, nickTopArtists]
    : [userPersonal, userCurrent, userRecent, userTopTracks, userTopArtists];

  /** setting up manual and automatic refreshing */
  const refreshOnClick = () => {
    personal.markStale();
    current.markStale();
    recent.markStale();
    topTracks.markStale();
    topArtists.markStale();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      current.markStale();
      recent.markStale();
    }, 15_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <React.StrictMode>
      <div className="app">
        <div className="columns is-desktop">
          <div className="column is-three-quarters">
            <h1>What'{nickMode ? "s Nick" : "re you"} listening to?</h1>
          </div>
          {/* No "Nick mode" when logged in as admin -- init/only state is "You mode" */}
          {IS_STAFF || (
            <div className="column">
              <button onClick={() => setNickMode(!nickMode)}>
                {nickMode ? "Show You" : "Show Nick"}
              </button>
            </div>
          )}
        </div>

        <div className="columns is-desktop">
          <div className="column">
            <PersonalCard
              nickMode={nickMode}
              shouldShowData={shouldShowData}
              IS_STAFF={IS_STAFF}
              {...personal.data}
            />
          </div>
          <button
            className="button is-rounded refresh-btn"
            onClick={refreshOnClick}
          >
            <i className="fa fa-refresh" aria-hidden="true"></i>
          </button>
          <div className="column">
            {!shouldShowData || current.isLoading ? (
              <>
                <h3>Currently Playing</h3>
                <SpotifyTrack />
              </>
            ) : current.error ? (
              <>
                <h3>Currently Playing</h3>
                <p>An error occured: {current.error.message}</p>
              </>
            ) : current.data && current.data.isPlaying ? (
              <>
                <h3>Currently Playing</h3>
                <SpotifyTrack track={current.data.track} />
              </>
            ) : (
              <>
                <h3>Nothing Currently Playing</h3>
                <SpotifyTrack />
              </>
            )}
          </div>
        </div>

        <div className="columns is-desktop">
          <div className="column">
            <h3>Recently Played</h3>
            {!shouldShowData || recent.isLoading || !recent.data ? (
              <>
                <SpotifyTrack />
                <SpotifyTrack />
                <SpotifyTrack />
              </>
            ) : recent.error ? (
              <p>An error occured: {recent.error}</p>
            ) : (
              <div className="scroll-box">
                <ol>
                  {recent.data &&
                    recent.data.map((data, idx) => {
                      return (
                        <li key={idx}>
                          <SpotifyTrack track={data} />
                        </li>
                      );
                    })}
                </ol>
              </div>
            )}
          </div>
          <div className="column">
            <h3>Top Tracks</h3>
            {!shouldShowData || topTracks.isLoading || !topTracks.data ? (
              <>
                <SpotifyTrack />
                <SpotifyTrack />
                <SpotifyTrack />
              </>
            ) : topTracks.error ? (
              <p>An error occured: {topTracks.error}</p>
            ) : (
              <div className="scroll-box">
                <ol>
                  {topTracks.data &&
                    topTracks.data.map((data, idx) => {
                      return (
                        <li key={idx}>
                          <SpotifyTrack track={data} />
                        </li>
                      );
                    })}
                </ol>
              </div>
            )}
          </div>
          <div className="column">
            <h3>Top Artists</h3>
            {!shouldShowData || topArtists.isLoading || !topArtists.data ? (
              <>
                <SpotifyArtist />
                <SpotifyArtist />
                <SpotifyArtist />
              </>
            ) : topArtists.error ? (
              <p>An error occured: {topArtists.error}</p>
            ) : (
              <div className="scroll-box">
                <ol>
                  {topArtists.data &&
                    topArtists.data.map((data, idx) => {
                      return (
                        <li key={idx}>
                          <SpotifyArtist artist={data} />
                        </li>
                      );
                    })}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
}
