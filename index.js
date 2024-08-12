// Fetch radicals
async function fetchRadicals() {
    const url =
        "http://ccdb.hemiola.com/characters/radicals?filter=gb&fields=string,kDefinition,kMandarin";
    const response = await fetch(url);
    const data = response.json();
    return data;
}

// Fetch composites for each radical
async function fetchComposites(radical) {
    const url = `http://ccdb.hemiola.com/characters/radicals/${radical}?filter=gb&fields=string,kDefinition,kMandarin`;
    const response = await fetch(url);
    const data = response.json();
    return data;
}

// Create Array with english translation
function extractEnglish(translation) {
    if (translation && translation.length > 0) {
        const englishList = translation.split(/[,;]/);
        const trimmedList = englishList.map((words) => words.trim());
        return trimmedList;
    } else {
        return [];
    }
}

// Extract pinyin
function extractPinyin(word) {
    // TODO: can be several, separated by whitespace, return list
    return word ? word.slice(0, -1).toLowerCase() : null;
}

// Extract tone
function extractTone(word) {
    // TODO: can be several, separated by whitespace, return list
    return word ? parseInt(word[word.length - 1]) : null;
}

// Create list of composite objects
function compositesList(composites) {
    const compositesList = [];
    let id = 0;
    for (let composite of composites) {
        compositesList.push({
            id: id,
            character: composite.string,
            english: extractEnglish(composite.kDefinition),
            pinyin: extractPinyin(composite.kMandarin),
            tone: extractTone(composite.kMandarin),
        });
        id++;
    }
    return compositesList;
}

// Create dictionary
async function createDictionary(radicals) {
    const dictionary = [];
    for (let radical of radicals) {
        const composites = await fetchComposites(radical.radical);
        dictionary.push({
            id: radical.radical,
            character: radical.string,
            english: extractEnglish(radical.kDefinition),
            pinyin: extractPinyin(radical.kMandarin),
            tone: extractTone(radical.kMandarin),
            composites: compositesList(composites),
        });
    }
    return dictionary;
}

// Run when DOM is loaded
window.addEventListener("DOMContentLoaded", async () => {
    // Create dictionary
    const radicals = await fetchRadicals();
    const dictionary = await createDictionary(radicals);
    console.log(dictionary);
});
