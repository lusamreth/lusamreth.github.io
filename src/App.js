import React, { useState } from "react";
// import './panel.css'
import moon from './moon.svg' 
import sun from './sundi.svg' 
import Dbreed from './doggy-bean'
import './navbar.css'



function Navbar(prop){
    let options = prop.options
    let dmode = options.darkmode 
    let mes = options.measurement
    
    let nvbarStyle = {
        backgroundColor : dmode ? "#212121" : "white",
        color : dmode ? "white" : 'black',
        borderBottom: "1px black solid",

    }
    const StateChanger = prop.change_state
    const swtichStyle = {
        backgroundColor:dmode ? "black":"white"
    }
    return (
        <div className="nav" style={nvbarStyle}>
            <div className="bar-container">
                <div className="logo" style={{
                    border:`1px solid ${dmode ? "white" : 'black'}`
                }}>
                    <b>DogGallery</b>
                </div>
                <div className="bar-content">
                    <div className="each-item toggle-mode" onClick={StateChanger.mode}> 
                        <img src={ !dmode ? sun : moon}
                            style = {swtichStyle}
                        alt="dmode"/>
                    </div>

                    <button className="each-item toggle-meas" onClick={StateChanger.measurement} 
                        style = {{
                            backgroundColor : mes === 'metric' ? 'pink' : 'orange'
                        }}
                    >
                        <b>{mes[0]}</b>
                    </button>
                </div>
            </div>
        </div>
    )
}


function App() {

    let [mode,setMode] = useState(true)
    let [measurement,setMeasurement] = useState('metric')


    const Mutator  = {
        measurement : () => setMeasurement( mea => {
            if (mea === 'metric') {
                setMeasurement("imperial")
            }else{

                setMeasurement("metric")
            }

        }) ,
        mode : () => setMode(mode => !mode)
    }
    const opt = {darkmode:mode, measurement:measurement}
	return (
		<div className="App">
            <Navbar change_state = {Mutator}
                options={opt} />
            <Dbreed darkmode={mode} measurement={measurement}/>
		</div>
	);
}
export default App;
