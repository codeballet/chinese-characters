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

// Create cards in the DOM
function generateCards(id) {
    // Acquire details about character
    const radicalId = id.split("_")[0];
    const characterId = id.split("_")[1];
    let radical;
    let character;
    let pinyinList;
    let toneList;
    let englishList;

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

    // Acquire mnemonic for card
    const cardsList = JSON.parse(localStorage.getItem("cards"));
    let mnemonic = "";
    for (card in cardsList) {
        if (card.id === id) {
            mnemonic = card.mnemonic;
        }
    }

    // Generate new DOM elements
    const cardRef = document.createElement("section");
    cardRef.classList.add("card");

    const characterRef = document.createElement("h3");
    characterRef.classList.add("card--character");
    characterRef.innerText = character;

    const radicalRef = document.createElement("h4");
    radicalRef.classList.add("card--radical");
    radicalRef.innerText = radical;

    const englishRef = document.createElement("p");
    characterRef.classList.add("card--english");
    characterRef.innerText = `English: ${englishList.split(", ")}`;

    const mnemonicRef = document.createElement("p");
    mnemonicRef.classList.add("card--mnemonic");
    mnemonicRef.innerText = `Mnemonic: ${mnemonic}`;

    // Add elements to DOM
    const cardsRef = document.querySelector(".cards");
    cardsRef.appendChild(cardRef);
    cardRef;
}
