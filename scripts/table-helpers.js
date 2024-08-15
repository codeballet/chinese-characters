// Return a formatted string with all pinyin and tone
function pinyinTableFormat(entry) {
    const formatted = [];
    for (let i = 0; i < entry.pinyin.length; i++) {
        formatted.push(`${entry.pinyin[i]} (${entry.tone[i]})`);
    }
    return formatted.join(", ");
}

// Create table with search results in the DOM
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
    resultsTable.appendChild(trHeaders);

    // Create table headers
    const thCharacter = document.createElement("th");
    thCharacter.classList.add("results__th");
    thCharacter.innerText = "Character";
    trHeaders.appendChild(thCharacter);

    const thPinyin = document.createElement("th");
    thPinyin.classList.add("results__th");
    thPinyin.innerText = "Pinyin";
    trHeaders.appendChild(thPinyin);

    const thEnglish = document.createElement("th");
    thEnglish.classList.add("results__th");
    thEnglish.innerText = "English";
    trHeaders.appendChild(thEnglish);

    // Create table data rows
    if (showingRadicals) {
        for (entry of dictionary) {
            // Append new table row
            const tr = document.createElement("tr");
            tr.classList.add("results__tr--data");
            tr.id = `${entry.id}_${entry.composites[0].id}`;
            resultsTable.appendChild(tr);

            // Append Character row data
            const tdCharacter = document.createElement("td");
            tdCharacter.classList.add("results__td");
            tdCharacter.innerText = entry.character;
            // const buttonCharacter = document.createElement("button");
            // buttonCharacter.classList.add("results__button");
            // buttonCharacter.innerText = entry.character;
            tr.appendChild(tdCharacter);
            // tdCharacter.appendChild(buttonCharacter);

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
        // Show all matching Characters
        for (entry of dictionary) {
            for (item of entry.composites) {
                // Append new table row
                const tr = document.createElement("tr");
                tr.classList.add("results__tr--data");
                tr.id = `${entry.id}_${item.id}`;
                resultsTable.appendChild(tr);

                // Append Character row data
                const tdCharacter = document.createElement("td");
                tdCharacter.classList.add("results__td");
                tdCharacter.innerText = item.character;
                // const buttonCharacter = document.createElement("button");
                // buttonCharacter.classList.add("results__button");
                // buttonCharacter.innerText = item.character;
                tr.appendChild(tdCharacter);
                // tdCharacter.appendChild(buttonCharacter);

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

// Show table in DOM
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

// Hide table in DOM
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

// Add eventListener to all table data rows
function tableRowListeners() {
    const resultsTrData = document.querySelectorAll(".results__tr--data");
    for (character of resultsTrData) {
        character.addEventListener("click", (e) => {
            // Acquire info about character
            const id = e.target.parentElement.id;
            const radicalId = id.split("_")[0];
            const characterId = id.split("_")[1];
            let radical;
            let character;
            let pinyinList;
            let toneList;
            let englishList;

            // Step through the dictionary to find details about id
            for (element of JSON.parse(localStorage.getItem("dictionary"))) {
                if (element.id === radicalId) {
                    radical = element.character;
                    for (item of element.composites) {
                        if (item.id === characterId) {
                            character = item.character;
                            pinyinList = item.pinyin;
                            toneList = item.tone;
                            englishList = item.english;
                        }
                    }
                }
            }

            // Create a card
            generateCard(radical, character, pinyinList, toneList, englishList);

            // Show selected character info to user
            infoGenerator(`You created a card with character "${character}"`);
        });
    }
}
