// Fetch radicals
async function fetchRadicals() {
    try {
        const url =
            "http://ccdb.hemiola.com/characters/radicals?filter=gb&fields=string,kDefinition,kMandarin";
        const response = await fetch(url);
        const data = response.json();
        return data;
    } catch (err) {
        console.log(err);
        return {
            error: "Failed to acquire radicals.",
        };
    }
}

// Fetch composites for each radical
async function fetchComposites(radical) {
    try {
        const url = `http://ccdb.hemiola.com/characters/radicals/${radical}?filter=gb&fields=string,kDefinition,kMandarin`;
        const response = await fetch(url);
        const data = response.json();
        return data;
    } catch (err) {
        console.log(err);
        return {
            error: "Failed to acquire composite characters.",
        };
    }
}

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

// Create complete dictionary
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

// Create table with radicals in the DOM
function radicalsTable(dictionary) {
    // Get radicals table from DOM
    const radicalsTableRef = document.querySelector(".radicals__table");

    // Remove any existing table rows with data
    const trOld = document.querySelectorAll(".radicals__tr--data");
    for (tr of trOld) {
        tr.remove();
    }

    // Return a formatted list of: ['pinyin (tone)']
    function pinyinTableFormat(entry) {
        const formatted = [];
        for (let i = 0; i < entry.pinyin.length; i++) {
            formatted.push(`${entry.pinyin[i]} (${entry.tone[i]})`);
        }
        return formatted.join(", ");
    }

    // Table data rows
    for (entry of dictionary) {
        // Append new table row
        const tr = document.createElement("tr");
        tr.classList.add("radicals__tr--data");
        radicalsTableRef.appendChild(tr);

        // Append Character row data
        const tdCharacter = document.createElement("td");
        tdCharacter.classList.add("radicals__td");
        tdCharacter.innerText = entry.character;
        tr.appendChild(tdCharacter);

        // Append Pinyin row data
        const tdPinyin = document.createElement("td");
        tdPinyin.classList.add("pinyin__td");
        tdPinyin.innerText = pinyinTableFormat(entry);
        tr.appendChild(tdPinyin);

        // Append English row data
        const tdEnglish = document.createElement("td");
        tdEnglish.classList.add("english__td");
        tdEnglish.innerText = entry.english.join(", ");
        tr.appendChild(tdEnglish);
    }
}

// Run once DOM is loaded
window.addEventListener("DOMContentLoaded", async () => {
    const radicals = await fetchRadicals();
    if (radicals.error) {
        //No radicals from API, inform user
    } else {
        const dictionary = await createDictionary(radicals);
        if (dictionary.error) {
            // No composite characters from API, inform user
        } else {
            // TODO: When pressing the 'radical' button, show list of radicals
            document
                .querySelector(".main__button--radicals")
                .addEventListener("click", (e) => {
                    console.log("Radicals Button clicked");
                    radicalsTable(dictionary);
                });
        }
    }
});
