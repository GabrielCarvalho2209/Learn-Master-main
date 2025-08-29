const deckFolderList = document.getElementById('deckFolderList');
const deckSearch = document.getElementById('deckSearch');
const apagarBtn = document.getElementById('apagarBtn');
const editDeckBtn = document.getElementById('editDeckBtn');

function getDecksAndCards() {
    const decks = JSON.parse(localStorage.getItem('decks')) || [];
    const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];

    const decksMap = {};
    decks.forEach(deck => {
        decksMap[deck] = [];
    });

    flashcards.forEach(card => {
        const deckName = card.deck || "Sem deck";
        if (!decksMap[deckName]) {
            decksMap[deckName] = [];
        }
        decksMap[deckName].push(card);
    });

    return decksMap;
}

function renderDeckFolders(filter = "") {
    deckFolderList.innerHTML = "";
    const decksMap = getDecksAndCards();

    const deckNames = Object.keys(decksMap)
        .filter(name => name.toLowerCase().includes(filter.toLowerCase()))
        .sort();

    if (deckNames.length === 0) {
        deckFolderList.innerHTML = "<p>Nenhum deck encontrado.</p>";
        return;
    }

    deckNames.forEach(deckName => {
        const folder = document.createElement('div');
        folder.className = 'deck-folder';
        folder.innerHTML = `
            <div class="deck-folder-title-bg" style="display: flex; align-items: center; gap: 10px;">
                <span class="icon-bc">
                    <button class="study-btn" title="Estudar este deck" style="background:transparent;border:none;padding:0;">
                        <img src="/Imgs/replay.png" alt="Estudar Deck" />
                    </button>
                </span>
                <span class="icon-bg">
                    <img class="deck-folder-icon" src="/Imgs/PastaCards.png" alt="Pasta do Deck" />
                </span>
                <span class="deck-name-text">${deckName}</span>
            </div>
            <div class="deck-flashcards-inside"></div>
        `;

        const inside = folder.querySelector('.deck-flashcards-inside');
        decksMap[deckName].forEach(card => {
            const div = document.createElement('div');
            div.className = 'deck-flashcard';
            div.innerHTML = `
                <div class="front"><b>Frente:</b> ${card.front}</div>
            `;
            div.onclick = () => createFlashcardModal(card);
            inside.appendChild(div);
        });

        folder.querySelector('.deck-folder-icon').onclick = function () {
            document.querySelectorAll('.deck-folder.open').forEach(f => {
                if (f !== folder) f.classList.remove('open');
            });
            folder.classList.toggle('open');
        };

        const studyBtn = folder.querySelector('.study-btn');
        studyBtn.onclick = (e) => {
            e.stopPropagation();
            localStorage.setItem('ultimoDeck', deckName);

            studyBtn.classList.add('clicked');
            setTimeout(() => studyBtn.classList.remove('clicked'), 250);
            createDeckStudyModal(deckName, decksMap[deckName]);
        };

        deckFolderList.appendChild(folder);
    });
}

