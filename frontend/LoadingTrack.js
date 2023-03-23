import React from "react";
import ContentLoader from "react-content-loader";

export default function LoadingTrack() {
  return (
    <ContentLoader
      speed={2}
      width={375}
      height={100}
      viewBox="0 0 375 100"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="15" y="15" rx="0" ry="0" width="70" height="70" />
      <rect x="135" y="50" rx="0" ry="0" width="115" height="20" />
      <rect x="105" y="15" rx="0" ry="0" width="200" height="25" />
    </ContentLoader>
  );
}
