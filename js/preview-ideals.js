var ideals = [
    {
        name: "Software Warranty",
        description: "Software doesn't erode from natural causes, therefore deserves a longer life expectancy.",
        image: "images/software-warranty.png",
        page: "/software-warranty.html"
    },
    {
        name: "Freedom of Installation",
        description: "No one should be required or expected to run specific software on their electronic device.",
        image: "images/installation-freedom.png",
        page: "/freedom-of-installation.html"
    },
    {
        name: "Software Autonomy",
        description: "Walled gardens limit freedom. Anyone should have the right to reprogram their device.",
        image: "images/software-autonomy.png",
        page: "/software-autonomy.html"
    }
];

const amountOfCards = 3;

function buildIdealCard(ideal) {
    return `
        <article class="medium-preview">
            <div class="flex-container">
                <div>
                    <img src="${ideal.image}">
                </div>
                <div>
                    <h4>${ideal.name}</h4>
                    <p>${ideal.description}</p>
                    <a class="btn filled big round" href="${ideal.page}">More</a>
                </div>
            </div>
        </article>
    `;
}

let idealHTMLString = "";
let usedIdeals = [];

for (let i=0; i<amountOfCards; i++) {
    // Choose random ideal
    let x = Math.floor(Math.random()*ideals.length);
    while (usedIdeals.includes(x)) {
        x = Math.floor(Math.random()*ideals.length);
    }

    idealHTMLString = idealHTMLString.concat(buildIdealCard(ideals[x]));
    usedIdeals.push(x);
}

document.getElementById('ideals').innerHTML = idealHTMLString;
console.log(usedIdeals);