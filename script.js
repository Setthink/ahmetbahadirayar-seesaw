const seesaw = document.getElementById('seesaw');

const leftSide = JSON.parse(localStorage.getItem('leftSide')) || [];
const rightSide = JSON.parse(localStorage.getItem('rightSide')) || [];
let currentSeesawAngle =
  parseFloat(localStorage.getItem('currentSeesawAngle')) || 0;
let leftTorque = parseFloat(localStorage.getItem('leftTorque')) || 0;
let rightTorque = parseFloat(localStorage.getItem('rightTorque')) || 0;

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
  seesaw.style.transform = `translate(-50%, -50%) rotate(${currentSeesawAngle}deg)`;
  saveStateToLocalStorage();
}

function saveStateToLocalStorage() {
  localStorage.setItem('leftSide', JSON.stringify(leftSide));
  localStorage.setItem('rightSide', JSON.stringify(rightSide));
  localStorage.setItem('leftTorque', leftTorque);
  localStorage.setItem('rightTorque', rightTorque);
  localStorage.setItem('currentSeesawAngle', currentSeesawAngle);
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
  console.log('angle:', currentSeesawAngle);
});
