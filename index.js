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

// Find only radicals or all characters?
function onlyRadicals(allCharacters, buttonText) {
    return buttonText === allCharacters ? true : false;
}

// Toggle and set text on find button
function toggleFindButton(showRadicals, allCharacters, radicalsOnly) {
    const findButtonRef = document.querySelector(".find__button");
    if (radicalsOnly) {
        findButtonRef.innerText = showRadicals;
    } else {
        findButtonRef.innerText = allCharacters;
    }
}

// Toggle and set results header
function toggleResultsH2(radicalsOnly) {
    const resultsH2Ref = document.querySelector(".results__h2");
    if (radicalsOnly) {
        resultsH2Ref.innerText = "Showing All Characters";
    } else {
        resultsH2Ref.innerText = "Showing Radicals";
    }
}

//
function filterSearch(showingRadicals, searchTerm, dictionary) {
    let newDictionary = [];

    if (showingRadicals) {
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
                            break;
                        }
                    }
                }
            }
            if (charactersDictinary.length > 0) {
                element["composites"] = charactersDictinary;
                newDictionary.push(element);
            }
        }
    }
    console.log("New dict: ", newDictionary);
    return newDictionary;
}

// Return a formatted string with all pinyin and tone
function pinyinTableFormat(entry) {
    const formatted = [];
    for (let i = 0; i < entry.pinyin.length; i++) {
        formatted.push(`${entry.pinyin[i]} (${entry.tone[i]})`);
    }
    return formatted.join(", ");
}

// Create table with find results in the DOM
function resultsTable(showingRadicals, dictionary) {
    // remove old table from DOM
    const oldResultsTableRef = document.querySelector(".results__table");
    if (oldResultsTableRef) {
        oldResultsTableRef.remove();
    }

    // Create table
    const findResultsRef = document.querySelector(".find--results");
    const resultsTable = document.createElement("table");
    resultsTable.classList.add("results__table");
    findResultsRef.appendChild(resultsTable);

    // Create table header row
    const trHeaders = document.createElement("tr");
    trHeaders.classList.add("results__tr--headers");
    const thCharacter = "";

    // Create table data rows
    if (showingRadicals) {
        for (entry of dictionary) {
            // Append new table row
            const tr = document.createElement("tr");
            tr.classList.add("results__tr--data");
            resultsTable.appendChild(tr);

            // Append table data for Character as button
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
    } else {
        // Show all matching Characters in each radical
        for (entry of dictionary) {
            for (item of entry.composites) {
                // Append new table row
                const tr = document.createElement("tr");
                tr.classList.add("results__tr--data");
                resultsTable.appendChild(tr);

                // Append table data for Character as button
                const tdCharacter = document.createElement("td");
                tdCharacter.classList.add("results__td");
                const buttonCharacter = document.createElement("button");
                buttonCharacter.classList.add("results__button");
                buttonCharacter.innerText = item.character;
                tr.appendChild(tdCharacter);
                tdCharacter.appendChild(buttonCharacter);

                // Append Pinyin row data
                const tdPinyin = document.createElement("td");
                tdPinyin.classList.add("pinyin__td");
                tdPinyin.innerText = pinyinTableFormat(item);
                tr.appendChild(tdPinyin);

                // Append English row data
                const tdEnglish = document.createElement("td");
                tdEnglish.classList.add("english__td");
                tdEnglish.innerText = item.english.join(", ");
                tr.appendChild(tdEnglish);
            }
        }
    }
}

function makeTableVisible() {
    if (document.querySelector(".results__table")) {
        if (
            document
                .querySelector(".results__table")
                .classList.contains("d-none")
        ) {
            document
                .querySelector(".results__table")
                .classList.toggle("d-none");
        }
    }
}

function makeTableInvisible() {
    if (document.querySelector(".results__table")) {
        if (
            !document
                .querySelector(".results__table")
                .classList.contains("d-none")
        ) {
            document
                .querySelector(".results__table")
                .classList.toggle("d-none");
        }
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
            // Successfully created dictionary

            // Find button text content
            const showRadicals = "Show Radicals";
            const allCharacters = "All Characters";

            // find__button eventListener
            document
                .querySelector(".find__button")
                .addEventListener("click", (e) => {
                    const findButtonRef =
                        document.querySelector(".find__button");

                    // Update state of page
                    let showingRadicals = onlyRadicals(
                        allCharacters,
                        findButtonRef.innerText
                    );

                    // Toggle and set find__button text
                    toggleFindButton(
                        showRadicals,
                        allCharacters,
                        showingRadicals
                    );

                    // Toggle and set results heading
                    toggleResultsH2(showingRadicals);

                    // Update state of page
                    showingRadicals = onlyRadicals(
                        allCharacters,
                        findButtonRef.innerText
                    );

                    // Reset input fields
                    document.querySelector(".find__input--pinyin").value = "";
                    document.querySelector(".find__input--english").value = "";

                    if (showingRadicals) {
                        resultsTable(showingRadicals, dictionary);
                    } else {
                        // Make table invisible
                        makeTableInvisible();
                    }
                });

            // Pinyin input field eventListener
            document
                .querySelector(".find__input--pinyin")
                .addEventListener("keyup", (e) => {
                    // Update state of page
                    const findButtonRef =
                        document.querySelector(".find__button");
                    let showingRadicals = onlyRadicals(
                        allCharacters,
                        findButtonRef.innerText
                    );

                    // Ensure table is visible
                    makeTableVisible();

                    // Respond to keypresses
                    if (e.key === "Enter") {
                        // Reset input field
                        e.target.value = "";

                        // Hide table
                        document
                            .querySelector(".results__table")
                            .classList.toggle("d-none");
                    } else {
                        const filteredDictionary = filterSearch(
                            showingRadicals,
                            e.target.value,
                            dictionary
                        );
                        resultsTable(showingRadicals, filteredDictionary);
                    }
                });

            // TODO: English input field eventListener
        }
    }
});
