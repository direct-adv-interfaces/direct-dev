# direct-dev

[direct-dev](https://www.npmjs.com/package/direct-dev) - это набор инфраструктурных инструментов для стека технологий [БЭМ](https://ru.bem.info), написанных командой фронтенда сервиса [Яндекс.Директ](https://direct.yandex.ru). Он содержит набор JavaScript модулей и консольных утилит, помогающих собирать различные артефакты, полезные во время разработки: модульные и [gemini](https://gemini-testing.github.io) тесты, документацию, страницы с примерами блоков.

Пакет включает:

- [Walker](WALKER.md) - утилита, с помощью которой вы можете динамически настроить сборку на основе информации о блоках своего проекта.
- [Плагины (технологии)](TECHS.md) для сборщика [ENB](https://ru.bem.info/toolbox/enb/) - выполняют сборку бандлов.
- [Вспомогательные блоки](BLOCKS.md) для сборки тестов и страниц с примерами продуктовых блоков.

**Внимание!** В версии 2.0.0 ENB технология `phantom-testing` перенесена в отдельный npm пакет [enb-phantom-testing](https://www.npmjs.com/package/enb-phantom-testing).

## Установка

```
npm install direct-dev -D
```
