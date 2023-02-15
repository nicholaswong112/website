import React from "react";
import ContentLoader from "react-content-loader";

export default function LoadingArtist() {
  return (
    <ContentLoader
      speed={2}
      width={375}
      height={130}
      viewBox="0 0 375 130"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="15" y="15" rx="0" ry="0" width="100" height="100" />
      <rect x="135" y="55" rx="0" ry="0" width="150" height="20" />
      <rect x="135" y="15" rx="0" ry="0" width="200" height="25" />
      <rect x="135" y="85" rx="0" ry="0" width="65" height="20" />
    </ContentLoader>
  );
}
