// Flashcards data e controle básico
const cards = [
  { front: "Fórmula da água", back: "H₂O" },
  { front: "Capital do Brasil", back: "Brasília" },
  { front: "Autor de 'Dom Casmurro'", back: "Machado de Assis" },
  { front: "Elemento químico símbolo 'Fe'", back: "Ferro" }
];

let currentIndex = 0;
let showingFront = true;

// Elementos do flashcard
const flashcardEl = document.getElementById('flashcard');
const flashcardInner = document.getElementById('flashcard-inner');
const flashcardFront = document.getElementById('flashcard-front');
const flashcardBack = document.getElementById('flashcard-back');
const flipBtn = document.getElementById('flip-btn');
const nextBtn = document.getElementById('next');

// Atualiza o conteúdo do flashcard
function updateCard() {
  if (flashcardFront && flashcardBack) {
    flashcardFront.textContent = cards[currentIndex].front;
    flashcardBack.textContent = cards[currentIndex].back;
    if (flashcardEl) flashcardEl.classList.remove('flipped');
    showingFront = true;
  }
}

// Evento de virar o flashcard
if (flipBtn && flashcardEl) {
  flipBtn.addEventListener('click', () => {
    flashcardEl.classList.toggle('flipped');
    showingFront = !showingFront;
  });
}

// Evento de próximo card
if (nextBtn && flashcardEl) {
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCard();
  });
}

// Inicializa o primeiro card
updateCard();

// Mascote "dá tchau" ao passar o mouse
const mascote = document.querySelector('.mascote');
if (mascote) {
  mascote.style.transition = 'transform 0.3s';
  mascote.addEventListener('mouseenter', () => mascote.style.transform = 'rotate(-20deg) scale(1.1)');
  mascote.addEventListener('mouseleave', () => mascote.style.transform = '');
}

// ===== Rolagem suave manual com easing =====
function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  requestAnimationFrame(animation);
}

// Intercepta todos os cliques em links da navbar e botões com data-target
document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href^="#"], button[data-target]');
  if (!link) return;

  e.preventDefault(); // Bloqueia salto instantâneo

  let targetId;
  if (link.tagName.toLowerCase() === 'a') {
    targetId = link.getAttribute('href').substring(1);
  } else {
    targetId = link.getAttribute('data-target');
  }

  const targetSection = document.getElementById(targetId);
  if (!targetSection) return;

  const offset = -80; // espaço no topo
  const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY + offset;

  smoothScrollTo(targetPosition, 600); // 600ms de duração
});
