const seesaw = document.getElementById('seesaw');

function getClickPositionOnSeesaw(event) {
  const rect = seesaw.getBoundingClientRect();
  const offsetX = event.clientX - rect.left - rect.width / 2;
  return offsetX;
}

function calculateTheTorque(offsetX) {
    let torque = 1 * offsetX; // Need to add the weight factor later
    console.log('Calculated torque:', torque);
    return torque;
}

seesaw.addEventListener('click', (event) => {
    const offsetX = getClickPositionOnSeesaw(event);
    calculateTheTorque(offsetX);
});