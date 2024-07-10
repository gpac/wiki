function displayKeywords(keywords, cachedDefinitions, allDefinitions, selectedLevel) {
    const wordCloudElement = document.querySelector('.words-cloud');
    const wordCloudList = document.getElementById('dynamic-words-cloud');
    wordCloudList.innerHTML = ''; 

    const sizes = ['size-1', 'size-2', 'size-3', 'size-4', 'size-5'];
    const colors = ['color-1', 'color-2', 'color-3', 'color-4'];

    let displayedKeywordsCount = 0;

    const totalRelevantKeywords = keywords.filter(keyword => {
        const definition = allDefinitions[keyword];
        return definition && (definition.level === selectedLevel || definition.level === 'all');
    }).length;

    keywords.forEach((keyword, index) => {
        const definition = allDefinitions[keyword];
     
        if (definition && (definition.level === selectedLevel || definition.level === 'all')) {
            displayedKeywordsCount++;

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = "#";
            a.textContent = keyword;
            a.className = sizes[index % sizes.length] + ' ' + colors[index % colors.length];

            a.addEventListener('click', function (event) {
                event.preventDefault();
                if (cachedDefinitions[keyword]) {
                    openModal(keyword, cachedDefinitions[keyword]);
                } else {
                    fetchDefinitions(keyword, cachedDefinitions);
                }
            });

            li.appendChild(a);
            wordCloudList.appendChild(li);
        }
    });

    if (displayedKeywordsCount > 0) {
        wordCloudElement.classList.remove('hidden');
    } else {
        wordCloudElement.classList.add('hidden');
    }

    if (displayedKeywordsCount < totalRelevantKeywords) {
        console.warn(`Some relevant keywords (${totalRelevantKeywords - displayedKeywordsCount}) could not be displayed.`);
    }
}