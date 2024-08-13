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

// Create table with find results in the DOM
function resultsTable(dictionary) {
    // Get results table from DOM
    const resultsTableRef = document.querySelector(".results__table");

    // Remove any existing table rows with data
    const trOld = document.querySelectorAll(".results--data");
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
        tr.classList.add("results--data");
        resultsTableRef.appendChild(tr);

        // Append Character row data with anchor
        const tdCharacter = document.createElement("td");
        tdCharacter.classList.add("results__td");
        const buttonCharacter = document.createElement("button");
        buttonCharacter.classList.add("results__button");
        buttonCharacter.innerText = entry.character;
        tr.appendChild(tdCharacter);
        tdCharacter.appendChild(buttonCharacter);

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

// Toggle button text and display of find--results section
function toggleResults(dictionary) {
    const radicals = "Radicals Only";
    const characters = "All Characters";
    let radicalsButtonRef = document.querySelector(".find__button--radicals");
    const findResultsRef = document.querySelector(".find--results");

    if (
        radicalsButtonRef.innerText === radicals &&
        findResultsRef.classList.contains("d-none")
    ) {
        // Show radicals
        radicalsButtonRef.innerText = characters;
        findResultsRef.classList.toggle("d-none");
        resultsTable(dictionary);
    } else if (
        radicalsButtonRef.innerText === characters &&
        !findResultsRef.classList.contains("d-none")
    ) {
        // Hide radicals
        radicalsButtonRef.innerText = radicals;
        findResultsRef.classList.toggle("d-none");
    } else if (!findResultsRef.classList.contains("d-none")) {
        // Button and page content out of sync, correct button
        radicalsButtonRef.innerText = characters;
    } else {
        radicalsButtonRef.innerText = radicals;
    }
}

//
function filterSearch(radicalsOnly, searchTerm, dictionary) {
    let newDictionary = [];

    if (radicalsOnly) {
        // Only look through the radicals
        for (element of dictionary) {
            newDictionary = dictionary.filter((element) => {
                for (item of element.pinyin) {
                    if (item.includes(searchTerm)) {
                        return element;
                    }
                }
            });
        }
    } else {
        // Look through all characters
        for (element of dictionary) {
            let charactersDictinary = [];
            for (item of element.composites) {
                if (item.pinyin.length > 0) {
                    for (pinyin of item.pinyin) {
                        if (pinyin.includes(searchTerm)) {
                            charactersDictinary.push(item);
                        }
                    }
                }
            }
            if (charactersDictinary.length > 0) {
                console.log("Charaters dict: ", charactersDictinary);
                element["composites"] = charactersDictinary;
                newDictionary.push(element);
            }
        }
    }
    console.log("New dict: ", newDictionary);
    return newDictionary;
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
            // Successfully created dictionary

            // Radicals button eventListener
            document
                .querySelector(".find__button--radicals")
                .addEventListener("click", (e) => {
                    toggleResults(dictionary);
                });

            // Pinyin input field eventListener
            let searchTerm = "";
            document
                .querySelector(".find__input--pinyin")
                .addEventListener("keyup", (e) => {
                    // Find radicals only or all characters?
                    const findButtonRadicalsRef = document.querySelector(
                        ".find__button--radicals"
                    );
                    const radicalsOnly =
                        findButtonRadicalsRef.innerText === "All Characters"
                            ? true
                            : false;

                    // Respond to keypresses
                    if (
                        e.key !== "Enter" &&
                        e.key !== "Backspace" &&
                        e.key !== "Delete"
                    ) {
                        searchTerm += e.key;
                        const filteredDictionary = filterSearch(
                            radicalsOnly,
                            searchTerm,
                            dictionary
                        );
                        resultsTable(filteredDictionary);
                    } else {
                        // filterSearch(searchTerm, dictionary);
                        // console.log(e);
                        e.target.value = "";
                        searchTerm = "";
                    }
                });
        }
    }
});
