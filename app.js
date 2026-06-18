const fileInput = document.getElementById('fileInput');
const uploadPrompt = document.getElementById('uploadPrompt');
const outputCanvas = document.getElementById('outputCanvas');
const ctx = outputCanvas.getContext('2d');
const webcamVideo = document.getElementById('webcamVideo');
const scanBtn = document.getElementById('scanBtn');
const resultsMatrix = document.getElementById('resultsMatrix');

const detectedShape = document.getElementById('detectedShape');
const hairText = document.getElementById('hairText');
const beardText = document.getElementById('beardText');
const skinText = document.getElementById('skinText');
const hairCareText = document.getElementById('hairCareText');

let targetImage = null;
let meshEngine = null;

// Static Style Matrix Data Sheets Mapping 
const styleDatabase = {
    'SQUARE_MATRIX': {
        name: 'Square Structured Frame',
        hair: 'Classic Side Part, Textured Pompadour, or Undercut to emphasize sharp jaw angles.',
        beard: 'Heavy Stubble or Full Beard with short sides to elongate the facial vectors.',
        skin: 'Gentle exfoliating face wash, alcohol-free toner, and a lightweight gel moisturizer to avoid dry oil build-up.',
        hairCare: 'Use a clarifying tea tree shampoo twice a week, followed by a argan oil scalp massage to boost follicle density.'
    },
    'OVAL_MATRIX': {
        name: 'Oval Balanced Proportions',
        hair: 'Fringe Up, Pompadour, or Mid-Fade Crops. Avoid heavy forward bangs that shorten the framework.',
        beard: 'Clean-shaven layout, short tailored box beard, or crisp light lining locks.',
        skin: 'Hydrating milk cleanser, Vitamin C protective serum every morning, and broad-spectrum SPF sunscreen block.',
        hairCare: 'Sulfate-free structural conditioning washes, bamboo-extract serum drops to lock natural moisture levels.'
    }
};

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                targetImage = img;
                uploadPrompt.classList.add('hidden');
                outputCanvas.classList.remove('hidden');
                outputCanvas.width = 640;
                outputCanvas.height = 480;
                ctx.drawImage(targetImage, 0, 0, 640, 480);
            };
        };
    }
});

function runFaceAnalysisPipeline() {
    meshEngine = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    meshEngine.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5 });
    meshEngine.onResults((results) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const points = results.multiFaceLandmarks[0];
            
            // Core Geometric Aspect Calculation Logic
            const widthDelta = Math.abs(points[234].x - points[454].x); // Width across cheekbones
            const heightDelta = Math.abs(points[10].x - points[152].x);  // Height from forehead to chin
            const dynamicRatio = widthDelta / (heightDelta || 1);

            ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
            ctx.drawImage(targetImage, 0, 0, 640, 480);

            // Render Trace Face Landmarks Overlays Nodes Array
            ctx.fillStyle = "rgba(139, 92, 246, 0.7)";
            points.forEach(pt => {
                ctx.beginPath();
                ctx.arc(pt.x * 640, pt.y * 480, 1.2, 0, 2 * Math.PI);
                ctx.fill();
            });

            // Evaluate Matrix Classifications Profile
            const assignedProfile = (dynamicRatio > 0.15) ? 'SQUARE_MATRIX' : 'OVAL_MATRIX';
            renderTargetGroomingCards(assignedProfile);
        }
    });

    meshEngine.send({ image: targetImage });
}

function renderTargetGroomingCards(key) {
    const data = styleDatabase[key];
    detectedShape.textContent = data.name;
    hairText.textContent = data.hair;
    beardText.textContent = data.beard;
    skinText.textContent = data.skin;
    hairCareText.textContent = data.hairCare;

    // Remove opacity block barrier smoothly
    resultsMatrix.classList.remove('opacity-40', 'pointer-events-none');
}

scanBtn.addEventListener('click', () => {
    if (!targetImage) return alert("Ingest an image asset map blueprint first, bhai! 🤦‍♂️");
    runFaceAnalysisPipeline();
});