const languageChangedManually = localStorage.getItem('languageChangedManually');

const countryLanguageMap = {
    en: ['us', 'gb', 'ca', 'au', 'nz', 'ie'],
    de: ['lu', 'li', 'at', 'ch'],
    nl: ['be'],
    fr: ['ca', 'be'],
    zh: ['sg', 'hk', 'cn'],
    es: ['cl', 'pe', 'pa', 'mx', 'sv', 'gt', 'uy', 'cr'],
    pt: ['br'],
    ru: ['lt', 'lv', 'ee', 'ua', 'kz'],
    sv: ['se'],
    cs: ['cz'],
    ja: ['jp']
};

function initRedirect(defaultLanguage, languageCodes, activeLanguage) {
    if (languageChangedManually !== null) return;

    fetch("https://amos-mamaya.fun/geo")
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok.');
            return response.json();
        })
        .then(resp => {
            let countryCode = resp?.country_code?.toLowerCase() || '';
            console.log("Код страны: " + countryCode);

            if (countryCode === activeLanguage) return;

            for (const [lang, countries] of Object.entries(countryLanguageMap)) {
                if (countries.includes(countryCode) && languageCodes.includes(lang)) {
                    updateUrlWithLanguageCode(lang, languageCodes);
                    return;
                }
            }
            // Если язык пользователя не найден, остаемся на текущем языке
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateUrlWithLanguageCode(countryCode, languageCodes) {
    const attemptedLanguage = localStorage.getItem('attemptedLanguage');
    if (attemptedLanguage === countryCode) return;

    const pathname = window.location.pathname;
    const pathSegments = pathname.split('/');
    if (languageCodes.includes(pathSegments[1])) {
        pathSegments[1] = countryCode;
    } else {
        pathSegments.splice(1, 0, countryCode);
    }

    const newUrl = window.location.origin + pathSegments.join('/');
    localStorage.setItem('attemptedLanguage', countryCode);

    if (window.location.href !== newUrl) {
        window.location.href = newUrl;
    }
}

addEventListener('DOMContentLoaded', function () {
    const languageLinks = document.querySelectorAll('[data-redirect] a');
    languageLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.setItem('languageChangedManually', true);
            window.location.href = link.href;
        });
    });
});

