import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { FiZoomIn, FiZoomOut, FiMaximize, FiMinimize, FiPlay, FiPause, FiRefreshCw, FiBox, FiSmartphone, FiX, FiExternalLink } from 'react-icons/fi';
import api from '../lib/api';

// ==================== STYLED COMPONENTS ====================

const rotate360 = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
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
`;

const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
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

const ARViewOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 200;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ARHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #fffbeb;
  border-bottom: 1px solid #fef3c7;

  h4 {
    margin: 0;
    color: #92400e;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.1rem;
  }
`;

const ARCloseBtn = styled.button`
  width: 36px;
  height: 36px;
  background: #fef3c7;
  border: none;
  border-radius: 50%;
  color: #78350f;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s;
  
  &:hover { 
    background: #fde68a;
    transform: rotate(90deg); 
  }
`;

const ARControls = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`;

const ARButton = styled.button`
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 20px rgba(217, 119, 6, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 15px 25px rgba(217, 119, 6, 0.4);
  }
`;

const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
  background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%);
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

const GenerateButton = styled.button`
  padding: 14px 32px;
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.4);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(217, 119, 6, 0.5);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
`;

const ProgressBar = styled.div`
  width: 240px;
  height: 6px;
  background: rgba(217, 119, 6, 0.2);
  border-radius: 3px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: 60%;
    background: linear-gradient(90deg, #d97706, #f59e0b, #d97706);
    background-size: 200% 100%;
    border-radius: 3px;
    animation: ${shimmer} 1.5s ease-in-out infinite;
  }
`;

const ProgressText = styled.p`
  color: #92400e;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 14px;
  margin: 8px 0;
`;

const RetryButton = styled.button`
  padding: 8px 20px;
  background: white;
  color: #b45309;
  border: 2px solid #d97706;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #fffbeb;
    transform: translateY(-1px);
  }
