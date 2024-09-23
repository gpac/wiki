document.addEventListener("DOMContentLoaded", function () {
    const tocContent = document.getElementById("toc-content");
    const navContent = document.getElementById("nav-content");

    tocContent.style.display = "none";
    navContent.style.display = "block";

    initializeGlossaryPage();
    initializeCollapseSections();
    handleTOCLinks();
    handleInitialHash();
 
      

});



function initializeGlossaryPage() {
    if (window.location.pathname.includes("/glossary/")) {
        document.body.classList.add("glossary-page");
    }
}

function initializeCollapseSections() {
    const articleInner = document.querySelector('.md-content__inner');
    const h1Element = articleInner.querySelector('h1');
    const feedbackForm = articleInner.querySelector('.md-feedback');

    if (h1Element && feedbackForm) {
        createArticleContentDiv(h1Element, feedbackForm);
    }

    const articleContent = document.querySelector('.article-content');
    if (articleContent) {
        const h2Elements = articleContent.querySelectorAll('h2');
        h2Elements.forEach(createCollapseSection);
    }
}

function createArticleContentDiv(h1Element, feedbackForm) {
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

function createCollapseSection(h2) {
    const content = [];
    let sibling = h2.nextElementSibling;
    while (sibling && sibling.tagName !== 'H2') {
        content.push(sibling);
        sibling = sibling.nextElementSibling;
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
}

function addCollapseIcon(h2) {
    if (!h2.querySelector('.collapse-icon')) {
        const collapseIcon = document.createElement('span');
        collapseIcon.classList.add('collapse-icon');
        collapseIcon.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>';
        h2.appendChild(collapseIcon);
    }
}

function toggleSection(section) {
    section.classList.toggle('active');
}

function handleTOCLinks() {
    const tocLinks = document.querySelectorAll('.md-nav__link');
    tocLinks.forEach(link => {
        if (link && link.hasAttribute('href')) {
        link.addEventListener('click', function(e) {
            const hash = this.getAttribute('href');
            if (hash.startsWith('#')) {
                openCollapsedSection(hash);
            }
        });
    }
    });
}

function handleInitialHash() {
    if (window.location.hash) {
        openCollapsedSection(window.location.hash);
    }
}

function openCollapsedSection(hash) {
    if (hash) {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
            const collapseSection = targetElement.closest('.collapse-section');
            if (collapseSection && !collapseSection.classList.contains('active')) {
                collapseSection.classList.add('active');
            }
        }
    }
}

function handleAllSection(section, h2) {
    if (section.classList.contains('active')) {
        section.setAttribute('data-was-active', 'true');
    } else {
        section.removeAttribute('data-was-active');
    }
}