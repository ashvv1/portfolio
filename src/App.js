import './App.css';
import Scrambler from './Projects/Scrambler';
import { useRef, useEffect } from 'react';
import gitsnip from './resources/gitsnip.jpg';
import pixme from './resources/adamportpix.png';
import me from './resources/adamport.png';
import cert1 from './resources/cert1.JPG';
import cert2 from './resources/cert2.JPG';
import cert3 from './resources/cert3.JPG';
import giticon from './resources/giticon.png'


function App() {

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
        <div className = "avatar" >
        <img src={pixme} alt = "pixelated adam" className = 'pixme' width="100%" height="100%"/>
        </div>
        <div className = "avatar2" >
        <img src={me} alt = "normal adam" className = 'pixme' width="100%" height="100%"/>
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
            <img className = "certOne" src={cert1} alt ="certificate one" height = "100%" width ="30%"/>
            <img src={cert2} alt ="certificate 2" height = "100%" width ="30%" className = "certTwo"/>
            <img src = {cert3} alt="certificate 3"  height = "100%" width ="30%" className = "certThree"/>
          </div>

          </div>
      
        </div>
        <div className = "thirdBanner" ref={thirdBanner}>
          <div className = "headerText">
          <div>..but with some experience!</div>

          <div className = "codeSnips">
            <img src={gitsnip} alt="code snippit" className = "code1" width = '33%' height = '1600px'/>
            <a href="https://github.com/ashvv1" className ="giticon">
              <img src={giticon} alt="git icon" height = "auto" width = '80%'/></a>
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
