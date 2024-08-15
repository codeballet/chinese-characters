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
                card.mnemonic.length === 0 ? "None yet" : card.mnemonic;
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

            const characterRef = document.createElement("h3");
            characterRef.classList.add("card--character");
            characterRef.innerText = character;

            const radicalRef = document.createElement("h4");
            radicalRef.classList.add("card--radical");
            radicalRef.innerText = `Radical: ${radical}`;

            const pinyinRef = document.createElement("p");
            pinyinRef.classList.add("card--pinyin");
            pinyinRef.innerText = `Pinyin: ${pinyin}`;

            const englishRef = document.createElement("p");
            englishRef.classList.add("card--english");
            englishRef.innerText = `English: ${englishList.join(", ")}`;

            const mnemonicRef = document.createElement("p");
            mnemonicRef.classList.add("card--mnemonic");
            mnemonicRef.innerText = `Mnemonic: ${mnemonic}`;

            // Add elements to DOM
            cardsRef.appendChild(cardRef);
            cardRef.appendChild(characterRef);
            cardRef.appendChild(radicalRef);
            cardRef.appendChild(pinyinRef);
            cardRef.appendChild(englishRef);
            cardRef.appendChild(mnemonicRef);
        }
    } else {
        // No cards in localstorage
        infoGenerator("You have no cards yet.");
    }
}