function createFlashcardModal(card) {
    const oldModal = document.getElementById('flashcard-modal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'flashcard-modal';
    modal.className = 'flashcard-modal';
    modal.innerHTML = `
        <div class="modal-bg"></div>
        <div class="modal-card">
            <div class="modal-flashcard">
                <div class="modal-face modal-front active">
                    <span class="modal-content">${card.front}</span>
                    <span class="modal-label">Frente</span>
                </div>
                <div class="modal-face modal-back">
                    <span class="modal-content">${card.back}</span>
                    <span class="modal-label">Verso</span>
                </div>
            </div>
            <button class="modal-flip-btn">Virar</button>
            <button class="modal-close-btn">&times;</button>
        </div>
    `;

    modal.querySelectorAll('.modal-content').forEach(el => {
        el.style.wordBreak = 'break-word';
        el.style.maxWidth = '100%';
    });

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    const modalFlashcard = modal.querySelector('.modal-flashcard');
    const flipBtn = modal.querySelector('.modal-flip-btn');
    flipBtn.onclick = () => {
        modalFlashcard.classList.toggle('flipped');
        modalFlashcard.querySelector('.modal-front').classList.toggle('active');
        modalFlashcard.querySelector('.modal-back').classList.toggle('active');
    };

    modal.querySelector('.modal-close-btn').onclick = () => closeModal(modal);
    modal.querySelector('.modal-bg').onclick = () => closeModal(modal);
}

function createDeckStudyModal(deckName, cards) {
    if (!cards.length) return;

    let studyCards = [...cards];
    let currentIndex = 0;

    const oldModal = document.getElementById('flashcard-modal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'flashcard-modal';
    modal.className = 'flashcard-modal';
    modal.innerHTML = `
        <div class="modal-bg"></div>
        <div class="modal-card">
            <div class="modal-header">
                <span class="progress-text">1 / ${studyCards.length}</span>
                <div class="modal-controls">
                    <button class="shuffle-btn" title="Embaralhar">🔀</button>
                    <button class="fullscreen-btn" title="Tela cheia">⛶</button>
                    <button class="modal-close-btn">&times;</button>
                </div>
            </div>

            <div class="modal-navigation">
                <button class="nav-btn prev-btn">⬅</button>
                <div class="modal-flashcard">
                    <div class="modal-face modal-front active">
                        <span class="modal-content">${studyCards[0].front}</span>
                        <span class="modal-label">Frente</span>
                    </div>
                    <div class="modal-face modal-back">
                        <span class="modal-content">${studyCards[0].back}</span>
                        <span class="modal-label">Verso</span>
                    </div>
                </div>
                <button class="nav-btn next-btn">➡</button>
            </div>

            <button class="modal-flip-btn">Virar</button>
            <div class="progress-bar"><div class="progress-fill"></div></div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    const modalFlashcard = modal.querySelector('.modal-flashcard');
    const flipBtn = modal.querySelector('.modal-flip-btn');
    const progressText = modal.querySelector('.progress-text');
    const progressFill = modal.querySelector('.progress-fill');

    function updateProgress() {
        progressText.textContent = `${currentIndex + 1} / ${studyCards.length}`;
        progressFill.style.width = `${((currentIndex + 1) / studyCards.length) * 100}%`;
    }

    function updateFlashcard(index, direction) {
        modalFlashcard.classList.add(direction === 'next' ? 'slide-out-left' : 'slide-out-right');

        setTimeout(() => {
            modalFlashcard.classList.remove('flipped');
            modalFlashcard.querySelector('.modal-front').classList.add('active');
            modalFlashcard.querySelector('.modal-back').classList.remove('active');

            modalFlashcard.querySelector('.modal-front .modal-content').textContent = studyCards[index].front;
            modalFlashcard.querySelector('.modal-back .modal-content').textContent = studyCards[index].back;

            modalFlashcard.classList.remove('slide-out-left', 'slide-out-right');
            modalFlashcard.classList.add(direction === 'next' ? 'slide-in-right' : 'slide-in-left');

            setTimeout(() => {
                modalFlashcard.classList.remove('slide-in-right', 'slide-in-left');
            }, 300);

            updateProgress();
        }, 300);
    }

    flipBtn.onclick = () => {
        modalFlashcard.classList.toggle('flipped');
        modalFlashcard.querySelector('.modal-front').classList.toggle('active');
        modalFlashcard.querySelector('.modal-back').classList.toggle('active');

        // Som opcional de flip
        const flipSound = new Audio('flip.mp3');
        flipSound.volume = 0.2;
        flipSound.play().catch(() => {});
    };

    modal.querySelector('.prev-btn').onclick = () => {
        currentIndex = (currentIndex - 1 + studyCards.length) % studyCards.length;
        updateFlashcard(currentIndex, 'prev');
    };
    modal.querySelector('.next-btn').onclick = () => {
        currentIndex = (currentIndex + 1) % studyCards.length;
        updateFlashcard(currentIndex, 'next');
    };

    modal.querySelector('.shuffle-btn').onclick = () => {
        studyCards.sort(() => Math.random() - 0.5);
        currentIndex = 0;
        updateFlashcard(currentIndex, 'next');
    };

    modal.querySelector('.fullscreen-btn').onclick = () => {
        if (!document.fullscreenElement) {
            modal.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    };

    modal.querySelector('.modal-close-btn').onclick = () => closeModal(modal);
    modal.querySelector('.modal-bg').onclick = () => closeModal(modal);

    document.addEventListener('keydown', function keyHandler(e) {
        if (!document.body.contains(modal)) {
            document.removeEventListener('keydown', keyHandler);
            return;
        }
        if (e.code === 'ArrowRight') {
            modal.querySelector('.next-btn').click();
        } else if (e.code === 'ArrowLeft') {
            modal.querySelector('.prev-btn').click();
        } else if (e.code === 'Space') {
            e.preventDefault();
            flipBtn.click();
        } else if (e.code === 'Escape') {
            closeModal(modal);
        }
    });

    updateProgress();
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
}

deckSearch.addEventListener('input', function () {
    renderDeckFolders(this.value);
});

apagarBtn.onclick = function () {
    if (confirm('Tem certeza que deseja apagar todos os decks e flashcards?')) {
        localStorage.removeItem('decks');
        localStorage.removeItem('flashcards');
        renderDeckFolders();
    }
};

editDeckBtn.addEventListener('click', () => {
    document.querySelectorAll('.deck-folder').forEach(folder => {
        if (!folder.querySelector('.deck-edit-btn')) {
            const editBtn = document.createElement('button');
            editBtn.textContent = "✏️";
            editBtn.className = "deck-edit-btn";
            editBtn.style.position = "absolute";
            editBtn.style.top = "10px";
            editBtn.style.left = "10px";
            editBtn.style.background = "white";
            editBtn.style.border = "1px solid #ccc";
            editBtn.style.borderRadius = "5px";
            editBtn.style.cursor = "pointer";
            editBtn.title = "Editar este deck";
            
            editBtn.onclick = (e) => {
                e.stopPropagation();
                const deckName = folder.querySelector('.deck-name-text').textContent;
                openDeckEditModal(deckName);
            };
            folder.appendChild(editBtn);
        }
    });
});

function openDeckEditModal(deckName) {
    const decks = JSON.parse(localStorage.getItem('decks')) || [];
    const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
    const cardsInDeck = flashcards.filter(c => c.deck === deckName);

    const modal = document.createElement('div');
    modal.className = "flashcard-modal show";
    modal.innerHTML = `
        <div class="modal-bg"></div>
        <div class="modal-card edit-modal">
            <h2>Editar Deck</h2>
            <label>Nome do Deck:</label>
            <input type="text" id="editDeckName" value="${deckName}">
            
            <h3>Flashcards</h3>
            <div id="editFlashcardsList">
                ${cardsInDeck.map((card, index) => `
                    <div class="edit-flashcard-item">
                        <label>Frente:</label>
                        <input type="text" class="edit-front" data-index="${index}" value="${card.front}">
                        <label>Verso:</label>
                        <input type="text" class="edit-back" data-index="${index}" value="${card.back}">
                    </div>
                `).join('')}
            </div>
            <button id="saveDeckEdits">Salvar</button>
            <button class="modal-close-btn">&times;</button>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.modal-bg').onclick = () => modal.remove();
    modal.querySelector('.modal-close-btn').onclick = () => modal.remove();

    modal.querySelector('#saveDeckEdits').onclick = () => {
        const newDeckName = document.getElementById('editDeckName').value.trim();
        const deckIndex = decks.indexOf(deckName);
        if (deckIndex !== -1) {
            decks[deckIndex] = newDeckName;
        }

        const fronts = modal.querySelectorAll('.edit-front');
        const backs = modal.querySelectorAll('.edit-back');
        fronts.forEach((input, i) => {
            const card = cardsInDeck[i];
            card.front = input.value.trim();
            card.back = backs[i].value.trim();
            card.deck = newDeckName; 
            const cardIndex = flashcards.findIndex(fc => fc.front === cardsInDeck[i].front && fc.back === cardsInDeck[i].back && fc.deck === deckName);
            if (cardIndex !== -1) {
                flashcards[cardIndex] = card;
            }
        });

        localStorage.setItem('decks', JSON.stringify(decks));
        localStorage.setItem('flashcards', JSON.stringify(flashcards));

        modal.remove();
        renderDeckFolders();
    };
}

renderDeckFolders();
