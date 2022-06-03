import React from "react";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";


function Notification(item) {

    return (
      <a className="notification" href={"/post/"+item.on}>
        <img className="post-profile-pic" src={process.env.REACT_APP_API_URL + "/" + item.pic}></img>
        <div className="notiftext">
          {item.notifier} {item.text}
        </div>
      </a>
    );
  }
  
export default Notification;