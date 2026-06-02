import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
import usePrevious from './UsePrevious';

const DEFAULT_FINGER = { left: -200, top: -200, zIndex: 0 };
const DEFAULT_FINGERS = {
    thumb: { ...DEFAULT_FINGER },
    pointer: { ...DEFAULT_FINGER },
    middle: { ...DEFAULT_FINGER },
    ring: { ...DEFAULT_FINGER },
    pinky: { ...DEFAULT_FINGER },
};

const returnLandmarks = (hand) => ({
    thumb: { left: hand[4][0], top: hand[4][1], zIndex: hand[4][2] },
    pointer: { left: hand[8][0], top: hand[8][1], zIndex: hand[8][2] },
    middle: { left: hand[12][0], top: hand[12][1], zIndex: hand[12][2] },
    ring: { left: hand[16][0], top: hand[16][1], zIndex: hand[16][2] },
    pinky: { left: hand[20][0], top: hand[20][1], zIndex: hand[20][2] },
});

const CameraCanvas = ({ pressButton, APP_WRAPPER }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const canvasContainer = useRef(null);
    const flashTimeoutRef = useRef(null);

    const [handData, setHandData] = useState(null);
    const [cameraLoaded, setCameraLoaded] = useState(false);
    const [loadedModel, setLoadedModel] = useState(null);
    const [cameraError, setCameraError] = useState(null);
    const [clickFlash, setClickFlash] = useState(false);

    const prevHandData = usePrevious(handData);

    // FIX: Move model loading into useEffect instead of during render
    useEffect(() => {
        let cancelled = false;
        const loadModel = async () => {
            try {
                const model = await handpose.load();
                if (!cancelled) {
                    setLoadedModel(model);
                }
            } catch (e) {
                console.error('Failed to load handpose model:', e);
                if (!cancelled) {
                    setCameraError('Hand tracking could not load. Please refresh and try again.');
                }
            }
        };
        loadModel();
        return () => { cancelled = true; };
    }, []);

    // Map model coordinates into the visible canvas. The previous 620x360
    // mapping drifted badly on mobile because the video is mirrored and scaled
    // to the full viewport, not to that fixed reference size.
    const mapVideoPointToCanvas = useCallback((left, top) => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const videoWidth = video?.videoWidth || 640;
        const videoHeight = video?.videoHeight || 480;
        const scaleX = canvas.width / videoWidth;
        const scaleY = canvas.height / videoHeight;

        return {
            x: (videoWidth - left) * scaleX,
            y: top * scaleY,
        };
    }, []);

    // Camera setup & cleanup — @mediapipe/camera_utils requires an onFrame
    // config (we no-op it because we run TF handpose against the <video> directly)
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const camera = new Camera(video, {
            onFrame: async () => {},
            width: 640,
            height: 480,
        });
        camera.start().catch((error) => {
            const permissionDenied =
                error?.name === 'NotAllowedError' ||
                error?.name === 'PermissionDeniedError';

            setCameraError(
                permissionDenied
                    ? 'Camera access was blocked. Enable camera permissions to use AR mode.'
                    : 'Camera could not start. Check your browser camera settings and try again.'
            );
        });

        return () => {
            const stream = video.srcObject;
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
            try {
                camera.stop();
            } catch (error) {
                // MediaPipe can throw if stop is called after a failed/denied start.
            }
        };
    }, []);

    // Resize canvas to match container via ResizeObserver
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = canvasContainer.current;
        if (!canvas || !container) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                const dpr = window.devicePixelRatio || 1;
                canvas.width = Math.round(width * dpr);
                canvas.height = Math.round(height * dpr);
                canvas.style.width = `${width}px`;
                canvas.style.height = `${height}px`;
            }
        });
        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, []);

    const fingerPos = useMemo(() => {
        if (handData?.landmarks) {
            return returnLandmarks(handData.landmarks);
        }
        return DEFAULT_FINGERS;
    }, [handData]);

    const prevFingerPos = useMemo(() => {
        if (prevHandData?.landmarks) {
            return returnLandmarks(prevHandData.landmarks);
        }
        // FIX: was `handData?.landmarks > 0` (array > number bug)
        if (handData?.landmarks?.length > 0) {
            return returnLandmarks(handData.landmarks);
        }
        return DEFAULT_FINGERS;
    }, [handData, prevHandData]);

    // FIX: Clean up flash timeout on unmount and before re-trigger
    const makeFlash = useCallback(() => {
        if (flashTimeoutRef.current) {
            clearTimeout(flashTimeoutRef.current);
        }
        setClickFlash(true);
        flashTimeoutRef.current = setTimeout(() => {
            setClickFlash(false);
            flashTimeoutRef.current = null;
        }, 500);
    }, []);

    // Cleanup flash timeout on unmount
    useEffect(() => {
        return () => {
            if (flashTimeoutRef.current) {
                clearTimeout(flashTimeoutRef.current);
            }
        };
    }, []);

    // Process finger data — single pass, squared-distance comparison, no logging
    useEffect(() => {
        const SENSITIVITY = 10.5;
        const PINCH_THRESHOLD_SQ = 80 * 80;
        const ON_SCREEN_THRESHOLD = -100;

        let maxStrength = 0;
        let pointerClicking = false;
        let thumbLeft = null;
        let thumbTop = null;
        let pointerLeft = null;
        let pointerTop = null;

        for (const key in fingerPos) {
            const v = fingerPos[key];
            const prevZ = prevFingerPos[key]?.zIndex || 0;
            const strength = prevZ - v.zIndex;

            if (strength > maxStrength) maxStrength = strength;

            if (key === 'pointer') {
                pointerLeft = v.left;
                pointerTop = v.top;
                pointerClicking = v.zIndex < prevZ - SENSITIVITY;
            } else if (key === 'thumb') {
                thumbLeft = v.left;
                thumbTop = v.top;
            }
        }

        const isOnScreen =
            thumbLeft !== null && pointerLeft !== null &&
            thumbLeft > ON_SCREEN_THRESHOLD && thumbTop > ON_SCREEN_THRESHOLD &&
            pointerLeft > ON_SCREEN_THRESHOLD && pointerTop > ON_SCREEN_THRESHOLD;

        if (isOnScreen) {
            const dx = thumbLeft - pointerLeft;
            const dy = thumbTop - pointerTop;
            const pinching = (dx * dx + dy * dy) < PINCH_THRESHOLD_SQ;

            const { x, y } = mapVideoPointToCanvas(pointerLeft, pointerTop);
            pressButton(x, y, pointerClicking, pinching);
        }

        if (maxStrength > 10) {
            makeFlash();
        }
    }, [fingerPos, mapVideoPointToCanvas, pressButton, prevFingerPos, makeFlash]);

    // Draw finger indicator on canvas instead of using a CSS-positioned div
    useEffect(() => {
        if (cameraError) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear entire canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const pointerLeft = fingerPos.pointer.left;
        const pointerTop = fingerPos.pointer.top;

        // Don't draw if off-screen (default -200)
        if (pointerLeft < -100 || pointerTop < -100) return;

        const { x, y } = mapVideoPointToCanvas(pointerLeft, pointerTop);
        const dpr = window.devicePixelRatio || 1;
        const radius = 14 * dpr;

        ctx.save();

        // Outer glow
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.shadowBlur = clickFlash ? 18 : 12;
        ctx.shadowColor = clickFlash
            ? 'rgba(123, 1, 238, 0.7)'
            : 'rgba(95, 188, 251, 0.95)';
        ctx.fillStyle = 'rgba(80, 79, 79, 0.47)';
        ctx.fill();

        // Inner bright ring
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.lineWidth = 2 * dpr;
        ctx.strokeStyle = clickFlash
            ? 'rgba(123, 1, 238, 0.8)'
            : 'rgba(95, 188, 251, 0.9)';
        ctx.shadowBlur = clickFlash ? 22 : 14;
        ctx.shadowColor = clickFlash
            ? 'rgb(95, 188, 251)'
            : 'rgba(95, 188, 251, 0.98)';
        ctx.stroke();

        ctx.restore();
    }, [fingerPos, clickFlash, mapVideoPointToCanvas, cameraError]);

    // Hand detection loop — skips React re-renders when no hand is in view
    useEffect(() => {
        const video = videoRef.current;
        let rafId = null;
        let prevHadHand = false;

        async function detectHands() {
            if (cameraError) return;

            if (!loadedModel || !video) {
                rafId = requestAnimationFrame(detectHands);
                return;
            }

            try {
                const hands = await loadedModel.estimateHands(video);

                if (!cameraLoaded && hands) {
                    setCameraLoaded(true);
                }

                const hasHand = hands.length > 0;
                if (hasHand || prevHadHand) {
                    setHandData(hands[0] || null);
                }
                prevHadHand = hasHand;
            } catch (e) {
                console.error('Hand detection error:', e);
                setCameraError('Hand tracking stopped unexpectedly. Please toggle AR mode off and on again.');
            }

            rafId = requestAnimationFrame(detectHands);
        }

        detectHands();

        return () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
        };
    }, [loadedModel, cameraLoaded, cameraError]);

    return (
        <div className="cameraCanvas" ref={canvasContainer}>
            {cameraError ? (
                <div className="cameraError" role="status">
                    <strong>AR mode needs camera access</strong>
                    <span>{cameraError}</span>
                </div>
            ) : !cameraLoaded && (
                <div className="loadingScreen">CAMERA LOADING</div>
            )}
            <video ref={videoRef} className="input_video" id="video"></video>
            <canvas ref={canvasRef} className="output_canvas"></canvas>
            {/* Finger indicator is now drawn on the canvas above via 2D context */}
        </div>
    );
};

export default CameraCanvas;
