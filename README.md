Запустить сборку тестового проекта:
```sh
npm run enb
```

При обходе блоков порядок не гарантируется!


## Технологии

### dev-declaration

Генерирует декларацию бандла (bemdecl.js), содержащю заданный список БЭМ-сущностей.

#### Опции

- `String` **[target]** — Результирующий таргет. По умолчанию `?.bemdecl.js`.
- `String[]` **[entities]** — Список имен сущностей (в соответствии с правилами именования БЭМ).

#### Пример

```js
const dev = require('direct-dev');

nodeConfig.addTech([
    dev.techs.devDeclaration, 
    {
        target: '?.bemdecl.js',
        entities: ['block1', 'block1__elem2']
    }]);
```

### dev-page-bemjson

Генерирует bemjson для отладочной страницы. В результате получается файл bemjson.js, содержащий блок `dev-page` с заданными параметрами.

Используя полученный bemjson, можно сгенерировать HTML-разметку отладочной страницы с помощью технологии **bemjson-to-html** из пакета [enb-bemxjst](https://github.com/enb/enb-bemxjst/blob/master/api.ru.md#bemjson-to-html).

#### Опции

- `String` **[target]** — Результирующий таргет. По умолчанию `?.bemjson.js`.
- `String` **[block]** — Название корневого блока. По умолчанию `dev-page`.
- `String` **[type]** — Значение модификатора `type`.
- `String` **[js]** — js-таргет для подключения к странице.
- `String` **[devJs]** — js-таргет для подключения к странице вспомогательного кода (например, тестов).
- `String` **[css]** — css-таргет для подключения к странице.

Если указаны значения параметров **css**, **js**, **devJs**,  то перед сборкой bemjson отлалочной страницы будут собраны указанные таргеты. 

#### Пример

```js
const dev = require('direct-dev');

nodeConfig.addTech([
    dev.techs.devPageBemjson, 
    {
        target: '?.bemjson.js',
        type: 'test',
        js: '?.js',
        devJs: '?.test.js',
        css: '?.css'
    }]);
```

### js-test

Собирает бандл с кодом тестов. Включает туда содержимое файлов `.test.js`, соответствующих заданному фильтру. 

#### Опции

- `String` **[target]** — Результирующий таргет. По умолчанию `?.test.js`.
- `BlockFilter` **[filter]** — Фильтр по названию блока и уровням переопределения. По умолчанию - не указан.

#### Пример

```js
const dev = require('direct-dev');

const filter = new dev.BlockFilter(
    { targetBlock: 'block-name', targetLevels: ['source.blocks'] },
    { rootPath: config.getRootPath() }
);

nodeConfig.addTech([
    dev.techs.jsTest, 
    { 
        target: '?.test.js', 
        filter: filter 
    }]);
```

### sandbox
 
Собирает бандл для песочницы. Включает туда содержимое файлов .sandbox.js, обернутое в служебный код песочницы.

#### Опции

- `String` **[target]** — Результирующий таргет. По умолчанию `?.sandbox.js`.
- `BlockFilter` **[filter]** — Фильтр по названию блока и уровням переопределения. По умолчанию - не указан.

#### Пример

```js
const dev = require('direct-dev');

const filter = new dev.BlockFilter(
    { targetBlock: 'block-name', targetLevels: ['source.blocks'] },
    { rootPath: config.getRootPath() }
);

nodeConfig.addTech([
    dev.techs.sandbox, 
    { 
        target: '?.sandbox.js', 
        filter: filter 
    }]);
```

### phantom-testing

Технология принимает на вход html-файл с тестами и передает его программе mocha-phantomjs. Результат в формате JSON записываеся в файл.

#### Опции

- `String` **[target]** — Результирующий таргет. По умолчанию `?.test-result.json`.
- `String` **[html]** — Таргет страницы с тестами, которая будет передана в phantomjs. По умолчанию `?.html`. Указанный таргет будет собран автоматически перед запуском тестов.

#### Пример

```js
const dev = require('direct-dev');

nodeConfig.addTech([
    dev.techs.phantomTesting,
    {
        target: '?.test-result.json',
        html: '?.html'
    }]);
```

### transporter

Технология склеивает исходные файлы в один, предварительно выполняя обработку каждого отдельного файла цепочкой обработчиков. 

#### Опции

- `String` **[target]** — Результирующий таргет. По умолчанию `?.merged.js`.
- `Object|Array` **[apply]** — Обработчик или массив обработчиков, которые будут применяться к каждому файлу.

#### Обработчики

В качестве обработчиков используются плагины для [gulp](http://gulpjs.com). Также в пакете доступны два дополнительных плагина:

- **coverage** - инструментирует js файлы с помощью библиотеки [istanbul](https://github.com/gotwarlost/istanbul);
- **wrap** - добавляет заданные строки в начало и конец обрабатываемого файла. Доступны плейсхолдеры `${relative}` (относительный путь к текущему файлу) и `${path}` (абсолютный путь).

#### Пример

Генерация js кода с данными из json файла:

```js
const dev = require('direct-dev');

nodeConfig.addTech([
    dev.techs.transporter('json'),              // ищем все файлы .json
    {
        target: '?.json.js',                    // собираем бандл ?.json.js
        apply: dev.transporterPlugins.wrap({ 
            before: 'GLOBAL_DATA.push(',        // добавляем в начало
            after: ');'                         // добавляем в конец
        })
    }]);
```

Инструментирование выбранных файлов:

```js
const dev = require('direct-dev');

const filter = vinyl => true;   // TODO: add business logic

nodeConfig.addTech([
    dev.techs.transporter('js'),
    {
        target: '?.js',
        apply: [
            dev.transporterPlugins.coverage({ filter }),  // инструментируем только нужные файлы
            dev.transporterPlugins.wrap({                 // добавляем комментарии в начало и конец
                before: '/* begin: ${relative} */', 
                after: '/* end: ${relative} */' }) 
        ]
    }]);
```


## Блоки

...

## Утилиты

### require2

### BlockFilter

### Walker

...
