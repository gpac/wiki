//Handle toogle button to switch between NAV and TOC

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggle-button");
    const tocContent = document.getElementById("toc-content");
    const navContent = document.getElementById("nav-content");
    const isDarkMode = document.body.getAttribute('data-md-color-scheme') === 'slate';
    let isNavIsVisible = true;
   

    if (toggleButton) {
     
        tippy(toggleButton, {
            content: 'Toggle Nav/Toc',
            placement: 'left',
            theme: isDarkMode ? 'dark' : 'light',
            trigger: 'mouseenter',
            hideOnClick: false
        });
    } 
    toggleButton.addEventListener("click", function () {
  
        if (isNavIsVisible) {
            navContent.style.display = "none";
            tocContent.style.display = "block";
        } else {
            navContent.style.display = "block";
            tocContent.style.display = "none";
        }
        isNavIsVisible = !isNavIsVisible;
    });

    tocContent.style.display = "none";
    navContent.style.display = "block";

    function activatePermanentLinkSections() {
        const permanentLinkSections = document.querySelectorAll('h2:has(a[title="Permanent link"])');
        permanentLinkSections.forEach(section => {
            section.classList.add('active');
        });
    }

    // Appeler la fonction au chargement de la page
    activatePermanentLinkSections()
 
});


document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("/glossary/")) {
        document.body.classList.add("glossary-page");
    }
});

// Collapse sections

document.addEventListener("DOMContentLoaded", function () {

    
    const articleInner = document.querySelector('.md-content__inner');
    const h1Element = articleInner.querySelector('h1');
    const feedbackForm = articleInner.querySelector('.md-feedback');

    function handleAllSection(section, h2) {
        if (section.classList.contains('active')) {
            section.setAttribute('data-was-active', 'true');
        } else {
            section.removeAttribute('data-was-active');
        }
    }

    if (h1Element && feedbackForm) {
        
        const articleContentDiv = document.createElement('div');
        articleContentDiv.classList.add('article-content');

        const fragment = document.createDocumentFragment();

        let sibling = h1Element.nextElementSibling;
        while (sibling && sibling !== feedbackForm) {
            const nextSibling = sibling.nextElementSibling;
            fragment.appendChild(sibling);
            sibling = nextSibling;
        }

        articleContentDiv.appendChild(fragment);
        h1Element.insertAdjacentElement('afterend', articleContentDiv);
    }

    const articleContent = document.querySelector('.article-content');

    if (articleContent) {
        const h2Elements = articleContent.querySelectorAll('h2');

        h2Elements.forEach(h2 => {
            const content = [];
            let sibling = h2.nextElementSibling;

            while (sibling && sibling.tagName !== 'H2') {
                content.push(sibling);
                sibling = sibling.nextElementSibling;
            }

            let collapseSection = document.createElement('div');
            collapseSection.classList.add('collapse-section');

            const collapseContent = document.createElement('div');
            collapseContent.classList.add('collapse-content');
            content.forEach(element => collapseContent.appendChild(element));

            h2.parentNode.insertBefore(collapseSection, h2);
            collapseSection.appendChild(h2);
            collapseSection.appendChild(collapseContent);

            if (!h2.querySelector('.collapse-icon')) {
                const collapseIcon = document.createElement('span');
                collapseIcon.classList.add('collapse-icon');
                collapseIcon.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>';
                h2.appendChild(collapseIcon);
            }

            h2.addEventListener('click', function () {
                collapseSection.classList.toggle('active');
                if (h2.dataset.level === 'all') {
                    handleAllSection(collapseSection, h2);
                }
            });
        });
    }
});
//Handle "all" sections

function initializeAllSections() {
    const allSections = document.querySelectorAll('.collapse-section');
    allSections.forEach(section => {
        const h2Element = section.querySelector('h2');
        if (h2Element && h2Element.dataset.level === 'all') {
            section.classList.add('active');
            section.setAttribute('data-was-active', 'true');
        }
    });
}

document.addEventListener("DOMContentLoaded", initializeAllSections);