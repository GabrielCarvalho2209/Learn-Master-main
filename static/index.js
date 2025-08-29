document.addEventListener("DOMContentLoaded", () => {
    const createBtn = document.getElementById("createBtn");
    const viewBtn = document.getElementById("viewBtn");
    const deckTitleEl = document.getElementById("deckTitle");
    const ultimoDeck = localStorage.getItem("ultimoDeck");

    // Atualiza o título do deck com o último deck acessado
    if (deckTitleEl && ultimoDeck) {
        deckTitleEl.textContent = ultimoDeck;
        // Torna a div/título clicável para ir ao deck correspondente
        deckTitleEl.style.cursor = "pointer";
        deckTitleEl.title = "Ir para o deck";
        deckTitleEl.addEventListener("click", () => {
            window.location.href = "/Index/Decks/decks.html#deck-" + encodeURIComponent(ultimoDeck);
        });
    }

    // Botão para criar flashcard
    if (createBtn) {
        createBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/Index/Criação/Criação.html";
        });
    }

    // Botão para ver flashcards
    if (viewBtn) {
        viewBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/Index/Decks/decks.html";
        });
    }
});
