import React from "react";
import { useParams } from "react-router-dom";
import logo from './logo.svg';
import { useFetchWrapper } from "./_helpers";


function Followers() {
  const {id} = useParams();
    return (
      <div className="notification">
        <div className="notiftype">
        </div>
        <div className="notiftext">
          
        </div>
      </div>
    );
  }
export default Followers;