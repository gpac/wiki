let closeModalTimer;

function keepModalOpen() {
    try {
        clearTimeout(closeModalTimer);
    } catch (error) {
        console.error('Error keeping modal open:', error);
    }
}

function startCloseModalTimer() {
    try {
        closeModalTimer = setTimeout(closeModal, 300);
    } catch (error) {
        console.error('Error starting close modal timer:', error);
    }
}

function openModal(keyword, definition, event = null) {
    try {
        const modal = document.getElementById("modal");
        const modalTitle = document.getElementById("modal-title");
        const modalDefinition = document.getElementById("modal-definition");
        const modalLink = document.getElementById("modal-link");

        if (!modalTitle || !modalDefinition || !modalLink) {
            console.error('Modal elements not found');
            return;
        }

        let descriptionText = 'Definition not available';
        if (typeof definition === 'string') {
            descriptionText = definition;
        } else if (definition && typeof definition === 'object' && definition.description) {
            descriptionText = definition.description;
        }

        const glossaryPageUrl = `${window.location.origin}/glossary/${keyword.toLowerCase()}/`;

        modalTitle.textContent = keyword;
        modalDefinition.textContent = descriptionText;
        modalLink.href = glossaryPageUrl;

        modal.style.display = "block";
        modal.classList.remove("hidden");
        modalLink.classList.remove("hidden");

        setTimeout(() => {
            modal.classList.add("visible");
        }, 10);

        modal.addEventListener('mouseenter', keepModalOpen);
        modal.addEventListener('mouseleave', startCloseModalTimer);
    } catch (error) {
        console.error('Error opening modal:', error);
    }
}

function closeModal() {
    try {
        const modal = document.getElementById("modal");
        if (modal) {
            modal.classList.remove("visible");

            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
        }
    } catch (error) {
        console.error('Error closing modal:', error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    try {
        document.getElementById("close-modal").addEventListener("click", function () {
            try {
                const modal = document.getElementById("modal");
                modal.classList.add("hidden");
                modal.style.display = "none";
            } catch (error) {
                console.error('Error handling close-modal click event:', error);
            }
        });

        document.getElementById("modal").addEventListener("click", function (event) {
            try {
                if (event.target === event.currentTarget) {
                    const modal = document.getElementById("modal");
                    modal.classList.add("hidden");
                    modal.style.display = "none";
                }
            } catch (error) {
                console.error('Error handling modal click event:', error);
            }
        });

        window.openModal = openModal;
        window.closeModal = closeModal;
    } catch (error) {
        console.error('Error during DOMContentLoaded event:', error);
    }
});