const form = document.querySelector(".translator");
const fromLang = document.getElementById("from-lang");
const toLang = document.getElementById("to-lang");
const sourceText = document.getElementById("source-text");
const translatedText = document.getElementById("translated-text");
const translateButton = form.querySelector('button[type="submit"]');

const API_URL = "https://api.mymemory.translated.net/get";

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const text = sourceText.value.trim();
    const source = fromLang.value;
    const target = toLang.value;

    if (!text) {
        translatedText.value = "Please enter some text to translate.";
        sourceText.focus();
        return;
    }

    if (text.length > 500) {
        translatedText.value = "Please enter 500 characters or fewer.";
        return;
    }

    if (source === target) {
        translatedText.value = text;
        return;
    }

    translateButton.disabled = true;
    translateButton.textContent = "Translating...";
    translatedText.value = "Translating, please wait...";

    try {
        const params = new URLSearchParams({
            q: text,
            langpair: `${source}|${target}`,
            de: "bartbracero@gmail.com" 
        });

        const response = await fetch(`${API_URL}?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();

        if (
            data.responseStatus !== 200 ||
            !data.responseData ||
            typeof data.responseData.translatedText !== "string" ||
            !data.responseData.translatedText.trim()
        ) {
            throw new Error(
                data.responseDetails || "Translation unavailable."
            );
        }

        translatedText.value = data.responseData.translatedText;

    } catch (error) {
        console.error("Translation error:", error);
        translatedText.value = `Error: ${error.message}`;

    } finally {
        translateButton.disabled = false;
        translateButton.textContent = "Translate Text →";
    }
});

sourceText.addEventListener("input", function () {
    translatedText.value = "";
});

fromLang.addEventListener("change", function () {
    translatedText.value = "";
});

toLang.addEventListener("change", function () {
    translatedText.value = "";
});