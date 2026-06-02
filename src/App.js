import { useRef, useState, useEffect, useCallback } from 'react';
import './App.css';
import CameraCanvas from './CameraCanvas';
import loading from './resources/loading.gif';
import logo from './resources/adamportpix.png';
import realAdam from './resources/adamport.png';
import safesend from './resources/safesend.jpg';
import cheats from './resources/cheat.jpg';
import anon from './resources/anon.png';
import galquiz from './resources/quizgalscreen.PNG';
import linkedinIcon from './resources/linkedinicon.png';
import resumeIcon from './resources/resumeicon.png';
import emailIcon from './resources/emailicon.png';
import vsSnip from './resources/vsSnipOne.JPG';
import vsSnipTwo from './resources/vsSnipTwo.JPG';
import resumePdf from './resources/adamhavivresume26.pdf';
import githubIcon from './resources/githubicon.png';
import minervaXR from './resources/minervaxr.JPG';
import offSwitch from './resources/offSwitch.png';
import onSwitch from './resources/onSwitch.png';
import blueBrush from './resources/brushes/bluebrush.png';
import site123 from './resources/site123.png';
import pyloftLanding from './resources/pyloft-landing.png';
import pyloftEditor from './resources/pyloft-editor.png';
import TechGlobe from './TechGlobe';

const inRange = (x, y, topMax, bottomMax, rightMax, leftMax) => {
  const xInRange = x < rightMax + 50 && x > leftMax - 50;
  const yInRange = y < bottomMax + 50 && y > topMax - 50;
  return xInRange && yInRange;
};

function ProjectImageRotator({ images, alt, intervalMs = 3500, startDelayMs = 0 }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return undefined;
    let intervalId;
    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        setIdx((i) => (i + 1) % images.length);
      }, intervalMs);
    }, startDelayMs);
    return () => {
      clearTimeout(startId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [images, intervalMs, startDelayMs]);

  if (!images || images.length === 0) return null;

  return images.map((src, i) => (
    <img
      key={src}
      className={`project-image-rotator-img${images.length > 1 && i !== idx ? ' project-image-rotator-img-hidden' : ''}`}
      src={src}
      alt={alt}
    />
  ));
}

