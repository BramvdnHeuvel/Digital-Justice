const languages = {
//  'hr': 'Croatian',       // Not supported yet
    'da': 'Dansk',          // Supports Danish
    'de': 'Deutsch',        // Supports German
    'et': 'Eesti',          // Supports Estonian
    'en': 'English',        // Supports English
    'es': 'Español',        // Supports Spanish
    'fr': 'Français',       // Supports French
//  'ga': 'Irish',          // Not supported yet
    'it': 'Italiano',       // Supports Italian
    'lv': 'Latviešu',       // Supports Latvian
    'lt': 'Lietuvių kalba', // Supports Lithuanian
    'hu': 'Magyar',         // Supports Hungarian
//  'mt': 'Maltese',        // Not supported yet
    'nl': 'Nederlands',     // Supports Dutch
    'pl': 'Polski',         // Supports Polish
    'pt': 'Portugês',       // Supports Portuguese
    'ro': 'Românesc',       // Supports Romanian
    'sl': 'Slovenski',      // Supports Slovenian
    'sk': 'Slovenská',      // Supports Slovak
    'fi': 'Suomalainen',    // Supports Finnish
    'sv': 'Svenska',        // Supports Swedish
    'cs': 'Česky',          // Supports Czech
    'el': 'Ελληνική',       // Supports Greek
    'bg': 'Български',      // Supports Bulgarian
};

let route = window.location.pathname;
var currentLanguage = "en";

// Determine current language
for (lan in languages) {
    if (route.startsWith("/" + lan + "/")) {
        currentLanguage = route.slice(1, 3);
        route = route.slice(3,);
        break;
    }
}

document.getElementById("language-picker").innerHTML = `
<div>
    <img src="https://digital-justice.com/icons/flags/${currentLanguage}.jpg" style="height: 30px;">
</div>
<div id="picker"></div>
`;

// Build language picker
let languagePicker = "";

for (lan in languages) {
    languagePicker = languagePicker.concat(`
        <a href="${lan}/${route}">
            <img src="https://digital-justice.com/icons/flags/${lan}.jpg">
            <span>${languages[lan]}</span>
        </a>
    `);
}

document.getElementById("picker").innerHTML = languagePicker;