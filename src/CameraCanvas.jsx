import { useEffect, useRef, useState, useMemo } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
import usePrevious from './UsePrevious';

const CameraCanvas = ({ pressButton, APP_WRAPPER }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const canvasContainer = useRef(null);
    const pointerFinger = useRef(null);

    const [handData, setHandData] = useState();
    const [cameraLoaded, setCameraLoaded] = useState(false);
    const [loadedModel, setLoadedModel] = useState();
    const [clickStrength, setClickStrength] = useState();

    const prevHandData = usePrevious(handData);

    const loadModel = async () => {
        try {
            const model = await handpose.load();
            setLoadedModel(model);
        } catch (e) {
        }
    }

    const appWidth = APP_WRAPPER?.current?.offsetWidth;
    const appHeight = APP_WRAPPER?.current?.offsetHeight;

    const APP_DIMENSIONS = {
        width: appWidth,
        height: appHeight
    }

    const WIDTH_RATIO = APP_DIMENSIONS?.width / 620
    const HEIGHT_RATIO = APP_DIMENSIONS?.height / 360

    if (!loadedModel) {
        loadModel();
    }

    useEffect(() => {
        const camera = new Camera(videoRef.current);
        const video = videoRef.current;
        camera.start();

        const endstream = async () => {
            video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
            const stream = video.srcObject;

            const tracks = stream.getTracks();
            tracks.forEach((track) => {
                track.stop();
            });
            camera.stop();

        }


        return () => {
            console.log("closing stream")
            endstream();
        }
    }, [])

    const fingerPos = useMemo(() => {
        
        if (handData?.landmarks) {
            return ({
                thumb: { left: handData.landmarks[4][0], top: handData.landmarks[4][1], zIndex: handData.landmarks[4][2] },
                pointer: { left: handData.landmarks[8][0], top: handData.landmarks[8][1], zIndex: handData.landmarks[8][2] },
                middle: { left: handData.landmarks[12][0], top: handData.landmarks[12][1], zIndex: handData.landmarks[12][2] },
                ring: { left: handData.landmarks[16][0], top: handData.landmarks[16][1], zIndex: handData.landmarks[16][2] },
                pinky: { left: handData.landmarks[20][0], top: handData.landmarks[20][1], zIndex: handData.landmarks[20][2] }
            })
        } else {
            return (
                {
                    thumb: { left: -200, top: -200 },
                    pointer: { left: -200, top: -200 },
                    middle: { left: -200, top: -200 },
                    ring: { left: -200, top: -200 },
                    pinky: { left: -200, top: -200 }
                }
            )
        }
    }, [handData])

    console.log(fingerPos);

    const prevFingerPos = useMemo(() => {
        if (prevHandData?.landmarks) {
            return ({
                thumb: { left: prevHandData.landmarks[4][0], top: prevHandData.landmarks[4][1], zIndex: prevHandData.landmarks[4][2] },
                pointer: { left: prevHandData.landmarks[8][0], top: prevHandData.landmarks[8][1], zIndex: prevHandData.landmarks[8][2] },
                middle: { left: prevHandData.landmarks[12][0], top: prevHandData.landmarks[12][1], zIndex: prevHandData.landmarks[12][2] },
                ring: { left: prevHandData.landmarks[16][0], top: prevHandData.landmarks[16][1], zIndex: prevHandData.landmarks[16][2] },
                pinky: { left: prevHandData.landmarks[20][0], top: prevHandData.landmarks[20][1], zIndex: prevHandData.landmarks[20][2] }
            })
        } else {
            if (handData?.length > 0) {
                return {
                    thumb: { left: handData.landmarks[4][0], top: handData.landmarks[4][1], zIndex: handData.landmarks[4][2] },
                    pointer: { left: handData.landmarks[8][0], top: handData.landmarks[8][1], zIndex: handData.landmarks[8][2] },
                    middle: { left: handData.landmarks[12][0], top: handData.landmarks[12][1], zIndex: handData.landmarks[12][2] },
                    ring: { left: handData.landmarks[16][0], top: handData.landmarks[16][1], zIndex: handData.landmarks[16][2] },
                    pinky: { left: handData.landmarks[20][0], top: handData.landmarks[20][1], zIndex: handData.landmarks[20][2] }
                }
            } else {
                return (
                    {
                        thumb: { left: -200, top: -200 },
                        pointer: { left: -200, top: -200 },
                        middle: { left: -200, top: -200 },
                        ring: { left: -200, top: -200 },
                        pinky: { left: -200, top: -200 }
                    }
                )
            }

        }
    }, [handData, prevHandData]);


    useEffect(() => {

        let firstFinger = null;
        let pinching = false;
        let proximityCount = 1;
        let count = 0;

        for (const [key, value] of Object.entries(fingerPos)) {

            if (proximityCount > Object.entries(fingerPos).length - 3) {
                pinching = true;
                // console.log(pinching);
            }

            const left = value.left;
            const top = value.top;
            const zIndex = value.zIndex;
            const prevZ = prevFingerPos[key].zIndex;
            const sensitivity = 10.5;
            const clicking = zIndex < prevZ - sensitivity;
            const currentStrength = prevZ - zIndex;
            const X_PIXELS = (620 - left) * WIDTH_RATIO;
            const Y_PIXELS = top * (HEIGHT_RATIO);

            setClickStrength(currentStrength)

            key === "pointer" && pressButton(X_PIXELS, Y_PIXELS, clicking, pinching);

            if (count === 0) {
                firstFinger = {
                    firstLeft: left,
                    firstTop: top,
                }
                count++
            }

            if (Math.abs(firstFinger.firstLeft - left) < 50 && Math.abs(firstFinger.firstTop - top) < 50) {
                proximityCount++
            }

        }

    }, [HEIGHT_RATIO, WIDTH_RATIO, fingerPos, pressButton, prevFingerPos])

    useEffect(() => {
        const video = videoRef.current;

        async function draw() {
            // Load the MediaPipe handpose model assets.  

            // Pass in a video stream to the model to obtain 
            // a prediction from the MediaPipe graph.
            try {
                if (loadedModel) {

                }
                const hands = await loadedModel.estimateHands(video);
                hands && setCameraLoaded(true);

                if (hands?.length > 0) {
                    setHandData(hands[0])
                } else {
                    setHandData(null);
                }
            } catch (e) {
            }
        }

        const drawInterval = setInterval(() => {
            draw();
        }, 5)

        return () => clearInterval(drawInterval)
    }, [loadedModel])

    return (
        <div className="cameraCanvas" ref={canvasContainer}>

            {!cameraLoaded && <div className='loadingScreen'>
                CAMERA LOADING
            </div>}

            <video ref={videoRef} className="input_video" id='video'></video>
            <canvas ref={canvasRef} className="output_canvas">
            </canvas>
            {/* <div className="fingerTracker" style={{ left: ((620 - fingerPos.thumb.left) * (WIDTH_RATIO)), top: (fingerPos.thumb.top * (HEIGHT_RATIO))}} id="thumb"></div> */}
            <div className={`fingerTracker`} id={`${clickStrength > 10 ? 'clickingFlash' : ""}`}style={{ left: ((620 - fingerPos.pointer.left) * (WIDTH_RATIO)), top: (fingerPos.pointer.top * (HEIGHT_RATIO))}} ref={pointerFinger}></div>
            {/* <div className="fingerTracker" style={{ left: ((620 - fingerPos.middle.left) * (WIDTH_RATIO)), top: (fingerPos.middle.top * (HEIGHT_RATIO)) }}id="middleFing"></div>
            <div className="fingerTracker" style={{ left: ((620 - fingerPos.ring.left) * (WIDTH_RATIO)), top: (fingerPos.ring.top * (HEIGHT_RATIO)) }} id="ringFing"></div>
            <div className="fingerTracker" style={{ left: ((620 - fingerPos.pinky.left) * (WIDTH_RATIO)), top: (fingerPos.pinky.top * (HEIGHT_RATIO)) }} id="pinky"></div> */}
        </div>
    );
};

export default CameraCanvas;