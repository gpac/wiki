document.addEventListener('DOMContentLoaded', function () {
    let cachedKeywords = getCache('keywordsCache');
    let cachedDefinitions = getCache('definitionsCache');

    let currentPagePath = window.location.pathname;

    if (currentPagePath.endsWith('/')) {
        currentPagePath = currentPagePath.slice(0, -1);
    }

    const currentPageMdPath = currentPagePath.replace('.html', '.md');

    fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions);
   
});

document.addEventListener('DOMContentLoaded', function() {
    initializeLevelManagement();
    
    let cachedKeywords = getCache('keywordsCache');
    let cachedDefinitions = getCache('definitionsCache');

    fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions);
});