document.addEventListener("DOMContentLoaded", function () {
    try {
        const tocContent = document.getElementById("toc-content");
        const navContent = document.getElementById("nav-content");

        tocContent.style.display = "none";
        navContent.style.display = "block";

        initializeGlossaryPage();
        initializeCollapseSections();
        handleTOCLinks();
        handleInitialHash();
        initializeHeaderTitle();
    } catch (error) {
        console.error("Error during DOMContentLoaded:", error);
    }
});

function initializeGlossaryPage() {
    try {
        if (window.location.pathname.includes("/glossary/")) {
            document.body.classList.add("glossary-page");
        }
    } catch (error) {
        console.error("Error in initializeGlossaryPage:", error);
    }
}

function initializeCollapseSections() {
    try {
        const articleInner = document.querySelector('.md-content__inner');
        if (!articleInner) return;

        const articleContentDiv = document.createElement('div');
        articleContentDiv.classList.add('article-content');

        while (articleInner.firstChild) {
            articleContentDiv.appendChild(articleInner.firstChild);
        }

        articleInner.appendChild(articleContentDiv);

        const h2Elements = articleContentDiv.querySelectorAll('h2');
        h2Elements.forEach(createCollapseSection);
    } catch (error) {
        console.error("Error in initializeCollapseSections:", error);
    }
}

function createArticleContentDiv(h1Element, feedbackForm) {
    try {
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
    } catch (error) {
        console.error("Error in createArticleContentDiv:", error);
    }
}

function createCollapseSection(h2) {
    try {
        const content = [];
        let sibling = h2.nextElementSibling;
        while (sibling && sibling.tagName !== 'H2') {
            content.push(sibling);
            sibling = sibling.nextElementSibling;
        }

        if (content.length === 0) {
            h2.classList.add('no-collapse');
            return;
        }
        const noCollapse = h2.classList.contains('no-collapse');
        if (noCollapse) {
            return;
        }
        const collapseSection = document.createElement('div');
        collapseSection.classList.add('collapse-section', 'active');

        const collapseContent = document.createElement('div');
        collapseContent.classList.add('collapse-content');
        content.forEach(element => collapseContent.appendChild(element));

        h2.parentNode.insertBefore(collapseSection, h2);
        collapseSection.appendChild(h2);
        collapseSection.appendChild(collapseContent);

        addCollapseIcon(h2);

        h2.addEventListener('click', function () {
            toggleSection(collapseSection);
            if (h2.dataset.level === 'all') {
                handleAllSection(collapseSection, h2);
            }
        });

        return collapseSection;
    } catch (error) {
        console.error("Error in createCollapseSection:", error);
    }
}

function addCollapseIcon(h2) {
    try {
        if (!h2.querySelector('.collapse-icon')) {
            const collapseIcon = document.createElement('span');
            collapseIcon.classList.add('collapse-icon');
            collapseIcon.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>';
            h2.appendChild(collapseIcon);
        }
    } catch (error) {
        console.error("Error in addCollapseIcon:", error);
    }
}

function toggleSection(section) {
    try {
        section.classList.toggle('active');
    } catch (error) {
        console.error("Error in toggleSection:", error);
    }
}

function handleTOCLinks() {
    try {
        const tocLinks = document.querySelectorAll('.md-nav__link');
        tocLinks.forEach(link => {
            if (link && link.hasAttribute('href')) {
                link.addEventListener('click', function (e) {
                    const hash = this.getAttribute('href');
                    if (hash.startsWith('#')) {
                        openCollapsedSection(hash);
                    }
                });
            }
        });
    } catch (error) {
        console.error("Error in handleTOCLinks:", error);
    }
}

function handleInitialHash() {
    try {
        if (window.location.hash) {
            openCollapsedSection(window.location.hash);
        }
    } catch (error) {
        console.error("Error in handleInitialHash:", error);
    }
}

function openCollapsedSection(hash) {
    try {
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                const collapseSection = targetElement.closest('.collapse-section');
                if (collapseSection && !collapseSection.classList.contains('active')) {
                    collapseSection.classList.add('active');
                }
            }
        }
    } catch (error) {
        console.error("Error in openCollapsedSection:", error);
    }
}

function handleAllSection(section, h2) {
    try {
        if (section.classList.contains('active')) {
            section.setAttribute('data-was-active', 'true');
        } else {
            section.removeAttribute('data-was-active');
        }
    } catch (error) {
        console.error("Error in handleAllSection:", error);
    }
}

function initializeHeaderTitle() {
    try {
        const header = document.querySelector('.md-header');
        const siteNameTopic = document.querySelector('.md-header__topic--site-name');
        const pageTitleTopic = document.querySelector('.md-header__topic--page-title');

        if (!header || !siteNameTopic || !pageTitleTopic) {
            console.error('Required elements not found for header title initialization');
            return;
        }

        const showHeaderTitleThreshold = 100;
        let isTransitioning = false;

        window.addEventListener('scroll', () => {
            if (isTransitioning) return;

            if (window.scrollY > showHeaderTitleThreshold && !header.classList.contains('show-page-title')) {
                isTransitioning = true;
                header.classList.add('show-page-title');
                setTimeout(() => { isTransitioning = false; }, 100);
            } else if (window.scrollY <= showHeaderTitleThreshold && header.classList.contains('show-page-title')) {
                isTransitioning = true;
                header.classList.remove('show-page-title');
                setTimeout(() => { isTransitioning = false; }, 100);
            }
        });
    } catch (error) {
        console.error("Error in initializeHeaderTitle:", error);
    }
}