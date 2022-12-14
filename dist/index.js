class AnyCoder {
    static encode(data, prefix) {
        function unicode_escape(c) {
            let s = c.charCodeAt(0).toString(16);
            while (s.length < 4)
                s = '0' + s;
            return '\\u' + s;
        }
        if (!prefix)
            prefix = '';
        switch (typeof data) {
            case 'object':
                if (data == null)
                    return 'null';
                let i, before, after;
                const indent = prefix + '    ', pieces = [];
                if (data instanceof Array) {
                    for (i = 0; i < data.length; i++)
                        pieces.push(AnyCoder.encode(data[i], indent));
                    before = '[\n';
                    after = ']';
                }
                else {
                    for (i in data)
                        pieces.push(i + ': ' + AnyCoder.encode(data[i], indent));
                    before = '{\n';
                    after = '}';
                }
                return (before +
                    indent +
                    pieces.join(',\n' + indent) +
                    '\n' +
                    prefix +
                    after);
            case 'string':
                data = data
                    .replace(/\\/g, '\\\\')
                    .replace(/'/g, '\\"')
                    .replace(/\n/g, '\\n')
                    .replace(/\r/g, '\\r')
                    .replace(/\t/g, '\\t')
                    .replace(/[\x00-\x19]/g, unicode_escape);
                return '"' + data + '"';
            default:
                if (data.hasOwnProperty('toString'))
                    throw new Error(`stopped code injection`);
                return String(data).replace(/\n/g, '\n' + prefix);
        }
    }
    static decode(string) {
        return new Function('return ' + string)();
    }
}
export default AnyCoder;
