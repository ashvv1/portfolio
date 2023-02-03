import { useEffect, useRef, useState, useMemo } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
import usePrevious from './UsePrevious';

const CameraCanvas = ({ arActive, pressButton, APP_WRAPPER}) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const canvasContainer = useRef(null);

    const [handData, setHandData] = useState();
    const [cameraLoaded, setCameraLoaded] = useState(false);
    const [loadedModel , setLoadedModel] = useState();

    const prevHandData = usePrevious(handData);
   
    const loadModel = async () => {
        try{
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

    if(!loadedModel){
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
                thumb: {left: handData.landmarks[4][0], top: handData.landmarks[4][1], zIndex: handData.landmarks[4][2]},
                pointer: {left: handData.landmarks[8][0], top: handData.landmarks[8][1], zIndex: handData.landmarks[8][2]},
                middle: {left: handData.landmarks[12][0], top: handData.landmarks[12][1], zIndex: handData.landmarks[12][2]},
                ring: {left: handData.landmarks[16][0], top: handData.landmarks[16][1], zIndex: handData.landmarks[16][2]},
                pinky: {left: handData.landmarks[20][0], top: handData.landmarks[20][1], zIndex: handData.landmarks[20][2]}
            })
        } else {
            return (
                { 
                    thumb: {left: -200, top: -200 },
                    pointer: {left: -200, top: -200 },
                    middle: {left: -200, top: -200 },
                    ring: {left: -200, top: -200 },
                    pinky: {left: -200, top: -200 }
                }
                )
        }
    }, [handData])

    const prevFingerPos = useMemo(() => {
        if (prevHandData?.landmarks) {
            return ({
                thumb: {left: prevHandData.landmarks[4][0], top: prevHandData.landmarks[4][1], zIndex: prevHandData.landmarks[4][2]},
                pointer: {left: prevHandData.landmarks[8][0], top: prevHandData.landmarks[8][1], zIndex: prevHandData.landmarks[8][2]},
                middle: {left: prevHandData.landmarks[12][0], top: prevHandData.landmarks[12][1], zIndex: prevHandData.landmarks[12][2]},
                ring: {left: prevHandData.landmarks[16][0], top: prevHandData.landmarks[16][1], zIndex: prevHandData.landmarks[16][2]},
                pinky: {left: prevHandData.landmarks[20][0], top: prevHandData.landmarks[20][1], zIndex: prevHandData.landmarks[20][2]}
            })
        } else {
            if(handData?.length > 0 ){
             return {   thumb: {left: handData.landmarks[4][0], top: handData.landmarks[4][1], zIndex: handData.landmarks[4][2]},
                pointer: {left: handData.landmarks[8][0], top: handData.landmarks[8][1], zIndex: handData.landmarks[8][2]},
                middle: {left: handData.landmarks[12][0], top: handData.landmarks[12][1], zIndex: handData.landmarks[12][2]},
                ring: {left: handData.landmarks[16][0], top: handData.landmarks[16][1], zIndex: handData.landmarks[16][2]},
                pinky: {left: handData.landmarks[20][0], top: handData.landmarks[20][1], zIndex: handData.landmarks[20][2]}
            }
            }else{
                return (
                    { 
                        thumb: {left: -200, top: -200 },
                        pointer: {left: -200, top: -200 },
                        middle: {left: -200, top: -200 },
                        ring: {left: -200, top: -200 },
                        pinky: {left: -200, top: -200 }
                    }
                    )
            }
      
        }
    }, [handData, prevHandData]);

    useEffect(() => {
        
        let triggered = false;
        
        for (const [key, value] of Object.entries(fingerPos)){

            const left = value.left;
            const top = value.top;
            const zIndex = value.zIndex;
            const prevZ = prevFingerPos[key].zIndex;
            const clicking = zIndex < prevZ-10.2;
            const clickStrength = prevZ - zIndex;



            if((left > 420 && left < 480) &&(top > 0 && top < 50)){
                clicking && pressButton(1, clickStrength);
                pressButton(-1);
                triggered = true
            }else if((left > 270 && left < 330) &&(top > 0 && top < 55)){
                clicking && pressButton(2, clickStrength);
                pressButton(-2);
                triggered = true
            }else if((left > 120 && left < 180) &&(top > 0 && top < 55)){
                clicking && pressButton(3, clickStrength);
                pressButton(-3);
                triggered = true
            }else if((left > 0 && left < 30) &&(top > 0 && top < 55)){
                clicking && pressButton(4, clickStrength);
                pressButton(-4);
                triggered = true
            }else if((left > 570 && left < 610) &&(top > 0 && top < 55)){
                // pressButton(5);
                // triggered = true
            }else{
                !triggered && pressButton(900);
            }
        }
        
    },[fingerPos, pressButton, prevFingerPos])

    useEffect(() => {
        const video = videoRef.current;

        async function draw() {
         
          
            // Load the MediaPipe handpose model assets.  
           
            // Pass in a video stream to the model to obtain 
            // a prediction from the MediaPipe graph.
            try{
                if(loadedModel){

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
        }, 10)

        return () => clearInterval(drawInterval)
    }, [loadedModel])



    return (
        <div className="cameraCanvas" ref={canvasContainer}>
       
            {!cameraLoaded &&  <div className='loadingScreen'>
CAMERA LOADING
</div>}
          
            <video ref={videoRef} className="input_video" id='video'></video>
                <canvas ref={canvasRef} className="output_canvas">
                </canvas>
 
       
            <div className="fingerTracker" style={{ left: ((620 - fingerPos.thumb.left) * (APP_DIMENSIONS.width/620)), top: (fingerPos.thumb.top * (APP_DIMENSIONS.height/330))}} id="thumb"></div>
            <div className="fingerTracker" style={{ left: ((620 - fingerPos.pointer.left) * (APP_DIMENSIONS.width/620)), top: (fingerPos.pointer.top * (APP_DIMENSIONS.height/350)) }}></div>
            <div className="fingerTracker" style={{ left: ((620 - fingerPos.middle.left) * (APP_DIMENSIONS.width/620)), top: (fingerPos.middle.top * (APP_DIMENSIONS.height/350)) }}id="middleFing"></div>
            <div className="fingerTracker" style={{ left: ((620 - fingerPos.ring.left) * (APP_DIMENSIONS.width/620)), top: (fingerPos.ring.top * (APP_DIMENSIONS.height/350)) }} id="ringFing"></div>
            <div className="fingerTracker" style={{ left: ((620 - fingerPos.pinky.left) * (APP_DIMENSIONS.width/620)), top: (fingerPos.pinky.top * (APP_DIMENSIONS.height/350)) }} id="pinky"></div>
        </div>
    );
};

export default CameraCanvas;