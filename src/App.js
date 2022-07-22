import './App.css';
import Scrambler from './Projects/Scrambler';
import { useRef, useState, useEffect } from 'react';


function App() {

  const [lightLoop, setLightLoop] = useState();

  const thirdBanner = useRef();
  const secondBanner = useRef();
  const headerBanner = useRef();
  const appBackground = useRef();

  useEffect(()=>{
    (document.getElementById('0')).focus();
  }, [])

  const executeScroll = (ref) => ref.current.scrollIntoView({ behavior: 'smooth', block: 'center'});

  const handleComplete = () =>{
    
    setInterval(()=>{
      document.getElementById('gameContainer').style.boxShadow = 'inset 0px 0px 8px 4px rgba(211, 157, 10, 0.733)';
    }, 500)
    setInterval(()=>{
      document.getElementById('gameContainer').style.boxShadow = 'none';
    }, 1000);

    document.getElementById('9').disabled=true;

    setTimeout(()=>{
      clearInterval(1);
      clearInterval(2);
    }, 5000)

      setTimeout(()=>{
        appBackground.current.style.height = '300vh';
        secondBanner.current.style.display = 'flex';
        thirdBanner.current.style.display = 'flex';
        executeScroll(secondBanner);
      }, 2000)
      
      setTimeout(()=>{
        window.scrollTo({top: 800, behavior: 'smooth'});
      }, 5500)  

      setTimeout(()=>{
        executeScroll(thirdBanner);
      }, 6000)   
    }

  return (
    <div className="App">
      <div className="App-background" ref={appBackground}>
        <div className = "headerBanner" ref={headerBanner}>
        <div className = "avatar">
        <span className='pixMe' width="250" height="300"></span>
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

          <div className = "certificates">
            <span className = "certOne"></span>
            {/* <span className = "arrowDown1"></span> */}
            <span className = "certTwo"></span>
            {/* <span className = "arrowDown2"></span> */}
            <span className = "certThree"></span>
          </div>

          </div>
      
        </div>
        <div className = "thirdBanner" ref={thirdBanner}>
          <div className = "headerText">
          <div>..but with some experience!</div>

          <div className = "codeSnips">
            <div className = "code1"></div>
            <div className = "code2"></div>
            <div className = "code3"></div>
          </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
