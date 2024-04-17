const languageChangedManually = localStorage.getItem('languageChangedManually');


const countriesGermanLanguage = ['lu', 'li', 'at', 'ch'];
const countriesDutchLanguage = ['be'];
const countriesFrenchLanguage = ['ca', 'be'];
const countriesChineseLanguage = ['sg', 'hk'];
const countriesSpanishLanguage = ['cl', 'pe', 'pa', 'mx', 'sv', 'gt', 'uy', 'cr'];
const countriesPortugueseLanguage = ['br',];
const countriesRussianLanguage = ['lt', 'lv', 'ee', 'ua', 'kz'];


function initRedirect(defaultLanguage, languageCodes, activeLanguage) {

    // Проверка, не изменялся ли язык вручную
    if (languageChangedManually == null) {

        /* fetch =========================== */
        // Отправка запроса к сервису для определения геолокации пользователя
        fetch("https://amos-mamaya.fun/geo")
            .then(response => {
                // Проверка на успешность ответа сервера
                if (!response.ok) throw new Error('Network response was not ok.');
                // Получение данных в формате JSON
                return response.json();
            })
            .then(resp => {
                // Извлечение странового кода из ответа, приведение к нижнему регистру
                let countryCode = resp && resp.country_code ? resp.country_code.toLowerCase() : '';
                console.log("Код страны: " + countryCode);


                // Ничего не делать, если язык соответствует стране
                if (countryCode == activeLanguage) return;


                // Проверка, существует ли версия сайта для страны пользователя и что это не дефолтная версия
                if (languageCodes.includes(countryCode) && countryCode !== defaultLanguage) {
                    updateUrlWithLanguageCode(countryCode, languageCodes);
                } else if (countriesGermanLanguage.includes(countryCode) && languageCodes.includes('de')) {
                    updateUrlWithLanguageCode('de', languageCodes);
                } else if (countriesDutchLanguage.includes(countryCode) && languageCodes.includes('nl')) {
                    updateUrlWithLanguageCode('nl', languageCodes);
                } else if (countriesFrenchLanguage.includes(countryCode) && languageCodes.includes('fr')) {
                    updateUrlWithLanguageCode('fr', languageCodes);
                } else if (countriesChineseLanguage.includes(countryCode) && languageCodes.includes('zh')) {
                    updateUrlWithLanguageCode('zh', languageCodes);
                } else if (countriesSpanishLanguage.includes(countryCode) && languageCodes.includes('es')) {
                    updateUrlWithLanguageCode('es', languageCodes);
                } else if (countriesPortugueseLanguage.includes(countryCode) && languageCodes.includes('pt')) {
                    updateUrlWithLanguageCode('pt', languageCodes);
                } else if (countriesRussianLanguage.includes(countryCode) && languageCodes.includes('ru')) {
                    updateUrlWithLanguageCode('ru', languageCodes);
                } else if (countryCode == 'se' && languageCodes.includes('sv')) {
                    updateUrlWithLanguageCode('sv', languageCodes);
                } else if (countryCode == 'cz' && languageCodes.includes('cs')) {
                    updateUrlWithLanguageCode('cs', languageCodes);
                } else if (countryCode == 'jp' && languageCodes.includes('ja')) {
                    updateUrlWithLanguageCode('ja', languageCodes);
                } else if (countryCode == 'cn' && languageCodes.includes('zh')) {
                    updateUrlWithLanguageCode('zh', languageCodes);
                }
                else {
                    redirectToDefaultLanguage(defaultLanguage, activeLanguage);
                }

            })
            .catch(error => {
                // Вывод информации об ошибке в консоль, если что-то пошло не так
                console.error('Error:', error);
            });

        /* fetch end =========================== */
    }
}


function updateUrlWithLanguageCode(countryCode, languageCodes) {
    const attemptedLanguage = localStorage.getItem('attemptedLanguage');

    // Проверяем, была ли уже попытка перенаправления на этот языковый код
    if (attemptedLanguage === countryCode) return;


    // Получение текущего пути страницы
    const pathname = window.location.pathname;

    let newUrl;
    // Проверка, находимся ли мы на главной странице
    if (pathname === '/' || pathname === '') {
        newUrl = window.location.origin + '/' + countryCode + '/';
    } else {
        const pathSegments = pathname.split('/');

        // Замена или вставка языкового кода в URL
        if (languageCodes.includes(pathSegments[1])) {
            pathSegments[1] = countryCode;
        } else {
            pathSegments.splice(1, 0, countryCode);
        }

        // Собираем обратно новый URL
        newUrl = window.location.origin + pathSegments.join('/');
    }

    // Сохраняем попытку перенаправления в localStorage
    localStorage.setItem('attemptedLanguage', countryCode);

    // Перенаправление на новый URL, если он отличается от текущего
    if (window.location.href !== newUrl) {
        window.location.href = newUrl;
    }
}

function redirectToDefaultLanguage(defaultLanguage, activeLanguage) {
    if (activeLanguage === defaultLanguage) return;

    const attemptedLanguage = localStorage.getItem('attemptedLanguage');

    // Проверяем, была ли уже попытка перенаправления на этот языковый код
    if (attemptedLanguage === defaultLanguage) return;

    // Получение текущего пути страницы
    const pathname = window.location.pathname;

    let newUrl;


    if (pathname === '/' || pathname === '') {
        // Если мы на главной странице и текущий язык не дефолтный
        newUrl = window.location.origin + '/';
    } else {
        // Разбиение текущего URL на сегменты
        const pathSegments = pathname.split('/');
        // Удаляем код языка из URL 
        pathSegments.splice(1, 1); // Удаляем сегмент языка

        newUrl = window.location.origin + '/' + pathSegments.slice(1).join('/');
    }

    // Сохраняем попытку перенаправления в localStorage
    localStorage.setItem('attemptedLanguage', defaultLanguage);

    // Перенаправление на новый URL, если он отличается от текущего
    if (window.location.href !== newUrl) {
        window.location.href = newUrl;
    }
}

addEventListener('DOMContentLoaded', function () {
    // Нахождение всех языковых ссылок на странице
    const languageLinks = document.querySelectorAll('[data-redirect] a');

    // Добавление обработчика события на каждую найденную ссылку
    languageLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Отменяем действие по умолчанию (переход по ссылке)
            event.preventDefault();

            // Устанавливаем значение в localStorage
            localStorage.setItem('languageChangedManually', true);

            // Выполняем переход по ссылке после установки значения
            window.location.href = link.href;
        });
    });
});
