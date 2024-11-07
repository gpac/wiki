//delete links in markdown content
function cleanMarkdownContent(content) {
  return content.replace(/\[[^\]]*\]\([^)]*\)/g, "");
}

function cleanWord(word) {
  return word.replace(/[.,!?(){}[\]`-]/g, "").toUpperCase();
}

function findKeywordsInContent(currentPageMdPath, lexique, callback) {
  fetchMarkdownContent(currentPageMdPath)
    .then((content) => {
      try {
        const cleanContent = cleanMarkdownContent(content);
        const wordCounts = {};

        const words = cleanContent.split(/\s+/);

        words.forEach((word) => {
          const cleanedWord = cleanWord(word);
          if (lexique.includes(cleanedWord)) {
            wordCounts[cleanedWord] = (wordCounts[cleanedWord] || 0) + 1;
          }
        });

        const filteredKeywords = Object.keys(wordCounts).filter(
          (word) => wordCounts[word] >= 2
        );

        callback(filteredKeywords);
      } catch (error) {
        console.error("Error processing markdown content:", error);
      }
    })
    .catch((error) => console.error("Error fetching markdown content:", error));
}
