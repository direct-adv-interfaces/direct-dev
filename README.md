Запустить сборку тестового проекта:
```
npm run enb
```

При обходе блоков порядок не гарантируется!


## Технологии

### dev-declaration

Генерирует декларацию бандла (bemdecl.js), содержащю заданный список БЭМ-сущностей.

#### Опции

- *String* [target] — Результирующий таргет. По умолчанию `?.bemdecl.js`.
- *String[]* [entities] — Список имен сущностей (в соответствии с правилами именования БЭМ).

#### Пример

```js
 var techs = require('direct-dev').techs;

 nodeConfig.addTech(techs.devDeclaration, {
     target: '?.bemdecl.js',
     entities: ['block1', 'block1__elem2']
 });
```

## Блоки

...

## Утилиты

...
