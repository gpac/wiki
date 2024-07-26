//Handle toogle button to switch between NAV and TOC

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggle-button");
    const tocContent = document.getElementById("toc-content");
    const navContent = document.getElementById("nav-content");
    let isNavIsVisible = true;

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
// Open collapse sections with highlighted search terms
document.addEventListener('DOMContentLoaded', function() {
    function openCollapseWithHighlight() {
        const highlights = document.querySelectorAll('mark[data-md-highlight]');

        highlights.forEach(highlight => {
            // Find the closest parent collapse section
            const collapseSection = highlight.closest('.collapse-section');
            if (collapseSection) {
                collapseSection.classList.add('active');
            }
        });
    }

    openCollapseWithHighlight();

    window.addEventListener('hashchange', openCollapseWithHighlight);
    document.addEventListener('DOMContentSwap', openCollapseWithHighlight);

    // MutationObserver to detect when search highlights are added to the page
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const addedNodes = mutation.addedNodes;
                for (let i = 0; i < addedNodes.length; i++) {
                    const node = addedNodes[i];

                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the node itself or any of its descendants have the highlight mark
                        if (node.matches('mark[data-md-highlight]') || node.querySelector('mark[data-md-highlight]')) {
                            openCollapseWithHighlight();
                            break;
                        }
                    }
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
});