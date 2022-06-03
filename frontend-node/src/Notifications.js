import React, { useEffect, useState} from "react";
import logo from './logo.svg';
import Notification from './Notification'
import { useFetchWrapper } from "./_helpers";
function Notifications() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchWrapper = useFetchWrapper();
  
  function loadItems(){
    if(!loading){
      setLoading(true);
    }
  }

  useEffect(() => {fetchWrapper.get(process.env.REACT_APP_API_URL+"/notifications?page=0").then(result => {setItems(result); setLoaded(true);})}, [loading]);
  if(!loaded){
    return <div className="loading">Loading...</div>
  } else{
    console.log(items);
    return (
      <div className="Notifications">
        {items.map(item => Notification(item))}
      </div>
    );
  }
}
  
export default Notifications;