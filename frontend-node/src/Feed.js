import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logo from './logo.svg';
import PostFeed from "./Post-feed";
import { useFetchWrapper } from "./_helpers";
export function Feed(vars) {
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const fetchWrapper = useFetchWrapper();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  function likeContent(id){
    fetchWrapper.post(process.env.REACT_APP_API_URL+"/like", {"id":id});
  }
  function loadContent(page){
    if(!isLoading && hasNext){
      setIsLoading(true);
      setPage(page+1);
  }
  }
  function loadInitial(){
    fetchWrapper.get(process.env.REACT_APP_API_URL+vars.location+"/feed?page="+0).then(
      result => {
        setItems(result.posts);
        setHasNext(result.has_next);
        console.log(result.has_next);
      });
  }
  window.addEventListener('scroll', function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1) {
        if(hasNext){
          loadContent(page);
        }
    }
  });

 useEffect(() => {
   if(isLoading && hasNext){fetchWrapper.get(process.env.REACT_APP_API_URL+vars.location+"/feed?page="+page).then(
    result => {
      console.log(result.posts);
      setItems(items.concat(result.posts));
      setHasNext(result.has_next);
     }).catch((err) => {});}}, [isLoading]);

  useEffect(() => { setLoaded(true); setIsLoading(false);}, [items]);

  if(!loaded){
    loadInitial();
    return <div className="load">"Loading..."</div>;
  } else{
  return (
    <div id="feed" className="feed">
      {items.map(item => PostFeed(item, likeContent))}
    </div>
  )}
}