function App() {

  const [icon, setIcon] = useState(logo);
  const [active, setActive] = useState('about');
  const [progress, setProgress] = useState(0);
  const [captionActive, setCaptionActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [capMessage, setCapMessage] = useState("Hi! Thanks for visiting :)")
  const [isLoading, setIsLoading] = useState(true);
  const [modeAR, setModeAR] = useState(false);
  const [pinchDrag, setPinchDrag] = useState(null);
  const [selectedProject, setSelectedProject] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  const lastScrollPosRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const lastShakeTimeRef = useRef(0);

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
  const projectStripRef = useRef(null);
  const stripScrollPausedRef = useRef(false);
  const stripScrollDirRef = useRef(1);
  const stripScrollRafRef = useRef(null);

  const APP_WRAPPER = appWrapper;

  const clickedRef = useRef(false);
  const triggeredRef = useRef(false);

  const icons = [
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  ];
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

  useEffect(() => {
    const imgs = [
      loading,
      logo,
      realAdam,
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
      githubIcon,
      pyloftEditor,
      pyloftLanding,
      site123,
    ]

    cacheImages(imgs);
  }, [])

  const projects = [
    {
      name: "Pyloft",
      description: "Free real-time collaborative Python editor. Share a room link, code together with live cursors, take turns running code.",
      tech: ["React", "WebSockets", "Python", "Node"],
      images: [pyloftEditor, pyloftLanding],
      link: "https://py-loft.com"
    },
    {
      name: "MinervaXR - LMS",
      description: "Learning management platform from my MinervaXR internship. My first time building with a team across different platforms and stacks.",
      tech: ["Node", "React", "Firebase", "AWS", "Docker"],
      images: [minervaXR],
      link: null
    },
    {
      name: "AnonChat",
      description: "Spin up a temporary chat room and talk anonymously. Started as a fun idea and my first experiment with near real-time database sync.",
      tech: ["NEXTjs", "Netlify", "Firebase"],
      images: [anon],
      link: "https://bespoke-dolphin-95cd93.netlify.app/",
      repo: "https://github.com/ashvv1/anonchatbase"
    },
    {
      name: "My Quiz Gal",
      description: "Language quizzes for practice and self-testing. Built to make my wife’s tutoring easier—and because language tools have always been close to my heart.",
      tech: ["React", "Router", "Heroku", "Firebase"],
      images: [galquiz],
      link: null
    },
    {
      name: "TextSOD",
      description: "A quiet bridge for discreet messages between friends, using a shared five-digit code and deliberately simple “dumb” encryption.",
      tech: ["React"],
      images: [safesend],
      link: null,
    },
    {
      name: "Cheat Delete",
      description: "My first web app—a small experiment turning calorie estimates into workout suggestions for the usual post-indulgence guilt.",
      tech: ["React"],
      images: [cheats],
      link: "https://ashvv1.github.io/cheatdelete",
      repo: "https://github.com/ashvv1/cheatdelete"
    },
    {
      name: "SITE123",
      description: "Current dev team member",
      tech: [],
      images: [site123],
      link: "https://www.site123.com",
    }
  ];

  useEffect(() => {
    if (isLoading) return undefined;

    const strip = projectStripRef.current;
    if (!strip) return undefined;

    const mobileMq = window.matchMedia('(max-width: 980px), (max-aspect-ratio: 1/1)');
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const SCROLL_PX_PER_SEC = 16;
    let lastTime = 0;

    const shouldAnimate = () => mobileMq.matches && !reducedMq.matches;

    const pauseStripScroll = () => {
      stripScrollPausedRef.current = true;
    };

    const resumeStripScroll = () => {
      stripScrollPausedRef.current = false;
    };

    const onStripPointerDown = () => {
      if (!shouldAnimate()) return;
      pauseStripScroll();

      const onPointerEnd = () => {
        resumeStripScroll();
        document.removeEventListener('pointerup', onPointerEnd);
        document.removeEventListener('pointercancel', onPointerEnd);
      };

      document.addEventListener('pointerup', onPointerEnd);
      document.addEventListener('pointercancel', onPointerEnd);
    };

    const tick = (time) => {
      stripScrollRafRef.current = requestAnimationFrame(tick);

      if (!shouldAnimate() || stripScrollPausedRef.current) {
        lastTime = 0;
        return;
      }

      const maxScroll = strip.scrollWidth - strip.clientWidth;
      if (maxScroll <= 1) {
        lastTime = 0;
        return;
      }

      if (lastTime > 0) {
        const dt = (time - lastTime) / 1000;
        let next = strip.scrollLeft + stripScrollDirRef.current * SCROLL_PX_PER_SEC * dt;

        if (next <= 0) {
          next = 0;
          stripScrollDirRef.current = 1;
        } else if (next >= maxScroll) {
          next = maxScroll;
          stripScrollDirRef.current = -1;
        }

        strip.scrollLeft = next;
      }

      lastTime = time;
    };

    const startLoop = () => {
      if (stripScrollRafRef.current != null) return;
      lastTime = 0;
      stripScrollRafRef.current = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (stripScrollRafRef.current != null) {
        cancelAnimationFrame(stripScrollRafRef.current);
        stripScrollRafRef.current = null;
      }
      lastTime = 0;
    };

    let stripListenersActive = false;

    const syncStripListeners = () => {
      if (shouldAnimate() && !stripListenersActive) {
        strip.addEventListener('pointerdown', onStripPointerDown);
        stripListenersActive = true;
      } else if (!shouldAnimate() && stripListenersActive) {
        strip.removeEventListener('pointerdown', onStripPointerDown);
        stripListenersActive = false;
      }
    };

    const onMqChange = () => {
      if (shouldAnimate()) {
        resumeStripScroll();
        syncStripListeners();
        startLoop();
      } else {
        resumeStripScroll();
        syncStripListeners();
        stopLoop();
      }
    };

    mobileMq.addEventListener('change', onMqChange);
    reducedMq.addEventListener('change', onMqChange);

    onMqChange();

    return () => {
      stopLoop();
      if (stripListenersActive) {
        strip.removeEventListener('pointerdown', onStripPointerDown);
      }
      mobileMq.removeEventListener('change', onMqChange);
      reducedMq.removeEventListener('change', onMqChange);
    };
  }, [isLoading, projects.length]);

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

  // inRange moved outside the component to avoid re-creation


  const checkIfInView = (element) => {
    const elementBounds = element.current.getBoundingClientRect();
    return (
      -50 < elementBounds.top
      && elementBounds.top < 400
    )
  }

  const handleScroll = () => {
    const appHeight = (
      sectionOne.current.clientHeight
      + sectionTwo.current.clientHeight
      + sectionThree.current.clientHeight
    );
    setProgress(appWrapper.current.scrollTop / (appHeight - window.innerHeight) * 100)
    if (checkIfInView(sectionOne)) {
      setActive('about');
    } else if (checkIfInView(sectionTwo)) {
      setActive('work');
    } else if (checkIfInView(sectionThree)) {
      setActive('contact');
    }

    // ── "Hard-scroll" shake: when the user reaches the bottom with
    // significant velocity, jiggle the contact icons like an impact ──
    const wrapper = appWrapper.current;
    if (!wrapper) return;
    const maxScroll = wrapper.scrollHeight - wrapper.clientHeight;
    const currentScroll = wrapper.scrollTop;
    const distanceFromBottom = maxScroll - currentScroll;

    const now = performance.now();
    const dt = now - lastScrollTimeRef.current;
    const dy = currentScroll - lastScrollPosRef.current;
    const velocity = dt > 0 ? dy / dt : 0;
    lastScrollPosRef.current = currentScroll;
    lastScrollTimeRef.current = now;

    if (
      distanceFromBottom < 8 &&
      velocity > 0.6 &&
      (now - lastShakeTimeRef.current) > 1200
    ) {
      lastShakeTimeRef.current = now;
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 950);
    }
  }


  const openEmail = () => {
    window.open('mailto:ashaviv27@gmail.com?subject=Job%20Offer&body=Come%20work%20with%20us!')
  }


  const pressButton = useCallback((x_axis, y_axis, clicking, pinching) => {
    if (pinching) {
      setPinchDrag((prev) => {
        if (prev?.active && prev.x === x_axis && prev.y === y_axis) return prev;
        return { active: true, x: x_axis, y: y_axis };
      });
    } else {
      setPinchDrag((prev) => prev?.active ? { active: false, x: 0, y: 0 } : prev);
    }

    let triggerCount = 0;

    const menuElements = [buttonOne, buttonTwo, buttonThree, buttonFour];

    for (let i = 0; i < menuElements.length; i++) {
      const menuButton = menuElements[i].current.getBoundingClientRect()
      const topMax = menuButton.top;
      const bottomMax = menuButton.bottom;
      const leftMax = menuButton.left;
      const rightMax = menuButton.right;
      if (inRange(x_axis, y_axis, topMax, bottomMax, rightMax, leftMax)) {
        menuElements[i].current.setAttribute("aria-label", "hovered");
        triggerCount++
        if (!clickedRef.current && clicking) {
          menuElements[i].current.setAttribute("aria-selected", "true")
          menuElements[i].current.setAttribute("aria-label", "un-hover");
          setTimeout(() => {
            menuElements[i].current.setAttribute("aria-selected", "false")
          }, 10)
          clickedRef.current = true;
          menuElements[i].current.click();
          // eslint-disable-next-line no-loop-func
          setTimeout(() => {
            clickedRef.current = false;
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
          if (!clickedRef.current && clicking) {
            clickedRef.current = true;
            sectionElements[i].current.click();
            // eslint-disable-next-line no-loop-func
            setTimeout(() => {
              clickedRef.current = false;
            }, 800)
            break;
          }
        }
      }
    }
    triggeredRef.current = triggerCount > 0;
    const activeElement = document.querySelector('[aria-label="hovered"]');
    !triggeredRef.current && activeElement?.setAttribute("aria-label", "un-hover");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);


  if (isLoading) {
    return (
      <div className="App" id='loading-screen'>
        <img src={loading} alt='loading gif'></img>
      </div>
    )
  }

  const featuredProject = projects[selectedProject] || projects[0];
  const hasProjectActions = Boolean(featuredProject.link || featuredProject.repo);

  return (
    <div className={`App ${modeAR ? 'arMode' : ""}`} onScroll={() => handleScroll()} ref={appWrapper}>
      {modeAR ? <CameraCanvas pressButton={pressButton} APP_WRAPPER={APP_WRAPPER} /> : null}
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

      <button
        type="button"
        className={`mobile-ar-bubble ${modeAR ? 'active' : ''}`}
        onClick={() => setModeAR(!modeAR)}
        aria-pressed={modeAR}
        aria-label={modeAR ? 'Disable camera mode' : 'Enable camera mode'}
      >
        <span className="mobile-ar-bubble-orb">
          <img src={modeAR ? onSwitch : offSwitch} alt="" />
        </span>
        <span className="mobile-ar-bubble-text">{modeAR ? 'ON' : 'AR'}</span>
      </button>

      <div className={`body `} >

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
              <p>I specialize in building websites and web apps using a wide range of technologies.
              With over 3 years of experience in building both professional and personal projects, I have a passion for innovation and learning new technologies.</p>
            </div>
          </div>

          <img className='vs-snip' src={vsSnip} alt="vscode snippet" ></img>
        </div>

        <div id="work" ref={sectionTwo} className='section projects-section'>
          <div className="projects-shell">
            <div className="projects-copy">
              <span className="section-kicker">Selected work</span>
              <h2>Projects with a purpose</h2>
              <p>
                A focused look at the products and experiments I have built, paired with the
                stack that powers them.
              </p>
            </div>

            <div className="projects-visual">
              <div className="projects-globe-frame">
                <TechGlobe
                  icons={icons}
                  pinchDrag={modeAR ? pinchDrag : null}
                  isARMode={modeAR}
                  isMobile={window.innerWidth <= window.innerHeight}
                />
              </div>
            </div>

            <article className="featured-project-card">
              <div className="featured-project-media" aria-label={`${featuredProject.name} preview`}>
                <ProjectImageRotator images={featuredProject.images} alt={featuredProject.name} />
              </div>
              <div className="featured-project-content">
                <span className="featured-project-index">
                  {String(selectedProject + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                </span>
                <h3>{featuredProject.name}</h3>
                <p>{featuredProject.description}</p>
                {featuredProject.tech.length > 0 && (
                  <div className="featured-project-tech">
                    {featuredProject.tech.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                )}
                <div className="project-actions">
                  {featuredProject.link && (
                    <a href={featuredProject.link} target="_blank" rel="noreferrer">Visit site</a>
                  )}
                  {featuredProject.repo && (
                    <a href={featuredProject.repo} target="_blank" rel="noreferrer">GitHub</a>
                  )}
                  {!hasProjectActions && <span>Private project</span>}
                </div>
              </div>
            </article>

            <div
              className="project-selector-strip"
              ref={projectStripRef}
              aria-label="Select project"
            >
              {projects.map((project, i) => (
                <button
                  key={project.name}
                  type="button"
                  className={`project-selector-card ${selectedProject === i ? 'active' : ''}`}
                  onClick={() => setSelectedProject(i)}
                >
                  <span className="project-selector-thumb">
                    <img src={project.images[0]} alt="" />
                  </span>
                  <span className="project-selector-copy">
                    <strong>{project.name}</strong>
                    <small>{project.tech.length > 0 ? project.tech.slice(0, 3).join(' · ') : 'Professional work'}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div id='contact' ref={sectionThree} className={`section contact-section ${active === 'contact' ? 'contact-active' : ''}`}>
          <div className={`contact-panel ${isShaking ? 'shaking' : ''}`}>
            <div className="contact-copy">
              <span className="section-kicker">Contact</span>
              <h2>Contact</h2>
              <p>
                You can reach me through LinkedIn, email, GitHub, or download my CV below.
              </p>
            </div>

            <div className="contact-actions">
              <a className="contact-action" href='https://www.linkedin.com/in/adam-haviv-84bb17225' target="_blank" rel="noreferrer" ref={linkedinRef}>
                <span className="contact-action-icon"><img src={linkedinIcon} alt='' /></span>
                <span className="contact-action-text">
                  <strong>LinkedIn</strong>
                  <small>Connect with me</small>
                </span>
              </a>
              <a className="contact-action" href={resumePdf} download='adamhavivresume.pdf' target="_blank" rel="noreferrer" ref={cvRef}>
                <span className="contact-action-icon"><img src={resumeIcon} alt='' /></span>
                <span className="contact-action-text">
                  <strong>CV</strong>
                  <small>Download resume</small>
                </span>
              </a>
              <button className="contact-action" type="button" onClick={() => openEmail()} ref={mailRef}>
                <span className="contact-action-icon"><img id='email-icon' src={emailIcon} alt='' /></span>
                <span className="contact-action-text">
                  <strong>Email</strong>
                  <small>ashaviv27@gmail.com</small>
                </span>
              </button>
              <a className="contact-action" href={'https://github.com/ashvv1/'} target="_blank" rel="noreferrer" ref={gitRef}>
                <span className="contact-action-icon"><img src={githubIcon} alt='' /></span>
                <span className="contact-action-text">
                  <strong>GitHub</strong>
                  <small>github.com/ashvv1</small>
                </span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
