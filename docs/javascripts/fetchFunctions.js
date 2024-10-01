function fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions) {
	try {
		fetch('/data/keywords.json')
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(data => {
				const allDefinitions = data.definitions;
				const lexique = Object.keys(allDefinitions);
				findKeywordsInContent(currentPageMdPath, lexique, (filteredKeywords) => {
					cachedKeywords[currentPageMdPath] = filteredKeywords;
					setCache('keywordsCache', cachedKeywords);
					const selectedLevel = localStorage.getItem('userLevel') || 'beginner';
					displayKeywords(filteredKeywords, cachedDefinitions, allDefinitions, selectedLevel);
				});
			})
			.catch(error => {
				console.error('Error fetching keywords:', error);
			});
	} catch (error) {
		console.error('Unexpected error in fetchKeywords:', error);
	}
}

function fetchDefinitions(keyword, cachedDefinitions, event) {
	try {
		fetch('/data/keywords.json')
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(data => {
				const definition = data.definitions[keyword];
				if (definition) {
					cachedDefinitions[keyword] = definition;
					setCache('definitionsCache', cachedDefinitions);
					openModal(keyword, definition, event);
				} else {
					console.error('Definition not found for keyword:', keyword);
					openModal(keyword, { description: 'Definition not found' }, event);
				}
			})
			.catch(error => {
				console.error('Error fetching definition:', error);
			});
	} catch (error) {
		console.error('Unexpected error in fetchDefinitions:', error);
	}
}

function fetchMarkdownContent(currentPageMdPath) {
	try {
		return fetch(currentPageMdPath)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.text();
			})
			.then(htmlContent => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(htmlContent, 'text/html');
				const mdContent = doc.querySelector('.md-content[data-md-component="content"]');
				if (mdContent) {
					return mdContent.textContent;
				} else {
					console.warn('Content element not found in the parsed HTML');
					return '';
				}
			})
			.catch(error => {
				console.error('Error fetching markdown content:', error);
				throw error;
			});
	} catch (error) {
		console.error('Unexpected error in fetchMarkdownContent:', error);
		return Promise.reject(error);
	}
}