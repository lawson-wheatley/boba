import React, { useEffect } from "react";
import logo from './logo.svg';
import postFeed from './Post-feed'
import { useRecoilValue } from 'recoil'
import { authAtom, usersAtom } from './_state'
import { useFetchWrapper } from "./_helpers";
import { useUserActions } from "./_actions";

function Home() {


  const auth = useRecoilValue(authAtom);
  const users = useRecoilValue(usersAtom);
  const userActions = useUserActions();
  const fetchWrapper = useFetchWrapper();
  const items = fetchWrapper.get("api.instaswatch.com/feed/");

  useEffect(() => {
      userActions.getAll();
  }, []);

    return (
      <div className="feed">
        {items.map(item => postFeed(item))}
      </div>
    );
}
export default Home;