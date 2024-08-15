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
