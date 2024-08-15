// Create Array with english translations
function extractEnglish(translation) {
    if (translation && translation.length > 0) {
        const englishList = translation.split(/[,;]/);
        const trimmedList = englishList.map((words) => words.trim());
        return trimmedList;
    } else {
        return [];
    }
}

// Extract pinyin Array
function extractPinyin(words) {
    if (words) {
        const wordsList = words.split(" ");
        const wordsListCleaned = wordsList.map((word) =>
            word.slice(0, -1).toLowerCase().trim()
        );
        return wordsListCleaned;
    } else {
        return [];
    }
}

// Extract tone Array
function extractTone(words) {
    if (words) {
        const wordsList = words.split(" ");
        const tonesList = wordsList.map((word) => word[word.length - 1]);
        return tonesList;
    } else {
        return [];
    }
}

// Create list of objects for composite characters
function compositesList(composites) {
    const compositesList = [];
    let id = 0;
    for (let composite of composites) {
        compositesList.push({
            id: encodeURI(composite.string),
            character: composite.string,
            english: extractEnglish(composite.kDefinition),
            pinyin: extractPinyin(composite.kMandarin),
            tone: extractTone(composite.kMandarin),
        });
        id++;
    }
    return compositesList;
}

// Create complete dictionary
async function createDictionary(radicals) {
    const dictionary = [];
    for (let radical of radicals) {
        // let encoded = encodeURI(radical.string);
        // console.log(encoded);
        // console.log(decodeURI(encoded));
        const composites = await fetchComposites(radical.radical);
        dictionary.push({
            id: encodeURI(radical.string),
            character: radical.string,
            english: extractEnglish(radical.kDefinition),
            pinyin: extractPinyin(radical.kMandarin),
            tone: extractTone(radical.kMandarin),
            composites: compositesList(composites),
        });
    }
    return dictionary;
}