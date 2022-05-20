import React, {useState} from "react";
import { useFetchWrapper } from "./_helpers";

function CreateCommunity(item) {
  const fetchWrapper = useFetchWrapper();
  const [community, setCommunity] = useState ("");
  const [communityText, setCommunityText] = useState ("");
  function uploa() {
    return fetchWrapper.post(process.env.REACT_APP_API_URL+"/create-community", {"community":community, "text":communityText});
  }
  return (

      <div className="login-containerv">
          <div className = "login-containerh">
    <div className="container-bubble">
          <div className="loginform lf" onSubmit={uploa}>
              <form className="lf" >
                  <input className="in cl si" type="text" name="title" placeholder="Community" onChange={e => setCommunity(e.target.value)}></input>
                  <input className="in cl si" type="text" name="title" placeholder="Community Text" onChange={e => setCommunityText(e.target.value)}></input>
                  <input className="bt in" type="submit"></input>
              </form>
          </div>
      </div>
      </div>
      </div>
  );
  }
export default CreateCommunity;