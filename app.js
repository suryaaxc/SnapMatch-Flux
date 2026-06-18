const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadPrompt = document.getElementById('uploadPrompt');
const previewContainer = document.getElementById('previewContainer');
const viewImage = document.getElementById('viewImage');
const mainCanvas = document.getElementById('mainCanvas');
const ctx = mainCanvas.getContext('2d');

// Sliders and Selectors Mapping
const sliderPadding = document.getElementById('sliderPadding');
const sliderRadius = document.getElementById('sliderRadius');
const sliderShadow = document.getElementById('sliderShadow');
const posterText = document.getElementById('posterText');
const fontFamily = document.getElementById('fontFamily');
const sliderFontSize = document.getElementById('sliderFontSize');
const sliderTextY = document.getElementById('sliderTextY');

const padVal = document.getElementById('padVal');
const radiusVal = document.getElementById('radiusVal');
const shadowVal = document.getElementById('shadowVal');
const fontSizeVal = document.getElementById('fontSizeVal');
const textYVal = document.getElementById('textYVal');

const presetButtons = document.querySelectorAll('#presetSelectors button');

let activeBgType = 'cyan-blue'; 
let activePreset = 'none'; 
let loadedImage = null;

const gradientMap = {
    'cyan-blue': { start: '#06b6d4', end: '#3b82f6' },
    'purple-pink': { start: '#a855f7', end: '#ec4899' },
    'amber-orange': { start: '#f59e0b', end: '#ef4444' },
    'dark-slate': { start: '#0f172a', end: '#020617' }
};

// Ingestion Threads
['dragenter', 'dragover'].forEach(name => {
    dropZone.addEventListener(name, (e) => { e.preventDefault(); dropZone.classList.add('bg-cyan-950/10'); });
});
['dragleave', 'drop'].forEach(name => {
    dropZone.addEventListener(name, (e) => { e.preventDefault(); dropZone.classList.remove('bg-cyan-950/10'); });
});
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
            previewContainer.classList.remove('hidden');
            setTimeout(() => previewContainer.classList.remove('scale-95', 'opacity-0'), 50);
            renderSnapMatrix();
            showNotification("Poster workspace frame buffer initialized.");
        };
    };
}

