import React, { useState } from "react";
import logo from './logo.svg';
import postFeed from './Post-feed'
import { useRecoilValue } from 'recoil'
import { authAtom, usersAtom } from './_state'
import { useFetchWrapper } from "./_helpers";
import { useUserActions } from "./_actions";

function Home() {

  const [appState, setAppState] = useState({
    loading: false,
    repos: null,
  });
  const auth = useRecoilValue(authAtom);
  const users = useRecoilValue(usersAtom);
  const userActions = useUserActions();
  const fetchWrapper = useFetchWrapper();
  const [loaded, finishedLoading] = useState(false);
  const [itms, setItems] = useState([])
  if(!loaded){
    fetchWrapper.get("http://127.0.0.1:80/feed").then(result => {
      delete result.access_token;
      finishedLoading(true);
      console.log(result);
      setItems(result);
    });
    return <div className="FUCK">"Loading..."</div>;
  }
  else{
  return (
    <div className="centerPos">
    <div className="feed">
      {itms.map(item => postFeed(item))}
    </div>
    </div>
  );}
}
export default Home;