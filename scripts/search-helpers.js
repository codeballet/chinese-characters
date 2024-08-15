// Find only radicals or all characters?
function onlyRadicals(allCharacters, buttonText) {
    return buttonText === allCharacters ? true : false;
}

// Toggle text on find button
function toggleFindButton(showRadicals, allCharacters, radicalsOnly) {
    const findButtonRef = document.querySelector(".find__button");
    if (radicalsOnly) {
        findButtonRef.innerText = showRadicals;
    } else {
        findButtonRef.innerText = allCharacters;
    }
}

// Toggle results header
function toggleResultsH2(radicalsOnly) {
    const resultsH2Ref = document.querySelector(".results__h2");
    if (radicalsOnly) {
        resultsH2Ref.innerText = "Showing All Characters";
    } else {
        resultsH2Ref.innerText = "Showing Radicals";
    }
}

// Filter search from dictionary
function filterSearch(
    showingRadicals,
    searchTerm,
    dictionary,
    language = "pinyin"
) {
    let newDictionary = [];

    if (showingRadicals) {
        // Only look through the radicals
        for (element of dictionary) {
            newDictionary = dictionary.filter((element) => {
                if (language === "pinyin") {
                    for (item of element.pinyin) {
                        if (item.includes(searchTerm)) {
                            return element;
                        }
                    }
                } else {
                    // English search
                    for (item of element.english) {
                        if (item.includes(searchTerm)) {
                            return element;
                        }
                    }
                }
            });
        }
    } else {
        // Look through all characters
        for (element of dictionary) {
            let charactersDictinary = [];
            for (item of element.composites) {
                if (language === "pinyin") {
                    if (item.pinyin.length > 0) {
                        for (pinyin of item.pinyin) {
                            if (pinyin.includes(searchTerm)) {
                                charactersDictinary.push(item);
                                break;
                            }
                        }
                    }
                } else {
                    if (item.english.length > 0) {
                        for (word of item.english) {
                            if (word.includes(searchTerm)) {
                                charactersDictinary.push(item);
                                break;
                            }
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
