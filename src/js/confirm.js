/**
 * --------------------------------------------------------------------------
 * Bootstrap Confirm (v0.0.1): confirm.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'
import Util from './util'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME               = 'confirm'
const VERSION            = '0.0.1'
const DATA_KEY           = 'bs.confirm'
const EVENT_KEY          = `.${DATA_KEY}`
const DATA_API_KEY       = '.data-api'
const JQUERY_NO_CONFLICT = $.fn[NAME]

const Default = {
    title       : 'Confirmation',
    text        : 'Are you sure want to do the action?',
    ask         : false,
    btnConfirm  : 'Yes',
    btnType     : 'primary',
    btnCancel   : 'Cancel'
}

const DefaultType = {
    title       : 'string',
    text        : 'string',
    ask         : 'boolean',
    btnConfirm  : 'string',
    btnType     : 'string',
    btnCancel   : 'string'
}

const Event = {
    MODAL_HIDDEN        : 'hidden.bs.modal',
    SUBMIT_DATA_API     : `submit${EVENT_KEY}${DATA_API_KEY}`,
    CLICK_DATA_API      : `click${EVENT_KEY}${DATA_API_KEY}`,
    ACCEPT_DATA_API     : `click.modal.${EVENT_KEY}${DATA_API_KEY}`,

    FORM_SUBMIT         : 'submit',
    A_CLICK             : 'click'
}

const ClassName = {
    
}

const Selector = {
    DATA_TOGGLE    : '[data-toggle="confirm"]',
    MODAL_ACCEPTER : '[data-accept="confirm"]'
}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Confirm {
    constructor(element, config) {
        this._config                = this._getConfig(config)
        this._element               = element
        this._modal                 = null
        this._isConfirmed           = null
        this._tagName               = element.tagName.toUpperCase()
        this._eventType             = this._tagName == 'A' ? Event.CLICK_DATA_API : Event.SUBMIT_DATA_API
        this._execEvent             = this._tagName == 'A' ? Event.A_CLICK : Event.FORM_SUBMIT
        this._isShown               = false

        this._addElementListener()
    }

    // Getters

    static get VERSION() {
        return VERSION
    }

    static get Default() {
        return Default
    }

    // Public

    ask(el, event){
        if(this._isConfirmed)
            return;
        
        this._isConfirmed = false;

        if(event)
            event.preventDefault()

        this._showModal()
    }

    cancel(){
        this._isConfirmed = false;
        if(this._modal)
            $(this._modal).modal('hide')
    }

    dispose() {
        [window, this._element]
            .forEach((htmlElement) => $(htmlElement).off(EVENT_KEY))

        $.removeData(this._element, DATA_KEY)

        this._config                = null
        this._element               = null
        this._modal                 = null
        this._isConfirmed           = null
        this._tagName               = null
        this._eventType             = null
        this._isShown               = null
    }

    // Private

    _addElementListener(){
        if(this._tagName === 'FORM' || !this._element.dataset.toggle){
            $(this._element).on(this._eventType, (event) => {
                this.ask(this, event)
            })
        }
    }

    _getConfig(config) {
        config = {
            ...Default,
            ...config
        }
        Util.typeCheckConfig(NAME, config, DefaultType)
        return config
    }

    _showModal(){
        let tx = `
            <div class="modal fade" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${this._config.title}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>${this._config.text}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">${this._config.btnCancel}</button>
                            <button type="button" class="btn btn-${this._config.btnType}" data-accept="confirm">${this._config.btnConfirm}</button>
                        </div>
                    </div>
                </div>
            </div>
        `

        this._modal = $(tx).appendTo(document.body).get(0)
        $(this._modal).on(Event.MODAL_HIDDEN, () => {
            this._isConfirmed = false;
            $(this._modal).remove()
        })

        $(this._modal).on(Event.ACCEPT_DATA_API, Selector.MODAL_ACCEPTER, () => {
            this._isConfirmed = true
            this._element[this._execEvent]()
            this.cancel()
        })

        $(this._modal).modal('show')
    }

    // Static

    static _jQueryInterface(config, relatedTarget) {
        return this.each(function () {
            let data = $(this).data(DATA_KEY)
            const _config = {
                ...Default,
                ...$(this).data(),
                ...typeof config === 'object' && config ? config : {}
            }

            if (!data) {
                data = new Confirm(this, _config)
                $(this).data(DATA_KEY, data)
            }

            if (typeof config === 'string') {
                if (typeof data[config] === 'undefined') {
                    throw new TypeError(`No method named "${config}"`)
                }
                data[config](relatedTarget)
            } else if (_config.ask) {
                data.ask(relatedTarget)
            }
        })
    }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    let data = $(this).data(DATA_KEY)
    if(!data){
        let target = this

        const config = $(target).data(DATA_KEY)
            ? 'ask' : {
                ...$(target).data(),
                ...$(this).data(),
                ...{ask:true}
            }
        event.preventDefault()
        Confirm._jQueryInterface.call($(target), config, this)
    }else{
        data.ask(this, event)
    }
})

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Confirm._jQueryInterface
$.fn[NAME].Constructor = Confirm
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT
  return Confirm._jQueryInterface
}

export default Confirm