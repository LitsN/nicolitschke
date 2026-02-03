document.addEventListener("DOMContentLoaded", function () {

    // 1. Modal-HTML Struktur dynamisch am Ende des Body erzeugen
    const modalHTML = `
        <div id="imgModal" class="lightbox-modal">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-content" id="imgModalSrc">
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 2. Elemente auswählen
    const modal = document.getElementById("imgModal");
    const modalImg = document.getElementById("imgModalSrc");
    const closeBtn = document.getElementsByClassName("lightbox-close")[0];

    // Alle Bilder innerhalb von <article> und <figure> auswählen
    const images = document.querySelectorAll('article figure img');

    // 3. Klick-Event für jedes Bild hinzufügen
    images.forEach(img => {
        img.addEventListener('click', function () {
            modal.style.display = "flex"; // Flexbox für Zentrierung
            modal.style.justifyContent = "center";
            modal.style.alignItems = "center";
            modalImg.src = this.src;
            modalImg.alt = this.alt;
        });
    });

    // 4. Schließen-Funktion (X-Button)
    closeBtn.onclick = function () {
        modal.style.display = "none";
    }

    // 5. Schließen bei Klick auf den Hintergrund
    modal.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    // 6. Schließen mit ESC-Taste
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
        }
    });
});