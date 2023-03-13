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
const onSwitch = require('./resources/onSwitch.png');
const blueBrush = require('./resources/brushes/bluebrush.png');



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

  const linkedinRef = useRef(null);
  const cvRef = useRef(null);
  const mailRef = useRef(null);
  const gitRef = useRef(null);

  const pathRef = useRef(null);

  const APP_WRAPPER = appWrapper;

  let clicked = false;
  let triggered = false;

  const icons = [reactIcon, nodeIcon, mongoIcon, jsIcon, dockerIcon, firebaseIcon, awsIcon, htmlIcon, cssIcon];
  const brushes = [blueBrush]

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

  const pathLength = pathRef.current ? pathRef.current.getTotalLength() : 0;
  
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

  const inRange = (x, y, topMax, bottomMax, rightMax, leftMax) => {
    const xInRange = x < rightMax + 50 && x > leftMax - 50;
    const yInRange = y < bottomMax + 50 && y > topMax - 50;
    return xInRange && yInRange;
  }


  const checkIfInView = (element) => {
    const elementBounds = element.current.getBoundingClientRect();
    return (
      -50 < elementBounds.top
      && elementBounds.top < 400
    )
  }

  const handleScroll = () => {

  const drawLength = (pathLength * progress * .01);

  // Draw in reverse
  pathRef && (pathRef.current.style.strokeDashoffset = pathLength - drawLength);
    
  // When complete, remove the dash array, otherwise shape isn't quite sharp
 // Accounts for fuzzy math
  if (progress >= 99.90) {
    pathRef.current.style.strokeDasharray = "none";
  } else {
    pathRef.current && (pathRef.current.style.strokeDasharray = pathLength + ' ' + pathLength);
  }
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

  const pressButton = (x_axis, y_axis, clicking, pinching) => {

    let triggerCount = 0;

    const menuElements = [buttonOne, buttonTwo, buttonThree, buttonFour];

    for (let i = 0; i < menuElements.length; i++) {
      const topMax = menuElements[i].current.getBoundingClientRect().top;
      const bottomMax = menuElements[i].current.getBoundingClientRect().bottom;
      const leftMax = menuElements[i].current.getBoundingClientRect().left;
      const rightMax = menuElements[i].current.getBoundingClientRect().right;
      if (inRange(x_axis, y_axis, topMax, bottomMax, rightMax, leftMax)) {
        menuElements[i].current.setAttribute("aria-label", "hovered");
        triggerCount++
        if (!clicked && clicking) {
          menuElements[i].current.setAttribute("aria-selected", "true")
          menuElements[i].current.setAttribute("aria-label", "un-hover");
          setTimeout(() => {
            menuElements[i].current.setAttribute("aria-selected", "false")
          }, 10)
          clicked = true;
          menuElements[i].current.click();
          // eslint-disable-next-line no-loop-func
          setTimeout(() => {
            clicked = false;
          }, 800)
        }
        break;
      }
    }

    if (active === 'contact') {
      const sectionElements = [linkedinRef, cvRef, mailRef, gitRef];

      for (let i = 0; i < sectionElements.length; i++) {
        const topMax = sectionElements[i].current.getBoundingClientRect().top;
        const bottomMax = sectionElements[i].current.getBoundingClientRect().bottom;
        const leftMax = sectionElements[i].current.getBoundingClientRect().left;
        const rightMax = sectionElements[i].current.getBoundingClientRect().right;

        if (inRange(x_axis, y_axis, topMax, bottomMax, rightMax, leftMax)) {
          sectionElements[i].current.setAttribute("aria-label", "hovered");
          triggerCount++
          if (!clicked && clicking) {
            clicked = true;
            sectionElements[i].current.click();
            // eslint-disable-next-line no-loop-func
            setTimeout(() => {
              clicked = false;
            }, 800)
            break;
          }
        }
      }
    }
    triggerCount > 0 ? triggered = true : triggered = false;
    const activeElement = document.querySelector('[aria-label="hovered"]');
    !triggered && activeElement?.setAttribute("aria-label", "un-hover");
  }


pathRef.current && (pathRef.current.style.strokeDasharray = pathLength + ' ' + pathLength);

progress < .1 && (pathRef.current && (pathRef.current.style.strokeDashoffset = pathLength))

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
              <li className={active === 'about' ? 'active' : ""} onClick={() => goToSection(sectionOne)} ref={buttonOne}>About</li>
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

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0.327874 0.448701 17.2 12.37" className={modeAR ? 'hidden' : 'svgPath'} visibility={progress < .1 ? "hidden" : ""}>
      <path ref={pathRef}
        d="M 4.835 7.02 C 0.488 3.868 -1.358 15.133 2.63 12.159 C 4.099 11.25 7.772 4.673 4.832 6.971 
        C 3.084 8.101 2.77 11.74 2.665 12.124 C 2.41 14.545 6.548 8.871 8.507 7.716 C 11.771 5.434 7.073
        5.163 7.842 8.101 C 9.067 14.363 5.883 12.404 5.428 11.39 C 3.749 7.647 8.997 12.754 9.836 10.9 
        C 11.655 7.542 19.422 1.769 16.938 0.58 C 15.049 -0.12 8.507 11.145 9.56 12.002 C 10.517 12.541 12.132 
        6.378 13.568 7.664 C 14.256 8.502 10.128 12.84 13.179 11.853 C 14.107 11.464 14.705 10.626 14.944 9.549"
        stroke="#E9ECF8" strokeWidth="0.05" fill="none" />
    </svg>

        <div id="about" className='section column' ref={sectionOne}>

          <div className={'colorsContainer'}>
            {brushes.map(brush => (
              <div className='brush' key={brush}><img src={blueBrush} alt="blue brush" ></img></div>
            ))}
          </div>
          <div className="headerText" >
            <div id='upOne'>
              <h4>Hi, my name is</h4>
              <h2>Adam Haviv</h2>
            </div>
            <div id='upTwo'>
              <h3>I am a FullStack Developer</h3>
            </div>
            <div id='upThree'>
              <p>I specialize in building websites and apps using React, Next.js and NoSQL databases.
                I have over one year of experience in building both professional and personal projects. My current focus is on AR and VR technologies.</p>
            </div>
          </div>

          <img className='vs-snip' src={vsSnip} alt="vscode snippet" ></img>
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
        
        </ div>

        <div id='contact' ref={sectionThree} className='section'>
          <div className="contact-icons">

            <a href='https://www.linkedin.com/in/adam-haviv-84bb17225' target="_blank" rel="noreferrer" ref={linkedinRef}><img src={linkedinIcon} alt='linkedin icon' ref={linkedinRef} /></a>
            <a href={resumePdf} download='adamhavivresume.pdf' target="_blank" rel="noreferrer" ref={cvRef}><img src={resumeIcon} alt='resume icon' ></img></a>
            <div id='email-icon-container' >
              <img onClick={() => openEmail()} id='email-icon' src={emailIcon} alt='email icon' ref={mailRef}></img>
            </div>
            <a href={'https://github.com/ashvv1/'} target="_blank" rel="noreferrer" ref={gitRef}><img src={githubIcon} alt='github icon'></img></a>

          </div>

        </div>

      </div>
    </div>
  );
}

export default App;
