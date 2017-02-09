Запустить сборку тестового проекта:

```sh
npm run enb
```

При обходе блоков порядок не гарантируется!

## Технологии

- [dev-declaration](#dev-declaration) - генерирует `bemdecl.js` для заданного набора сущностей;
- [dev-page-bemjson](#dev-page-bemjson) - генерирует `bemjson` для отладочной страницы;                                                         
- [js-test](#js-test) - сборка бандлов с тестами;
- [sandbox](#sandbox) - сборка бандлов с кодом "песочницы";
- [phantom-testing](#phantom-testing) - выполнение тестов в phantomjs;
- [empty-test-result](#empty-test-result) - генерация пустого результата выполнения тестов без их запуска;
- [transporter](#transporter) - трансформация отдельных файлов цепочкой обработчиков.                                                                              

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
Если код предварительно был инструментировн, в результирующий файл будет также записана информация о покрытии кода тестами.

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

### empty-test-result

Технология формирует пустой файл с результатами тестов в формате технологии [phantom-testing](#phantom-testing). При создании можно передать параметр `needCoverage` - если передать значение `true`, в результирующий файл будет добавлен zero-coverage report (считаем, что весь код не покрыт тестами). 

Данная технология нужна для получения отчета о результатах тестов без их запуска, если заранее известно, что в бандле нет тестов.

#### Опции

- `String` **[target]** — Результирующий таргет. По умолчанию `?.test-result.json`.
- `BlockFilter` **[filter]** — Фильтр по названию блока и уровням переопределения. По умолчанию - не указан.

#### Пример

```js
const dev = require('direct-dev');

// указываем, что нужно добавить в результат информацию 
// о нулевом покрытии кода тестами
const needCoverage = true;               

// при формировании информации о покрытии будем учитывать только 
// код конкретного блока и только на заданных уровнях
const filter = new dev.BlockFilter(
    { targetBlock: 'block-name', targetLevels: ['source.blocks'] },
    { rootPath: config.getRootPath() }
);

nodeConfig.addTech([
    dev.techs.emptyTestResult(needCoverage),
    {
        target: '?.test-result.json',
        filter: filter
    }]);
```

### transporter

Технология склеивает исходные файлы в один, предварительно выполняя обработку каждого отдельного файла цепочкой обработчиков. 

#### Опции

- `String` **[target]** — Результирующий таргет. По умолчанию `?.merged.js`.
- `Object|Array` **[apply]** — Обработчик или массив обработчиков, которые будут применяться к каждому файлу.

#### Обработчики

Обработчики - это функции, получаюшие на вход поток объектов `{ path: 'путь-к-файлу', contents: 'строка'}`, и трансформирующие его в новый поток объектов  в таком же формате. После применения всех обработчиков содержимое потока склеивается в один файл и считается результатом сборки ENB-таргета.
В пакете доступны два плагина:

- **coverage** - инструментирует js файлы с помощью библиотеки [istanbul](https://github.com/gotwarlost/istanbul);
- **wrap** - добавляет заданные строки в начало и конец обрабатываемого файла. Доступны плейсхолдеры `${relative}` (относительный путь к текущему файлу) и `${path}` (абсолютный путь).

#### Пример

Инструментирование выбранных файлов:

```js
const dev = require('direct-dev');

const filter = vinyl => true;   // TODO: add business logic

nodeConfig.addTech([
    dev.techs.transporter('js', { noCache: true }),
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
