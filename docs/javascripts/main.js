const EXPERT_LEVEL = 'expert';
const BEGINNER_LEVEL = 'beginner';

// initialize functions
function initializeApp() {
    try {
        initializeSettings();
        initializeLevelManagement();
        initializeFeedback('.md-nav__feedback--desktop');
        initializeFeedback('.md-feedback--mobile');
        initializeTagNavigation();
        setupEventListeners();
        handleInitialPageLoad();
    } catch (error) {
        console.error("Error in initializeApp:", error);
    }
}

function setupEventListeners() {
    try {
        document.body.addEventListener('click', handleNavigation);
        window.addEventListener('popstate', handlePopState);
        window.addEventListener('load', handleSearchPageCollapse);
    } catch (error) {
        console.error("Error in setupEventListeners:", error);
    }
}

function handleInitialPageLoad() {
    try {
        const savedLevel = localStorage.getItem("userLevel") || EXPERT_LEVEL;
        updateTOCVisibility(savedLevel);
        updateOptionsVisibility(savedLevel);

        const currentPagePath = getCurrentPagePath();
        const cachedKeywords = getCache('keywordsCache');
        const cachedDefinitions = getCache('definitionsCache');

        fetchKeywords(currentPagePath, cachedKeywords, cachedDefinitions);
    } catch (error) {
        console.error("Error in handleInitialPageLoad:", error);
    }
}

// Handlers
function handleNavigation(event) {
    try {
        const target = event.target.closest('a');
        if (!isValidNavigationTarget(target)) return;

        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(target.href);

        if (shouldHandleNavigation(currentUrl, targetUrl)) {
            handleNavigationChange(event, target);
        }
    } catch (error) {
        console.error("Error in handleNavigation:", error);
    }
}

function isValidNavigationTarget(target) {
    try {
        return target && target.href && !target.href.startsWith('javascript:');
    } catch (error) {
        console.error("Error in isValidNavigationTarget:", error);
        return false;
    }
}

function shouldHandleNavigation(currentUrl, targetUrl) {
    try {
        return currentUrl.pathname !== targetUrl.pathname || !targetUrl.searchParams.has('h');
    } catch (error) {
        console.error("Error in shouldHandleNavigation:", error);
        return false;
    }
}

function handleNavigationChange(event, target) {
    try {
        if (localStorage.getItem('tempExpertMode') === 'true') {
            event.preventDefault();
            revertFromTemporaryExpertMode();
            updateContentVisibility(BEGINNER_LEVEL);
            setTimeout(() => {
                window.location.href = target.href;
            }, 0);
        }
    } catch (error) {
        console.error("Error in handleNavigationChange:", error);
    }
}

function handlePopState() {
    try {
        if (!isSearchResultPage() && revertFromTemporaryExpertMode()) {
            updateContentVisibility(BEGINNER_LEVEL);
        }
    } catch (error) {
        console.error("Error in handlePopState:", error);
    }
}

// Feedback
function initializeFeedback(selector) {
    try {
        const feedback = document.querySelector(selector);
        if (!feedback) return;

        const buttons = feedback.querySelectorAll('.md-feedback__icon:not(.md-feedback__contribute)');
        const note = getFeedbackNote(feedback);

        buttons.forEach(button => {
            button.addEventListener('click', () => handleFeedbackClick(button, buttons, note));
        });

        initializeContributeIcon(feedback);
    } catch (error) {
        console.error("Error in initializeFeedback:", error);
    }
}

function getFeedbackNote(feedback) {
    try {
        let note = feedback.querySelector('.md-feedback__note');
        if (!note) {
            note = document.createElement('div');
            note.className = 'md-feedback__note';
            note.hidden = true;
            feedback.querySelector('.md-feedback__inner').appendChild(note);
        }
        return note;
    } catch (error) {
        console.error("Error in getFeedbackNote:", error);
        return null;
    }
}

function handleFeedbackClick(button, allButtons, note) {
    try {
        const data = button.getAttribute('data-md-value');
        const url = `/${window.location.pathname}`;
        const title = document.querySelector('.md-content__inner h1')?.textContent || '';

        console.log(`Feedback: ${data} for page ${url} (${title})`);

        note.textContent = `Thank you for your feedback!`;
        note.hidden = false;

        allButtons.forEach(btn => btn.disabled = true);
    } catch (error) {
        console.error("Error in handleFeedbackClick:", error);
    }
}

function initializeContributeIcon(feedback) {
    try {
        const contributeIcon = feedback.querySelector('.md-feedback__contribute');
        const contributeNote = feedback.querySelector('.md-feedback__contribute-note');

        if (contributeIcon && contributeNote) {
            contributeIcon.addEventListener('mouseenter', () => contributeNote.hidden = false);
            contributeIcon.addEventListener('mouseleave', () => contributeNote.hidden = true);
        }
    } catch (error) {
        console.error("Error in initializeContributeIcon:", error);
    }
}

// Collapse 
function handleSearchPageCollapse() {
    try {
        const isSearchPage = new URLSearchParams(window.location.search).has('h');
        const wasCollapsed = localStorage.getItem('wasCollapsed');

        if (isSearchPage && localStorage.getItem('collapseAll') === 'true') {
            localStorage.setItem('wasCollapsed', 'true');
            toggleAllSections(false);
        } else if (wasCollapsed === 'true') {
            localStorage.removeItem('wasCollapsed');
            toggleAllSections(true);
        }
    } catch (error) {
        console.error("Error in handleSearchPageCollapse:", error);
    }
}

// Tags navigation
function initializeTagNavigation() {
    try {
        const wordCloudLinks = document.querySelectorAll('#dynamic-words-cloud a');
        wordCloudLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                try {
                    event.preventDefault();
                    navigateToTagPage(event.target.textContent);
                } catch (error) {
                    console.error("Error in wordCloudLinks click event:", error);
                }
            });
        });
    } catch (error) {
        console.error("Error in initializeTagNavigation:", error);
    }
}

function navigateToTagPage(keyword) {
    try {
        window.location.href = `/tags/#${keyword.toLowerCase()}`;
    } catch (error) {
        console.error("Error in navigateToTagPage:", error);
    }
}

// Utils
function getCurrentPagePath() {
    try {
        let currentPagePath = window.location.pathname;
        if (currentPagePath.endsWith('/')) {
            currentPagePath = currentPagePath.slice(0, -1);
        }
        return currentPagePath.replace('.html', '.md');
    } catch (error) {
        console.error("Error in getCurrentPagePath:", error);
        return '';
    }
}

function updateContentVisibility(level) {
    try {
        filterContent(level);
        updateTOCVisibility(level);
        updateOptionsVisibility(level);
    } catch (error) {
        console.error("Error in updateContentVisibility:", error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    try {
        initializeApp();
    } catch (error) {
        console.error("Error during DOMContentLoaded:", error);
    }
});