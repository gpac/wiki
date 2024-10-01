let levelSwitch, switchLabel, currentPageMdPath, collapseAllSwitch, settingsButton, settingsDropdown;

/**
 * Settings Management
 * This section contains functions related to initializing and managing user settings.
 */

/**
 * Initializes the settings functionality.
 * Sets up event listeners and loads saved preferences.
 */
function initializeSettings() {
  try {
    collapseAllSwitch = document.getElementById('collapse-all-switch');
    settingsButton = document.querySelector('.md-header__settings-button');
    settingsDropdown = document.querySelector('.md-header__settings-dropdown');

    if (!collapseAllSwitch || !settingsButton || !settingsDropdown) {
      throw new Error('Required elements for settings initialization not found');
    }

    const savedLevel = localStorage.getItem('userLevel') || 'expert';
    const savedCollapseAll = localStorage.getItem('collapseAll') === 'true';
    collapseAllSwitch.checked = savedCollapseAll;
    toggleAllSections(savedCollapseAll);

    collapseAllSwitch.addEventListener('change', handleCollapseAllChange);
    settingsButton.addEventListener('click', toggleSettingsDropdown);
    document.addEventListener('click', closeSettingsDropdown);
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
}

/**
 * Handles the change event of the collapse all switch.
 * Updates localStorage and toggles all sections accordingly.
 */
function handleCollapseAllChange() {
  try {
    const collapseAll = collapseAllSwitch.checked;
    localStorage.setItem('collapseAll', collapseAll);
    toggleAllSections(collapseAll);
  } catch (error) {
    console.error('Error handling collapse all change:', error);
  }
}

/**
 * Toggles the visibility of the settings dropdown.
 */
function toggleSettingsDropdown() {
  try {
    settingsDropdown.classList.toggle('hidden');
  } catch (error) {
    console.error('Error toggling settings dropdown:', error);
  }
}

/**
 * Closes the settings dropdown when clicking outside of it.
 * @param {Event} event - The click event
 */
function closeSettingsDropdown(event) {
  try {
    if (!settingsDropdown.contains(event.target) && !settingsButton.contains(event.target)) {
      settingsDropdown.classList.add('hidden');
    }
  } catch (error) {
    console.error('Error closing settings dropdown:', error);
  }
}

/**
 * Toggles all collapsible sections based on the collapse parameter.
 * @param {boolean} collapse - Whether to collapse or expand all sections
 */
function toggleAllSections(collapse) {
  try {
    const sections = document.querySelectorAll('.collapse-section');
    sections.forEach(section => {
      if (collapse) {
        section.classList.remove('active');
      } else {
        section.classList.add('active');
      }
    });
  } catch (error) {
    console.error('Error toggling all sections:', error);
  }
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
  try {
    levelSwitch = document.getElementById('level-switch');
    switchLabel = document.querySelector('.switch-label');

    if (!levelSwitch || !switchLabel) {
      throw new Error('Level switch or switch label not found');
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

    filterContent(savedLevel);
    updateTOCVisibility(savedLevel);

    currentPageMdPath = getCurrentPageMdPath();
    levelSwitch.addEventListener("change", handleLevelChange);
  } catch (error) {
    console.error('Error initializing level management:', error);
  }
}

/**
 * Gets the current page's Markdown path.
 * @returns {string} The current page's Markdown path
 */
function getCurrentPageMdPath() {
  try {
    let currentPagePath = window.location.pathname;
    if (currentPagePath.endsWith("/")) {
      currentPagePath = currentPagePath.slice(0, -1);
    }
    return currentPagePath.replace(".html", ".md");
  } catch (error) {
    console.error('Error getting current page Markdown path:', error);
    return '';
  }
}

/**
 * Handles the change event of the level switch.
 * Updates localStorage and applies new level settings.
 */
function handleLevelChange() {
  try {
    const selectedLevel = levelSwitch.checked ? "expert" : "beginner";
    localStorage.setItem("userLevel", selectedLevel);
    updateSwitchLabel();
    filterContent(selectedLevel);
    updateTOCVisibility(selectedLevel);
    updateOptionsVisibility(selectedLevel);

    let cachedKeywords = getCache("keywordsCache");
    let cachedDefinitions = getCache("definitionsCache");
    fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions);

    document.dispatchEvent(new CustomEvent('userLevelChanged', { detail: selectedLevel }));
  } catch (error) {
    console.error('Error handling level change:', error);
  }
}

/**
 * Updates the switch label text based on the current level.
 */
function updateSwitchLabel() {
  try {
    if (switchLabel && levelSwitch) {
      switchLabel.textContent = levelSwitch.checked ? "Expert" : "Beginner";
    } else {
      throw new Error('switchLabel or levelSwitch is undefined');
    }
  } catch (error) {
    console.error('Error updating switch label:', error);
  }
}

/**
 * Content Filtering
 * This section contains functions related to filtering content based on user level.
 */

/**
 * Checks if the current page is in the Howtos section.
 * @returns {boolean} True if the current page is in the Howtos section
 */
function isHowtosSection() {
  try {
    return window.location.pathname.includes('/Howtos/');
  } catch (error) {
    console.error('Error checking if Howtos section:', error);
    return false;
  }
}

/**
 * Filters content based on the user's level.
 * @param {string} level - The user's level ('expert' or 'beginner')
 */
function filterContent(level) {
  try {
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
      sections.forEach(section => {
        section.classList.remove('hidden-level');
        const span = section.querySelector('.level-tag');
        if (span) span.style.display = 'none';
      });
    }
  } catch (error) {
    console.error('Error filtering content:', error);
  }
}

