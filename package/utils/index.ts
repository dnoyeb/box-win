const isElement = (e: unknown): e is Element => {
    if (typeof Element === 'undefined') return false
    return e instanceof Element
}

const isString = (str: unknown) => {
    return typeof (str) === "string" ? true : false;
}

export const getAppendTo = (appendTo: any) => {
    let _appendTo
    if (!appendTo) {
        _appendTo = document.body
    } else if (isString(appendTo)) {
        _appendTo = document.querySelector<HTMLElement>(appendTo)
        // should fallback to default value with a warning
        if (!isElement(_appendTo)) {
            _appendTo = document.body
        }
    }
    return _appendTo
}