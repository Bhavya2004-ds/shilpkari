import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FiMonitor, FiMaximize, FiMinimize, FiRotateCw } from 'react-icons/fi';

const VRContainer = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
`;

const VRScene = styled.div`
  width: 100%;
  height: 100%;
  
  a-scene {
    width: 100%;
    height: 100%;
  }
`;

const VRControls = styled.div`
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

const VRButton = styled.button`
  padding: 10px 20px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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

const VRProductViewer = ({ product, vrModelUrl, images = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sceneRef = useRef(null);

  useEffect(() => {
    // Check if WebXR is supported
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        setIsVRSupported(supported);
      });
    }
  }, []);

  useEffect(() => {
    // Load A-Frame script
    const script = document.createElement('script');
    script.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
    script.async = true;
    
    script.onload = () => {
      setIsLoading(false);
      // Initialize scene after A-Frame loads
      setTimeout(() => {
        if (sceneRef.current) {
          const scene = sceneRef.current.querySelector('a-scene');
          if (scene && scene.hasLoaded) {
            // Scene is ready
          } else {
            scene.addEventListener('loaded', () => {
              // Scene loaded
            });
          }
        }
      }, 100);
    };
    
    script.onerror = () => {
      setError('Failed to load VR viewer');
      setIsLoading(false);
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const enterVR = async () => {
    if (sceneRef.current) {
      const scene = sceneRef.current.querySelector('a-scene');
      if (scene && scene.enterVR) {
        try {
          await scene.enterVR();
        } catch (err) {
          console.error('Failed to enter VR:', err);
          setError('Failed to enter VR mode');
        }
      }
    }
  };

  const resetView = () => {
    if (sceneRef.current) {
      const camera = sceneRef.current.querySelector('a-camera');
      if (camera) {
        camera.setAttribute('position', '0 1.6 3');
        camera.setAttribute('rotation', '0 0 0');
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      sceneRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const generate360Images = () => {
    if (!images || images.length === 0) {
      return '';
    }
    
    return images.map((img, index) => {
      const angle = (index / images.length) * 360;
      return `<a-image 
        src="${img}" 
        position="${Math.sin(angle * Math.PI / 180) * 5} 1 ${Math.cos(angle * Math.PI / 180) * 5}" 
        rotation="0 ${-angle} 0"
        height="3"
        width="3"
        transparent="true"></a-image>`;
    }).join('');
  };

  if (isLoading) {
    return (
      <VRContainer>
        <LoadingOverlay>
          <Spinner />
          <p>Loading VR Experience...</p>
        </LoadingOverlay>
      </VRContainer>
    );
  }

  if (error) {
    return (
      <VRContainer>
        <ErrorMessage>
          <h3>VR Error</h3>
          <p>{error}</p>
        </ErrorMessage>
      </VRContainer>
    );
  }

  return (
    <VRContainer ref={sceneRef}>
      <VRScene dangerouslySetInnerHTML={{
        __html: `
          <a-scene 
            background="color: #87CEEB"
            vr-mode-ui="enabled: true"
            device-orientation-permission-ui="enabled: true">
            
            <!-- Assets -->
            <a-assets>
              ${images.map((img, index) => 
                `<img id="image-${index}" src="${img}" crossorigin="anonymous" />`
              ).join('')}
              ${vrModelUrl ? `<a-asset-item id="vr-model" src="${vrModelUrl}"></a-asset-item>` : ''}
            </a-assets>
            
            <!-- Lighting -->
            <a-light type="ambient" color="#404040"></a-light>
            <a-light type="directional" position="0 1 1" color="#ffffff" intensity="0.5"></a-light>
            <a-light type="point" position="0 5 0" color="#ffffff" intensity="0.8"></a-light>
            
            <!-- Environment -->
            <a-sky color="#87CEEB"></a-sky>
            <a-plane 
              position="0 0 0" 
              rotation="-90 0 0" 
              width="20" 
              height="20" 
              color="#8B7355"
              shadow></a-plane>
            
            <!-- Product Display -->
            ${vrModelUrl ? `
              <a-entity 
                id="product-model"
                gltf-model="#vr-model"
                position="0 1 0"
                rotation="0 0 0"
                scale="1 1 1"
                animation="property: rotation; to: 0 360 0; loop: true; dur: 10000">
              </a-entity>
            ` : generate360Images()}
            
            <!-- Camera -->
            <a-camera 
              position="0 1.6 3"
              look-controls="enabled: true"
              wasd-controls="enabled: false">
              <a-cursor 
                color="#ffffff" 
                animation__click="property: scale; start: 0.1 0.1 0.1; to: 1 1 1; dur: 150; begin: click; easing: easeOutQuad">
              </a-cursor>
            </a-camera>
            
            <!-- VR Controls -->
            <a-entity 
              laser-controls="hand: right"
              raycaster="objects: .interactive">
            </a-entity>
            <a-entity 
              laser-controls="hand: left"
              raycaster="objects: .interactive">
            </a-entity>
          </a-scene>
        `
      }} />
      
      <VRControls>
        {isVRSupported && (
          <VRButton onClick={enterVR}>
            <FiMonitor />
            Enter VR
          </VRButton>
        )}
        <ControlButton onClick={resetView} title="Reset View">
          <FiRotateCw />
        </ControlButton>
        <ControlButton onClick={toggleFullscreen} title="Toggle Fullscreen">
          {isFullscreen ? <FiMinimize /> : <FiMaximize />}
        </ControlButton>
      </VRControls>
    </VRContainer>
  );
};

export default VRProductViewer;
