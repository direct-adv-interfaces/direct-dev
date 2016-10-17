module.exports = {
    bemjson: {
        block: 'b1',
        count: 7
    },
    init: function(container) {

        for (var i = 0; i < this.bemjson.count; i++) {
            container.innerHTML += '<div><strong>hello!</strong></div>';
        }
    }
};
