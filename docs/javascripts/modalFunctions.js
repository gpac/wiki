function openModal(keyword, definition) {
   

    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDefinition = document.getElementById("modal-definition");
    const modalLink = document.getElementById("modal-link");

    if (modalTitle && modalDefinition && modalLink) {
        let descriptionText;
        if (typeof definition === 'string') {
            descriptionText = definition;
        } else if (definition && typeof definition === 'object' && definition.description) {
            descriptionText = definition.description;
        } else {
            descriptionText = 'Definition not available';
        }
        const glossaryPageUrl = `${window.location.origin}/glossary/${keyword.toLowerCase()}/`;
      
        if (window.innerWidth <= 1040) {
            window.location.href = glossaryPageUrl;
        } else {
            modalTitle.textContent = keyword;
            modalDefinition.textContent = descriptionText;
            modalLink.href = `${window.location.origin}/glossary/${keyword.toLowerCase()}/`;
            modal.classList.remove("hidden");
            modal.style.display = "block";
            modalLink.classList.remove("hidden");
        }
    } else {
        console.error('Modal elements not found');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("close-modal").addEventListener("click", function () {
        const modal = document.getElementById("modal");
        modal.classList.add("hidden");
        modal.style.display = "none";
    });

    document.getElementById("modal").addEventListener("click", function (event) {
        if (event.target === event.currentTarget) {
            const modal = document.getElementById("modal");
            modal.classList.add("hidden");
            modal.style.display = "none";
        }
    });

    window.openModal = openModal;
});