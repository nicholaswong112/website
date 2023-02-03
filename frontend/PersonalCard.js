import React from "react";

const DEFAULT_IMAGE = "/static/spotify/profile_placeholder.svg";

const PersonalCard = React.memo(
  ({
    nickMode,
    shouldShowData,
    IS_STAFF,
    profileImage,
    displayName,
    profileUrl,
  }) => {
    let bigText = <h4></h4>;
    let smallText = <p></p>;

    if (shouldShowData) {
      bigText = (
        <h4>
          <a href={profileUrl}>{displayName}</a>
        </h4>
      );
      smallText = (
        <>
          <p>
            <a href="/spotify/logout">Sign out</a>
          </p>
          <p>
            {/** TODO: place a message here if the token is stale */}
            <a href="/spotify/refresh_token">Refresh token</a>
          </p>
        </>
      );
    } else if (IS_STAFF && !shouldShowData) {
      bigText = (
        <h4>
          <a href="/spotify/login">Sign in</a> to see *and share* your stats!
        </h4>
      );
    } else {
      // We know !IS_STAFF && !shouldShowData
      if (nickMode) {
        bigText = <h4>Tell Nick to sign in</h4>;
        smallText = <p>Meanwhile, try checking your own stats!</p>;
      } else {
        bigText = (
          <h4>
            <a href="/spotify/login">Sign in</a> to see your stats!
          </h4>
        );
      }
    }

    return (
      <div className="columns">
        <div className="column">
          {shouldShowData ? (
            <a href={profileUrl}>
              <img className="prof-pic" src={profileImage} />
            </a>
          ) : (
            <img className="prof-pic" src={DEFAULT_IMAGE} />
          )}
        </div>
        <div className="column">
          {bigText}
          {smallText}
        </div>
      </div>
    );
  }
);

export default PersonalCard;
