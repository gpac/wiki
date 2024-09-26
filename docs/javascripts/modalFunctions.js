let closeModalTimer;

function keepModalOpen() {
    clearTimeout(closeModalTimer);
}

function startCloseModalTimer() {
    closeModalTimer = setTimeout(closeModal, 400); 
}
function openModal(keyword, definition, event = null) {
   

    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDefinition = document.getElementById("modal-definition");
    const modalLink = document.getElementById("modal-link");


    if (!modalTitle || !modalDefinition || !modalLink) {
        console.error('Modal elements not found');
        return;
    }
     
    if (modalTitle && modalDefinition && modalLink) {
        let descriptionText = 'Definition not vailable';
        if (typeof definition === 'string') {
            descriptionText = definition;
        } else if (definition && typeof definition === 'object' && definition.description) {
            descriptionText = definition.description;
        } 
        const glossaryPageUrl = `${
            window.location.origin
          }/glossary/${keyword.toLowerCase()}/`;
      
      modalTitle.textContent = keyword;
      modalDefinition.textContent = descriptionText;
      modalLink.href = glossaryPageUrl;

      modal.style.display = "block";

      modal.classList.remove("hidden");
      modal.style.display = "block";
      modalLink.classList.remove("hidden"); 
        
    } else {
        console.error('Modal elements not found');
    }
    setTimeout(() => {
        modal.classList.add("visible");
    }, 10);

  
    modal.addEventListener('mouseenter', keepModalOpen);
    modal.addEventListener('mouseleave', startCloseModalTimer);
}

function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.classList.remove("visible");

        setTimeout(() => {
            modal.style.display = "none";
        }, 300); 
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
    window.closeModal = closeModal;
});