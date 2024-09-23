let levelSwitch, switchLabel, currentPageMdPath,collapseAllSwitch,  settingsButton, settingsDropdown;
/**
 * Settings Management
 * This section contains functions related to initializing and managing user settings.
 */

/**
 * Initializes the settings functionality.
 * Sets up event listeners and loads saved preferences.
 */


function initializeSettings() {
  collapseAllSwitch = document.getElementById('collapse-all-switch');
  settingsButton = document.querySelector('.md-header__settings-button');
  settingsDropdown = document.querySelector('.md-header__settings-dropdown');

  const savedLevel = localStorage.getItem('userLevel') || 'expert';
  const savedCollapseAll = localStorage.getItem('collapseAll') === 'true';
  collapseAllSwitch.checked = savedCollapseAll;
  toggleAllSections(savedCollapseAll); 

  collapseAllSwitch.addEventListener('change', handleCollapseAllChange);
  settingsButton.addEventListener('click', toggleSettingsDropdown);

  document.addEventListener('click', closeSettingsDropdown);
}

/**
 * Handles the change event of the collapse all switch.
 * Updates localStorage and toggles all sections accordingly.
 */
function handleCollapseAllChange() {
  const collapseAll = collapseAllSwitch.checked;
  localStorage.setItem('collapseAll', collapseAll);
  toggleAllSections(collapseAll);
}

/**
 * Toggles the visibility of the settings dropdown.
 */
function toggleSettingsDropdown() {
  settingsDropdown.classList.toggle('hidden');
}
/**
 * Closes the settings dropdown when clicking outside of it.
 * @param {Event} event - The click event
 */

function closeSettingsDropdown(event) {
  if (!settingsDropdown.contains(event.target) && !settingsButton.contains(event.target)) {
    settingsDropdown.classList.add('hidden');
  }
}

/**
 * Toggles all collapsible sections based on the collapse parameter.
 * @param {boolean} collapse - Whether to collapse or expand all sections
 */
function toggleAllSections(collapse) {
  const sections = document.querySelectorAll('.collapse-section');
  sections.forEach(section => {
    if (collapse) {
      section.classList.remove('active');
    } else {
      section.classList.add('active');
    }
  });
}

/**
 * Level Management
 * This section contains functions related to managing user expertise levels.
 */

/**
 * Initializes the level management functionality.
 * Sets up event listeners and applies initial level settings.
 */
function initializeLevelManagement() {
 levelSwitch = document.getElementById('level-switch');
 switchLabel = document.querySelector('.switch-label');

  if (!levelSwitch || !switchLabel) {
    console.error('Level switch or switch label not found');
    return;
  }
  const savedLevel = localStorage.getItem("userLevel") || "expert";
  
  if (isSearchResultPage()) {
    if (setTemporaryExpertMode()) {
      filterContent('expert');
      updateTOCVisibility('expert');
      updateOptionsVisibility('expert');
    }
  } else {
    if (revertFromTemporaryExpertMode()) {
      filterContent('beginner');
      updateTOCVisibility('beginner');
      updateOptionsVisibility('beginner');
    }
  }
  levelSwitch.checked = savedLevel === "expert";
  updateSwitchLabel();

  /*  addLevelTags();*/

  filterContent(savedLevel);
  updateTOCVisibility(savedLevel);
 

  currentPageMdPath = getCurrentPageMdPath();
  levelSwitch.addEventListener("change", handleLevelChange); 
}


/**
 * Gets the current page's Markdown path.
 * @returns {string} The current page's Markdown path
 */

function getCurrentPageMdPath() {
  let currentPagePath = window.location.pathname;
  if (currentPagePath.endsWith("/")) {
    currentPagePath = currentPagePath.slice(0, -1);
  }
  return currentPagePath.replace(".html", ".md");
}

/**
 * Handles the change event of the level switch.
 * Updates localStorage and applies new level settings.
 */
function handleLevelChange() {
  const selectedLevel = levelSwitch.checked ? "expert" : "beginner";
  localStorage.setItem("userLevel", selectedLevel);
  updateSwitchLabel();
  filterContent(selectedLevel);
  updateTOCVisibility(selectedLevel);
  updateOptionsVisibility(selectedLevel);  // Add this line

  let cachedKeywords = getCache("keywordsCache");
  let cachedDefinitions = getCache("definitionsCache");
  fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions);

  document.dispatchEvent(new CustomEvent('userLevelChanged', { detail: selectedLevel }));
}
/**
 * Updates the switch label text based on the current level.
 */
function updateSwitchLabel() {
  if (switchLabel && levelSwitch) { // Vérification des variables
    switchLabel.textContent = levelSwitch.checked ? "Expert" : "Beginner";
  } else {
    console.error('switchLabel ou levelSwitch est undefined');
  }
}
/**
 * Adds level tags to elements with data-level attribute.
 */

/* function addLevelTags() {
  const allContent = document.querySelectorAll("[data-level]");
  allContent.forEach((element) => {
    const level = element.dataset.level;
    if (level && level === 'basic') {
      return}
    if (level) {
      const existingTag = element.querySelector(".level-tag");
      if (!existingTag) {
        const tag = document.createElement("span");
        tag.className = `level-tag level-${level}`;
        tag.textContent = level.charAt(0).toUpperCase() + level.slice(1);
        element.insertBefore(tag, element.firstChild);
      }
    }
  });
} */

