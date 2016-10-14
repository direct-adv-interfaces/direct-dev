# dev-page

Отладочная страница. Пустая страница, на страницу можно подключить код/стили блоков и отладочный код.

## Модификатор `type`

Определяет тип отладочной страницы. Допустимые значения: `'test'`, `'sandbox'`.

**test**

Страница для запуска тестов. Автоматически добавляет в зависимости блоки `dev-jquery`, `dev-mocha`, `dev-chai`, 
`dev-sinon`. Также на страницу автоматически рендерится код запуска тестов через mocha/mocha-phantomjs.


```js
{
    block: 'dev-page',
    mods: { type: 'test' },
    refs: {
        js: 'index.js',
        devJs: 'index.test.js',
        css: 'index.css'
    }
}
```

**sandbox**

Страница-песочница для независимой разработки блоков. Автоматически добавляет в зависимости блок `dev-sandbox` для
инициализации песочницы, реализованной в технологии `.sandbox.js`.

```js
{
    block: 'dev-page',
    mods: { type: 'sandbox' },
    refs: {
        js: 'index.js',
        devJs: 'index.sandbox.js',
        css: 'index.css'
    }
}
```
