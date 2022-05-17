import React from "react";
import logo from './logo.svg';
import postFeed from './Post-feed'
import Notifications from './Notifications'
import Post from './Post'
import Login from './Login'
//import Upload from './Upload'

import Profile from './Profile'
function App() {
  const [token, setToken] = useState();
  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
  <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/profile/" element={<Profile />} />
    <Route path="/notifications" element={<Notifications/> }/>
    <Route path="/p/" element={<Post />} />
    <Route path="/new-post" element={<Upload />} />
    </Routes>
  </BrowserRouter>)
}
export default App;