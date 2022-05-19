import React, { useState } from "react";
import logo from './logo.svg';
import PostFeed from './Post-feed'
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
  function likeContent(id){
    fetchWrapper.post("http://127.0.0.1:80/like", {"id":id})
  }
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
      {itms.map(item => PostFeed(item, likeContent))}
    </div>
    <div className="create">
    <div className="createpost">
      <img class="mob-navimg moba" src="/img/logo.svg"/>
      <a href="/upload" class="abutton">Create a Post</a>
      <a href="/createcommunity" class="abutton">Create a Community</a>
      </div>
    </div>
    </div>
  );}
}
export default Home;