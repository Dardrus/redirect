const languageChangedManually = localStorage.getItem('languageChangedManually');

// Определение языков для стран в виде объекта
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
	ja: ['jp'],
	zh: ['cn'],
};

function initRedirect(defaultLanguage, languageCodes, activeLanguage) {
	// Проверка, не изменялся ли язык вручную
	if (languageChangedManually == null) {
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

				// Проверка, существует ли версия сайта для страны пользователя и что это не активная версия
				let languageCode = getLanguageCodeForCountry(countryCode, languageCodes);

				if (languageCode && languageCode !== activeLanguage && languageCode !== defaultLanguage) {
					updateUrlWithLanguageCode(languageCode, languageCodes);
				}

				if(languageCode == defaultLanguage) {
					redirectToDefaultLanguage(defaultLanguage);
				}
			})
			.catch(error => {
				// Вывод информации об ошибке в консоль, если что-то пошло не так
				console.error('Error:', error);
			});
	}
}

// Функция для определения языкового кода для страны
function getLanguageCodeForCountry(countryCode, languageCodes) {
	if (languageCodes.includes(countryCode)) {
		return countryCode;
	}

	for (let [language, countries] of Object.entries(countryLanguageMap)) {
		if (countries.includes(countryCode) && languageCodes.includes(language)) {
			return language;
		}
	}
	return null;
}

function updateUrlWithLanguageCode(languageCode, languageCodes) {
	const attemptedLanguage = localStorage.getItem('attemptedLanguage');

	// Проверяем, была ли уже попытка перенаправления на этот языковый код
	if (attemptedLanguage === languageCode) return;

	// Получение текущего пути страницы
	const pathname = window.location.pathname;

	let newUrl;
	// Проверка, находимся ли мы на главной странице
	if (pathname === '/' || pathname === '') {
		newUrl = window.location.origin + '/' + languageCode + '/';
	} else {
		const pathSegments = pathname.split('/');

		// Замена или вставка языкового кода в URL
		if (languageCodes.includes(pathSegments[1])) {
			pathSegments[1] = languageCode;
		} else {
			pathSegments.splice(1, 0, languageCode);
		}

		// Собираем обратно новый URL
		newUrl = window.location.origin + pathSegments.join('/');
	}

	// Сохраняем попытку перенаправления в localStorage
	localStorage.setItem('attemptedLanguage', languageCode);

	// Перенаправление на новый URL, если он отличается от текущего
	if (window.location.href !== newUrl) {
		window.location.href = newUrl;
	}
}

function getCurrentLanguage(languageCodes, defaultLanguage) {
	const pathname = window.location.pathname;
	// Извлечение части URL после первого слэша
	const languageSegment = pathname.split('/')[1]; // Получаем сегмент между первыми двумя слэшами

	// Проверка, существует ли такой языковой код
	if (languageCodes.includes(languageSegment)) {
		return languageSegment;
	} else {
		return defaultLanguage;
	}
}

function redirectToDefaultLanguage(defaultLanguage) {
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

function getCurrentLanguage() {
	const pathname = window.location.pathname;
	// Извлечение части URL после первого слэша
	const languageSegment = pathname.split('/')[1]; // Получаем сегмент между первыми двумя слэшами

	// Проверка, существует ли такой языковой код
	if (languageCodes.includes(languageSegment)) {
		return languageSegment;
	} else {
		return defaultLanguage;
	}
}
