import React from "react";
import { cardStyles } from "../../styles";

const FeedCard = ({
  name,
  time_created,
  likes,
  comments_num,
  photo,
  message,
}) => {
  let showType = "";
  const classes = cardStyles();
  const elapsedTime = Math.ceil((new Date() - time_created) / 1000);
  let configuredTime;
  /*configuring time elapsed shown to change based on how much time has elapsed*/
  if (elapsedTime < 60) {
    showType = "second";
    configuredTime = elapsedTime;
  } else if (elapsedTime < 3600) {
    showType = "minute";
    configuredTime = Math.floor(elapsedTime / 60);
  } else if (elapsedTime < 86400) {
    showType = "hour";
    configuredTime = Math.floor(elapsedTime / 3600);
  } else {
    showType = "day";
    configuredTime = Math.floor(elapsedTime / 86400);
  }
  if (configuredTime !== 1) showType = showType + "s";
  return (
    <div className={`${classes.root} card-container`}>
      <h3>{name}</h3>
      <p>{`${configuredTime} ${showType} ago`}</p>
      <p>{message}</p>
      <p>likes: {likes}</p>
      <p>comments: {comments_num}</p>
    </div>
  );
};

export default FeedCard;
