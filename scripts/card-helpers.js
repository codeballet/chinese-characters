// Save card details to localStorage
function saveCardDetails(id) {
    const cardDetails = {
        id: id,
        mnemonic: "",
    };

    if (localStorage.getItem("cards")) {
        let cards = JSON.parse(localStorage.getItem("cards"));

        // Check if card id already exists
        for (let card of cards) {
            console.log("The card is:", card);
            if (card.id === id) {
                return false;
            }
        }
        // Card does not exist, add to localStorage
        cards.push(cardDetails);
        localStorage.setItem("cards", JSON.stringify(cards));
        return true;
    } else {
        console.log("No cards in localStorage");

        // Create new cards list in localstorage
        let cardsList = [];
        cardsList.push(cardDetails);
        localStorage.setItem("cards", JSON.stringify(cardsList));
        return true;
    }
}

// Remove card from the DOM
function deleteCardDetails(id) {
    console.log("Removing card id:", id);
    // Acquire cards from localStorage
    const cardsList = JSON.parse(localStorage.getItem("cards"));
    // Filter out the releavant card from list
    const newCardsList = cardsList.filter((card) => card.id !== id);
    // Store new list in localStorage
    localStorage.setItem("cards", JSON.stringify(newCardsList));
}

// Delete card in DOM
function deleteCardInDOM(id) {
    const cardRefs = document.querySelectorAll(".card");
    for (card of cardRefs) {
        if (card.id === id) {
            card.remove();
        }
    }
}

// Update mnemonic in localStorage and DOM
function updateMnemonic(id, value) {
    const newValue = value.length > 0 ? value : "Not created";

    const cards = JSON.parse(localStorage.getItem("cards"));
    const newCards = cards.map((card) => {
        if (card.id === id) {
            card.mnemonic = newValue;
        }
        return card;
    });
    localStorage.setItem("cards", JSON.stringify(newCards));

    // Show new mnemonic in DOM
    document.getElementById(`mnemonic${id}`).innerText = newValue;
    // Reset mnemonic button
    document.getElementById(`button${id}`).innerText = "Edit Mnemonic";
}

