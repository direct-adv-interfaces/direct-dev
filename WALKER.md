# Walker

Walker - это консольная утилита, с помощью которой вы можете настроить сборку на основе информации о блоках своего проекта (названия блоков, их элементы и модификаторы, используемые технологии), а не только на основе фиксированного конфигурационного файла.

Это может быть полезно, например, если вы хотите собрать отдельный HTML файл с документацией (jsdoc) *для каждого блока* своего проекта.

При запуске Walker обходит все блоки вашего проекта и генерирует на основе этой информации некоторый результат с помощью плагинов (что именно будет сгенерировано - записит от выбранного плагина).

С помощью Walker вы можете обрабатывать любые файлы, структура которых совпадает с файловой структурой БЭМ-блоков. Например, вы можете обработать бандлы, собранные при помощи ENB.

## Конфигурационный файл

При запуске Walker использует настройки, указанные в конфигурационном файле `.direct-dev.js`, расположенном в текущей папке. Этот файл имеет следующий формат:

```js
module.exports = {
    levels: [ 'path/to/level', ... ],   // уровни переопределения
    handler: 'path/to/plugin',          // запускаемый плагин
    handlerConfig: { ... }              // настройки запускаемого плагина
};
```

Если необходимо запускать Walker с несколькими наборами настроек, вы можете определить в конфигурационном файле именованные профили и при запуске Walker указать профиль, настройки из которого необходимо использовать.

```js
module.exports = {
    levels: [ 'path/to/level', ... ],   // уровни переопределения
    handler: 'path/to/plugin',          // запускаемый плагин
    handlerConfig: { ... }              // настройки запускаемого плагина
    profiles: {
        profile1: { ... },
        profile2: { ... },
        ...
    }
};
```

При запуске настройки из корня конфигурационного файла будут доопределены настройками заданного профиля, если он был указан.

## Как запустить

```
$ node direct-dev/lib/walker-cli
```

Использовать настройки из заданного профиля:

```
$ node direct-dev/lib/walker-cli -p profile1
```

Обрабатывать только заданный блок:

```
$ node direct-dev/lib/walker-cli -b block-name
```


## Доступные плагины

### test-bundler

Формирует параметры для сборки бандлов с тестами. Для каждого блока собирается отдельный бандл.

На выходе выдает JSON файл, содержащий параметры сборки бандлов в следующем формате:

```js
[
    {
        block: 'block-name',  // название блока
        path: 'path/to/bundles/block-name',  // папка для бандла
        entities: ['block-name', 'block-name__elem'],  // БЭМ-сущности блока
        hasTests: true  // признак, что у блока есть тесты (реализован в технологии test.js)
    },
    ...
]
```

#### Параметры плагина

- `{String} resultPath` - путь, по которому будет сохранен результирующий JSON файл;
- `{String} baseBundlePath` - папка, в которой нужно собирать бандлы;
- `{String[]} devEntities` - дополнительные БЭМ-сущности, которые нужно добавить в декларацию каждого бандла;
- `{Object} defaultBundleConfig` - содержимое по умолчанию.
— `{String} testTechnology` — имя технологии, в которой хранятся тесты. По умолчанию `test.js` 

#### Пример использования

```js
module.exports = {
    levels: [ ... ],
    handler: 'direct-dev/lib/tools/walker-plugins/test-bundler',
    handlerConfig: {
        resultPath: 'example-project/bundles.json',
        baseBundlePath: 'example-project/desktop.bundles',
        devEntities: ['dev-page', 'dev-page_type_test'],
        testTechnology: `test.js`,
        defaultBundleConfig: {
            target: '?.test-result.json'
        }
    }
};
```

### test-reporter

Формирует отчет о результатах выполнения модульных тестов. Информацию о тестах ищет в технологии `test-result.json` каждого блока/бандла. Выводит информацию в консоль и в teamcity.

#### Параметры плагина

- `{String} reporter` - формат вывода результата: console|teamcity;
- `{Boolean} displayEmpty` - признак: включать в отчет блоки без тестов;
- `{Boolean} throwError` - признак: генерировать ошибку, если есть упавшие тесты.

#### Пример использования

```js
module.exports = {
    levels: [ ... ],
    handler: 'direct-dev/lib/tools/walker-plugins/test-reporter',
    handlerConfig: {
        reporter: 'teamcity',
        displayEmpty: true,
        throwError: true
    }
};
```

### coverage-reporter

Формирует отчет о покрытии кода тестами. Информацию о тестах ищет в технологии `test-result.json` каждого блока/бандла. Выводит информацию в консоль, в teamcity и в HTML файлы.

#### Параметры плагина

- `{String} reporter` - формат вывода результата: console|teamcity|html.

#### Пример использования

```js
module.exports = {
    levels: [ ... ],
    handler: 'direct-dev/lib/tools/walker-plugins/coverage-reporter',
    handlerConfig: {
        reporter: 'teamcity'
    }
};
```

### forbidden-blocks

Проверяет, что в проекте нет блоков с именами из заданного списка.

#### Параметры плагина

- `{String} reporter` - формат вывода результата: console|teamcity.
- `{String[]} names` - список запрещенных названий блоков.
- `{Boolean} throwError` - завершать ли процесс с ошибкой.

#### Пример использования

```js
module.exports = {
    levels: [ ... ],
    handler: 'direct-dev/lib/tools/walker-plugins/forbidden-blocks',
    handlerConfig: {
        names: ['b4', 'b3', 'b2'],
        reporter: 'teamcity',
        throwError: false
    }
};
```

## Создание собственных плагинов

Плагин представляет собой класс, реализующий два метода:

- `eachBlock(blockData, blockName)` - формирует результат для отдельного блока
- `allBlocks(data)` - формирует общий результат для всех блоков

**Внимание! При обходе блоков порядок не гарантируется!**

#### Пример

```js
class PluginName {

    /**
     * @param config - Настройки плаигна (handlerConfig)
     */
    constructor(config = {}) {
        this.config = config;
    }

    /**
     * @param {Object} blockData - Информация о блоке
     * @param {Object} blockData.techs - Технологии, в которых реализован блок (ключ - технология, значение - массив путей к файлам)
     * @param {Object} blockData.entities - БЭМ-сущности блока (ключ - ID БЭМ-сущности, значение - объект, аналогичный полю "techs", но для конкретной БЭМ-сущности)
     * @param {String} blockName - Название блока
     */
    eachBlock(blockData, blockName) {
        return {
            block: blockName,
            entities: Object.keys(blockData.entities),
            hasTests: !!blockData.techs['test.js']
        };
    }

    /**
     * @param {Object[]} data - Массив объектов, полученных из метода "eachBlock"
     */
    allBlocks(data) {
        fs.writeFile(this.config.path, JSON.stringify(data));
    }
}
```
