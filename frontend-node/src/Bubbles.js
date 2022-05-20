import React, { useState } from "react";
import logo from './logo.svg';
import PostFeed from './Post-feed'
import { useRecoilValue } from 'recoil'
import { authAtom, usersAtom } from './_state'
import { useFetchWrapper } from "./_helpers";
import { useUserActions } from "./_actions";

function Bubbles() {

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
    fetchWrapper.get(process.env.REACT_APP_API_URL+"/bubbles").then(result => {
      delete result.access_token;
      finishedLoading(true);
      console.log(result);
      setItems(result);
    });
    return <div className="FUCK">"Loading..."</div>;
  }
  else{
  return (
    <div className="feed">
      <a href= {"/bubble/"+itms[0].name}><div className="bubble">{itms[0].name}</div></a>
      <a href= {"/bubble/"+itms[1].name}><div className="bubble1">{itms[1].name}</div></a>
      <a href= {"/bubble/"+itms[2].name}><div className="bubble2">{itms[2].name}</div></a>
      <a href= {"/bubble/"+itms[3].name}><div className="bubble3">{itms[3].name}</div></a>
      <a href= {"/bubble/"+itms[4].name}><div className="bubble4">{itms[4].name}</div></a>
    </div>
  );}
}
export default Bubbles;