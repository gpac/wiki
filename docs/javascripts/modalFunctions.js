let closeModalTimer;

function keepModalOpen() {
  clearTimeout(closeModalTimer);
}

function startCloseModalTimer() {
  closeModalTimer = setTimeout(closeModal, 300);
}

function openModal(keyword, definition, event) {
  try {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDefinition = document.getElementById("modal-definition");
    const modalLink = document.getElementById("modal-link");

    if (!modalTitle || !modalDefinition || !modalLink) {
      throw new Error("Modal elements not found");
    }

    setModalContent(modalTitle, modalDefinition, modalLink, keyword, definition);

    if (event && event.target) {
      const rect = event.target.getBoundingClientRect();
      const parentRect = document.querySelector('.words-cloud-container').getBoundingClientRect();

      const offsetLeft = rect.left - parentRect.left;
      const offsetTop = rect.bottom - parentRect.top;

      modal.style.position = "absolute";
      modal.style.left = `${offsetLeft - 80}px`;
      modal.style.top = `${offsetTop + 40}px`;
    }

    showModal(modal, modalLink);

    modal.addEventListener("mouseenter", keepModalOpen);
    modal.addEventListener("mouseleave", startCloseModalTimer);
  } catch (error) {
    console.error("Error opening modal:", error);
  }
}

function setModalContent(modalTitle, modalDefinition, modalLink, keyword, definition) {
  try {
    let descriptionText = "Definition not available";
    if (typeof definition === "string") {
      descriptionText = definition;
    } else if (definition && typeof definition === "object" && definition.description) {
      descriptionText = definition.description;
    }

    const glossaryPageUrl = `${window.location.origin}/glossary/${keyword.toLowerCase()}`;
    const tagsPageUrl = `/tags/#${keyword.toLowerCase()}`;

    modalTitle.textContent = keyword;
    modalTitle.onclick = function () {
      window.location.href = tagsPageUrl;
    };

    modalDefinition.innerHTML = '';

    // Description
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = descriptionText;
    modalDefinition.appendChild(descriptionElement);

    // Aliases section
    if (definition.aliases && definition.aliases.length > 0) {
      const aliasesSection = createAliasesSection(definition.aliases);
      modalDefinition.appendChild(aliasesSection);
    }
    if (definition.glossaryPage) {
      modalLink.href = definition.url || glossaryPageUrl;
      modalLink.style.display = "inline-block";
    } else {
      modalLink.style.display = "none";
    }
  } catch (error) {
    console.error("Error setting modal content:", error);
  }
}

function createAliasesSection(aliases) {
  try {
    const aliasesSection = document.createElement("div");
    aliasesSection.classList.add("modal-aliases");

    const aliasesTitle = document.createElement("h3");
    aliasesTitle.textContent = "See also:";
    aliasesSection.appendChild(aliasesTitle);

    const aliasesList = document.createElement("ul");
    aliases.forEach((alias) => {
      const aliasItem = document.createElement("li");
      const aliasLink = createAliasLink(alias);
      aliasItem.appendChild(aliasLink);
      aliasesList.appendChild(aliasItem);
    });

    aliasesSection.appendChild(aliasesList);
    return aliasesSection;
  } catch (error) {
    console.error("Error creating aliases section:", error);
  }
}

function createAliasLink(alias) {
  try {
    const link = document.createElement("a");
    link.textContent = alias;
    link.href = `/tags/#${alias.toLowerCase()}`;
    link.className = "alias-link";
    return link;
  } catch (error) {
    console.error("Error creating alias link:", error);
  }
}

function showModal(modal, modalLink) {
  try {
    modal.style.display = "block";
    modal.classList.remove("hidden");
    modalLink.classList.remove("hidden");

    modal.offsetHeight;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.classList.add("visible");
  
      });
    });

    setTimeout(() => {
      modal.classList.add("visible");
    }, 10);
  } catch (error) {
    console.error("Error showing modal:", error);
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
    console.error("Error closing modal:", error);
  }
}


document.addEventListener("DOMContentLoaded", function () {
  try {
    const closeModalButton = document.getElementById("close-modal");
    const modal = document.getElementById("modal");

    if (!closeModalButton || !modal) {
      throw new Error("Required modal elements not found");
    }

    closeModalButton.addEventListener("click", function () {
      try {
        modal.classList.add("hidden");
        modal.style.display = "none";
      } catch (error) {
        console.error("Error closing modal:", error);
      }
    });

    modal.addEventListener("click", function (event) {
      try {
        if (event.target === event.currentTarget) {
          modal.classList.add("hidden");
          modal.style.display = "none";
        }
      } catch (error) {
        console.error("Error handling modal click:", error);
      }
    });

    window.openModal = openModal;
    window.closeModal = closeModal;
  } catch (error) {
    console.error("Error initializing modal event listeners:", error);
  }
});

window.addEventListener('resize', function() {
  try {
    const modal = document.getElementById("modal");
    if (!modal) {
      throw new Error("Modal element not found");
    }

    if (modal.style.display === "block") {
      const wordCloudElement = document.querySelector('.words-cloud');
      if (!wordCloudElement) {
        throw new Error("Word cloud element not found");
      }

      const wordCloudRect = wordCloudElement.getBoundingClientRect();
      const modalRect = modal.getBoundingClientRect();


      modal.style.left = `${wordCloudRect.left + (wordCloudRect.width - modalRect.width) / 2}px`;

     
      const computedStyle = window.getComputedStyle(modal);
      let currentTop = parseFloat(computedStyle.top);

      const newTop = currentTop - 50;
      modal.style.top = `${newTop}px`;

      console.log('Previous top:', currentTop, 'New top:', newTop);
    }
  } catch (error) {
    console.error("Error handling window resize:", error);
  }
});