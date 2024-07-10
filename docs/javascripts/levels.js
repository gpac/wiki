
let levelSwitch, switchLabel, currentPageMdPath;



function initializeLevelManagement() {
    levelSwitch = document.getElementById('level-switch');
    switchLabel = document.querySelector('.switch-label');
    const savedLevel = localStorage.getItem('userLevel') || 'beginner';
    
    
    
    levelSwitch.checked = savedLevel === 'expert';
    updateSwitchLabel();
  
    
    addLevelTags();
  
    filterContent(savedLevel);
    currentPageMdPath = getCurrentPageMdPath();
    levelSwitch.addEventListener('change', handleLevelChange);
}

function handleLevelChange() {
    const selectedLevel = levelSwitch.checked ? 'expert' : 'beginner';
    localStorage.setItem('userLevel', selectedLevel);
    updateSwitchLabel();
    filterContent(selectedLevel);
    
    
    fetchKeywords(currentPageMdPath, getCache('keywordsCache'), getCache('definitionsCache'));
}
function getCurrentPageMdPath() {
    let currentPagePath = window.location.pathname;
    if (currentPagePath.endsWith('/')) {
        currentPagePath = currentPagePath.slice(0, -1);
    }
    return currentPagePath.replace('.html', '.md');
}
function handleLevelChange() {
    const selectedLevel = levelSwitch.checked ? 'expert' : 'beginner';
    localStorage.setItem('userLevel', selectedLevel);
    updateSwitchLabel();
    filterContent(selectedLevel);
    
    let cachedKeywords = getCache('keywordsCache');
    let cachedDefinitions = getCache('definitionsCache');
    fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions);
}
//Display the level of the user
function updateSwitchLabel() {
    switchLabel.textContent = levelSwitch.checked ? 'Expert' : 'Beginner';
}

function addLevelTags() {
    const allContent = document.querySelectorAll('[data-level]');
    allContent.forEach(element => {
        const level = element.dataset.level;
        if (level) {
            // Vérifier si un tag de niveau existe déjà
            const existingTag = element.querySelector('.level-tag');
            if (!existingTag) {
                const tag = document.createElement('span');
                tag.className = `level-tag level-${level}`;
                tag.textContent = level.charAt(0).toUpperCase() + level.slice(1);
                element.insertBefore(tag, element.firstChild);
            }
        }
    });
}


function filterContent(level) {
    const articleContent = document.querySelector('.article-content');
    if (articleContent) {
        const sections = articleContent.querySelectorAll('.collapse-section');
        sections.forEach(section => {
            const h2Element = section.querySelector('h2');
            const sectionLevel = h2Element ? h2Element.dataset.level : null;
            const isAllSection = h2Element && h2Element.dataset.level === 'all';
            const span = section.querySelector('.level-tag');
            
            if (level === 'expert' || isAllSection) {
                handleExpertOrAllSection(section, span, level, isAllSection);
            } else if (level === 'beginner') {
                handleBeginnerSection(section, sectionLevel, isAllSection, span);
            }
     
            
           
        });
    }
}

//Remove tag "expert" and "all" 
function handleExpertOrAllSection(section, span, level, isAllSection) {
    section.classList.remove('hidden-level');
    if (span && (level === 'expert' || isAllSection)) {
        span.style.display = 'none';
    }
}

//Add tag "beginner" if level==='beginner'
function handleBeginnerSection(section, sectionLevel, isAllSection, span) {
    if (sectionLevel === 'beginner' || isAllSection) {
        section.classList.remove('hidden-level');
        if (span) {
            span.style.display = ''; // Display the tag "beginner"
        }
    } else {
        section.classList.add('hidden-level');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeLevelManagement();
    

    let cachedKeywords = getCache('keywordsCache');
    let cachedDefinitions = getCache('definitionsCache');

    fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions);
});