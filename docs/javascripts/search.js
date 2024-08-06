document.addEventListener('DOMContentLoaded', function() {
  

    const searchInput = document.querySelector('input.md-search__input');
   

    let tippyInstance = null;

    function updateTooltip() {

        const isBeginnerMode = localStorage.getItem("userLevel") === "beginner";
        const isDarkMode = document.body.getAttribute('data-md-color-scheme') === 'slate';
     

        if (isBeginnerMode) {
            console.log("Beginner mode: creating/updating tooltip");
            if (!tippyInstance && searchInput) {
                console.log("Creating new tippy instance");
                tippyInstance = tippy(searchInput, {
                    content: '⚠️ For best search results, switch to expert mode',
                    placement: 'left',
                    theme: isDarkMode ? 'dark' : 'light',
                    trigger: 'focus',
                    hideOnClick: true
                });
            } else if (tippyInstance) {
                console.log("Updating existing tippy instance");
                tippyInstance.setProps({
                    theme: isDarkMode ? 'dark' : 'light'
                });
            }
        } else {
            console.log("Expert mode: destroying tooltip if it exists");
            if (tippyInstance) {
                tippyInstance.destroy();
                tippyInstance = null;
            }
        }
    }

    if (searchInput) {
        console.log("Search input found, setting up tooltip");
     
        setTimeout(() => {
            console.log("Initializing tooltip after delay");
            updateTooltip();
        }, 100);

      
        document.addEventListener('levelChanged', function() {
            console.log("Level changed event detected");
            updateTooltip();
        });

    
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-md-color-scheme') {
                    console.log("Color scheme changed");
                    updateTooltip();
                }
            });
        });

        observer.observe(document.body, { attributes: true });
    } else {
        console.log("Search input not found");
    }
});