import { useRef, useState } from 'react';
import './App.css';
const logo = require('./resources/adamportpix.png')

function App() {

  const sectionTwo = useRef(null);
  const sectionOne = useRef(null);

  const [active, setActive] = useState('home');

  const [progress, setProgress] = useState();

  const goToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkIfInView = (element) => {
    const elementBounds = element.current.getBoundingClientRect();
    return (
      elementBounds.top <= window.innerHeight * 0.11 &&
      elementBounds.top > -1 &&
      elementBounds.bottom - 1 <= (window.innerHeight)
    )
  }

  const handleScroll = () => {
    const topElementReference = sectionOne.current.getBoundingClientRect();
    console.log(Math.abs(topElementReference.top / (window.innerHeight * .0131)) + window.innerWidth * .001 - 15)
    setProgress(Math.abs(topElementReference.top / (window.innerHeight * .0101)) + window.innerWidth * .011 - 14)
    if (checkIfInView(sectionOne)) {
      setActive('home')
    }
    if (checkIfInView(sectionTwo)) {
      setActive('meet')
    }

  }

  return (
    <div className="App" onScroll={() => handleScroll()}>
      <div className='header-container' ref={sectionOne}>
        <header>
          <div className='icon-container'>
          <img src={logo} alt="homelogo" className='logo'></img>
          </div>
          
          <nav >
            <ul className='nav-list'>
              <li className={active === 'home' ? 'active' : ""} onClick={() => goToSection(sectionOne)}>Home</li>
              <li className={active === 'meet' ? 'active' : ""} onClick={() => goToSection(sectionTwo)}>Tech</li>
              <li >Projects</li>
            </ul>
            <div className='progress-ball' style={{ left: `${progress}%` }}></div>
          </nav>
        </header>
      </div>

      <div className='body'>
        <div id="home" className='section column'>
          <div className="headerText" >
            <span className="Cool-letter" >H</span><span className="Cool-letter">i</span><span className="Cool-letter">,</span>
            <br></br>
            <span className="Cool-letter">W</span><span className="Cool-letter">e</span><span className="Cool-letter">l</span><span className="Cool-letter">c</span><span className="Cool-letter">o</span><span className="Cool-letter">m</span><span className="Cool-letter">e</span> <span className="Cool-letter">T</span><span className="Cool-letter">o</span> <span className="Cool-letter">M</span><span className="Cool-letter">y</span> <span className="Cool-letter">P</span><span className="Cool-letter">o</span><span className="Cool-letter">r</span><span className="Cool-letter">t</span><span className="Cool-letter">f</span><span className="Cool-letter">o</span><span className="Cool-letter">l</span><span className="Cool-letter">i</span><span className="Cool-letter">o</span><span className="Cool-letter">.</span>
          </div>
          <div id='about-me'>
            <p>I'm Adam Haviv, an aspiring Full-Stack Developer with a passion for learning,</p>
            <p id='second-line'> creating and problem solving.</p>
          </div>

        </div>

        <div ref={sectionTwo} className='section'>
          Section Two
        </div>

      </div>
    </div>
  );
}

export default App;
