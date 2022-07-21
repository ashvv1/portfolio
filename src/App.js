import './App.css';
import Scrambler from './Projects/Scrambler';
import { useRef, useState } from 'react';


function App() {

  const [lightLoop, setLightLoop] = useState();

  const secondBanner = useRef();
  const headerBanner = useRef();
  const appBackground = useRef();

  const executeScroll = (ref) => ref.current.scrollIntoView({ behavior: 'smooth', block: 'center'});

  const handleComplete = () =>{
    
    setInterval(()=>{
      document.getElementById('gameContainer').style.boxShadow = 'inset 0px 0px 8px 4px rgba(211, 157, 10, 0.733)';
    }, 500)
    setInterval(()=>{
      document.getElementById('gameContainer').style.boxShadow = 'none';
    }, 1000)



    setTimeout(()=>{
      clearInterval(1);
      clearInterval(2);
    }, 5000)

      setTimeout(()=>{
        appBackground.current.style.height = '200vh';
        secondBanner.current.style.display = 'flex';
        executeScroll(secondBanner);
      }, 2000)    
    }

  return (
    <div className="App">
      <div className="App-background" ref={appBackground}>
        <div className = "headerBanner" ref={headerBanner}>
        <div className = "avatar">
        <span className='pixMe'></span>
        </div>
          <div className = "headerText" >
          <span>H</span><span>i</span><span>,</span>
          <br></br>
          <span>W</span><span>e</span><span>l</span><span>c</span><span>o</span><span>m</span><span>e</span> <span>T</span><span>o</span> <span>M</span><span>y</span> <span>P</span><span>o</span><span>r</span><span>t</span><span>f</span><span>o</span><span>l</span><span>i</span><span>o</span><span>.</span>
          </div>
          <div className = "testWindow"><Scrambler handleComplete = {handleComplete}/> <span className="equalSign">=</span> </div> 
          
        </div>
        <div className = "secondBanner" ref={secondBanner}>
          <div className = "headerText">
          <div>You know my name, but did you know...</div>
          <div>I'm mostly self-taught...</div>
          <br></br>
          <div className = "certificates">
            <span className = "certOne"></span>
            <span className = "certTwo"></span>
            <span className = "certThree"></span>
          </div>

          </div>
      
        </div>
      </div>
    </div>
  );
}

export default App;
