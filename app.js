const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadPrompt = document.getElementById('uploadPrompt');
const videoCanvas = document.getElementById('videoCanvas');
const ctx = videoCanvas.getContext('2d');
const compileBtn = document.getElementById('compileBtn');
const loader = document.getElementById('loader');

// Controls Mapping
const motionProfile = document.getElementById('motionProfile');
const sliderSpeed = document.getElementById('sliderSpeed');
const shaderOverlay = document.getElementById('shaderOverlay');
const speedVal = document.getElementById('speedVal');

let loadedImage = null;
let animationFrameId = null;
let currentFrameStep = 0;

// Drag Drop Event Routing Interceptors
['dragenter', 'dragover'].forEach(n => dropZone.addEventListener(n, (e) => e.preventDefault()));
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleImageStream(e.dataTransfer.files[0]);
});
uploadPrompt.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => { if (e.target.files.length) handleImageStream(e.target.files[0]); });

function handleImageStream(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            loadedImage = img;
            uploadPrompt.classList.add('hidden');
            videoCanvas.classList.remove('hidden');
            
            // Lock aspect canvas footprint resolution
            videoCanvas.width = 720;
            videoCanvas.height = 1280; // 9:16 Cinematic Short Resolution Setup
            
            currentFrameStep = 0;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            executeRenderLoop(); // Kickoff loop
            showNotification("Image stream mapped to cinematic timeline pipeline");
        };
    };
}

// --- 🌌 CORE RENDER LOOP VECTOR COMPILER ---
function executeRenderLoop() {
    if (!loadedImage) return;

    const profile = motionProfile.value;
    const speedModifier = parseInt(sliderSpeed.value) / 1000;
    const activeShader = shaderOverlay.value;

    speedVal.textContent = `${(parseInt(sliderSpeed.value)/10).toFixed(1)}x`;

    ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
    ctx.save();

    let targetWidth = videoCanvas.width;
    let targetHeight = videoCanvas.height;
    let dx = 0;
    let dy = 0;
    let zoomScale = 1.0;

    // Camera Profile Computations
    currentFrameStep += speedModifier;
    
    if (profile === 'zoomIn') {
        zoomScale = 1.0 + (Math.sin(currentFrameStep * 0.5) * 0.15); // Smooth sinusoidal camera pull
    } else if (profile === 'panRight') {
        zoomScale = 1.2; // Keep canvas padded for safe panning bounds
        dx = Math.sin(currentFrameStep) * 40;
    } else if (profile === 'dolly') {
        zoomScale = 1.1 + (Math.cos(currentFrameStep * 0.3) * 0.1);
        dy = Math.sin(currentFrameStep * 0.5) * 20;
    }

    // Centered Canvas Transform Scale Matrix
    ctx.translate(videoCanvas.width / 2 + dx, videoCanvas.height / 2 + dy);
    ctx.scale(zoomScale, zoomScale);
    
    // Draw raw image tracking proportions bound calculations
    const imgAspect = loadedImage.width / loadedImage.height;
    const canvasAspect = videoCanvas.width / videoCanvas.height;
    
    let drawW, drawH;
    if (imgAspect > canvasAspect) {
        drawH = videoCanvas.height;
        drawW = videoCanvas.height * imgAspect;
    } else {
        drawW = videoCanvas.width;
        drawH = videoCanvas.width / imgAspect;
    }

    ctx.drawImage(loadedImage, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // 🎬 Atmospheric Frame Shader Noise Integrations
    if (activeShader === 'grain') {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.07})`; // Instant variable noise layer
        ctx.fillRect(0, 0, videoCanvas.width, videoCanvas.height);
    } else if (activeShader === 'cyber') {
        ctx.fillStyle = `rgba(0, 255, 100, ${Math.random() * 0.04})`;
        ctx.fillRect(0, 0, videoCanvas.width, videoCanvas.height);
        // Draw custom scanning bars lines tracking offsets
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        for(let i=0; i<videoCanvas.height; i+=8) {
            ctx.fillRect(0, (i + (currentFrameStep * 20)) % videoCanvas.height, videoCanvas.width, 2);
        }
    }

    animationFrameId = requestAnimationFrame(executeRenderLoop);
}

// Controller Listeners Adjustments
motionProfile.addEventListener('change', () => currentFrameStep = 0);
shaderOverlay.addEventListener('change', () => currentFrameStep = 0);

// --- 💾 HIGH-FIDELITY HARDWARE MEDIA RECORDER EXPORTER ENGINE ---
compileBtn.addEventListener('click', () => {
    if (!loadedImage) return alert("Ingest an image blueprint first, bhai! 🤦‍♂️");
    
    loader.classList.remove('hidden');
    showNotification("Recording loop buffer... please do not toggle view");

    const videoStream = videoCanvas.captureStream(30); // Capture canvas at 30FPS stream tracks
    const mediaRecorder = new MediaRecorder(videoStream, { mimeType: 'video/webm;codecs=vp9' });
    const chunkBuffers = [];

    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunkBuffers.push(e.data); };
    
    mediaRecorder.onstop = () => {
        // Compile binary data arrays straight into file stream download link
        const videoBlob = new Blob(chunkBuffers, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = videoUrl;
        downloadLink.download = `SnapMotion_Flux_${Date.now()}.webm`;
        downloadLink.click();
        
        loader.classList.add('hidden');
        showNotification("Cinematic Motion Video Saved Successfully!");
    };

    // Force run record tracks exactly for a 5-second cinematic cycle loop
    mediaRecorder.start();
    setTimeout(() => {
        mediaRecorder.stop();
    }, 5000); 
});

function showNotification(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3500);
}