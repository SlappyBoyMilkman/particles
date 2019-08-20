import React from "react";
import System from "../util/system.js"

class Particles extends React.Component{
  constructor(){
    super();
    this.state = {

    }
  }

  componentDidMount(){
    let system = new System( this.refs.canvas );
  }

  render(){
    return(
      <canvas ref = "canvas"></canvas>
    )
  }
}

export default Particles;
