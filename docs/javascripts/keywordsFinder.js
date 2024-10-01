//delete links in markdown content
function cleanMarkdownContent(content) {
    try {
        return content.replace(/\[[^\]]*\]\([^)]*\)/g, '');
    } catch (error) {
        console.error('Error cleaning markdown content:', error);
        return content; // Return the original content if an error occurs
    }
}

function cleanWord(word) {
    try {
        return word.replace(/[.,!?(){}[\]`-]/g, '').toUpperCase();
    } catch (error) {
        console.error('Error cleaning word:', error);
        return word; // Return the original word if an error occurs
    }
}

function findKeywordsInContent(currentPageMdPath, lexique, callback) {
    fetchMarkdownContent(currentPageMdPath)
        .then(content => {
            try {
                const cleanContent = cleanMarkdownContent(content);
                const wordCounts = {};

                const words = cleanContent.split(/\s+/);

                words.forEach(word => {
                    try {
                        const cleanedWord = cleanWord(word);
                        if (lexique.includes(cleanedWord)) {
                            wordCounts[cleanedWord] = (wordCounts[cleanedWord] || 0) + 1;
                        }
                    } catch (error) {
                        console.error(`Error processing word '${word}':`, error);
                    }
                });

                const filteredKeywords = Object.keys(wordCounts).filter(word => wordCounts[word] >= 2);

                callback(filteredKeywords);
            } catch (error) {
                console.error('Error processing content:', error);
                callback([]); // Return an empty array if an error occurs
            }
        })
        .catch(error => console.error('Error fetching markdown content:', error));
}