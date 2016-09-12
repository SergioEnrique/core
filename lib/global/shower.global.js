import EventEmitter from '../emitter/emitter';
import Plugins from './plugins';

const inited = [];

/**
 * @name shower
 * @class
 * @static
 */
export default sh = {
    /**
     * Ready function will call callback when Shower init.
     * If Shower already initialized, callback will call immediately.
     *
     * @param {function} [callback] Your function that run after Shower initialized.
     * It will be call with shower.
     * @returns {boolean} Ready state.
     *
     * @example
     * shower.ready(function (sh) {
     *     sh.go(2);
     * });
     */
    ready(callback) {
        if (callback) {
            if (inited.length) {
                inited.forEach(callback);
            } else {
                this.events.once('init', function (e) {
                    callback(e.get('shower'));
                });
            }
        }

        return Boolean(inited.length);
    },

    /**
     * Init new Shower.
     * @param {object} [initOptions]
     * @param {(HTMLElement|string)} [initOptions.container='.shower']
     * @param {object} [initOptions.options]
     * @param {function} [initOptions.callback]
     * @param {object} [initOptions.context]
     *
     * @example
     * shower.init({
     *     contaner: '.my-shower',
     *     callback: this._onShowerInit,
     *     context: this
     * });
     */
    init(initOptions) {
        initOptions = initOptions || {};

        shower.modules.require(['Shower'], function (Shower) {
            new Shower(initOptions.container, initOptions.options);
        });
    },

    /**
     * @returns {Shower[]} Array of shower players.
     */
    getInited() {
        return inited.slice();
    }
};

/**
 * @name shower.plugins
 * @field
 * @type {Plugins}
 */
sh.events = new EventEmitter({context: sh});

/**
 * @name shower.events
 * @field
 * @type {Emitter}
 */
sh.plugins = new Plugins(sh);

sh.events.on('notify', function (e) {
    var showerInstance = e.get('shower');
    inited.push(showerInstance);
    sh.events.emit('init', e);
});


export const defaultOptions = {
    containerSelector: '.shower',
    debugMode: false,
    debugModeClassName: 'debug',

    hotkeys: true,
    sessionstoreKey: 'shower',

    slidesSelector: '.shower .slide',

    modeFullClassName: 'full',
    modeListClassName: 'list',

    slideTitleElementSelector: 'H2',
    slideActiveClassName: 'active',
    slideVisitedClassName: 'visited'
};
