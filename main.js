function ellipsis(str, len) {
    if (typeof str !== 'string') {
        console.warn('ellipsis: not a string', str);
        return str;
    }
    return (str.length > len) ? str.substr(0, len - 2) + '…' : str;
}

function $(q) {
    return document.querySelector(q);
};