// --- 🎨 HARDCORE POSTER & TYPOGRAPHY RENDERING ENGINE ---
function renderSnapMatrix() {
    if (!loadedImage) return;

    const padding = parseInt(sliderPadding.value);
    const radius = parseInt(sliderRadius.value);
    const shadowBlur = parseInt(sliderShadow.value);
    const textStr = posterText.value;
    const currentFont = fontFamily.value;
    const baseFontSize = parseInt(sliderFontSize.value);
    const placementYPercent = parseInt(sliderTextY.value);

    // Sync baseline text readings and node values
    padVal.textContent = `${padding}px`;
    radiusVal.textContent = `${radius}px`;
    shadowVal.textContent = `${shadowBlur}px`;
    fontSizeVal.textContent = `${baseFontSize}px`;
    textYVal.textContent = `${placementYPercent}%`;

    const imgWidth = loadedImage.width;
    const imgHeight = loadedImage.height;
    
    const computedPad = (imgWidth * (padding / 100));
    mainCanvas.width = imgWidth + (computedPad * 2);
    mainCanvas.height = imgHeight + (computedPad * 2);

    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    // 1. Draw Background Framework
    const grad = ctx.createLinearGradient(0, 0, mainCanvas.width, mainCanvas.height);
    grad.addColorStop(0, gradientMap[activeBgType].start);
    grad.addColorStop(1, gradientMap[activeBgType].end);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

    // 2. Setup Drop Shadow Layers
    if (shadowBlur > 0) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = (imgWidth * (shadowBlur / 400));
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = (imgWidth * (shadowBlur / 500));
    }

    ctx.save();
    const targetX = computedPad;
    const targetY = computedPad;
    const targetRadius = (imgWidth * (radius / 300));

    // 3. Round Corner Path Processing Loop
    ctx.beginPath();
    ctx.moveTo(targetX + targetRadius, targetY);
    ctx.lineTo(targetX + imgWidth - targetRadius, targetY);
    ctx.quadraticCurveTo(targetX + imgWidth, targetY, targetX + imgWidth, targetY + targetRadius);
    ctx.lineTo(targetX + imgWidth, targetY + imgHeight - targetRadius);
    ctx.quadraticCurveTo(targetX + imgWidth, targetY + imgHeight, targetX + imgWidth - targetRadius, targetY + imgHeight);
    ctx.lineTo(targetX + targetRadius, targetY + imgHeight);
    ctx.quadraticCurveTo(targetX, targetY + imgHeight, targetX, targetY + imgHeight - targetRadius);
    ctx.lineTo(targetX, targetY + targetRadius);
    ctx.quadraticCurveTo(targetX, targetY, targetX + targetRadius, targetY);
    ctx.closePath();
    ctx.clip();

    // 4. Ingest Preset Matrix Processing Filters array
    let filterString = "none";
    if (activePreset === 'iphone') {
        filterString = "saturate(165%) contrast(110%) sepia(8%)";
    } else if (activePreset === 'cyber') {
        filterString = "hue-rotate(285deg) saturate(210%) contrast(120%)";
    } else if (activePreset === 'poster') {
        // 🔥 AI High Contrast Poster Look Shader Matrix Configuration
        filterString = "contrast(190%) saturate(175%) brightness(95%)";
    }
    
    ctx.filter = filterString;
    ctx.drawImage(loadedImage, targetX, targetY, imgWidth, imgHeight);
    ctx.restore();

    // 5. 🔥 NEW: CANVA VECTOR TEXT OVERLAY LAYERING ENGINE
    if (textStr.trim() !== "") {
        ctx.save();
        
        // Dynamically compute absolute font tracking properties mapping to total canvas width
        const scaleFactor = imgWidth / 600; 
        const computedFontSize = baseFontSize * scaleFactor;
        
        ctx.font = `italic ${computedFontSize}px "${currentFont}", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Calculate absolute coordinate alignment matrices
        const textTargetX = mainCanvas.width / 2;
        const textTargetY = targetY + (imgHeight * (placementYPercent / 100));

        // Poster Text Effects Array Mapping
        if (activePreset === 'poster') {
            // High-Impact Editorial Dual Text Layer Rendering Look
            ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            ctx.fillText(textStr.toUpperCase(), textTargetX + (4 * scaleFactor), textTargetY + (4 * scaleFactor));
            ctx.fillStyle = "#facc15"; // AI Bold Cyber Yellow
        } else if (activePreset === 'cyber') {
            ctx.fillStyle = "#00ffff"; // Glowing Tron Neon Cyan Text Frame
            ctx.shadowColor = "#00ffff";
            ctx.shadowBlur = 15 * scaleFactor;
        } else {
            ctx.fillStyle = "#ffffff"; // Standard Solid Clean Minimalist White Layout
        }

        ctx.fillText(textStr.toUpperCase(), textTargetX, textTargetY);
        ctx.restore();
    }
    
    viewImage.src = mainCanvas.toDataURL('image/png');
}

// Control Interfaces Hooks Execution
[sliderPadding, sliderRadius, sliderShadow, sliderFontSize, sliderTextY].forEach(s => s.addEventListener('input', renderSnapMatrix));
posterText.addEventListener('input', renderSnapMatrix);
fontFamily.addEventListener('change', renderSnapMatrix);

presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        presetButtons.forEach(b => b.classList.remove('border-cyan-500/80', 'text-cyan-400', 'pulse-active'));
        btn.classList.add('border-cyan-500/80', 'text-cyan-400', 'pulse-active');
        activePreset = btn.getAttribute('data-preset');
        renderSnapMatrix();
    });
});

document.getElementById('downloadBtn').addEventListener('click', () => {
    if (!loadedImage) return alert("Ingest an asset into SnapVerse first, bhai!");
    const a = document.createElement('a');
    a.href = mainCanvas.toDataURL('image/png');
    a.download = `SnapVerse_Poster_${Date.now()}.png`;
    a.click();
});

document.getElementById('copyBtn').addEventListener('click', () => {
    if (!loadedImage) return alert("No active asset schema found.");
    mainCanvas.toBlob(async (blob) => {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        showNotification("Poster copied directly to Clipboard!");
    });
});

function showNotification(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3500);
}