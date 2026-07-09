const domainSelect = document.getElementById("domainSelect");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

chrome.tabs.query({active:true,currentWindow:true}, tabs => {

    const url = new URL(tabs[0].url);
    const domain = url.origin;

    chrome.storage.sync.get(["domains"], data => {

        let domains = data.domains || [];

        if(!domains.includes(domain)){
            domains.push(domain);

            chrome.storage.sync.set({
                domains: domains
            });
        }

        domainSelect.innerHTML = "";

        domains.forEach(d => {

            const option = document.createElement("option");

            option.value = d;
            option.textContent = d;

            if(d === domain)
                option.selected = true;

            domainSelect.appendChild(option);

        });

    });

});

function search(){

    const domain = domainSelect.value;
    const query = searchInput.value.trim();

    if(query.length === 0)
        return;

    const google =
        `https://www.google.com/search?q=${encodeURIComponent(`site:${domain} "${query}"`)}`;

    chrome.tabs.create({
        url: google
    });

}

searchBtn.addEventListener("click", search);

searchInput.addEventListener("keydown", e => {

    if(e.key === "Enter"){
        search();
    }

});
