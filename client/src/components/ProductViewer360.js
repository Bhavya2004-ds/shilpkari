import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiZoomIn, FiZoomOut, FiMaximize, FiMinimize, FiPlay, FiPause, FiRefreshCw, FiRotateCw } from 'react-icons/fi';

// Subtle animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;


const rotate360 = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const ViewerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 10px 40px rgba(217, 119, 6, 0.15),
    0 0 0 1px rgba(217, 119, 6, 0.1),
    inset 0 2px 0 rgba(255, 255, 255, 0.8);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 30% 20%, rgba(217, 119, 6, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(180, 83, 9, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
  cursor: grab;
  touch-action: none;
  overflow: hidden;
  position: relative;
  z-index: 1;
  
  &:active {
    cursor: grabbing;
  }
`;

// Wooden display stand effect
const DisplayStand = styled.div`
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 20px;
  background: linear-gradient(180deg, #92400e 0%, #78350f 50%, #451a03 100%);
  border-radius: 50%;
  box-shadow: 
    0 10px 30px rgba(69, 26, 3, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  z-index: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 10%;
    right: 10%;
    height: 8px;
    background: linear-gradient(180deg, #b45309 0%, #92400e 100%);
    border-radius: 4px 4px 0 0;
  }
`;

// Circle rotation track
const RotationCircle = styled.div`
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  border: 2px dashed rgba(217, 119, 6, 0.3);
  pointer-events: none;
  
  &::after {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(${props => props.$rotation}deg);
    transform-origin: 50% calc(50% + 160px);
    width: 12px;
    height: 12px;
    background: linear-gradient(135deg, #d97706, #b45309);
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(217, 119, 6, 0.5);
  }
`;

const ProductImage = styled.img`
  max-width: 260px;
  max-height: 260px;
  object-fit: contain;
  transition: transform 0.05s ease-out, box-shadow 0.3s ease;
  transform-style: preserve-3d;
  user-select: none;
  -webkit-user-drag: none;
  border-radius: 12px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.2),
    0 8px 24px rgba(217, 119, 6, 0.15);
  animation: ${props => props.$isFloating ? floatAnimation : 'none'} 3s ease-in-out infinite;
  background: white;
  padding: 8px;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.95);
  padding: 10px 16px;
  border-radius: 40px;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(217, 119, 6, 0.2);
  z-index: 10;
`;

const ControlButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid ${props => props.$active ? '#d97706' : '#e5e7eb'};
  background: ${props => props.$active
    ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
    : 'white'};
  color: ${props => props.$active ? 'white' : '#78350f'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$active
    ? '0 4px 12px rgba(217, 119, 6, 0.4)'
    : '0 2px 4px rgba(0, 0, 0, 0.05)'};
  font-size: 16px;
  
  &:hover {
    background: ${props => props.$active
    ? 'linear-gradient(135deg, #b45309 0%, #92400e 100%)'
    : '#fffbeb'};
    border-color: #d97706;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
`;

const FullscreenButton = styled(ControlButton)`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
`;

const InfoBadge = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #92400e;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  z-index: 10;
  border: 1px solid rgba(217, 119, 6, 0.2);
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RotationBadge = styled.div`
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #d97706, #b45309);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.4);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoadingIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #92400e;
  z-index: 20;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid #fef3c7;
  border-top: 3px solid #d97706;
  border-right: 3px solid #b45309;
  border-radius: 50%;
  animation: ${rotate360} 1s linear infinite;
`;

const Tooltip = styled.span`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #78350f;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  margin-bottom: 8px;
  pointer-events: none;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #78350f;
  }
`;

const ButtonWrapper = styled.div`
  position: relative;
  
  &:hover ${Tooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

const HintBadge = styled.div`
  position: absolute;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(120, 53, 15, 0.9);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.3s ease;
  z-index: 10;
  box-shadow: 0 4px 16px rgba(120, 53, 15, 0.3);
`;

const ProductViewer360 = ({ images = [], productName = "" }) => {
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef(null);

  // Hide hint after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotation using setInterval for reliability
  useEffect(() => {
    let intervalId = null;

    if (isAutoRotating && !isDragging) {
      intervalId = setInterval(() => {
        setRotationY(prev => (prev + 1) % 360);
      }, 30); // ~33fps, rotates 1 degree every 30ms
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoRotating, isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setIsAutoRotating(false);
    setShowHint(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    const newRotationY = (rotationY + deltaX * 0.5) % 360;
    setRotationY(newRotationY < 0 ? newRotationY + 360 : newRotationY);

    const newRotationX = Math.max(-25, Math.min(25, rotationX + deltaY * 0.3));
    setRotationX(newRotationX);

    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
    setIsAutoRotating(false);
    setShowHint(false);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;

    const newRotationY = (rotationY + deltaX * 0.5) % 360;
    setRotationY(newRotationY < 0 ? newRotationY + 360 : newRotationY);

    const newRotationX = Math.max(-25, Math.min(25, rotationX + deltaY * 0.3));
    setRotationX(newRotationX);

    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.6));
  };

  const handleReset = () => {
    setRotationY(0);
    setRotationX(0);
    setZoom(1);
    setIsAutoRotating(false);
  };

  const toggleAutoRotate = () => {
    setIsAutoRotating(!isAutoRotating);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (images.length === 0) {
    return (
      <ViewerContainer>
        <LoadingIndicator>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
          <p>No images available</p>
        </LoadingIndicator>
      </ViewerContainer>
    );
  }

  const mainImage = images[0]?.url || images[0];
  const imageUrl = mainImage ? mainImage.split('?')[0] : '';

  return (
    <ViewerContainer ref={containerRef}>
      {isLoading && (
        <LoadingIndicator>
          <Spinner />
          <p style={{ fontSize: '14px', fontWeight: '500' }}>Loading product view...</p>
        </LoadingIndicator>
      )}

      <ImageContainer
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Display stand */}
        <DisplayStand />

        {/* Rotation track */}
        <RotationCircle $rotation={rotationY} />

        <ProductImage
          src={imageUrl}
          alt={productName}
          $isFloating={isAutoRotating}
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/500x500?text=Image+Not+Found';
            setIsLoading(false);
          }}
          style={{
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${zoom})`,
            opacity: isLoading ? 0 : 1
          }}
        />
      </ImageContainer>

      <HintBadge $visible={showHint && !isLoading}>
        <FiRotateCw size={16} />
        Drag to rotate the product view
      </HintBadge>

      {/* Rotation indicator */}
      <RotationBadge>
        <FiRotateCw size={14} />
        {Math.round(rotationY)}° View
      </RotationBadge>

      <InfoBadge>
        <FiZoomIn size={14} />
        {Math.round(zoom * 100)}%
      </InfoBadge>

      <FullscreenButton onClick={toggleFullscreen}>
        {isFullscreen ? <FiMinimize /> : <FiMaximize />}
      </FullscreenButton>

      <Controls>
        <ButtonWrapper>
          <Tooltip>Zoom Out</Tooltip>
          <ControlButton onClick={handleZoomOut} disabled={zoom <= 0.6}>
            <FiZoomOut />
          </ControlButton>
        </ButtonWrapper>

        <ButtonWrapper>
          <Tooltip>Reset View</Tooltip>
          <ControlButton onClick={handleReset}>
            <FiRefreshCw />
          </ControlButton>
        </ButtonWrapper>

        <ButtonWrapper>
          <Tooltip>{isAutoRotating ? 'Stop Rotation' : 'Auto Rotate'}</Tooltip>
          <ControlButton onClick={toggleAutoRotate} $active={isAutoRotating}>
            {isAutoRotating ? <FiPause /> : <FiPlay />}
          </ControlButton>
        </ButtonWrapper>

        <ButtonWrapper>
          <Tooltip>Zoom In</Tooltip>
          <ControlButton onClick={handleZoomIn} disabled={zoom >= 2}>
            <FiZoomIn />
          </ControlButton>
        </ButtonWrapper>
      </Controls>
    </ViewerContainer>
  );
};

export default ProductViewer360;
