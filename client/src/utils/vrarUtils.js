// Utility functions for VR/AR content generation and processing

export const generate360Images = (baseImage, count = 36) => {
  // Generate URLs for 360-degree images (in a real app, these would be actual 360-degree photos)
  const images = [];
  for (let i = 0; i < count; i++) {
    // This is a placeholder - in reality, you'd have actual 360-degree photos
    images.push(`${baseImage}?angle=${i * 10}`);
  }
  return images;
};

export const createVRModelUrl = (productId) => {
  // Generate a placeholder VR model URL
  // In production, this would be an actual 3D model file
  return `/api/products/${productId}/vr-model`;
};

export const createARModelUrl = (productId) => {
  // Generate a placeholder AR model URL
  // In production, this would be an AR-compatible 3D model
  return `/api/products/${productId}/ar-model`;
};

export const processVRARAssets = async (files, productId) => {
  const processedAssets = {
    images: [],
    vr360Url: null,
    arModelUrl: null
  };

  // Process regular images
  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  for (const file of imageFiles) {
    // In production, upload to cloud storage and get URL
    const imageUrl = URL.createObjectURL(file);
    processedAssets.images.push({
      url: imageUrl,
      alt: file.name,
      isPrimary: processedAssets.images.length === 0
    });
  }

  // Process VR model files (.glb, .gltf)
  const vrFiles = files.filter(file => 
    file.name.endsWith('.glb') || 
    file.name.endsWith('.gltf') || 
    file.name.endsWith('.obj')
  );
  
  if (vrFiles.length > 0) {
    processedAssets.vr360Url = createVRModelUrl(productId);
  }

  // Process AR model files
  const arFiles = files.filter(file => 
    file.name.endsWith('.usdz') || 
    file.name.endsWith('.glb') || 
    file.name.endsWith('.gltf')
  );
  
  if (arFiles.length > 0) {
    processedAssets.arModelUrl = createARModelUrl(productId);
  }

  return processedAssets;
};

export const detectDeviceCapabilities = () => {
  const capabilities = {
    vr: false,
    ar: false,
    webgl: false,
    webxr: false
  };

  // Check for WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  capabilities.webgl = !!gl;

  // Check for WebXR support
  if ('xr' in navigator) {
    capabilities.webxr = true;
    // Check for VR and AR support
    navigator.xr.isSessionSupported('immersive-vr').then(supported => {
      capabilities.vr = supported;
    });
    navigator.xr.isSessionSupported('immersive-ar').then(supported => {
      capabilities.ar = supported;
    });
  }

  return capabilities;
};

export const optimizeForMobile = (viewerType) => {
  // Return optimized settings for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    switch (viewerType) {
      case '360':
        return {
          resolution: 'medium',
          autoRotate: false,
          zoomLimit: 1.5
        };
      case 'vr':
        return {
          enableVR: false, // Disable VR on mobile by default
          performanceMode: 'low'
        };
      case 'ar':
        return {
          cameraResolution: 'medium',
          trackingMode: 'fast'
        };
      default:
        return {};
    }
  }
  
  return {};
};
