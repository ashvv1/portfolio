import { useRef, useState, useEffect } from 'react';
import './App.css';
const loading = require('./resources/loading.gif');
const logo = require('./resources/adamportpix.png');
const realAdam = require('./resources/adamport.png');
const reactIcon = require('./resources/reacticon.png');
const nodeIcon = require('./resources/nodeicon.png');
const mongoIcon = require('./resources/mongoicon.png');
const jsIcon = require('./resources/jsicon.png');
const dockerIcon = require('./resources/dockericon.png');
const firebaseIcon = require('./resources/firebaseicon.png');
const awsIcon = require('./resources/awsicon.png');
const htmlIcon = require('./resources/htmlicon.png');
const cssIcon = require('./resources/cssicon.png');
const safesend = require('./resources/safesend.jpg')
const cheats = require('./resources/cheat.jpg');
const crypto = require('./resources/crypto.JPG');
const galquiz = require('./resources/quizgalscreen.PNG');
const linkedinIcon = require('./resources/linkedinicon.png');
const resumeIcon = require('./resources/resumeicon.png');
const emailIcon = require('./resources/emailicon.png');
const vsSnip = require('./resources/vsSnipOne.JPG');
const vsSnipTwo = require('./resources/vsSnipTwo.JPG');
const resumePdf = require('./resources/newresash.pdf');
const githubIcon = require('./resources/githubicon.png');

