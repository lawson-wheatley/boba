import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logo from './logo.svg';
import PostFeed from "./Post-feed";
import { useFetchWrapper } from "./_helpers";

export function Feed(props) {
  const [loc, setLoc] = useState(props);
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const fetchWrapper = useFetchWrapper();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [feedType, setFeedtype] = useState("hot");
  const width = window.innerWidth;
  const mc = window.innerHeight*0.075;
  function likeContent(id){
    fetchWrapper.post(process.env.REACT_APP_API_URL+"/like", {"id":id});
  }
  function loadContent(page){
    if(!isLoading && hasNext){
      setIsLoading(true);
      setPage(page+1);
  }
  }
  function setFeed(basis){
    setFeedtype(basis);
    setPage(0);
    setHasNext(true);
    loadContent(0);
  }
  function loadInitial(){
    fetchWrapper.get(process.env.REACT_APP_API_URL+props.location+"/feed?sortby="+feedType+"&page="+0).then(
      result => {
        setItems(result.posts);
        setHasNext(result.has_next);
        setLoaded(true);
        console.log(result.has_next);
        console.log(result);
      });
  }
  function scroller(e){
    if(width > 769){
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 60) {
          if(hasNext){
            loadContent(page);
          }
      }
      } else{
        if ((e.target.scrollTop) >= e.target.scrollHeight - e.target.clientHeight) {
          if(hasNext){
            loadContent(page);
          }
      }
      }
  }
 useEffect(() => {
   if(isLoading && hasNext){fetchWrapper.get(process.env.REACT_APP_API_URL+props.location+"/feed?sortby="+feedType+"&page="+page).then(
    result => {
      setItems(items.concat(result.posts));
      setHasNext(result.has_next);
     }).catch((err) => {});}}, [isLoading]);

  useEffect(() => { setLoaded(true); setIsLoading(false);}, [items]);
  if(!loaded){
    loadInitial();
    return <div className="load">"Loading..."</div>;
  } else{
  return (
    <div id="feed" className="feed" onScroll={e => scroller(e)}>
      <div id="feedselector" className="post">
        <div className="dsa">
          <input className="selecto" value="Hot" type="button" onClick={e => setFeed("hot")}></input>
          <input className="selecto" value="Top" type="button" onClick={e => setFeed("top")}></input>
          <input className="selecto" value="New" type="button" onClick={e => setFeed("new")}></input>
        </div>
      </div>
      {items.map(item => PostFeed(item, likeContent))}
    </div>
  )}
}