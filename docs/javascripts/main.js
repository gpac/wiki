document.addEventListener('DOMContentLoaded', function () {
    try {
        initializeSettings();
        initializeLevelManagement();

        const savedLevel = localStorage.getItem("userLevel") || "expert";
        updateTOCVisibility(savedLevel);
        updateOptionsVisibility(savedLevel);

        let currentPagePath = window.location.pathname;

        if (currentPagePath.endsWith('/')) {
            currentPagePath = currentPagePath.slice(0, -1);
        }

        currentPageMdPath = currentPagePath.replace('.html', '.md');

        let cachedKeywords = getCache('keywordsCache');
        let cachedDefinitions = getCache('definitionsCache');

        fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions);

        document.body.addEventListener('click', function(event) {
            try {
                const target = event.target.closest('a');
                if (target && target.href && !target.href.startsWith('javascript:')) {
                    const currentUrl = new URL(window.location.href);
                    const targetUrl = new URL(target.href);

                    if (currentUrl.pathname !== targetUrl.pathname || !targetUrl.searchParams.has('h')) {
                        if (localStorage.getItem('tempExpertMode') === 'true') {
                            event.preventDefault();
                            revertFromTemporaryExpertMode();
                            filterContent('beginner');
                            updateTOCVisibility('beginner');
                            updateOptionsVisibility('beginner');

                            setTimeout(() => {
                                window.location.href = target.href;
                            }, 0);
                        }
                    }
                }
            } catch (error) {
                console.error('Error handling click event:', error);
            }
        });

        // Handle navigation via browser back/forward buttons
        window.addEventListener('popstate', function() {
            try {
                if (!isSearchResultPage() && revertFromTemporaryExpertMode()) {
                    filterContent('beginner');
                    updateTOCVisibility('beginner');
                    updateOptionsVisibility('beginner');
                }
            } catch (error) {
                console.error('Error handling popstate event:', error);
            }
        });
    } catch (error) {
        console.error('Error during DOMContentLoaded event:', error);
    }
});