function App() {

  const [icon, setIcon] = useState(logo);
  const [active, setActive] = useState('about');
  const [progress, setProgress] = useState(0);
  const [captionActive, setCaptionActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [capMessage, setCapMessage] = useState("Hi! Thanks for visiting :)")
  const [isLoading, setIsLoading] = useState(true);

  const sectionTwo = useRef(null);
  const sectionOne = useRef(null);
  const sectionThree = useRef(null);
  const appWrapper = useRef(null);
  const logoCaption = useRef(null);


const icons = [reactIcon, nodeIcon, mongoIcon, jsIcon, dockerIcon, firebaseIcon, awsIcon, htmlIcon, cssIcon];
  
const cacheImages = async (srcArray) => {
  const promises = await srcArray.map((src) => {
    return new Promise(function (resolve, reject) {
      const img = new Image();
      img.src = src;
      img.onload = resolve();
      img.onerror = reject();
    });
  });

  await Promise.all(promises);

  setIsLoading(false)
}

useEffect(() => {
  const imgs = [
    loading,
    logo,
    realAdam,
    reactIcon,
    nodeIcon,
    mongoIcon,
    jsIcon,
    dockerIcon,
    firebaseIcon,
    awsIcon,
    htmlIcon,
    cssIcon,
    safesend,
    cheats,
    crypto,
    galquiz,
    linkedinIcon,
    resumeIcon,
    emailIcon,
    vsSnip,
    vsSnipTwo,
    resumePdf,
    githubIcon    
  ]

  cacheImages(imgs);
}, [])

  const projects = [
    {
        name:"TextSOD",
        description:"Send and receive messages using a 5 Digit Code that is known only by you and your intended respondents",
        tech: ["Node", "React"],
        images: [safesend],
        link: "http://textsod.com"
    },
    {
        name: "My Quiz Gal",
        description: "Learn any language that you want through practice and by testing yourself, for free!",
        tech: ["Node", "React", "Router", "CSS", "HTML"],
        images: [galquiz],
        link: "https://www.myquizgal.com/"
    },
    {
        name: "Cheat Delete",
        description: "Cheat food calorie calculator and workout planner.",
        tech: ["Node", "JSX"],
        images: [cheats],
        link: "https://ashvv1.github.io/cheatdelete"
    },
    {
        name: "Crypto Calc",
        description: "Calculate potential gains or losses on trades of XRP/BTC/ETH",
        tech: ["Node", "React", "JSX"],
        images: [crypto],
        link: "https://ashvv1.github.io/cryptocalc/"
    }

];

  const switchLogo = () => {
    setClickCount((prevCount) => {
      return prevCount + 1
    });
    if(clickCount > 3){
      setCapMessage("Ouch! How many times are you gonna click me?")
    }
    if(icon === logo){
      setIcon(realAdam);
    }else{
      setIcon(logo);
    }
    if(!captionActive){
      logoCaption.current.style.display = 'flex';
      setCaptionActive(true);
    }else{
      logoCaption.current.style.display = 'none';
      setCaptionActive(false);
    }
  }

  const goToSection = (ref) => {
    // ref.current?.scrollIntoView({ behavior: 'smooth' });
    // const elementPosition = ref.current.getBoundingClientRect().top;
    const appHeight = appWrapper.current.getBoundingClientRect().height * .9 * 3;
    console.log(appHeight);
    switch (ref) {
      case sectionOne:
        appWrapper.current.scrollTo({
                top: 0,
                behavior: "smooth"
           });
        break;
      case sectionTwo:
        appWrapper.current.scrollTo({
          top: appHeight *.3333 + 1,
          behavior: "smooth"
     });
        break;
      case sectionThree:
        appWrapper.current.scrollTo({
          top: appHeight *.6666 + 1,
          behavior: "smooth"
     });
        break;
      default: 
        break;
    }
    }
   

  const checkIfInView = (element) => {
    const elementBounds = element.current.getBoundingClientRect();
    return (
      elementBounds.top <= window.innerHeight * 0.3 &&
      elementBounds.top > -1 &&
      elementBounds.bottom - 10 <= (window.innerHeight * 1.2)
    )
  }

  const handleScroll = () => {
    const appHeight = appWrapper.current.getBoundingClientRect().height * 2;
    const topElement = sectionOne.current.getBoundingClientRect().top;
    setProgress((Math.abs(topElement * 1.111237)/ appHeight) * 100 )
    if(checkIfInView(sectionOne)){
      setActive('about');
    }else if(checkIfInView(sectionTwo)){
      setActive('work');
    }else if(checkIfInView(sectionThree)){
      setActive('contact');
    }
  }

  const openEmail = () => {
    window.open('mailto:ashaviv27@gmail.com?subject=Job%20Offer&body=Come%20work%20with%20us!')
  }

  if (isLoading) {
    return (
      <div className="App" id='loading-screen'>
        <img src={loading} alt='loading gif'></img>
      </div>
    )
  }

  return (
    <div className="App" onScroll={() => handleScroll()} ref={appWrapper}>
      <div className='header-container' ref={sectionOne}>
        <header>
          <div className='logo-container'>
          <img onClick = {() => switchLogo()} src={icon} alt="homelogo" className='logo'></img>
          <div className ='logo-caption' ref={logoCaption} ><span>{capMessage}</span></div>
          </div>
          <nav >
            <ul className='nav-list'>
              <li className={active === 'about' ? 'active' : ""} onClick={() => goToSection(sectionOne)}>About</li>
              <li className={active === 'work' ? 'active' : ""} onClick={() => goToSection(sectionTwo)}>Work</li>
              <li className={active === 'contact' ? 'active' : ""} onClick={() => goToSection(sectionThree)}>Contact</li>
            </ul>
            <div className='progress-ball-container'>
            <div className='progress-ball' style={{ left: `${progress}%` }}></div>
            </div>
            
          </nav>
        </header>
      </div>

      <div className='body'>
        <div id="about" className='section column'>
          <div className="headerText" >
           <h4>Hi, my name is</h4>
           <h2>Adam Haviv</h2>
           <h3>I am a FullStack Developer</h3>
           <p>I specialize in building websites and apps using React and NoSQL databases. Currently, I am working as an intern, building a Learning Management System from the ground up as part of a small team.</p>
          </div>

          <img className='vs-snip' src={vsSnip} alt="vscode snippet" hidden={active !== 'about'}></img>
        </div>

        <div id="work" ref={sectionTwo} className='section'>
          <div className="icons-container">
            {icons.map((icon, i) => (
              <img key={`icon${i}`} src={icon} alt='stack icon'></img>
          ))}
            </div>
            <div className="Project-list">
                {projects.map((project, i) => (
                    <div key={project.name} className="Project-list-item">
                      <div className="project-list-desc">
                        <h3>{project.name}</h3>
                        <h4>{project.description}</h4>
                        <br></br>
                        </div>
                        <div className="tech-tiles">{project.tech.map((item, i) => (
                            <div key={item+i}className="tech-tile">{item}</div>
                        ))}
                        </div>
                        <div className="image-gallery">
                            {project.images.map((image,i) => (
                                <a key = {`${project.name}image${i}`} href={project.link}>
                                    <img src={image} alt='gallery' ></img>
                                </a>
                                
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <img className='vs-snip' src={vsSnipTwo} alt="vscode snippet" hidden={active !== 'work'}></img>
        </ div>

        <div id='contact' ref={sectionThree} className='section'>
          <a href='https://www.linkedin.com/in/adam-haviv-84bb17225'><img src={linkedinIcon} alt='linkedin icon'/></a>
          <a href={resumePdf} download='adamhavivresume.pdf'><img src={resumeIcon} alt='resume icon'></img></a>
          <div id='email-icon-container'>
          <img onClick={() => openEmail()} id='email-icon' src={emailIcon} alt='email icon'></img>
          </div>
          <a href={'https://github.com/ashvv1/'} ><img src={githubIcon} alt='github icon'></img></a>
        </div>

      </div>
    </div>
  );
}

export default App;
