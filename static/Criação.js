const deckInput = document.getElementById('deck-input');
const addDeckBtn = document.getElementById('addDeckBtn');
const deckSelect = document.getElementById('deck-select');
const visualizarBtn = document.getElementById('vizualizarBtn');
const criarBtn = document.getElementById('criarBtn');
const frontInput = document.getElementById('front-input');
const backInput = document.getElementById('back-input');
const visualFrontContent = document.getElementById('visualFrontContent');
const visualBackContent = document.getElementById('visualBackContent');
const flashcardVisual = document.getElementById('flashcardVisual');
const flipBtn = document.getElementById('flipBtn');
const visualFront = document.getElementById('visualFront');
const visualBack = document.getElementById('visualBack');


let decks = JSON.parse(localStorage.getItem('decks')) || [];

function renderDecks() {
    deckSelect.innerHTML = '<option value="">Nenhum deck criado</option>';
    decks.forEach(deckName => {
        const option = document.createElement('option');
        option.value = deckName;
        option.textContent = deckName;
        deckSelect.appendChild(option);
    });
}
renderDecks();

addDeckBtn.addEventListener('click', () => {
    const deckName = deckInput.value.trim();
    if (deckName && !decks.includes(deckName)) {
        decks.push(deckName);
        localStorage.setItem('decks', JSON.stringify(decks));
        renderDecks();
        deckSelect.value = deckName;
        deckInput.value = '';
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const visualizarBtn = document.getElementById('vizualizarBtn');
    const criarBtn = document.getElementById('criarBtn');
    const frontInput = document.getElementById('front-input');
    const backInput = document.getElementById('back-input');
    const visualFrontContent = document.getElementById('visualFrontContent');
    const visualBackContent = document.getElementById('visualBackContent');
    const flashcardVisual = document.getElementById('flashcardVisual');

    let visualizado = false;

    function validarCampos() {
        return frontInput.value.trim() !== "" && backInput.value.trim() !== "";
    }

    function atualizarEstadoCriar() {
        criarBtn.disabled = !(visualizado && validarCampos());
    }

    visualizarBtn.addEventListener('click', function() {
        if (validarCampos()) {
            visualFrontContent.textContent = frontInput.value;
            visualBackContent.textContent = backInput.value;
            flashcardVisual.classList.add('highlight');
            setTimeout(() => flashcardVisual.classList.remove('highlight'), 600);
            visualizado = true;
            atualizarEstadoCriar();
        } else {
            alert('Preencha ambos os campos antes de visualizar!');
        }
    });

    frontInput.addEventListener('input', () => {
        visualizado = false;
        atualizarEstadoCriar();
    });
    backInput.addEventListener('input', () => {
        visualizado = false;
        atualizarEstadoCriar();
    });

    document.getElementById('flashcard-form').addEventListener('submit', function(e) {
        if (!(visualizado && validarCampos())) {
            e.preventDefault();
            criarBtn.disabled = true;
            alert('Preencha os campos e visualize o flashcard antes de criar!');
        }
    });

    atualizarEstadoCriar();
});


document.getElementById('flashcard-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
  
    const frontInput = document.getElementById('front-input');
    const backInput = document.getElementById('back-input');
    const deckSelect = document.getElementById('deck-select');
    const criarBtn = document.getElementById('criarBtn');

    if (criarBtn.disabled) {
        alert('Preencha os campos e visualize o flashcard antes de criar!');
        return;
    }

 
    const deck = deckSelect.value;
    const front = frontInput.value;
    const back = backInput.value;
    let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
    flashcards.push({ deck, front, back });
    localStorage.setItem('flashcards', JSON.stringify(flashcards));

  
    window.location.href = '/Index/Decks/decks.html';
});


flipBtn.addEventListener('click', () => {
    flashcardVisual.classList.toggle('flipped');
    visualFront.classList.toggle('active');
    visualBack.classList.toggle('active');
});
