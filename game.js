// Valentine's Day Memory Game - Sarah & Kaan
// Cross-matching pairs with hidden photo reveal!

const pairs = [
    { a: '🇹🇷', b: '🇲🇦', label: 'countries' },
    { a: 'sarah', b: 'kaan', label: 'names' },
    { a: 'askim', b: 'mine', label: 'words' },
    { a: 'love', b: 'miss', label: 'feelings' },
    { a: '6 months', b: 'together', label: 'time' },
    { a: '❤️', b: '💕', label: 'hearts' },
    { a: '💋', b: '🥰', label: 'kisses' },
    { a: '14/02', b: 'forever', label: 'date' },
];

// All photos for slideshow (shuffled hidden photo chosen from these)
const allPhotos = [
    'images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg',
    'images/5.jpg', 'images/6.jpg', 'images/7.jpg', 'images/8.jpg',
    'images/9.jpg', 'images/10.jpg', 'images/11.jpg'
];

// DOM elements
const gameBoard = document.getElementById('gameBoard');
const hiddenPhoto = document.getElementById('hiddenPhoto');
const moveCountEl = document.getElementById('moveCount');
const matchCountEl = document.getElementById('matchCount');
const timerEl = document.getElementById('timer');
const restartBtn = document.getElementById('restartBtn');
const victoryOverlay = document.getElementById('victoryOverlay');
const playAgainBtn = document.getElementById('playAgainBtn');
const victoryMoves = document.getElementById('victoryMoves');
const victoryTime = document.getElementById('victoryTime');
const floatingHearts = document.getElementById('floatingHearts');
const slideshowImg = document.getElementById('slideshowImg');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moveCount = 0;
let timerInterval = null;
let seconds = 0;
let isLocked = false;
let gameStarted = false;
let currentSlide = 0;
let currentHiddenPhoto = '';

// Shuffle array (Fisher-Yates)
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Format time
function formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// Start timer
function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        seconds++;
        timerEl.textContent = formatTime(seconds);
    }, 1000);
}

// Stop timer
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// Determine if a card value is an emoji
function isEmoji(value) {
    const emojiRegex = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u;
    return emojiRegex.test(value);
}

