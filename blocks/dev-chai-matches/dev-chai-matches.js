(function(global) {

    global.expect || (global.expect = chai.expect);

    var Assertion = chai.Assertion;

    /**
     * Наличие модификатора
     *
     * expect(block).to.haveMod(block.elem('inner'), 'elem-mod-name');
     * expect(block).to.not.haveMod(block.elem('inner'), 'elem-mod-name');
     *
     * expect(block).to.haveMod(block.elem('inner'), 'elem-mod-name', 'elem-mod-val');
     * expect(block).to.not.haveMod(block.elem('inner'), 'elem-mod-name', 'elem-mod-val');
     *
     * expect(block).to.haveMod('state');
     * expect(block).to.not.haveMod('state');
     *
     * expect(block).to.haveMod('state', 'bla');
     * expect(block).to.not.haveMod('state', 'bla');
     *
     * @param {Object} [elem]
     * @param {String} modName
     * @param {String} [modVal]
     * @public
     */
    function haveMod(elem, modName, modVal) {
        var len = arguments.length,
            block = this._obj,
            who,
            actModVal;

        if (len == 2 && typeof elem == 'string') {
            modVal = arguments[1];
            modName = arguments[0];

            elem = undefined;
        } else if (len == 1) {
            modName = arguments[0];
            elem = undefined;
        }

        who = elem ? 'element of block' : 'block';
        actModVal = elem ? block.getMod(elem, modName) : block.getMod(modName);

        !modVal ?
            this.assert(
                elem ? block.hasMod(elem, modName) : block.hasMod(modName),
                '\nexpect: ' + who + ' has modifier #{exp}' +
                '\nactual: ' + who + ' don`t has modifier #{exp}',
                '\nexpect: ' + who + ' don`t has modifier #{exp}' +
                '\nactual: ' + who + ' has modifier #{exp} with the value #{act}',
                modName,
                actModVal
            ) :
            this.assert(
                elem ? block.hasMod(elem, modName, modVal) : block.hasMod(modName, modVal),
                '\nexpect: ' + who + ' has modifier \'' + modName + '\' with the value #{exp}' +
                '\nactual: ' + who + ' has modifier \'' + modName + '\' with the value #{act}',
                '\nexpect: ' + who + ' don`t has modifier \'' + modName + '\' with the value#{exp}' +
                '\nactual: ' + who + ' has modifier \'' + modName + '\' with the value #{act}',
                modVal,
                actModVal
            );
    }

    /**
     * Существование|Отсутствие одного элемента в DOM-дереве
     *
     * expect(block).to.haveElem('action');
     * expect(block).to.not.haveElem('action');
     *
     * expect(block).to.haveElem('action', 'state', 'current');
     *
     * @param {String} name
     * @param {String} [modName]
     * @param {String} [modVal]
     * @public
    */
    function haveElem(name, modName, modVal) {
        return modName ?
            haveElems.call(this, name, modName, modVal, 1) :
            haveElems.call(this, name, 1);
    }

    /**
     * Существование|Отсутствие элементов в DOM-дереве
     *
     * expect(block).to.haveElems('action');
     * expect(block).to.not.haveElems('action');
     *
     * expect(block).to.haveElems('action', 3);
     *
     * @param {String} name
     * @param {String} [modName]
     * @param {String} [modVal]
     * @param {Number} [count]
     * @public
     */
    function haveElems(name, modName, modVal, count) {
        var block = this._obj,
            currentCount;

        if (modName && typeof modName == 'string') {
            currentCount = block.findElem(name, modName, modVal).length;
            name = [name, modName, modVal].join('_');
        } else {
            currentCount = block.findElem(name).length;
            count = modName;
        }

        if (arguments.length % 2) {
            // не передан параметр count
            this.assert(
                currentCount > 0,
                '\nexpect: element #{exp} exist\nactual: element #{exp} don`t exist',
                '\nexpect: element #{exp} don`t exist\nactual: element #{exp} exist',
                name
            );
        } else {
            // передан параметр count
            this.assert(
                currentCount === count,
                '\nexpect: element #{exp} found ' + count + ' times' +
                '\nактуально: элемент #{exp} found #{act} times',
                '\nожидается: элемент #{exp} not found ' + count + ' times' +
                '\nактуально: элемент #{exp} found #{act} times',
                name,
                currentCount
            );
        }
    }

    /**
     * Триггер BEM-событий блока
     *
     * @example
     * После создания блока
     * expect(block).to.triggerEvent('new-goal');
     * expect(block).to.triggerEvent(0, 'new-goal');
     * expect(block).to.triggerEvent('new-goal', { goal: 1 });
     * expect(block).to.triggerEvent(1, 'new-goal', { goal: 1 });
     * expect(block).to.triggerEvent('new-goal', function() { block.trigger('new-goal) });
     * expect(block).to.triggerEvent(2, 'new-goal', function() { block.trigger('new-goal) });
     * expect(block).to.triggerEvent('new-goal', { goal: 1 }, function() { block.trigger('new-goal', { goal: 1 }) });
     * expect(block).to.triggerEvent(3, 'new-goal', { goal: 1 }, function() { block.trigger('new-goal', { goal: 1 }) });
     *
     * До создания блока
     * expect(BEM.blocks['b-block']).to.triggerEvent('popup-content-inited');
     * expect(BEM.blocks['b-block']).to.triggerEvent('popup-content-inited', { empty: true });
     * expect(BEM.blocks['b-block']).to.triggerEvent('popup-content-inited', function() { block.trigger('popup-content-inited') });
     * expect(BEM.blocks['b-block']).to.triggerEvent('popup-content-inited', { empty: true }, function() { block.trigger('popup-content-inited', { empty: true }) });
     *
     * @param {Number} [eventIndex] индекс события блока начиная с 0
     * @param {String} event название события
     * @param {Object} [data] данные передаваемые в событие
     * @param {Function} [actionCallback] функция, выполнение которой вызовет ожидаемое событие
     * @public
     *
     */
    function triggerEvent(eventIndex, event, data, actionCallback) {
        var block = this._obj,
            args = Array.prototype.slice.call(arguments),
            newEvent,
            newData,
            called,
            triggerCall;

        // (event, ...) -> (eventIndex, event, ...)
        if (typeof args[0] !== 'number') {
            args.unshift(0);
        }

        // (eventIndex, event, actionCallback) -> (eventIndex, event, data, actionCallback)
        if (typeof args[2] === 'function') {
            args[3] = args[2];

            delete args[2];
        }

        eventIndex = args[0];
        event = args[1];
        data = args[2];
        actionCallback = args[3];

        if (actionCallback) {
            sinon.spy(block, 'trigger');
            actionCallback();
        } else {
            if (!block.trigger.id) {
                throw new TypeError('The test is not enough sinon.spy(\'trigger\')');
            }
        }

        triggerCall = block.trigger.getCall(eventIndex);

        data && triggerCall && (newData = triggerCall.args[1]);

        called = block.trigger.called && block.trigger.callCount > eventIndex;

        this.assert(
            called,
            '\nexpect: block triggered event \'' + event + (data ? ' с \'#{exp}\'' : '') +
            '\nactual: block not triggered event',
            '\nexpect: block not triggered event' +
            '\nactual: block triggered event \'' + event + (newData ? ' с \'#{act}\'' : ''),
            data,
            newData
        );

        if (!called) return;

        newEvent = triggerCall.args[0].type || triggerCall.args[0];

        if (data) {
            this.assert(
                newEvent === event && u._.isEqual(data, newData),
                '\n' +
                'expect: block triggered event \'' + event + '\' с \'#{exp}\'\n' +
                'actual: block triggered event \'' + newEvent + '\' с \'#{act}\'',
                '',
                data,
                newData
            );

        } else {
            this.assert(
                newEvent === event,
                '\n' +
                'expect: block triggered event #{exp}\n' +
                'actual: block triggered event #{act}',
                '',
                event,
                newEvent
            );
        }

        if (actionCallback) {
            block.trigger.restore();
        }
    }

    /**
     * Существование|Отсутствие одного блока внутри
     *
     * expect(block).to.haveBlock('input');
     * expect(block).to.not.haveBlock('input');
     *
     * expect(block).to.haveBlock('name', { block: 'input', modName: 'disabled', modVal: 'yes' });
     *
     * @param {String|jQuery} [elem]
     * @param {String|Object} blockParams
     * @param {String} blockParams.block
     * @param {String} blockParams.modName
     * @param {String} blockParams.modVal
     * @public
    */
    function haveBlock(elem, blockParams) {
        return arguments.length == 2 ?
            haveBlocks.call(this, elem, blockParams, 1) :
            haveBlocks.call(this, elem, 1);
    }

    /**
     * Существование|Отсутствие блоков внутри
     *
     * expect(block).to.haveBlocks('input');
     * expect(block).to.not.haveBlocks('input');
     *
     * expect(block).to.haveBlocks('input', 3);
     *
     * @param {String|jQuery} [elem]
     * @param {String|Object} blockParams
     * @param {String} blockParams.block
     * @param {String} blockParams.modName
     * @param {String} blockParams.modVal
     * @param {Number} [count]
     * @public
     */
    function haveBlocks(elem, blockParams, count) {
        if (arguments.length == 2) {
            if (typeof blockParams === 'number') {
                // не передан элемент
                count = blockParams;
                blockParams = elem;
                elem = undefined;
            }
            //else { не передано кол-во элементов }
        } else if (arguments.length == 1) {
            blockParams = elem;
            elem = undefined;
        }

        var block = this._obj,
            currentCount = block
                .findBlocksInside(elem && (typeof elem === 'string' ? block.findElem(elem) : elem), blockParams)
                .length,
            countExist = typeof count !== 'undefined',
            blockName = typeof blockParams === 'string' ?
                blockParams :
                BEM.INTERNAL.buildClass(blockParams.block, blockParams.modName, blockParams.modVal);

        if (countExist) {
            this.assert(
                currentCount === count,
                '\nexpect: block #{exp} found ' + count + ' times' +
                '\nactual: block #{exp} not fund #{act} times',
                '',
                blockName,
                currentCount
            );
        } else {
            this.assert(
                currentCount > 0,
                '\nexpect: block #{exp} exict\nactual: element #{exp} don`t exist',
                '\nexpect: block #{exp} don`t exist\nactual: element #{exp} exist',
                blockName
            );
        }
    }

    Assertion.addMethod('haveMod', haveMod);
    Assertion.addMethod('haveElem', haveElem);
    Assertion.addMethod('haveElems', haveElems);
    Assertion.addMethod('haveBlock', haveBlock);
    Assertion.addMethod('haveBlocks', haveBlocks);
    Assertion.addMethod('triggerEvent', triggerEvent);

}(window));
