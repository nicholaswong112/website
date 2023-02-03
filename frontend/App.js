import React, { useState } from "react";
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
const PERSONAL_ENDPOINT = "/me";
const CURRENTLY_ENDPOINT = "/me/player/currently-playing";
const RECENTLY_ENDPOINT = "/me/player/recently-played";
const TOP_TRACKS_ENDPOINT = "/me/top/tracks";
const TOP_ARTISTS_ENDPOINT = "/me/top/artists";

export default function App() {
  /** constants passed through by Django, see spotify/index.html */
  const IS_STAFF = JSON.parse(document.getElementById("is_staff").textContent);
  const USER_LOGGED_IN = JSON.parse(
    document.getElementById("user_logged_in").textContent
  );
  const NICK_LOGGED_IN = JSON.parse(
    document.getElementById("nick_logged_in").textContent
  );
  const CONSTANTS = {
    IS_STAFF: IS_STAFF,
    USER_LOGGED_IN: USER_LOGGED_IN,
    NICK_LOGGED_IN: NICK_LOGGED_IN,
  };

  /** Top-level state to be persisted across refreshes
   * If admin is logged in (isStaff=True), we never use nickMode
   */
  const [nickMode, setNickMode] = useLocalStorageState(false);

  const shouldShowData = nickMode ? NICK_LOGGED_IN : USER_LOGGED_IN;

  /** USER_LOGGED_IN iff 'access_token' in cookies invariant is
   * maintained by Django -- will break if cookies aren't allowed
   *
   * [cookies] is read-only because any log-in/out activity will
   * result in a reload of the page
   */
  const [cookies] = useCookies();
  const accessToken = cookies["access_token"];
  const expiresAt = cookies["expires_at"];

  //   if (expiresAt <= new Date().getTime() / 1000) {
  //     // TODO: need to refresh the token at /spotify/refresh_token
  //      // and also notify that data will be stale
  //     return;
  //   }

  const spotifyOptions = {
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
  };

  /** Refer to https://developer.spotify.com/documentation/web-api/reference/#/operations/get-current-users-profile
   * for structure of JSON response */
  const transformPersonal = ({ display_name, external_urls, images }) => {
    return {
      displayName: display_name,
      profileImage: images[0].url,
      profileUrl: external_urls.spotify,
    };
  };
  const [personalData, personalIsLoading, setPersonalStale] =
    useFetchCachedLocalStorage(
      SPOTIFY_PREFIX + PERSONAL_ENDPOINT,
      hash(SPOTIFY_PREFIX + PERSONAL_ENDPOINT + accessToken),
      spotifyOptions,
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
  const transformCurrent = ({ item }) => {
    return extractTrackData(item);
  };
  const [currentData, currentIsLoading, setCurrentStale] =
    useFetchCachedLocalStorage(
      SPOTIFY_PREFIX + CURRENTLY_ENDPOINT,
      hash(SPOTIFY_PREFIX + CURRENTLY_ENDPOINT + accessToken),
      spotifyOptions,
      transformCurrent
    );

  /** Refer to https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recently-played
   * for structure of JSON response */
  const transformRecent = ({ items }) => {
    return items.map(({ track }) => {
      return extractTrackData(track);
    });
  };
  const [recentData, recentIsLoading, setRecentStale] =
    useFetchCachedLocalStorage(
      SPOTIFY_PREFIX + RECENTLY_ENDPOINT,
      hash(SPOTIFY_PREFIX + RECENTLY_ENDPOINT + accessToken),
      spotifyOptions,
      transformRecent
    );

  /** Refer to https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks
   * for structure of JSON response */
  const transformTopTracks = ({ items }) => {
    return items.map(extractTrackData);
  };
  const [topTracksData, topTracksIsLoading, setTopTracksStale] =
    useFetchCachedLocalStorage(
      SPOTIFY_PREFIX + TOP_TRACKS_ENDPOINT,
      hash(SPOTIFY_PREFIX + TOP_TRACKS_ENDPOINT + accessToken),
      spotifyOptions,
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
  const [topArtistsData, topArtistsIsLoading, setTopArtistsStale] =
    useFetchCachedLocalStorage(
      SPOTIFY_PREFIX + TOP_ARTISTS_ENDPOINT,
      hash(SPOTIFY_PREFIX + TOP_ARTISTS_ENDPOINT + accessToken),
      spotifyOptions,
      transformTopArtists
    );

  return (
    <div className="app">
      <div className="columns is-desktop">
        <div className="column is-three-quarters">
          <h1>What'{nickMode ? "s Nick" : "re you"} listening to?</h1>
        </div>
        {/* No "Nick mode" when logged in as admin -- init state is "You mode" */}
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
            {...CONSTANTS}
            {...personalData}
          />
        </div>
        <button className="button is-rounded refresh-btn">
          Refresh - TODO
        </button>
        <div className="column">
          <h3>Currently Playing</h3>
          <SpotifyTrack track={currentData} />
        </div>
      </div>

      <div className="columns is-desktop">
        <div className="column">
          <h3>Recently Played</h3>
          <div className="scroll-box">
            <ol>
              {recentData &&
                recentData.map((data, idx) => {
                  return (
                    <li key={idx}>
                      <SpotifyTrack track={data} />
                    </li>
                  );
                })}
            </ol>
          </div>
        </div>
        <div className="column">
          <h3>Top Tracks</h3>
          <div className="scroll-box">
            <ol>
              {topTracksData &&
                topTracksData.map((data, idx) => {
                  return (
                    <li key={idx}>
                      <SpotifyTrack track={data} />
                    </li>
                  );
                })}
            </ol>
          </div>
        </div>
        <div className="column">
          <h3>Top Artists</h3>
          <div className="scroll-box">
            <ol>
              {topArtistsData &&
                topArtistsData.map((data, idx) => {
                  return (
                    <li key={idx}>
                      <SpotifyArtist {...data} />
                    </li>
                  );
                })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