// Create a card element
function createCard(value, pairId, gridIndex) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.value = value;
    card.dataset.pairId = pairId;
    card.dataset.gridIndex = gridIndex;

    const isEmojiCard = isEmoji(value);
    const contentClass = isEmojiCard ? 'card-emoji' : 'card-text';

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back">
                <span class="${contentClass}">${value}</span>
            </div>
        </div>
    `;

    card.addEventListener('click', () => flipCard(card));
    return card;
}

// Flip a card
function flipCard(card) {
    if (isLocked) return;
    if (card.classList.contains('flipped')) return;
    if (card.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;

    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moveCount++;
        moveCountEl.textContent = moveCount;
        checkMatch();
    }
}

// Check if two cards are a cross-match pair
function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.pairId === card2.dataset.pairId &&
                  card1.dataset.value !== card2.dataset.value;

    if (match) {
        card1.classList.add('matched');
        card2.classList.add('matched');

        // Reveal the photo sections underneath (wait so player can see the match)
        setTimeout(() => {
            card1.classList.add('revealed');
            card2.classList.add('revealed');
        }, 1400);

        showMatchConnection(card1, card2);

        matchedPairs++;
        matchCountEl.textContent = matchedPairs;
        flippedCards = [];

        if (matchedPairs === pairs.length) {
            stopTimer();
            // Reveal entire photo first, then show victory
            setTimeout(() => {
                gameBoard.classList.add('all-revealed');
                setTimeout(showVictory, 1200);
            }, 600);
        }
    } else {
        isLocked = true;
        card1.classList.add('wrong');
        card2.classList.add('wrong');

        setTimeout(() => {
            card1.classList.remove('flipped', 'wrong');
            card2.classList.remove('flipped', 'wrong');
            flippedCards = [];
            isLocked = false;
        }, 900);
    }
}

// Show a brief "matched" connection animation
function showMatchConnection(card1, card2) {
    const pairId = card1.dataset.pairId;
    const pair = pairs[pairId];

    const label = document.createElement('div');
    label.className = 'match-label';
    label.textContent = pair.a + ' ♥ ' + pair.b;
    gameBoard.appendChild(label);

    const r1 = card1.getBoundingClientRect();
    const r2 = card2.getBoundingClientRect();
    const boardRect = gameBoard.getBoundingClientRect();
    const cx = ((r1.left + r1.right) / 2 + (r2.left + r2.right) / 2) / 2 - boardRect.left;
    const cy = ((r1.top + r1.bottom) / 2 + (r2.top + r2.bottom) / 2) / 2 - boardRect.top;

    label.style.left = cx + 'px';
    label.style.top = cy + 'px';

    setTimeout(() => label.remove(), 1200);
}

// Show victory screen
function showVictory() {
    victoryMoves.textContent = moveCount;
    victoryTime.textContent = formatTime(seconds);
    currentSlide = 0;
    updateSlideshow();
    victoryOverlay.classList.add('show');

    for (let i = 0; i < 25; i++) {
        setTimeout(() => spawnFloatingHeart(), i * 120);
    }
}

// Slideshow controls
function updateSlideshow() {
    slideshowImg.style.opacity = 0;
    setTimeout(() => {
        slideshowImg.src = allPhotos[currentSlide];
        slideshowImg.style.opacity = 1;
    }, 200);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % allPhotos.length;
    updateSlideshow();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + allPhotos.length) % allPhotos.length;
    updateSlideshow();
}

// Initialize game
function initGame() {
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moveCount = 0;
    seconds = 0;
    isLocked = false;
    gameStarted = false;
    stopTimer();

    moveCountEl.textContent = '0';
    matchCountEl.textContent = '0';
    timerEl.textContent = '00:00';
    victoryOverlay.classList.remove('show');
    gameBoard.classList.remove('all-revealed');
    gameBoard.innerHTML = '';

    // Pick a random photo for the hidden background
    currentHiddenPhoto = allPhotos[Math.floor(Math.random() * allPhotos.length)];
    hiddenPhoto.style.backgroundImage = `url('${currentHiddenPhoto}')`;

    // Build card data
    const allCards = [];
    pairs.forEach((pair, index) => {
        allCards.push({ value: pair.a, pairId: index });
        allCards.push({ value: pair.b, pairId: index });
    });

    const shuffled = shuffle(allCards);

    shuffled.forEach(({ value, pairId }, gridIndex) => {
        const card = createCard(value, pairId, gridIndex);
        cards.push(card);
        gameBoard.appendChild(card);
    });

    // Intro: briefly show all cards
    setTimeout(() => {
        cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('flipped'), i * 50);
        });

        setTimeout(() => {
            cards.forEach((card, i) => {
                setTimeout(() => card.classList.remove('flipped'), i * 30);
            });
        }, 1500);
    }, 300);
}

// Floating hearts background
function spawnFloatingHeart() {
    const heartEmojis = ['❤️', '💕', '💘', '💗', '💖', '🩷', '🇹🇷', '🇲🇦'];
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (4 + Math.random() * 4) + 's';
    heart.style.fontSize = (14 + Math.random() * 16) + 'px';
    floatingHearts.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove());
}

function startAmbientHearts() {
    setInterval(() => {
        if (Math.random() > 0.5) {
            spawnFloatingHeart();
        }
    }, 2500);
}

// Auto-advance slideshow
let slideshowInterval = null;
function startSlideshowAuto() {
    slideshowInterval = setInterval(nextSlide, 3000);
}
function stopSlideshowAuto() {
    clearInterval(slideshowInterval);
}

// Event listeners
restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', () => {
    stopSlideshowAuto();
    initGame();
});
prevBtn.addEventListener('click', () => {
    stopSlideshowAuto();
    prevSlide();
    startSlideshowAuto();
});
nextBtn.addEventListener('click', () => {
    stopSlideshowAuto();
    nextSlide();
    startSlideshowAuto();
});

// Observe victory overlay to start/stop slideshow
const observer = new MutationObserver(() => {
    if (victoryOverlay.classList.contains('show')) {
        startSlideshowAuto();
    } else {
        stopSlideshowAuto();
    }
});
observer.observe(victoryOverlay, { attributes: true, attributeFilter: ['class'] });

// Start!
initGame();
startAmbientHearts();