`;

// ==================== MAIN COMPONENT ====================

const ThreeDModelViewer = ({ productId, model3dData, productName }) => {
    const [status, setStatus] = useState(model3dData?.status || 'none');
    const [glbUrl, setGlbUrl] = useState(model3dData?.glbUrl || null);
    const [error, setError] = useState(model3dData?.error || null);
    const [isAutoRotating, setIsAutoRotating] = useState(true);
    const [showAR, setShowAR] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [modelLoading, setModelLoading] = useState(false);
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const pollIntervalRef = useRef(null);

    // Three.js refs
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const modelRef = useRef(null);
    const animFrameRef = useRef(null);
    const autoRotateRef = useRef(isAutoRotating);

    // Detect mobile for AR
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
        };
        checkMobile();
    }, []);

    // Keep auto-rotate ref in sync
    useEffect(() => {
        autoRotateRef.current = isAutoRotating;
        if (controlsRef.current) {
            controlsRef.current.autoRotate = isAutoRotating;
        }
    }, [isAutoRotating]);

    // Sync with incoming props
    useEffect(() => {
        if (model3dData) {
            setStatus(model3dData.status || 'none');
            setGlbUrl(model3dData.glbUrl || null);
            setError(model3dData.error || null);
        }
    }, [model3dData]);

    // Poll for status when processing
    const startPolling = useCallback(() => {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

        pollIntervalRef.current = setInterval(async () => {
            try {
                const response = await api.get(`/ai/3d-model-status/${productId}`);
                const data = response.data;

                if (data.status === 'completed') {
                    setStatus('completed');
                    setGlbUrl(data.glbUrl);
                    setError(null);
                    setIsGenerating(false);
                    clearInterval(pollIntervalRef.current);
                } else if (data.status === 'failed') {
                    setStatus('failed');
                    setError(data.error || 'Generation failed');
                    setIsGenerating(false);
                    clearInterval(pollIntervalRef.current);
                }
            } catch (err) {
                console.error('Poll error:', err);
            }
        }, 5000);
    }, [productId]);

    // Start polling on mount if processing
    useEffect(() => {
        if (status === 'processing') {
            setIsGenerating(true);
            startPolling();
        }

        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Initialize Three.js scene when GLB model is ready
    useEffect(() => {
        if (status !== 'completed' || !glbUrl || !canvasRef.current) return;

        setModelLoading(true);

        const canvas = canvasRef.current;
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        scene.background = null; // Transparent — CSS gradient shows through
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 1, 3);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true // Useful for screenshots/previews
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Modern Three.js Color Space & Tone Mapping
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping; // Switched back to ACES but with higher exposure
        renderer.toneMappingExposure = 2.8; // High exposure for a bright, vibrant look
        
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        // Environment Map (Critical for PBR/Metallic materials to look good)
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        
        const neutralEnv = pmremGenerator.fromScene(new RoomEnvironment()).texture;
        scene.environment = neutralEnv;
        
        pmremGenerator.dispose();

        // Controls
        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        controls.minDistance = 1.2;
        controls.maxDistance = 6;
        controls.minPolarAngle = Math.PI / 6;
        controls.maxPolarAngle = Math.PI / 1.5;
        controls.autoRotate = autoRotateRef.current;
        controls.autoRotateSpeed = 3;
        controlsRef.current = controls;

        // Lighting - High Contrast & Maximum Brightness
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2.0); // Strong overall ambient bounce
        scene.add(hemiLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); 
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 2.5); // Intense main light
        dirLight.position.set(5, 12, 8);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        scene.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
        fillLight.position.set(-8, 5, -8);
        scene.add(fillLight);

        // Strong Point light attached to camera
        const pointLight = new THREE.PointLight(0xffffff, 2.0);
        camera.add(pointLight);
        scene.add(camera);

        const topLight = new THREE.DirectionalLight(0xffffff, 1.0);
        topLight.position.set(0, 15, 0);
        scene.add(topLight);

        // Ground plane for shadow
        const groundGeo = new THREE.PlaneGeometry(10, 10);
        const groundMat = new THREE.ShadowMaterial({ opacity: 0.15 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1.2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Load GLB model
        const loader = new GLTFLoader();
        loader.load(
            glbUrl,
            (gltf) => {
                const model = gltf.scene;

                // Center and scale the model
                const box = new THREE.Box3().setFromObject(model);
                const boxCenter = box.getCenter(new THREE.Vector3());
                const boxSize = box.getSize(new THREE.Vector3());

                const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
                const scale = 2 / maxDim;
                model.scale.setScalar(scale);

                // Re-center after scaling
                const newBox = new THREE.Box3().setFromObject(model);
                const newCenter = newBox.getCenter(new THREE.Vector3());
                model.position.sub(newCenter);
                model.position.y -= newBox.min.y * 0.5; // Lift slightly above ground

                // Enable shadows and boost environment reflection
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                        // Boost environment map intensity for extra "pop"
                        if (child.material) {
                            child.material.envMapIntensity = 2.5;
                            child.material.needsUpdate = true;
                        }
                    }
                });

                scene.add(model);
                modelRef.current = model;
                setModelLoading(false);
            },
            undefined, // onProgress
            (err) => {
                console.error('GLB loading error:', err);
                setModelLoading(false);
            }
        );

        // Animation loop
        const animate = () => {
            animFrameRef.current = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Resize handler
        const handleResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            controls.dispose();
            renderer.dispose();
            scene.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(m => m.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
            });
        };
    }, [status, glbUrl]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleGenerate = async () => {
        try {
            setIsGenerating(true);
            setStatus('processing');
            setError(null);

            await api.post('/ai/generate-3d-model', { productId });

            startPolling();
        } catch (err) {
            console.error('Generate error:', err);
            setStatus('failed');
            setError(err.response?.data?.message || 'Failed to start generation');
            setIsGenerating(false);
        }
    };

    const handleZoomIn = () => {
        if (cameraRef.current) {
            const camera = cameraRef.current;
            const dir = new THREE.Vector3();
            camera.getWorldDirection(dir);
            camera.position.addScaledVector(dir, 0.5);
        }
    };

    const handleZoomOut = () => {
        if (cameraRef.current) {
            const camera = cameraRef.current;
            const dir = new THREE.Vector3();
            camera.getWorldDirection(dir);
            camera.position.addScaledVector(dir, -0.5);
        }
    };

    const handleReset = () => {
        if (cameraRef.current && controlsRef.current) {
            cameraRef.current.position.set(0, 1, 3);
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
        }
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
            // Trigger resize on fullscreen change
            if (rendererRef.current && containerRef.current && cameraRef.current) {
                const w = containerRef.current.clientWidth;
                const h = containerRef.current.clientHeight;
                cameraRef.current.aspect = w / h;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(w, h);
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // ---- Render: No model yet or failed ----
    if (status === 'none' || status === 'failed') {
        return (
            <ViewerContainer ref={containerRef}>
                <LoadingContainer>
                    {status === 'failed' ? (
                        <ProgressContainer>
                            <FiBox size={48} style={{ color: '#b45309', marginBottom: '8px' }} />
                            <p style={{ color: '#92400e', fontSize: '16px', fontWeight: 600, margin: 0 }}>
                                3D Model Generation Failed
                            </p>
                            <ErrorText>{error}</ErrorText>
                            <RetryButton onClick={handleGenerate}>
                                Try Again
                            </RetryButton>
                        </ProgressContainer>
                    ) : (
                        <ProgressContainer>
                            <FiBox size={48} style={{ color: '#b45309', marginBottom: '8px' }} />
                            <p style={{ color: '#92400e', fontSize: '16px', fontWeight: 600, margin: 0 }}>
                                Generate a 3D model from the product image
                            </p>
                            <p style={{ color: '#a16207', fontSize: '13px', margin: '4px 0 16px' }}>
                                Powered by TripoSR AI • Takes about 30-90 seconds
                            </p>
                            <GenerateButton onClick={handleGenerate} disabled={isGenerating}>
                                <FiBox size={20} />
                                Generate 3D Model
                            </GenerateButton>
                        </ProgressContainer>
                    )}
                </LoadingContainer>
            </ViewerContainer>
        );
    }

    // ---- Render: Processing ----
    if (status === 'processing') {
        return (
            <ViewerContainer ref={containerRef}>
                <LoadingContainer>
                    <ProgressContainer>
                        <Spinner />
                        <p style={{ color: '#92400e', fontSize: '16px', fontWeight: 600, margin: 0 }}>
                            Generating 3D Model...
                        </p>
                        <ProgressBar />
                        <ProgressText>
                            AI is creating a 3D model from the product image. This usually takes 30-90 seconds.
                        </ProgressText>
                    </ProgressContainer>
                </LoadingContainer>
            </ViewerContainer>
        );
    }

    // ---- Render: Completed — Show 3D Model ----
    return (
        <ViewerContainer ref={containerRef}>
            {modelLoading && (
                <LoadingContainer style={{ background: 'rgba(255, 251, 235, 0.9)' }}>
                    <Spinner />
                    <p style={{ color: '#92400e', fontSize: '14px', fontWeight: 500, marginTop: '16px' }}>
                        Loading 3D model...
                    </p>
                </LoadingContainer>
            )}

            <InfoBadge>
                <FiBox size={14} />
                3D Model
            </InfoBadge>

            <FullscreenButton onClick={toggleFullscreen}>
                {isFullscreen ? <FiMinimize /> : <FiMaximize />}
            </FullscreenButton>

            <CanvasWrapper>
                <canvas ref={canvasRef} />
            </CanvasWrapper>

            <Controls>
                <ButtonWrapper>
                    <Tooltip>See in your Room</Tooltip>
                    <ControlButton 
                        onClick={() => setShowAR(true)} 
                        style={{ 
                            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', 
                            color: 'white',
                            borderColor: '#06b6d4'
                        }}
                    >
                        <FiSmartphone />
                    </ControlButton>
                </ButtonWrapper>

                <div style={{ width: 1, height: 24, background: '#e5e7eb', margin: '0 4px' }} />

                <ButtonWrapper>
                    <Tooltip>Zoom Out</Tooltip>
                    <ControlButton onClick={handleZoomOut}>
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
                    <ControlButton
                        onClick={() => setIsAutoRotating(!isAutoRotating)}
                        $active={isAutoRotating}
                    >
                        {isAutoRotating ? <FiPause /> : <FiPlay />}
                    </ControlButton>
                </ButtonWrapper>

                <ButtonWrapper>
                    <Tooltip>Zoom In</Tooltip>
                    <ControlButton onClick={handleZoomIn}>
                        <FiZoomIn />
                    </ControlButton>
                </ButtonWrapper>
            </Controls>

            {showAR && (
                <ARViewOverlay>
                    <ARHeader>
                        <h4><FiSmartphone /> Virtual Preview (AR)</h4>
                        <ARCloseBtn onClick={() => setShowAR(false)} title="Close Overlay">
                            <FiX />
                        </ARCloseBtn>
                    </ARHeader>
                    
                    <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <model-viewer
                            src={glbUrl}
                            ar
                            ar-modes="webxr scene-viewer quick-look"
                            camera-controls
                            interaction-prompt="auto"
                            alt={`A 3D model of ${productName}`}
                            shadow-intensity="1"
                            exposure="1.2"
                            style={{ width: '100%', height: '100%', background: 'transparent' }}
                        >
                            <ARControls slot="ar-button">
                                <ARButton>
                                    <FiExternalLink /> View in your space
                                </ARButton>
                            </ARControls>

                            {!isMobile && (
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '50%', 
                                    left: '50%', 
                                    transform: 'translate(-50%, -50%)',
                                    background: 'rgba(255,255,255,0.95)',
                                    padding: '2rem',
                                    borderRadius: '20px',
                                    border: '1px solid #fef3c7',
                                    textAlign: 'center',
                                    maxWidth: '85%',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    pointerEvents: 'none'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
                                    <h3 style={{ color: '#92400e', marginBottom: '0.5rem' }}>Open on Mobile</h3>
                                    <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                                        To see this {productName || 'product'} in your room, please open this link on your <strong>Android</strong> or <strong>iOS</strong> smartphone.
                                    </p>
                                </div>
                            )}
                        </model-viewer>
                    </div>
                </ARViewOverlay>
            )}
        </ViewerContainer>
    );
};

export default ThreeDModelViewer;
