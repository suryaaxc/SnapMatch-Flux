const fileA = document.getElementById('fileA');
const fileB = document.getElementById('fileB');
const canvasA = document.getElementById('canvasA');
const canvasB = document.getElementById('canvasB');
const calculateBtn = document.getElementById('calculateBtn');
const resultsPanel = document.getElementById('resultsPanel');

const scoreDisplay = document.getElementById('scoreDisplay');
const bondName = document.getElementById('bondName');
const bondDesc = document.getElementById('bondDesc');

let imgA = null, imgB = null;
let ratioA = 0, ratioB = 0;

fileA.addEventListener('change', (e) => {
    if (e.target.files.length) {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (event) => {
            imgA = new Image();
            imgA.src = event.target.result;
            imgA.onload = () => {
                canvasA.classList.remove('hidden');
                canvasA.width = 300; canvasA.height = 300;
                canvasA.getContext('2d').drawImage(imgA, 0, 0, 300, 300);
            };
        };
    }
});

fileB.addEventListener('change', (e) => {
    if (e.target.files.length) {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (event) => {
            imgB = new Image();
            imgB.src = event.target.result;
            imgB.onload = () => {
                canvasB.classList.remove('hidden');
                canvasB.width = 300; canvasB.height = 300;
                canvasB.getContext('2d').drawImage(imgB, 0, 0, 300, 300);
            };
        };
    }
});

async function analyzeFaceStructures() {
    const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
    faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: false, minDetectionConfidence: 0.5 });

    return new Promise((resolve) => {
        let completed = 0;
        faceMesh.onResults((results) => {
            completed++;
            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                const pts = results.multiFaceLandmarks[0];
                const width = Math.abs(pts[234].x - pts[454].x);
                const height = Math.abs(pts[10].y - pts[152].y);
                if (completed === 1) ratioA = width / (height || 1);
                if (completed === 2) ratioB = width / (height || 1);
            }
            if (completed === 2) resolve();
        });

        faceMesh.send({ image: imgA }).then(() => {
            faceMesh.send({ image: imgB });
        });
    });
}

async function computeBondingMatrix() {
    if (!imgA || !imgB) return alert("Please populate both image asset nodes first, bhai! 🤦‍♂️");
    
    calculateBtn.textContent = "Processing Compatibility Matrices...";
    resultsPanel.classList.add('opacity-10', 'scale-95'); // Reset animation transitions states
    
    await analyzeFaceStructures();

    if (ratioA === 0) ratioA = 0.82;
    if (ratioB === 0) ratioB = 0.79;

    const structuralDelta = Math.abs(ratioA - ratioB);
    let finalScore = Math.floor(100 - (structuralDelta * 240));
    if (finalScore > 98) finalScore = 98;
    if (finalScore < 45) finalScore = 55;

    // Trigger score ticking look
    scoreDisplay.textContent = `${finalScore}%`;
    
    if (finalScore > 85) {
        bondName.textContent = "✨ Twin Flame Matrix Sync";
        bondDesc = "Absolute facial symmetry correlation detected. Deep intuitive synchronicity with matching energy loops. Ideal psychological stability blueprint.";
    } else if (finalScore > 65) {
        bondName.textContent = "⚡ Magnetic Harmony Proportions";
        bondDesc = "Highly balancing complementary structure types. Strong relational gravitational pull with high conversational retention tracks.";
    } else {
        bondName.textContent = "🪐 Independent Orbit Axis";
        bondDesc = "Distinct unique individual facial geometry layouts. Highly individualistic traits mapping. Requires active adjustment parameters but creates powerful separate growth lines.";
    }

    // Trigger neon reveal transitions
    resultsPanel.classList.remove('opacity-10', 'pointer-events-none', 'scale-95');
    resultsPanel.classList.add('opacity-100', 'scale-100');
    calculateBtn.textContent = "Compute Bonding Matrix";
}

calculateBtn.addEventListener('click', computeBondingMatrix);