const SAMPLE_PERSONAL_DATA = {
  profileImage:
    "https://i.scdn.co/image/ab6775700000ee851f6447a42e1b26f65b253b9a",
  displayName: "Nicholas Wong",
  profileUrl: "https://open.spotify.com/user/d4rkarcherx",
};
const SAMPLE_TRACK_DATA = {
  albumImages: [
    {
      height: 640,
      url: "https://i.scdn.co/image/ab67616d0000b273169e46867bdfede3803964b2",
      width: 640,
    },
    {
      height: 300,
      url: "https://i.scdn.co/image/ab67616d00001e02169e46867bdfede3803964b2",
      width: 300,
    },
    {
      height: 64,
      url: "https://i.scdn.co/image/ab67616d00004851169e46867bdfede3803964b2",
      width: 64,
    },
  ],
  songName: "Inspire",
  songUrl: "https://open.spotify.com/track/5f07SlGqb3uEmn1s3KtSVj",
  artists: [
    {
      artistName: "Polyphia",
      artistUrl: "https://api.spotify.com/v1/artists/4vGrte8FDu062Ntj0RsPiZ",
    },
    {
      artistName: "Lewis Grant",
      artistUrl: "https://open.spotify.com/artist/5hn4bbaAkdXOwk8160xTpj",
    },
  ],
};

const SAMPLE_ARTIST_DATA = {
  artistImages: [
    {
      height: 640,
      url: "https://i.scdn.co/image/ab6761610000e5ebc4da5a902d3faf62294645ca",
      width: 640,
    },
    {
      height: 320,
      url: "https://i.scdn.co/image/ab67616100005174c4da5a902d3faf62294645ca",
      width: 320,
    },
    {
      height: 160,
      url: "https://i.scdn.co/image/ab6761610000f178c4da5a902d3faf62294645ca",
      width: 160,
    },
  ],
  artistName: "Steffany Gretzinger",
  artistUrl: "https://open.spotify.com/artist/2akNRvGNB400IDDUMr1PHW",
  genres: ["ccm", "instrumental worship", "world worship", "worship"],
};

const personalData = {
  imageUrl: "/static/me-and-navi.jpg",
  displayName: "Wick Nong",
};
const currentData = { track: SAMPLE_TRACK_DATA, isPlaying: true };
const recentData = [SAMPLE_TRACK_DATA, SAMPLE_TRACK_DATA, SAMPLE_TRACK_DATA];
const topTracksData = [SAMPLE_TRACK_DATA, SAMPLE_TRACK_DATA, SAMPLE_TRACK_DATA];
const topArtistsData = [
  SAMPLE_ARTIST_DATA,
  SAMPLE_ARTIST_DATA,
  SAMPLE_ARTIST_DATA,
];
export default {
  personalData,
  currentData,
  recentData,
  topTracksData,
  topArtistsData,
};
