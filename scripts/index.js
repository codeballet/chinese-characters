// Run once DOM is loaded
window.addEventListener("DOMContentLoaded", async () => {
    infoGenerator("Creating Dictionary...");
    const radicals = await fetchRadicals();
    if (radicals.error) {
        //No radicals from API, inform user
        infoGenerator(radicals.error);
    } else {
        const dictionary = await createDictionary(radicals);
        if (dictionary.error) {
            // No composite characters from API, inform user
            infoGenerator(dictionary.error);
        } else {
            // Successfully created dictionary
            console.log("Dictionary loaded");
            infoGenerator("Dictionary is ready to use");
            // Save dictionary to localStorage
            localStorage.setItem("dictionary", JSON.stringify(dictionary));

            // Navigation: Find button eventListener
            document
                .querySelector(".header__button--find")
                .addEventListener("click", (e) => {
                    console.log("Clicked Navigation button Find");
                    document
                        .querySelector(".main--find")
                        .classList.remove("d-none");
                    document
                        .querySelector(".main--cards")
                        .classList.add("d-none");
                });

            // Navigation: Card button eventListener
            document
                .querySelector(".header__button--cards")
                .addEventListener("click", (e) => {
                    console.log("Clicked Navigation button Cards");
                    document
                        .querySelector(".main--find")
                        .classList.add("d-none");
                    document
                        .querySelector(".main--cards")
                        .classList.remove("d-none");

                    // Show cards
                    generateCards();
                });

            // Search Find button text content
            const showRadicals = "Show Radicals";
            const allCharacters = "All Characters";

            // find__button for what to show eventListener
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
                        console.log(dictionary);
                        resultsTable(showingRadicals, dictionary);
                        // Ensure table is visible
                        makeTableVisible();
                        // add eventListener to all table rows
                        tableRowListeners();
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

                    // Reset english input field
                    document.querySelector(".find__input--english").value = "";

                    // Respond to keypresses
                    if (e.key === "Enter") {
                        // Reset input field
                        e.target.value = "";

                        // Hide table
                        makeTableInvisible();
                    } else {
                        const filteredDictionary = filterSearch(
                            showingRadicals,
                            e.target.value,
                            dictionary
                        );
                        resultsTable(showingRadicals, filteredDictionary);

                        // Ensure table is visible
                        makeTableVisible();

                        // add eventListener to all table rows
                        tableRowListeners();
                    }
                });

            // English input field eventListener
            document
                .querySelector(".find__input--english")
                .addEventListener("keyup", (e) => {
                    // Update state of page
                    const findButtonRef =
                        document.querySelector(".find__button");
                    let showingRadicals = onlyRadicals(
                        allCharacters,
                        findButtonRef.innerText
                    );

                    // Reset pinyin input field
                    document.querySelector(".find__input--pinyin").value = "";

                    // Respond to keypresses
                    if (e.key === "Enter") {
                        // Reset input field
                        e.target.value = "";

                        // Hide table
                        makeTableInvisible();
                    } else {
                        const filteredDictionary = filterSearch(
                            showingRadicals,
                            e.target.value,
                            dictionary,
                            "english"
                        );
                        resultsTable(showingRadicals, filteredDictionary);

                        // Ensure table is visible
                        makeTableVisible();

                        // add eventListener to all table rows
                        tableRowListeners();
                    }
                });
        }
    }
});
