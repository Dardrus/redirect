# redirect.js

`redirect.js` - это JavaScript-библиотека, предназначенная для перенаправления пользователя на подходящую языковую версию сайта на основе его страны.

## Подключение для сайтов без админ панели (без WP, статические сайты)

### Шаг 1: Подключите скрипт на вашу веб-страницу

Добавьте следующий код перед закрывающим тегом `</head>` на вашем сайте:

```html
<script src="https://cdn.jsdelivr.net/gh/Dardrus/redirect@v1.0.2/script.js"></script>
```

### Шаг 2: Создайте локальный файл `redirect.js`

Создайте файл `redirect.js` в директории `js` вашего сайта и подключите его следующим образом:

```html
<script src="js/redirect.js"></script>
```

### Шаг 3: Инициализируйте перенаправление

Откройте файл `redirect.js` и добавьте в него следующий код для инициализации скрипта:

```javascript
const defaultLanguage = 'en'; // Язык по умолчанию на сайте
const languageCodes = ['en', 'es', 'pl']; // Список поддерживаемых языков на сайте
const activeLanguage = getCurrentLanguage(); // Автоматическое определение текущего языка пользователя

initRedirect(defaultLanguage, languageCodes, activeLanguage);
```

## Подключение для сайтов на WP + плагин "polylang"

### Шаг 1: Подключите скрипт на вашу веб-страницу

Добавьте следующий код перед закрывающим тегом `</head>` на вашем сайте:

```html
<script src="https://cdn.jsdelivr.net/gh/Dardrus/redirect@v1.0.2/script.js"></script>
<script type="text/javascript">
    // Получение данных о языках из PHP и передача в JavaScript на основе плагина `polylang`
    initRedirect(
        '<?php echo pll_default_language("slug"); ?>',
        <?php echo json_encode(pll_languages_list(array('fields' => 'slug'))); ?>,
        '<?php echo pll_current_language("slug"); ?>'
    );
</script>
```
Готово, все очеень просто!

## Важно!
### Обязательным условием корректной работы `redirect.js` является присвоение атрибута `data-redirect` для списка языков в HTML разметке.

Например:

```html
<ul class="lang-list" data-redirect>
    <li class="lang-item">
        <a class="lang-link" href="/"></a>
    </li>
    <li class="lang-item">
        <a class="lang-link" href="/es"></a>
    </li>
    <li class="lang-item">
        <a class="lang-link" href="/pl"></a>
    </li>
</ul>
```

С помощью этих настроек ваш сайт сможет автоматически перенаправлять пользователя на нужную языковую версию, основываясь на его геолокации:))
