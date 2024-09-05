document.addEventListener('DOMContentLoaded', function() {
  

    const searchInput = document.querySelector('input.md-search__input');
   

    let tippyInstance = null;

    function updateTooltip() {

        const isBeginnerMode = localStorage.getItem("userLevel") === "beginner";
        const isDarkMode = document.body.getAttribute('data-md-color-scheme') === 'slate';
     

        if (isBeginnerMode) {
          
            if (!tippyInstance && searchInput) {
         
                tippyInstance = tippy(searchInput, {
                    content: '⚠️ For best search results, switch to expert mode',
                    placement: 'left',
                    theme: isDarkMode ? 'dark' : 'light',
                    trigger: 'focus',
                    hideOnClick: true
                });
            } else if (tippyInstance) {
                
                tippyInstance.setProps({
                    theme: isDarkMode ? 'dark' : 'light'
                });
            }
        } else {
            
            if (tippyInstance) {
                tippyInstance.destroy();
                tippyInstance = null;
            }
        }
    }

    if (searchInput) {
       
     
        setTimeout(() => {
          
            updateTooltip();
        }, 100);

      
        document.addEventListener('levelChanged', function() {
            
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