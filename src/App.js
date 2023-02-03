import { useRef, useState, useEffect } from 'react';
import './App.css';
import CameraCanvas from './CameraCanvas';
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
const anon = require('./resources/anon.png')
const galquiz = require('./resources/quizgalscreen.PNG');
const linkedinIcon = require('./resources/linkedinicon.png');
const resumeIcon = require('./resources/resumeicon.png');
const emailIcon = require('./resources/emailicon.png');
const vsSnip = require('./resources/vsSnipOne.JPG');
const vsSnipTwo = require('./resources/vsSnipTwo.JPG');
const resumePdf = require('./resources/engResumeAdamShaneHaviv.pdf');
const githubIcon = require('./resources/githubicon.png');
const minervaXR = require('./resources/minervaxr.JPG');
const githubSmall = require('./resources/githubsmall.png');
const websiteIcon = require('./resources/tabicon.png');
const offSwitch = require('./resources/offSwitch.png');
const onSwitch = require('./resources/onSwitch.png')


function App() {

  const [icon, setIcon] = useState(logo);
  const [active, setActive] = useState('about');
  const [progress, setProgress] = useState(0);
  const [captionActive, setCaptionActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [capMessage, setCapMessage] = useState("Hi! Thanks for visiting :)")
  const [isLoading, setIsLoading] = useState(true);
  const [modeAR, setModeAR] = useState(false);

  const sectionTwo = useRef(null);
  const sectionOne = useRef(null);
  const sectionThree = useRef(null);
  const appWrapper = useRef(null);
  const logoCaption = useRef(null);

  const buttonOne = useRef(null);
  const buttonTwo = useRef(null);
  const buttonThree = useRef(null);
  const buttonFour = useRef(null);
  const buttonFive = useRef(null);

  const APP_WRAPPER = appWrapper;
 

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
      anon,
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
      name: "MinervaXR - LMS",
      description: "A Learning Management System made during my internship at MinervaXR ",
      tech: ["Node", "React", "Firebase", "AWS", "Docker"],
      images: [minervaXR],
      link: null
    },
    {
      name: "AnonChat",
      description: "Open a temporary chat room at chat anonymously",
      tech: ["NEXTjs", "Netlify", "Firebase"],
      images: [anon],
      link: "https://bespoke-dolphin-95cd93.netlify.app/",
      repo: "https://github.com/ashvv1/anonchatbase"
    },
    {
      name: "My Quiz Gal",
      description: "Learn any language that you want through practice and by testing yourself, for free!",
      tech: ["React", "Router", "Heroku", "Firebase"],
      images: [galquiz],
      link: "https://www.myquizgal.com/"
    },
    {
      name: "TextSOD",
      description: "Send and receive messages using a 5 Digit Code that is known only by you and your intended respondents",
      tech: ["React"],
      images: [safesend],
      link: "http://textsod.com",
    },
    {
      name: "Cheat Delete",
      description: "Get a customized workout according to calorie intake",
      tech: ["React"],
      images: [cheats],
      link: "https://ashvv1.github.io/cheatdelete",
      repo: "https://github.com/ashvv1/cheatdelete"
    }
  ];

  const switchLogo = () => {
    setClickCount((prevCount) => {
      return prevCount + 1
    });
    if (clickCount > 3) {
      setCapMessage("Ouch! How many times are you gonna click me?")
    }
    if (icon === logo) {
      setIcon(realAdam);
    } else {
      setIcon(logo);
    }
    if (!captionActive) {
      logoCaption.current.style.display = 'flex';
      setCaptionActive(true);
    } else {
      logoCaption.current.style.display = 'none';
      setCaptionActive(false);
    }
  }

  const goToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }


  const checkIfInView = (element) => {
    const elementBounds = element.current.getBoundingClientRect();
    return (
      -50 < elementBounds.top
      && elementBounds.top < 400
    )
  }

  const handleScroll = () => {
    const appHeight = (sectionOne.current.clientHeight + sectionTwo.current.clientHeight + sectionThree.current.clientHeight);
    setProgress(appWrapper.current.scrollTop / (appHeight - window.innerHeight) * 100)
    if (checkIfInView(sectionOne)) {
      setActive('about');
    } else if (checkIfInView(sectionTwo)) {
      setActive('work');
    } else if (checkIfInView(sectionThree)) {
      setActive('contact');
    }
  }


  const openEmail = () => {
    window.open('mailto:ashaviv27@gmail.com?subject=Job%20Offer&body=Come%20work%20with%20us!')
  }

  const pressButton = (button, clickStrength) => {
    const activeElement = document.querySelector('[aria-label="hovered"]');
    (activeElement && !clickStrength) && activeElement.setAttribute("aria-label", "unhovered");

    switch (button) {
      case 1:
        buttonOne.current.setAttribute("aria-label", "pressed");
        buttonOne.current.click();
        break;
      case 2:
        buttonTwo.current.setAttribute("aria-label", "pressed");
        buttonTwo.current.click();
        break;
      case 3:
        buttonThree.current.setAttribute("aria-label", "pressed");
        buttonThree.current.click();
        break;
      case 4:
        buttonFour.current.setAttribute("aria-label", "pressed");
        buttonFour.current.click();
        break;
      case 5:
        buttonFive.current.setAttribute("aria-label", "pressed");
        buttonFive.current.click();
        break;
      case -1:
        buttonOne.current.setAttribute("aria-label", "hovered");
        break;
      case -2:
        buttonTwo.current.setAttribute("aria-label", "hovered");
        break;
      case -3:
        buttonThree.current.setAttribute("aria-label", "hovered");
        break;
      case -4:
        buttonFour.current.setAttribute("aria-label", "hovered");
        break;
      case -5:
        buttonFive.current.setAttribute("aria-label", "hovered");
        break;
      default:
        break;
    }
  }

  if (isLoading) {
    return (
      <div className="App" id='loading-screen'>
        <img src={loading} alt='loading gif'></img>
      </div>
    )
  }

  return (
    <div className={`App ${modeAR ? 'arMode' : ""}`} onScroll={() => handleScroll()} ref={appWrapper}>
      {modeAR ? <CameraCanvas arActive={modeAR} pressButton={pressButton} APP_WRAPPER={APP_WRAPPER} /> : null}
      <div className='header-container'>
        <header>
          <div className='logo-container'>
            <img onClick={() => switchLogo()} src={icon} alt="homelogo" className='logo' ref={buttonFive}></img>
            <div className='logo-caption' ref={logoCaption} ><span>{capMessage}</span></div>
          </div>
          <div className="arButton" onClick={() => setModeAR(!modeAR)} ref={buttonFour}><h3>ARMODE</h3><img src={modeAR ? onSwitch : offSwitch} alt="ar is on"></img></div>
          <nav >

            <ul className='nav-list'>
              <li className={active === 'about' ? 'active' : ""} onClick={() => goToSection(sectionOne)} ref={buttonOne}  >About</li>
              <li className={active === 'work' ? 'active' : ""} onClick={() => goToSection(sectionTwo)} ref={buttonTwo}>Projects</li>
              <li className={active === 'contact' ? 'active' : ""} onClick={() => goToSection(sectionThree)} ref={buttonThree}>Contact</li>
            </ul>
            <div className='progress-ball-container'>
              <div className='progress-ball' style={{ left: `${progress}%` }}></div>
            </div>

          </nav>
        </header>
      </div>

      <div className={`body `} >
        <div id="about" className='section column' ref={sectionOne}>
          <div className="headerText" >
            <div id='upOne'>
              <h4>Hi, my name is</h4>
              <h2>Adam Haviv</h2>
            </div>
            <div id='upTwo'>
              <h3>I am a FullStack Developer</h3>
            </div>
            <div id='upThree'>
              <p>I specialize in building websites and apps using React and NoSQL databases.
                Currently, I am working as an intern, building a Learning Management System from the ground up as part of a small team.</p>
            </div>
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

                <img className="projectBackgroundImage" src={project.images[0]} alt={`${project.name} background`} />
                <div className="project-list-desc">
                  {project.repo && <a href={project.repo} target="_blank" rel="noreferrer" className="projectIcon" id="topLeft"><img src={githubSmall} alt={"link to github"} /></a>}
                  {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="projectIcon" id="topRight"><img src={websiteIcon} alt={"link to website"} /></a>}
                  <h3>{project.name}</h3>
                  <h4>{project.description}</h4>
                  <p className="project-tech">Made using: {project.tech.map(tech => <span key={tech}>{tech} </span>)}</p>
                </div>
              </div>
            ))}
          </div>
          <img className='vs-snip' src={vsSnipTwo} alt="vscode snippet" hidden={active !== 'work'}></img>
        </ div>

        <div id='contact' ref={sectionThree} className='section'>
          <div className="contact-icons">

            <a href='https://www.linkedin.com/in/adam-haviv-84bb17225' target="_blank" rel="noreferrer"><img src={linkedinIcon} alt='linkedin icon' /></a>
            <a href={resumePdf} download='adamhavivresume.pdf' target="_blank" rel="noreferrer"><img src={resumeIcon} alt='resume icon'></img></a>
            <div id='email-icon-container'>
              <img onClick={() => openEmail()} id='email-icon' src={emailIcon} alt='email icon'></img>
            </div>
            <a href={'https://github.com/ashvv1/'} target="_blank" rel="noreferrer"><img src={githubIcon} alt='github icon'></img></a>

          </div>

        </div>

      </div>
    </div>
  );
}

export default App;
