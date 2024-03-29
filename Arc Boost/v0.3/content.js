/*
reNorsk - En Arc Boost (https://arc.net/boosts) som retter nynorsk til norsk, for økt leseglede.
- Se https://github.com/oeeve/renorsk for detaljer.

1. Last ned Arc Browser (https://arc.net).
2. Åpne: arc://boost/, eller Cmd+T og skriv 'New Legacy Boost (Advanced)'.
3. Kopier og lim inn følgende JavaScript til content.js.
4. Bruk Mac: Cmd+Ctrl+R / Win: Ctrl+Alt+R når du måtte komme over en tekst som bare er publisert på nynorsk, for å 'rette' denne til norsk. 

Mer informasjon om New Legacy Boosts: https://resources.arc.net/hc/en-us/articles/19212718608151-Boosts-Customize-Any-Website
*/

document.addEventListener('keydown', function (e) {
    if ((e.metaKey || (e.ctrlKey && e.altKey)) && e.key === 'r') {
        e.preventDefault();
        main();
    }
});

function main() {
    document.body.querySelectorAll("*").forEach(handleElement);
    addMutationObserver();
}

async function handleText(textNode) {
    let text = textNode.nodeValue;
    let url = `https://www.apertium.org/apy/translate?q=${encodeURIComponent(text)}&langpair=nno|nob`;
    try {
        let response = await fetch(url);
        let data = await response.json();
        if (data && data.responseData && data.responseData.translatedText) {
            let translatedText = data.responseData.translatedText.replace(/\*/g, '');
            textNode.nodeValue = translatedText;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function addMutationObserver() {
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.target.querySelectorAll("*").forEach(handleElement);
        });
    });
    observer.observe(document.body, { subtree: true, childList: true });
}

function handleElement(e) {
    e.childNodes.forEach((child) => {
        if (child && !isUserInput(child)) {
            if (child.nodeName === "A") {
                child.childNodes.forEach((grandChild) => {
                    if (grandChild.nodeName === "#text") {
                        handleText(grandChild);
                    }
                });
            } else if (child.nodeName === "#text") {
                handleText(child);
            }
        }
    });
}

function isUserInput(node) {
    const tagName = node.tagName ? node.tagName.toLowerCase() : "";
    return (
        tagName == "input" || tagName == "textarea" || isInsideContentEditable(node)
    );
}

function isInsideContentEditable(node) {
    while (node.parentNode) {
        if (node.contentEditable === "true") {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}