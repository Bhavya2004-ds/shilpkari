import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FiCamera, FiMaximize, FiMinimize, FiRefreshCw } from 'react-icons/fi';

const ARContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
`;

const ARScene = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const ARVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
`;

const AROverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const ARModel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
`;

const ARControls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const ARButton = styled.button`
  padding: 10px 20px;
  border: none;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ControlButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #e2e8f0;
    transform: scale(1.1);
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 50;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #ef4444;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
`;

const PermissionPrompt = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 400px;
`;

const ARProductViewer = ({ product, arModelUrl, images = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isARSupported, setIsARSupported] = useState(false);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [modelPosition, setModelPosition] = useState({ x: 0, y: 0, scale: 1 });
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const arContainerRef = useRef(null);

  useEffect(() => {
    // Check if AR is supported
    const checkARSupport = async () => {
      // Check for WebXR AR support
      if ('xr' in navigator) {
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          setIsARSupported(supported);
        } catch (err) {
          console.log('AR not supported:', err);
          setIsARSupported(false);
        }
      } else {
        // Fallback to camera-based AR
        setIsARSupported(true);
      }
    };

    checkARSupport();
  }, []);

  const startCamera = async () => {
    try {
      setNeedsPermission(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsStreamActive(true);
      setNeedsPermission(false);
      setIsLoading(false);
      
      // Start AR tracking simulation
      startARTracking();
    } catch (err) {
      console.error('Camera access denied:', err);
      setError('Camera access denied. Please allow camera permissions to use AR.');
      setNeedsPermission(false);
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreamActive(false);
  };

  const startARTracking = () => {
    // Simulate AR tracking with mouse/touch movement
    const handleMovement = (event) => {
      if (!arContainerRef.current) return;
      
      const rect = arContainerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Map mouse position to model position
      const modelX = ((x / rect.width) - 0.5) * 100;
      const modelY = ((y / rect.height) - 0.5) * 100;
      
      setModelPosition({
        x: modelX,
        y: modelY,
        scale: 1
      });
    };

    arContainerRef.current?.addEventListener('mousemove', handleMovement);
    arContainerRef.current?.addEventListener('touchmove', handleMovement);
  };

  const resetAR = () => {
    setModelPosition({ x: 0, y: 0, scale: 1 });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      arContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handlePermissionGranted = () => {
    startCamera();
  };

  const handlePermissionDenied = () => {
    setError('Camera permission is required for AR experience');
    setNeedsPermission(false);
    setIsLoading(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (isLoading && !needsPermission) {
    return (
      <ARContainer>
        <LoadingOverlay>
          <Spinner />
          <p>Initializing AR...</p>
        </LoadingOverlay>
      </ARContainer>
    );
  }

  if (needsPermission) {
    return (
      <ARContainer>
        <PermissionPrompt>
          <h3>Camera Permission Required</h3>
          <p>AR experience requires access to your camera to overlay products in your environment.</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
            <ARButton onClick={handlePermissionGranted}>
              Allow Camera
            </ARButton>
            <ControlButton onClick={handlePermissionDenied}>
              Cancel
            </ControlButton>
          </div>
        </PermissionPrompt>
      </ARContainer>
    );
  }

  if (error) {
    return (
      <ARContainer>
        <ErrorMessage>
          <h3>AR Error</h3>
          <p>{error}</p>
        </ErrorMessage>
      </ARContainer>
    );
  }

  return (
    <ARContainer ref={arContainerRef}>
      <ARScene>
        <ARVideo
          ref={videoRef}
          autoPlay
          playsInline
          muted
        />
        
        <AROverlay>
          {arModelUrl ? (
            <ARModel
              style={{
                backgroundImage: `url(${arModelUrl})`,
                transform: `translate(calc(-50% + ${modelPosition.x}px), calc(-50% + ${modelPosition.y}px)) scale(${modelPosition.scale})`
              }}
            />
          ) : images.length > 0 ? (
            <ARModel
              style={{
                backgroundImage: `url(${images[0]})`,
                transform: `translate(calc(-50% + ${modelPosition.x}px), calc(-50% + ${modelPosition.y}px)) scale(${modelPosition.scale})`
              }}
            />
          ) : null}
        </AROverlay>
      </ARScene>
      
      <ARControls>
        {!isStreamActive ? (
          <ARButton onClick={startCamera}>
            <FiCamera />
            Start AR
          </ARButton>
        ) : (
          <>
            <ARButton onClick={stopCamera}>
              Stop AR
            </ARButton>
            <ControlButton onClick={resetAR} title="Reset Position">
              <FiRefreshCw />
            </ControlButton>
          </>
        )}
        <ControlButton onClick={toggleFullscreen} title="Toggle Fullscreen">
          {isFullscreen ? <FiMinimize /> : <FiMaximize />}
        </ControlButton>
      </ARControls>
    </ARContainer>
  );
};

export default ARProductViewer;
