function displayKeywords(keywords, cachedDefinitions, allDefinitions, selectedLevel) {
    try {
        const wordCloudElement = document.querySelector('.words-cloud');
        if (!wordCloudElement) throw new Error("Element with class 'words-cloud' not found");

        const wordCloudList = document.getElementById('dynamic-words-cloud');
        if (!wordCloudList) throw new Error("Element with ID 'dynamic-words-cloud' not found");

        wordCloudList.innerHTML = ''; 

        const sizes = ['size-1', 'size-2', 'size-3', 'size-4', 'size-5'];
        const colors = ['color-1', 'color-2', 'color-3', 'color-4'];

        let displayedKeywordsCount = 0;

        const totalRelevantKeywords = keywords.filter(keyword => {
            const definition = allDefinitions[keyword];
            return definition && (definition.level === selectedLevel || definition.level === 'all');
        }).length;

        keywords.forEach((keyword, index) => {
            try {
                const definition = allDefinitions[keyword];
                if (definition && (definition.level === selectedLevel || definition.level === 'all')) {
                    displayedKeywordsCount++;

                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = "#";
                    a.textContent = keyword;
                    a.className = sizes[index % sizes.length] + ' ' + colors[index % colors.length];

                    a.addEventListener('mouseenter', function (event) {
                        event.preventDefault();
                        clearTimeout(closeModalTimer); 
                        if (cachedDefinitions[keyword]) {
                            openModal(keyword, cachedDefinitions[keyword], event);
                        } else {
                            fetchDefinitions(keyword, cachedDefinitions, event);
                        }
                    });

                    a.addEventListener('mouseleave', startCloseModalTimer);

                    li.appendChild(a);
                    wordCloudList.appendChild(li);
                }
            } catch (error) {
                console.error(`Error processing keyword '${keyword}':`, error);
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
    } catch (error) {
        console.error('Error displaying keywords:', error);
    }
}