const seesaw = document.getElementById('seesaw');

const leftSide = [];
const rightSide = [];
let currentSeesawAngle = 0;
let leftTorque = 0;
let rightTorque = 0;

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
}

seesaw.addEventListener('click', (event) => {
  const offsetX = getClickPositionOnSeesaw(event);
  const weight = randomWeight();
  const obj = { offsetX, weight };
  if (offsetX < 0) {
    leftSide.push(obj);
    leftTorque += calculateTheTorque(Math.abs(offsetX), weight);
  } else {
    rightSide.push(obj);
    rightTorque += calculateTheTorque(offsetX, weight);
  }

  updateSeesawTilt();
});
