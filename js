// pomodoro
const bells = new Audio('./sounds/bell.wav'); 
const startBtn = document.querySelector('.btn-start'); 
const pauseBtn = document.querySelector('.btn-pause'); 
const resetBtn = document.querySelector('.btn-reset'); 
const timeInput = document.querySelector('#timeInput'); 
const breakTimeInput = document.querySelector('#breakTimeInput');
const session = document.querySelector('.minutes'); 
const appMessage = document.querySelector('.app-message');
let onBreak = false;


//pomordoro
let myInterval; 
let state = 'stopped'; // stopped or running or paused
let totalSeconds = 0;
let originalMinutes = 25;

// things for unlocking recipes
let totalStudyMinutes = 0;
const totalMinutesElement = document.getElementById('totalMinutes');
const recipeListElement = document.getElementById('recipeList');

const recipes = [
  { minutes: 1, name: "Espresso Shot" },
  { minutes: 2, name: "Cappuccino" },
  { minutes: 120, name: "Iced Latte" },
  { minutes: 180, name: "Mocha Deluxe" },
  { minutes: 240, name: "Cold Brew Supreme" }
];

let unlockedRecipes = [];


// display times
const updateDisplay = (minutes, seconds) => {
  const minuteDiv = document.querySelector('.minutes');
  const secondDiv = document.querySelector('.seconds');
  
  minuteDiv.textContent = minutes;
  secondDiv.textContent = seconds < 10 ? '0' + seconds : seconds;
}

// button states
const updateButtons = () => {
  if (state === 'stopped') {
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = false;
    startBtn.textContent = 'start';
  } else if (state === 'running') {
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      resetBtn.disabled = false;
      pauseBtn.textContent = 'pause';
  } else if (state === 'paused') {
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      resetBtn.disabled = false;
      startBtn.textContent = 'resume';
  }
}

// getting session time from input or default
const getSessionTime = () => {
  const inputValue = timeInput.value;
  if (inputValue && inputValue > 0 && inputValue <= 120) {
    return parseInt(inputValue);
  }
  return 25; // default
}

// get break time
const getBreakTime = () => {
  const inputValue = breakTimeInput.value;
  if (inputValue && inputValue > 0 && inputValue <= 30) {
    return parseInt(inputValue);
  }
  return 5; // default
}

// timer countdown function
const updateSeconds = () => {
  totalSeconds--;
  
  let minutesLeft = Math.floor(totalSeconds / 60);
  let secondsLeft = totalSeconds % 60;
  
  updateDisplay(minutesLeft, secondsLeft);
  
  if (minutesLeft === 0 && secondsLeft === 0) {
    bells.play();
    clearInterval(myInterval);

    if (!onBreak) {
      // Finish study session
      updateProgress(originalMinutes);
      appMessage.textContent = 'Study done! Break time started.';
      onBreak = true;
      const breakMinutes = getBreakTime();
      totalSeconds = breakMinutes * 60;
      updateDisplay(breakMinutes, 0);
      myInterval = setInterval(updateSeconds, 1000); // start break timer
    } else {
      // Finish break
      appMessage.textContent = 'Break finished! Ready to start again.';
      state = 'stopped';
      onBreak = false;
      updateButtons();
    }
  }
}

// starting timer
const startTimer = () => {
  if (state === 'stopped') {
    // to start it fresh
    originalMinutes = getSessionTime();
    totalSeconds = originalMinutes * 60;
    appMessage.textContent = `Timer running for ${originalMinutes} minutes`;
    updateDisplay(originalMinutes, 0);
  } else if (state === 'paused') {
    // to resume
    appMessage.textContent = 'Timer resumed';
  }
  
  state = 'running';
  updateButtons();
  myInterval = setInterval(updateSeconds, 1000);
}

// pausing timer function
const pauseTimer = () => {
  if (state === 'running') {
    state = 'paused';
    clearInterval(myInterval);
    appMessage.textContent = 'Timer paused';
    updateButtons();
  }
}

// resetting the timer function
const resetTimer = () => {
  clearInterval(myInterval);
  state = 'stopped';
  onBreak = false;
  originalMinutes = getSessionTime();
  totalSeconds = originalMinutes * 60;
  updateDisplay(originalMinutes, 0);
  appMessage.textContent = 'Press start to begin';
  updateButtons();
}

// updating the display when something changes
const updateInputDisplay = () => {
  if (state === 'stopped') {
    const minutes = getSessionTime();
    updateDisplay(minutes, 0);
  }
}

// recipe unlocker function
const updateProgress = (sessionMinutes) => {
  totalStudyMinutes += sessionMinutes;
  totalMinutesElement.textContent = totalStudyMinutes;

  recipes.forEach(recipe => {
    if (totalStudyMinutes >= recipe.minutes && !unlockedRecipes.includes(recipe.name)) {
      unlockedRecipes.push(recipe.name);
      const li = document.createElement('li');
      li.textContent = recipe.name;
      recipeListElement.appendChild(li);
    }
  })
  // storing recipes
  localStorage.setItem('unlockedRecipes', JSON.stringify(unlockedRecipes));
}


// event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
timeInput.addEventListener('input', updateInputDisplay);

// Initialize
updateButtons();
updateInputDisplay();