import React, { useState, Component} from "react";
import { Feed } from "./Feed";
import logo from './logo.svg';
import PostFeed from './Post-feed'
import { useFetchWrapper } from "./_helpers";

class Home extends Component{
  constructor(props){
    super(props);
    this.state ={
      loaded: false,
      itms: [],
    }
  }
  render(){
      return (
        <div className="centerPos">
          <Feed location="" page={0} />
        <div className="create">
        <div className="createpost">
          <img className="mob-navimg moba" src="/img/logo.svg"/>
          <a href="/upload" className="abutton">Create a Post</a>
          <a href="/createcommunity" className="abutton">Create a Community</a>
          </div>
        </div>
        </div>
      );
    }
}

export default Home;