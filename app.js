// 🌌 SnapVerse Engine Core Modules Mapping
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadPrompt = document.getElementById('uploadPrompt');
const previewContainer = document.getElementById('previewContainer');
const viewImage = document.getElementById('viewImage');
const mainCanvas = document.getElementById('mainCanvas');
const ctx = mainCanvas.getContext('2d');

// ⚙️ Sliders & Value Counters References
const sliderPadding = document.getElementById('sliderPadding');
const sliderRadius = document.getElementById('sliderRadius');
const sliderShadow = document.getElementById('sliderShadow');
const sliderBrightness = document.getElementById('sliderBrightness');
const sliderBlur = document.getElementById('sliderBlur');

const padVal = document.getElementById('padVal');
const radiusVal = document.getElementById('radiusVal');
const shadowVal = document.getElementById('shadowVal');
const brightVal = document.getElementById('brightVal');
const blurVal = document.getElementById('blurVal');

const bgSelectors = document.querySelectorAll('#bgSelectors button');
const presetButtons = document.querySelectorAll('#presetSelectors button');

let activeBgType = 'cyan-blue'; 
let activePreset = 'none'; // Track active matrix filter shader state
let loadedImage = null;

const gradientMap = {
    'cyan-blue': { start: '#06b6d4', end: '#3b82f6' },
    'purple-pink': { start: '#a855f7', end: '#ec4899' },
    'amber-orange': { start: '#f59e0b', end: '#ef4444' },
    'dark-slate': { start: '#0f172a', end: '#020617' }
};

// --- 🔒 DRAG & DROP BOUNDARY INTERCEPTORS ---
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add('border-cyan-500/40', 'bg-cyan-950/10');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-cyan-500/40', 'bg-cyan-950/10');
    }, false);
});

dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) handleImageStream(files[0]);
});

uploadPrompt.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) handleImageStream(e.target.files[0]);
});

// --- ⚙️ FILE INGESTION LAYER ---
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
            
            // Trigger entry fade-in animations vectors
            setTimeout(() => {
                previewContainer.classList.remove('scale-95', 'opacity-0');
            }, 50);

            renderSnapMatrix(); 
            showNotification("Asset successfully locked into SnapVerse Environment");
        };
    };
}

// --- 🎨 CANVAS RENDERING MATRIX ENGINE ---
function renderSnapMatrix() {
    if (!loadedImage) return;

    const padding = parseInt(sliderPadding.value);
    const radius = parseInt(sliderRadius.value);
    const shadowBlur = parseInt(sliderShadow.value);
    let brightness = sliderBrightness.value;
    let pixelBlur = sliderBlur.value;

    // Sync baseline counter readouts
    padVal.textContent = `${padding}px`;
    radiusVal.textContent = `${radius}px`;
    shadowVal.textContent = `${shadowBlur}px`;
    brightVal.textContent = `${brightness}%`;
    blurVal.textContent = `${pixelBlur}px`;

    const imgWidth = loadedImage.width;
    const imgHeight = loadedImage.height;
    
    const computedPad = (imgWidth * (padding / 100));
    mainCanvas.width = imgWidth + (computedPad * 2);
    mainCanvas.height = imgHeight + (computedPad * 2);

    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    // 1. Background Frame Render Loop
    const grad = ctx.createLinearGradient(0, 0, mainCanvas.width, mainCanvas.height);
    grad.addColorStop(0, gradientMap[activeBgType].start);
    grad.addColorStop(1, gradientMap[activeBgType].end);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

    // 2. Setup Shadows Space Layer
    if (shadowBlur > 0) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
        ctx.shadowBlur = (imgWidth * (shadowBlur / 400));
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = (imgWidth * (shadowBlur / 600));
    }

    ctx.save();
    const targetX = computedPad;
    const targetY = computedPad;
    const targetRadius = (imgWidth * (radius / 300));

    // 3. Mockup Corner Rounding Clip Path Trace
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

    // 4. Algorithmic Shader Filters Routing
    let filterString = `brightness(${brightness}%) blur(${pixelBlur}px)`;
    
    if (activePreset === 'iphone') {
        // iPhone Trend Lookup: Warm saturations with high-contrast luminance pops
        filterString += ` saturate(160%) contrast(115%) sepia(10%)`;
    } else if (activePreset === 'cartoon') {
        // Comic Cartoon Base Layer Style Map
        filterString += ` contrast(180%) saturate(140%) grayscale(10%)`;
    } else if (activePreset === 'cyber') {
        // Neon Cyberpunk Cyber Color Inversion Map
        filterString += ` hue-rotate(290deg) saturate(200%) contrast(110%)`;
    }

    ctx.filter = filterString;
    ctx.drawImage(loadedImage, targetX, targetY, imgWidth, imgHeight);
    ctx.restore();

    // 5. Hard Draw Cartoon Comic Structural Borders Layer if Active
    if (activePreset === 'cartoon') {
        ctx.save();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = (imgWidth * 0.015); // Dynamic trace border weight mapping
        ctx.strokeRect(targetX, targetY, imgWidth, imgHeight);
        ctx.restore();
    }
    
    viewImage.src = mainCanvas.toDataURL('image/png');
}

// --- 🎛️ CORE LISTENERS MANAGEMENT CORE ---
[sliderPadding, sliderRadius, sliderShadow, sliderBrightness, sliderBlur].forEach(slider => {
    slider.addEventListener('input', renderSnapMatrix);
});

bgSelectors.forEach(btn => {
    btn.addEventListener('click', () => {
        bgSelectors.forEach(b => b.classList.remove('border-white'));
        btn.classList.add('border-white');
        activeBgType = btn.getAttribute('data-bg');
        renderSnapMatrix();
    });
});

// Preset Buttons Event Matrix
presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        presetButtons.forEach(b => {
            b.classList.remove('border-cyan-500/80', 'text-cyan-400', 'pulse-active');
            b.classList.add('border-slate-700', 'text-slate-300');
        });
        btn.classList.remove('border-slate-700', 'text-slate-300');
        btn.classList.add('border-cyan-500/80', 'text-cyan-400', 'pulse-active');
        
        activePreset = btn.getAttribute('data-preset');
        renderSnapMatrix();
    });
});

// --- 💾 EXPORTER CHANNELS ---
document.getElementById('downloadBtn').addEventListener('click', () => {
    if (!loadedImage) return alert("Ingest an asset into SnapVerse first, bhai! 🤦‍♂️");
    const a = document.createElement('a');
    a.href = mainCanvas.toDataURL('image/png');
    a.download = `SnapVerse_${activePreset}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification("High-Fidelity 4K Asset Saved!");
});

document.getElementById('copyBtn').addEventListener('click', async () => {
    if (!loadedImage) return alert("No active asset matrix layer, bhai!");
    try {
        mainCanvas.toBlob(async (blob) => {
            const item = new ClipboardItem({ "image/png": blob });
            await navigator.clipboard.write([item]);
            showNotification("Asset copied straight to Clipboard!");
        });
    } catch (err) {
        alert("Clipboard channel block detected inside host layout sandbox rules.");
    }
});

function showNotification(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3500);
}