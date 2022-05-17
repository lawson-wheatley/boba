import React from "react";
import logo from './logo.svg';
import postFeed from './Post-feed'
import {authAtom} from '_state'
import { useFetchWrapper } from "./_helpers";

function Home() {
  const [error, setError] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);


  const auth = useRecoilValue(authAtom);
  const users = useRecoilValue(usersAtom);
  const userActions = useUserActions();
  const fetchWrapper = useFetchWrapper();
  const items = fetchWrapper.get("api.instaswatch.com/user-feed/");

  useEffect(() => {
      userActions.getAll();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="feed">
        {items.map(item => postFeed(item))}
      </div>
    );
  }
}
export default Home;