// Create cards in the DOM
function generateCards() {
    // Check if any cards are stored in localStorage
    if (
        localStorage.getItem("cards") &&
        JSON.parse(localStorage.getItem("cards")).length > 0
    ) {
        infoGenerator("Time to practice!");

        // Erase any existing card DOM element
        if (document.querySelector(".cards")) {
            document.querySelector(".cards").remove();
        }

        // Insert new card section in DOM
        const mainCardsRef = document.querySelector(".main--cards");
        const cardsRef = document.createElement("section");
        cardsRef.classList.add("cards");
        mainCardsRef.appendChild(cardsRef);

        // Step through each card and get details from dictionary
        const cards = JSON.parse(localStorage.getItem("cards"));
        for (let card of cards) {
            const id = card.id;
            const mnemonic =
                card.mnemonic.length === 0 ? "Not created" : card.mnemonic;
            const radicalId = id.split("_")[0];
            const characterId = id.split("_")[1];
            let radical;
            let character;
            let englishList;

            // Get details in dictionary
            for (element of JSON.parse(localStorage.getItem("dictionary"))) {
                if (element.id === radicalId) {
                    radical = element.character;
                    for (item of element.composites) {
                        if (item.id === characterId) {
                            character = item.character;
                            pinyin = pinyinTableFormat(item);
                            englishList = item.english;
                        }
                    }
                }
            }

            // Generate new DOM elements for card
            const cardRef = document.createElement("section");
            cardRef.classList.add("card");
            cardRef.id = id;

            // Character
            const characterRef = document.createElement("h3");
            characterRef.classList.add("card--character");
            characterRef.innerText = character;

            // Radical
            const radicalHeaderRef = document.createElement("h4");
            radicalHeaderRef.classList.add("card--radical-header");
            radicalHeaderRef.innerText = "Radical";
            const radicalRef = document.createElement("p");
            radicalRef.classList.add("card--radical");
            radicalRef.innerText = radical;

            // Pinyin
            const pinyinHeaderRef = document.createElement("h4");
            pinyinHeaderRef.classList.add("card--pinyin-header");
            pinyinHeaderRef.innerText = "Pinyin";
            const pinyinRef = document.createElement("p");
            pinyinRef.classList.add("card--pinyin");
            pinyinRef.innerText = pinyin;

            // English
            const englishHeaderRef = document.createElement("h4");
            englishHeaderRef.classList.add("card--english-header");
            englishHeaderRef.innerText = "English";
            const englishRef = document.createElement("p");
            englishRef.classList.add("card--english");
            englishRef.innerText = englishList.join(", ");

            // Mnemonic
            const mnemonicHeaderRef = document.createElement("h4");
            mnemonicHeaderRef.classList.add(".card--mnemonic-header");
            mnemonicHeaderRef.innerText = "Mnemonic";
            const mnemonicRef = document.createElement("p");
            mnemonicRef.classList.add("card--mnemonic");
            mnemonicRef.id = `mnemonic${id}`;
            mnemonicRef.innerText = mnemonic;

            // Mnemonic input field
            const mnemonicInputdRef = document.createElement("input");
            mnemonicInputdRef.type = "text";
            mnemonicInputdRef.classList.add("card--input", "d-none");
            mnemonicInputdRef.id = `input${id}`;
            mnemonicInputdRef.placeholder = "Write new mnemonic";

            // Mnemonic edit button
            const mnemonicButtonRef = document.createElement("button");
            mnemonicButtonRef.classList.add("card--mnemonic-button");
            mnemonicButtonRef.id = `button${id}`;
            mnemonicButtonRef.innerText = "Edit Mnemonic";

            // Delete button
            const deleteRef = document.createElement("button");
            deleteRef.classList.add("card--delete");
            deleteRef.innerText = "Delete";

            // Add elements to DOM
            cardsRef.appendChild(cardRef);
            cardRef.appendChild(characterRef);
            cardRef.appendChild(radicalHeaderRef);
            cardRef.appendChild(radicalRef);
            cardRef.appendChild(pinyinHeaderRef);
            cardRef.appendChild(pinyinRef);
            cardRef.appendChild(englishHeaderRef);
            cardRef.appendChild(englishRef);
            cardRef.appendChild(mnemonicHeaderRef);
            cardRef.appendChild(mnemonicRef);
            cardRef.appendChild(mnemonicInputdRef);
            cardRef.appendChild(mnemonicButtonRef);
            cardRef.appendChild(deleteRef);
        }
        // Add Card eventListener for Delete buttons
        const cardDeleteRefs = document.querySelectorAll(".card--delete");
        for (let button of cardDeleteRefs) {
            button.addEventListener("click", (e) => {
                deleteCardDetails(e.target.parentElement.id);
                deleteCardInDOM(e.target.parentElement.id);
            });
        }

        // Add Card eventListener to edit mnemonics
        const mnemonicButtonRefs = document.querySelectorAll(
            ".card--mnemonic-button"
        );
        for (button of mnemonicButtonRefs) {
            button.addEventListener("click", (e) => {
                const id = e.target.parentElement.id;
                const inputRef = document.getElementById(`input${id}`);
                const buttonRef = document.getElementById(`button${id}`);
                const mnemonicRef = document.getElementById(`mnemonic${id}`);
                if (inputRef.classList.contains("d-none")) {
                    // Show input field to edit
                    inputRef.classList.toggle("d-none");
                    inputRef.focus();
                    buttonRef.innerText = "Save changes";

                    // eventlistener for pressing "Enter" on the input
                    document
                        .getElementById(`input${id}`)
                        .addEventListener("keyup", (e) => {
                            if (e.key === "Enter") {
                                inputRef.classList.toggle("d-none");
                                updateMnemonic(id, e.target.value);
                            }
                        });
                } else {
                    // Mnemonic save button is pressed
                    inputRef.classList.toggle("d-none");
                    updateMnemonic(id, inputRef.value);
                }
            });
        }
    } else {
        // No cards in localstorage
        infoGenerator("You have no cards yet.");
    }
}