function handleBeginnerSectionWithTags(section, sectionLevel, isAllSection, span) {
  try {
    if (sectionLevel === "beginner" || isAllSection) {
      section.classList.remove("hidden-level");
      if (span) {
        span.style.display = sectionLevel === "beginner" ? "" : "none";
      }
    } else {
      section.classList.add("hidden-level");
    }
  } catch (error) {
    console.error('Error handling beginner section with tags:', error);
  }
}

function handleBeginnerSectionWithoutTags(section, sectionLevel, isAllSection, span) {
  try {
    section.classList.remove("hidden-level");
    if (span) {
      span.style.display = "none";
    }
  } catch (error) {
    console.error('Error handling beginner section without tags:', error);
  }
}

function handleExpertOrAllSection(section, span, level, isAllSection) {
  try {
    section.classList.remove("hidden-level");
    if (span && (level === "expert" || isAllSection)) {
      span.style.display = "none";
    }
  } catch (error) {
    console.error('Error handling expert or all section:', error);
  }
}

function updateTOCVisibility(level) {
  try {
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
    h2Elements.forEach(h2 => {
      if (h2.getAttribute('data-level') === 'beginner' && h2.id) {
        beginnerIds.add(h2.id);
      }
    });

    if (beginnerIds.size === 0) {
      tocItems.forEach(item => {
        item.style.display = '';
      });
    } else {
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
  } catch (error) {
    console.error('Error updating TOC visibility:', error);
  }
}

function updateOptionsVisibility(level) {
  try {
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
  } catch (error) {
    console.error('Error updating options visibility:', error);
  }
}

// Levels with search feature

function isSearchResultPage() {
  try {
    return new URLSearchParams(window.location.search).has('h');
  } catch (error) {
    console.error('Error checking if search result page:', error);
    return false;
  }
}

function setTemporaryExpertMode() {
  try {
    const currentLevel = localStorage.getItem('userLevel');
    if (currentLevel === 'beginner' && isSearchResultPage()) {
      localStorage.setItem('tempExpertMode', 'true');
      localStorage.setItem('userLevel', 'expert');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error setting temporary expert mode:', error);
    return false;
  }
}

function revertFromTemporaryExpertMode() {
  try {
    if (localStorage.getItem('tempExpertMode') === 'true') {
      localStorage.setItem('userLevel', 'beginner');
      localStorage.removeItem('tempExpertMode');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error reverting from temporary expert mode:', error);
    return false;
  }
}

/**
 * Event Listeners
 * This section sets up the main event listeners when the DOM is loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  try {
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
  } catch (error) {
    console.error('Error during DOMContentLoaded event:', error);
  }
});