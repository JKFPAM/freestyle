const guiParams = {
    color1: "#ff2d2d",      // Initial gradient color 1
    color2: "#ffac8c",      // Initial gradient color 2
    angle: 0,               // Manual angle adjustment
    rows: 3,                // Number of rows
    columns: 3,             // Number of columns
    spread: 50,             // Gradient spread percentage
    twirlIntensity: 0,      // Intensity of the twirl effect
};

let cellAngles = [];       // Array to store angles of each cell
let animationInterval = null; // Interval ID for animation

// Function to initialize angles if grid size changes
function initializeAngles() {
    const totalCells = guiParams.rows * guiParams.columns;
    if (cellAngles.length !== totalCells) {
        cellAngles = Array.from({ length: totalCells }, () => Math.floor(Math.random() * 360));
    }
}

// Function to update the gradient grid
function updateGradientGrid(applyManualAngle = false) {
    const container = document.querySelector(".gradient-container");

    // Update the grid layout
    container.style.gridTemplateRows = `repeat(${guiParams.rows}, 1fr)`;
    container.style.gridTemplateColumns = `repeat(${guiParams.columns}, 1fr)`;

    // Initialize angles if grid size changes
    initializeAngles();

    // Apply manual angle adjustment
    if (applyManualAngle) {
        cellAngles = cellAngles.map((angle) => (angle + guiParams.angle) % 360);
    }

    // Clear all gradient cells while keeping the center square intact
    const centerSquare = document.getElementById("three-container");
    container.innerHTML = ""; // Clear all cells
    container.appendChild(centerSquare); // Re-add center square

    // Create grid cells with gradients
    cellAngles.forEach((currentAngle) => {
        const cell = document.createElement("div");
        cell.classList.add("gradient-cell");
        cell.style.background = `linear-gradient(${currentAngle}deg, ${guiParams.color1} 0%, ${guiParams.color2} ${guiParams.spread}%)`;
        container.appendChild(cell);
    });
}


// Start animation by incrementing angles
function startAnimation() {
    if (!animationInterval) {
        animationInterval = setInterval(() => {
            cellAngles = cellAngles.map((angle) => (angle + 1) % 360);
            updateGradientGrid();
        }, 5); // Adjust animation speed here
    }
}

// Stop animation
function stopAnimation() {
    clearInterval(animationInterval);
    animationInterval = null;
}

// Function to create the glass effect with Three.js
function createGlassEffect() {
    const centerSquare = document.getElementById("three-container");

    // Apply glass and twirl effect styles
    const twirlAngle = guiParams.twirlIntensity;
    centerSquare.style.background = "rgba(255, 255, 255, 0.1)";
    centerSquare.style.border = "2px solid rgba(255, 255, 255, 0.2)";
    centerSquare.style.backdropFilter = "blur(10px)";
    centerSquare.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
    centerSquare.style.borderRadius = "10px";

    // Twirl effect using CSS rotation
    centerSquare.style.transform = `translate(-50%, -50%) rotate(${twirlAngle}deg)`;
}



// Initialize the dat.GUI object
const gui = new dat.GUI();

const color1Controller = gui.addColor(guiParams, "color1").name("Color 1");
const color2Controller = gui.addColor(guiParams, "color2").name("Color 2");
const angleController = gui.add(guiParams, "angle", -180, 180).step(1).name("Adjust Angle");
const rowsController = gui.add(guiParams, "rows", 1, 60).step(1).name("Rows");
const columnsController = gui.add(guiParams, "columns", 1, 60).step(1).name("Columns");
const spreadController = gui.add(guiParams, "spread", 0, 200).step(1).name("Gradient Spread");

const twirlController = gui.add(guiParams, "twirlIntensity", 0, 360)
    .step(1)
    .name("Twirl Intensity");

twirlController.onChange(() => createGlassEffect());

const randomizeButton = {
    randomize: () => {
        cellAngles = []; // Clear angles for new random ones
        updateGradientGrid();
    },
};
gui.add(randomizeButton, "randomize").name("Randomize Angles");

const animationControls = {
    startAnimation: () => startAnimation(),
    stopAnimation: () => stopAnimation(),
};
gui.add(animationControls, "startAnimation").name("Start Animation");
gui.add(animationControls, "stopAnimation").name("Stop Animation");

color1Controller.onChange(() => updateGradientGrid());
color2Controller.onChange(() => updateGradientGrid());
angleController.onFinishChange(() => updateGradientGrid(true));
rowsController.onChange(() => {
    cellAngles = [];
    updateGradientGrid();
});
columnsController.onChange(() => {
    cellAngles = [];
    updateGradientGrid();
});
spreadController.onChange(() => updateGradientGrid());

updateGradientGrid(); // Set initial grid
createGlassEffect(); // Set up glass shader