/**
 * Content Filtering
 * This section contains functions related to filtering content based on user level.
 */

/**
 * Checks if the current page is in the Howtos section.
 * @returns {boolean} True if the current page is in the Howtos section
 */

function isHowtosSection() {
  return window.location.pathname.includes('/Howtos/');
}
/**
 * Filters content based on the user's level.
 * @param {string} level - The user's level ('expert' or 'beginner')
 */
function filterContent(level) {
  const articleContent = document.querySelector('.article-content');
  if (!articleContent) return;

  const sections = articleContent.querySelectorAll('.collapse-section');
  
  if (isHowtosSection()) {
      const hasBeginnerSections = Array.from(sections).some(section => 
          section.querySelector('h2[data-level="beginner"]')
      );

      sections.forEach(section => {
          const h2Element = section.querySelector('h2');
          const sectionLevel = h2Element ? h2Element.dataset.level : null;
          const isAllSection = sectionLevel === 'all';
          const span = section.querySelector('.level-tag');
          
          if (level === 'expert' || isAllSection) {
              handleExpertOrAllSection(section, span, level, isAllSection);
          } else if (level === 'beginner') {
              if (hasBeginnerSections) {
                  handleBeginnerSectionWithTags(section, sectionLevel, isAllSection, span);
              } else {
                  handleBeginnerSectionWithoutTags(section, sectionLevel, isAllSection, span);
              }
          }
      });
  } else {
      // For sections that are not in "Howtos" section
      sections.forEach(section => {
          section.classList.remove('hidden-level');
          const span = section.querySelector('.level-tag');
          if (span) span.style.display = 'none';
      });
  }
}

function handleBeginnerSectionWithTags(
  section,
  sectionLevel,
  isAllSection,
  span
) {
  if (sectionLevel === "beginner" || isAllSection) {
    section.classList.remove("hidden-level");
    if (span) {
      span.style.display = sectionLevel === "beginner" ? "" : "none";
    }
  } else {
    section.classList.add("hidden-level");
  }
}

function handleBeginnerSectionWithoutTags(
  section,
  sectionLevel,
  isAllSection,
  span
) {
  section.classList.remove("hidden-level");
  if (span) {
    span.style.display = "none";
  }
}

//Remove tag "expert" and "all"
function handleExpertOrAllSection(section, span, level, isAllSection) {
  section.classList.remove("hidden-level");
  if (span && (level === "expert" || isAllSection)) {
    span.style.display = "none";
  }
}
function updateTOCVisibility(level) {

  if (!document.body) {
    console.warn('Document body not ready, deferring TOC update');
    return;
  }
  if (level !== 'beginner') {
   
      document.querySelectorAll('.md-nav__item').forEach(item => {
          item.style.display = '';
      });
      return;
  }



  const h2Elements = document.querySelectorAll('h2[data-level]');
  const tocItems = document.querySelectorAll('.md-nav__item');
 

  const beginnerIds = new Set();
  const sectionWithSubsections = new Set();
  h2Elements.forEach(h2 => {
      if (h2.getAttribute('data-level') === 'beginner' && h2.id) {
          beginnerIds.add(h2.id);
      }
  });
  if (beginnerIds.size === 0) {
    // If no beginner sections, show all TOC items
    tocItems.forEach(item => {
      item.style.display = '';
    });
  } else {

   // Hide non-beginner TOC items and show beginner ones.
   tocItems.forEach(item => {
    const link = item.querySelector('a.md-nav__link');
    if (link) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const id = href.slice(1);  
        if (!beginnerIds.has(id)) {
          item.style.display = 'none';
        } else {
          item.style.display = '';
        }
      }
    }
  });
}
  
}
function updateOptionsVisibility(level) {
  const optionDivs = document.querySelectorAll('.option');
  optionDivs.forEach(div => {
    const aElement = div.querySelector('a[id]');
    if (level === 'beginner') {
      if (aElement && aElement.getAttribute('data-level') === 'basic') {
        div.style.display = '';
      } else {
        div.style.display = 'none';
      }
    } else {
      div.style.display = '';
    }
  });
}

//Levels with search feature

function isSearchResultPage() {
  return new URLSearchParams(window.location.search).has('h');
}

function setTemporaryExpertMode() {
const currentLevel = localstroga.getItem('userLevel');
if(currentLevel === 'beginner' && isSearchResultPage()) {
  localStorage.setItem('tempExpertMode', 'true');
  localStorage.setItem('userLevel', 'expert');
  return true
}
return false
}

function revertFromTemporaryExpertMode() {
  if (localStorage.getItem('tempExpertMode') === 'true') {
    localStorage.setItem('userLevel', 'beginner');
    localStorage.removeItem('tempExpertMode');
    return true
  }
  return false
}
/**
 * Event Listeners
 * This section sets up the main event listeners when the DOM is loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
 
  initializeSettings();
  initializeLevelManagement();
  const savedLevel = localStorage.getItem("userLevel") || "expert";
  updateTOCVisibility(savedLevel);
  updateOptionsVisibility(savedLevel);

  let cachedKeywords = getCache("keywordsCache");
  let cachedDefinitions = getCache("definitionsCache");

  fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions);

  const levelSwitch = document.getElementById('level-switch');
  if (levelSwitch) {
      levelSwitch.addEventListener('change', handleLevelChange);
  }
});