let levelSwitch, switchLabel, currentPageMdPath;

function initializeLevelManagement() {
  levelSwitch = document.getElementById("level-switch");
  switchLabel = document.querySelector(".switch-label");
  const savedLevel = localStorage.getItem("userLevel") || "expert";

  levelSwitch.checked = savedLevel === "expert";
  updateSwitchLabel();

  addLevelTags();

  filterContent(savedLevel);
  updateTOCVisibility(savedLevel);
  currentPageMdPath = getCurrentPageMdPath();
  levelSwitch.addEventListener("change", handleLevelChange);
}


function getCurrentPageMdPath() {
  let currentPagePath = window.location.pathname;
  if (currentPagePath.endsWith("/")) {
    currentPagePath = currentPagePath.slice(0, -1);
  }
  return currentPagePath.replace(".html", ".md");
}
function handleLevelChange() {
  const selectedLevel = levelSwitch.checked ? "expert" : "beginner";
  localStorage.setItem("userLevel", selectedLevel);
  updateSwitchLabel();
  filterContent(selectedLevel);
  updateTOCVisibility(selectedLevel);

  let cachedKeywords = getCache("keywordsCache");
  let cachedDefinitions = getCache("definitionsCache");
  fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions);
}
//Display the level of the user
function updateSwitchLabel() {
  switchLabel.textContent = levelSwitch.checked ? "Expert" : "Beginner";
}

function addLevelTags() {
  const allContent = document.querySelectorAll("[data-level]");
  allContent.forEach((element) => {
    const level = element.dataset.level;
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
}
function isHowtosSection() {
  return window.location.pathname.includes('/Howtos/');
}
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
  if (!isHowtosSection()) {
      // Hors section Howtos, tout afficher
      document.querySelectorAll(".md-nav__item, .md-nav").forEach((item) => {
          item.style.removeProperty('display');
      });
      return;
  }

  const tocItems = document.querySelectorAll(".md-nav__list > .md-nav__item");
  
  tocItems.forEach((item) => {
      const link = item.querySelector(":scope > a.md-nav__link");
      if (link) {
          const subNav = item.querySelector('.md-nav');
          const subItems = subNav ? subNav.querySelectorAll('.md-nav__item') : [];
          
          if (level === "expert") {
              // En mode expert, tout afficher
              item.style.removeProperty('display');
              subItems.forEach(subItem => subItem.style.removeProperty('display'));
          } else {
              // En mode beginner
              item.style.removeProperty('display'); // Toujours afficher les éléments de premier niveau
              
              // Cacher les sous-éléments
              subItems.forEach(subItem => subItem.style.display = 'none');
          }
      }
  });
}
document.addEventListener("DOMContentLoaded", function () {
  initializeLevelManagement();
  const savedLevel = localStorage.getItem("userLevel") || "expert";
  updateTOCVisibility(savedLevel);

  let cachedKeywords = getCache("keywordsCache");
  let cachedDefinitions = getCache("definitionsCache");

  fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions);
});
