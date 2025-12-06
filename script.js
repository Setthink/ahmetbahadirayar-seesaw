// Author: Ahmet Bahadır Ayar
// Project: Seesaw Simulation

const DOM = {
  seesaw: document.getElementById('seesaw'),
  resetBtn: document.getElementById('reset-btn'),
  leftWeightDisplay: document.getElementById('left-weight'),
  rightWeightDisplay: document.getElementById('right-weight'),
  angleInfoDisplay: document.getElementById('angle-info'),
  weightEntry: document.getElementById('weight-entry'),
};

const State = {
  weights: JSON.parse(localStorage.getItem('weights')) || [],
  currentSeesawAngle:
    parseFloat(localStorage.getItem('currentSeesawAngle')) || 0,
  leftTorque: parseFloat(localStorage.getItem('leftTorque')) || 0,
  rightTorque: parseFloat(localStorage.getItem('rightTorque')) || 0,

  saveStateToLocalStorage() {
    localStorage.setItem('weights', JSON.stringify(this.weights));
    localStorage.setItem('leftTorque', this.leftTorque);
    localStorage.setItem('rightTorque', this.rightTorque);
    localStorage.setItem('currentSeesawAngle', this.currentSeesawAngle);
  },

  reset() {
    this.weights = [];
    this.leftTorque = 0;
    this.rightTorque = 0;
    this.currentSeesawAngle = 0;
    localStorage.clear();
    Display.applySeesawTransform(0);
    renderWeights();
    Display.updateWeight();
    Display.updateAngle();
    DOM.weightEntry.innerHTML = '';
  },
};

const Util = {
  randomWeight() {
    return Math.floor(Math.random() * 10) + 1;
  },

  getClickPositionOnSeesaw(event) {
    const rect = DOM.seesaw.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    return offsetX;
  },

  calculateTheTorque(offsetX, weight) {
    return offsetX * weight;
  },

  getColorForWeight(weight) {
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
  },
};

const Display = {
  updateSeesawTilt() {
    State.currentSeesawAngle = Math.max(
      -30,
      Math.min(30, (State.rightTorque - State.leftTorque) / 10)
    );
    Display.applySeesawTransform(State.currentSeesawAngle);
    Display.updateAngle();
    State.saveStateToLocalStorage();
  },

  updateAngle() {
    DOM.angleInfoDisplay.textContent = `${State.currentSeesawAngle.toFixed(
      2
    )}°`;
  },

  updateWeight() {
    const leftTotal = State.weights
      .filter((obj) => obj.isLeft)
      .reduce((sum, obj) => sum + obj.weight, 0);
    const rightTotal = State.weights
      .filter((obj) => !obj.isLeft)
      .reduce((sum, obj) => sum + obj.weight, 0);
    DOM.leftWeightDisplay.textContent = `${leftTotal} kg`;
    DOM.rightWeightDisplay.textContent = `${rightTotal} kg`;
  },

  updateWeightEntry(offsetX, weight, isLeft) {
    const weightEntryDiv = document.createElement('div');
    const side = isLeft ? 'Left' : 'Right';
    weightEntryDiv.textContent = `- ${weight}kg added to ${side} side at ${Math.abs(
      offsetX
    ).toFixed(0)}px from center`;
    DOM.weightEntry.prepend(weightEntryDiv);
  },

  rebuildWeightEntry() {
    DOM.weightEntry.innerHTML = '';
    State.weights.forEach((obj) => {
      const weightEntryDiv = document.createElement('div');
      const side = obj.isLeft ? 'Left' : 'Right';
      weightEntryDiv.textContent = `- ${obj.weight}kg added to ${side} side at ${Math.abs(
        obj.offsetX
      ).toFixed(0)}px from center`;
      DOM.weightEntry.prepend(weightEntryDiv);
    });
  },

  applySeesawTransform(angle) {
    DOM.seesaw.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
  },
};

function renderWeights(animateIsLeft = null) {
  document.querySelectorAll('.weight').forEach((w) => w.remove());

  const leftWeights = State.weights.filter((obj) => obj.isLeft);
  const rightWeights = State.weights.filter((obj) => !obj.isLeft);

  const renderSide = (weights, isLeft) => {
    const lastIndex = weights.length - 1;
    weights.forEach((obj, index) => {
      const weightDiv = document.createElement('div');
      weightDiv.classList.add('weight');
      if (animateIsLeft === isLeft && index === lastIndex) {
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
      DOM.seesaw.appendChild(weightDiv);
    });
  };

  renderSide(leftWeights, true);
  renderSide(rightWeights, false);
}

DOM.seesaw.addEventListener('click', (event) => {
  const offsetX = Util.getClickPositionOnSeesaw(event);
  const weight = Util.randomWeight();
  const color = Util.getColorForWeight(weight);
  const isLeft = offsetX < 0;
  const obj = { offsetX, weight, color, isLeft };
  
  State.weights.push(obj);
  
  if (isLeft) {
    State.leftTorque += Util.calculateTheTorque(Math.abs(offsetX), weight);
  } else {
    State.rightTorque += Util.calculateTheTorque(offsetX, weight);
  }

  Display.updateSeesawTilt();
  renderWeights(isLeft);
  Display.updateWeight();
  Display.updateWeightEntry(offsetX, weight, isLeft);
});

DOM.resetBtn.addEventListener('click', () => {
  State.reset();
});

// Initialize on load
Display.applySeesawTransform(State.currentSeesawAngle);
renderWeights();
Display.updateWeight();
Display.updateAngle();
Display.rebuildWeightEntry();
