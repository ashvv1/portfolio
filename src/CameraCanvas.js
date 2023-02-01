import { useEffect, useRef, useState, useMemo } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';

const CameraCanvas = ({ arActive, pressButton }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const canvasContainer = useRef(null);

    const [handData, setHandData] = useState([]);
    const [cameraLoaded, setCameraLoaded] = useState(false);
    const [loadedModel , setLoadedModel] = useState();
   
    const loadModel = async () => {
        try{
            const model = await handpose.load();
            setLoadedModel(model);
        } catch (e) {
        } 
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
                thumb: {left: handData.landmarks[4][0], top: handData.landmarks[4][1]},
                pointer: {left: handData.landmarks[8][0], top: handData.landmarks[8][1]},
                middle: {left: handData.landmarks[12][0], top: handData.landmarks[12][1]},
                ring: {left: handData.landmarks[16][0], top: handData.landmarks[16][1]},
                pinky: {left: handData.landmarks[20][0], top: handData.landmarks[20][1]}
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

    useEffect(() => {
        
        let triggered = false;
        
        for (const [key, value] of Object.entries(fingerPos)){
            const left = value.left;
            const top = value.top;
            console.log(left);

            if((left > 420 && left < 480) &&(top > 0 && top < 50)){
                pressButton(1);
                triggered = true
            }else if((left > 270 && left < 330) &&(top > 0 && top < 55)){
                pressButton(2)
                triggered = true
            }else if((left > 120 && left < 180) &&(top > 0 && top < 55)){
                pressButton(3);
                triggered = true
            }else if((left > 0 && left < 30) &&(top > 0 && top < 55)){
                pressButton(4);
                triggered = true
            }else{
                !triggered && pressButton(900);
            }
        }
        
    },[fingerPos, pressButton])

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
        }, 100)

        return () => clearInterval(drawInterval)
    }, [loadedModel])

    return (
        <div className="cameraCanvas" ref={canvasContainer}>
            <div className="cameraCanvasInnter">
            {!cameraLoaded &&  <div className='loadingScreen'>
CAMERA LOADING
</div>}
          
            <video ref={videoRef} className="input_video" id='video'></video>
                <canvas ref={canvasRef} className="output_canvas">
                </canvas>
 
            </div>
            <div className="fingerTracker" style={{ left: ((600 - fingerPos.thumb.left) * 3.0), top: (fingerPos.thumb.top * 2.5) }} id="thumb"></div>
            <div className="fingerTracker" style={{ left: ((600 - fingerPos.pointer.left) * 3.0), top: (fingerPos.pointer.top * 2.5) }}></div>
            <div className="fingerTracker" style={{ left: ((600 - fingerPos.middle.left) * 3.0), top: (fingerPos.middle.top * 2.5) }}id="middleFing"></div>
            <div className="fingerTracker" style={{ left: ((600 - fingerPos.ring.left) * 3.0), top: (fingerPos.ring.top * 2.5) }} id="ringFing"></div>
            <div className="fingerTracker" style={{ left: ((600 - fingerPos.pinky.left) * 3.0), top: (fingerPos.pinky.top * 2.5) }} id="pinky"></div>
        </div>
    );
};

export default CameraCanvas;