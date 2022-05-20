import React from "react";
import logo from './logo.svg';
import Notification from './Notification'
import { useFetchWrapper } from "./_helpers";
function Notifications() {
  const fetchWrapper = useFetchWrapper();
  const items = fetchWrapper.get(REACT_APP_API_URL+"/notifications");
    return (
      <div className="Notifications">
        {items.map(item => Notification(item))}
      </div>
    );
  }
  
export default Notifications;