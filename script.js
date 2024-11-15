const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')
const stopperElement = document.getElementById('stopper')
const resetElement = document.getElementById('reset')

quoteInputElement.addEventListener('input', () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span')
  const arrayValue = quoteInputElement.value.split('')

  let correct = true
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index]
    if (character == null) {
      characterSpan.classList.remove('correct')
      characterSpan.classList.remove('incorrect')
      correct = false
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct')
      characterSpan.classList.remove('incorrect')
    } else {
      characterSpan.classList.remove('correct')
      characterSpan.classList.add('incorrect')
      correct = false
    }
  })

  if (correct) renderNewQuote()
})

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content)
}

async function renderNewQuote() {
  const quote = await getRandomQuote()
  quoteDisplayElement.innerHTML = ''
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span')
    characterSpan.innerText = character
    quoteDisplayElement.appendChild(characterSpan)
  })
  quoteInputElement.value = null
  startTimer()
}

let timerInterval 
let startTime
let isPaused = false
let elapsedTime = 0

function startTimer() {
  timerElement.innerText = 0
  startTime = new Date()
  clearInterval(timerInterval) // Ensure no previous interval is running
  timerInterval = setInterval(() => {
    timerElement.innerText = getTimerTime()
  }, 1000)
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000)
}

stopperElement.addEventListener('click', () => {
  if (!isPaused) {
    freezeEverything()
    stopperElement.innerText = 'Resume' // Update button text
  } else {
    unfreezeEverything()
    stopperElement.innerText = 'Pause' 
  }
  isPaused = !isPaused 
})

function freezeEverything() {
    clearInterval(timerInterval) 
    elapsedTime = getTimerTime() 
    quoteInputElement.disabled = true 
  }
  
  function unfreezeEverything() {
    quoteInputElement.disabled = false 
    startFrozenTimer(elapsedTime) 
  }

function startFrozenTimer(frozenTime) {
  startTime = new Date() - frozenTime * 1000 
  timerInterval = setInterval(() => {
    timerElement.innerText = getTimerTime()
  }, 1000)
}

resetElement.addEventListener('click', () => {
    window.location.reload()
})

renderNewQuote()
