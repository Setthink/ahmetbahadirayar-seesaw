const seesaw = document.getElementById('seesaw');
const resetBtn = document.getElementById('reset-btn');
const leftWeightDisplay = document.getElementById('left-weight');
const rightWeightDisplay = document.getElementById('right-weight');
const angleInfoDisplay = document.getElementById('angle-info');

let leftSide = JSON.parse(localStorage.getItem('leftSide')) || [];
let rightSide = JSON.parse(localStorage.getItem('rightSide')) || [];
let currentSeesawAngle =
  parseFloat(localStorage.getItem('currentSeesawAngle')) || 0;
let leftTorque = parseFloat(localStorage.getItem('leftTorque')) || 0;
let rightTorque = parseFloat(localStorage.getItem('rightTorque')) || 0;
// Show the saved seesaw angle on load
applySeesawTransform(currentSeesawAngle);
renderWeights();
updateWeightDisplays();
updateAngleDisplay();
rebuildWeightEntryDisplay();

function getClickPositionOnSeesaw(event) {
  const rect = seesaw.getBoundingClientRect();
  const offsetX = event.clientX - rect.left - rect.width / 2;
  return offsetX;
}

function calculateTheTorque(offsetX, weight) {
  return offsetX * weight;
}

function randomWeight() {
  return Math.floor(Math.random() * 10) + 1;
}

function updateSeesawTilt() {
  currentSeesawAngle = Math.max(
    -30,
    Math.min(30, (rightTorque - leftTorque) / 10)
  );
  applySeesawTransform(currentSeesawAngle);
  updateAngleDisplay();
  saveStateToLocalStorage();
}

function updateAngleDisplay() {
  angleInfoDisplay.textContent = `${currentSeesawAngle.toFixed(2)}°`;
}

function getColorForWeight(weight) {
  const colors = [
    '#ffba08',
    '#faa307',
    '#f48c06',
    '#e85d04',
    '#dc2f02',
    '#d00000',
    '#9d0208',
    '#6a040f',
    '#370617',
    '#03071e',
  ];
  return colors[weight - 1] || '#999999';
}

function updateWeightEntryDisplay(offsetX, weight) {
  const weightEntryDiv = document.createElement('div');
  const side = offsetX < 0 ? 'Left' : 'Right';
  weightEntryDiv.textContent = `- ${weight}kg added to ${side} side at ${Math.abs(
    offsetX
  ).toFixed(0)}px from center`;
  document.getElementById('weight-entry').prepend(weightEntryDiv);
}

function rebuildWeightEntryDisplay() {
  const weightEntryContainer = document.getElementById('weight-entry');
  weightEntryContainer.innerHTML = '';
  const allWeights = [...leftSide, ...rightSide];
  allWeights.forEach((obj) => {
    updateWeightEntryDisplay(obj.offsetX, obj.weight);
  });
}

function applySeesawTransform(angle) {
  seesaw.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
}

function saveStateToLocalStorage() {
  localStorage.setItem('leftSide', JSON.stringify(leftSide));
  localStorage.setItem('rightSide', JSON.stringify(rightSide));
  localStorage.setItem('leftTorque', leftTorque);
  localStorage.setItem('rightTorque', rightTorque);
  localStorage.setItem('currentSeesawAngle', currentSeesawAngle);
}

function updateWeightDisplays() {
  const leftTotal = leftSide.reduce((sum, obj) => sum + obj.weight, 0);
  const rightTotal = rightSide.reduce((sum, obj) => sum + obj.weight, 0);
  leftWeightDisplay.textContent = `${leftTotal} kg`;
  rightWeightDisplay.textContent = `${rightTotal} kg`;
}

function renderWeights(animateSide = null) {
  document.querySelectorAll('.weight').forEach((w) => w.remove());

  const renderSide = (weights, side) => {
    const lastIndex = weights.length - 1;
    weights.forEach((obj, index) => {
      const weightDiv = document.createElement('div');
      weightDiv.classList.add('weight');
      if (animateSide === side && index === lastIndex) {
        weightDiv.classList.add('weight-drop');
      }
      const size = 20 + obj.weight * 4;
      weightDiv.style.left = `calc(50% + ${obj.offsetX}px - ${size / 2}px)`;
      weightDiv.style.backgroundColor = obj.color;
      weightDiv.title = `Weight: ${obj.weight}`;
      weightDiv.style.width = `${size}px`;
      weightDiv.style.height = `${size}px`;
      weightDiv.style.top = `-${size}px`;
      const weightNumber = document.createElement('div');
      weightNumber.classList.add('weight-number');
      weightNumber.textContent = obj.weight;
      weightDiv.appendChild(weightNumber);
      seesaw.appendChild(weightDiv);
    });
  };

  renderSide(leftSide, true);
  renderSide(rightSide, false);
}
seesaw.addEventListener('click', (event) => {
  const offsetX = getClickPositionOnSeesaw(event);
  const weight = randomWeight();
  const color = getColorForWeight(weight);
  const obj = { offsetX, weight, color };
  if (offsetX < 0) {
    leftSide.push(obj);
    leftTorque += calculateTheTorque(Math.abs(offsetX), weight);
  } else {
    rightSide.push(obj);
    rightTorque += calculateTheTorque(offsetX, weight);
  }

  updateSeesawTilt();
  renderWeights(offsetX < 0 ? true : false);
  updateWeightDisplays();
  updateWeightEntryDisplay(offsetX, weight);
});

resetBtn.addEventListener('click', () => {
  leftSide.length = 0;
  rightSide.length = 0;
  leftTorque = 0;
  rightTorque = 0;
  currentSeesawAngle = 0;
  localStorage.clear();
  applySeesawTransform(0);
  renderWeights();
  updateWeightDisplays();
  updateAngleDisplay();
  document.getElementById('weight-entry').innerHTML = '';
});
