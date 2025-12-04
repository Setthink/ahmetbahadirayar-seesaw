const seesaw = document.getElementById('seesaw');
const resetBtn = document.getElementById('reset-btn');

let leftSide = JSON.parse(localStorage.getItem('leftSide')) || [];
let rightSide = JSON.parse(localStorage.getItem('rightSide')) || [];
let currentSeesawAngle =
  parseFloat(localStorage.getItem('currentSeesawAngle')) || 0;
let leftTorque = parseFloat(localStorage.getItem('leftTorque')) || 0;
let rightTorque = parseFloat(localStorage.getItem('rightTorque')) || 0;
// Show the saved seesaw angle on load
applySeesawTransform(currentSeesawAngle);
renderWeights();


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
  saveStateToLocalStorage();
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

function renderWeights() {
  document.querySelectorAll('.weight').forEach(w => w.remove());

  const allWeights = [...leftSide, ...rightSide];

  allWeights.forEach(obj => {
    const weightDiv = document.createElement('div');
    weightDiv.classList.add('weight');
    weightDiv.style.left = `calc(50% + ${obj.offsetX}px - 20px)`;
    weightDiv.style.backgroundColor = obj.color;
    weightDiv.title = `Weight: ${obj.weight}`;
    const weightNumber = document.createElement('div');
    weightNumber.classList.add('weight-number');
    weightNumber.textContent = obj.weight;
    weightDiv.appendChild(weightNumber);
    seesaw.appendChild(weightDiv);
  });
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
  renderWeights();
  console.log('angle:', currentSeesawAngle);
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
});
