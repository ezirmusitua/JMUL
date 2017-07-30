GM_xmlhttpRequest = window.GM_xmlhttpRequest;

const FnMethodNameMap = {
    'abort': 'onabort',
    'failed': 'onerror',
    'fail': 'onerror',
    'error': 'onerror',
    'loaded': 'onload',
    'load': 'onload',
    'success': 'onload',
    'onload': 'onload',
    'progress': 'onprogress',
    'onprogress': 'onprogress',
    'ready': 'onreadystatechange',
    'readystatechange': 'onreadystatechange',
    'onreadystatechange': 'onreadystatechange',
    'timeout': 'ontimeout',
    'ontimeout': 'ontimeout',
};

const MethodNameMap = {
    'get': 'GET',
    'Get': 'GET',
    'GET': 'GET',
    'post': 'POST',
    'Post': 'POST',
    'POST': 'POST',
    'head': 'HEAD',
    'Head': 'HEAD',
    'HEAD': 'HEAD',
    'delete': 'DELETE',
    'Delete': 'DELETE',
    'DELETE': 'DELETE',
    'patch': 'PATCH',
    'Patch': 'PATCH',
    'PATCH': 'PATCH',
    'put': 'PUT',
    'Put': 'PUT',
    'PUT': 'PUT',
};

class JMRequestHeader {
    constructor(headers) {
        if (headers instanceof JMRequestHeader) {
            headers = headers.value();
        }
        this.headerObj = headers;
    }

    option(key, value) {
        this.headerObj[key] = value;
        return this;
    } // chain
    setAccept(value) {
        this._accept = this.headerObj.accept = value;
        return this;
    }

    setAcceptCharset(value) {
        this.acceptCharset = this.headerObj['Accept-Charset'] = value;
        return this;
    }

    setAcceptEncoding(value) {
        this.acceptEncoding = this.headerObj['Accept-Encoding'] = value;
        return this;
    }

    setAge(value) {
        this.age = this.headerObj.age = value;
        return this;
    }

    setAuthorization(value) {
        this.authorization = this.headerObj.Authorization = value;
        return this;
    }

    setContentEncoding(value) {
        this.contentEncoding = this.headerObj['Content-Encoding'] = value;
        return this;
    }

    setContentLength(value) {
        this.contentLength = this.headerObj['Content-Length'] = value;
        return this;
    }

    setContentType(value) {
        this.contentType = this.headerObj['Content-Type'] = value;
        return this;
    }

    setCookie(value) {
        this.cookie = this.headerObj.Cookie = value;
        return this;
    }

    setUA(value) {
        this.ua = this.headerObj['User-Agent'] = value;
        return this;
    }

    value() {
        return this.headerObj;
    }
}

class JMRequest {
    constructor(options) {
        this._method = options.method && MethodNameMap[options.method] || 'GET';
        this._url = options.url || '';
        this.options = {};
        this.options.headers = new JMRequestHeader(options.headers || {});
        for (let key of Object.keys(options)) {
            if (FnMethodNameMap[key] && typeof options[key] === 'function') {
                this.options[FnMethodNameMap[key]] = options[key];
            }
        }
        this.options.data = this.handleRequestData(options.data)
    }

    handleRequestData(data) {
        if (!data) return '';
        const contentType = this.options.headers.contentType;
        if (!contentType || contentType === 'application/json') {
            return JMRequest.toJsonData(data);
        } else if (contentType === 'application/x-www-form-urlencoded') {
            return JMRequest.toFormData(data);
        } else {
            // treat other as plain/text, do not support multipart/form-data
            return data.toString();
        }
    }

    setMethod(_method) {
        this._method = MethodNameMap[_method];
        return this;
    }

    setUrl(_url) {
        this._url = _url;
        return this;
    }

    setHeaders(headers) {
        this.options.headers = headers;
        return this;
    }

    setData(obj) {
        this.options.data = this.handleRequestData(obj);
        return this;
    }

    load(fn) {
        this.options.onload = fn;
        return this;
    }

    error(fn) {
        this.options.onerror = fn;
        return this;
    }

    timeout(fn) {
        this.options.ontimeout = fn;
        return this;
    }

    readyStateChange(fn) {
        this.options.onreadystatechange = fn;
        return this;
    }

    abort(fn) {
        this.options.onabort = fn;
        return this;
    }

    progress(fn) {
        this.options.onprogress = fn;
        return this;
    }

    send() {
        return JMRequest.request(this._method, this._url, this.options);
    }

    static toFormData(data) {
        if (typeof data === 'string') {
            return data;
        } else {
            let result = '';
            for (let key of Object.keys(data)) {
                result += key + '=' + data[key] + '&';
            }
            return result.slice(0, -1);
        }
    }

    static toJsonData(data) {
        if (typeof data === 'object') {
            return JSON.stringify(data);
        } else {
            return data;
        }
    }

    static request(method, url, options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: MethodNameMap[method],
                url: url,
                headers: options.headers,
                data: options.data,
                onreadystatechange: (response) => {
                    if (!options.onreadystatechange) return console.log('on ready state change. ');
                    const fn = options.onreadystatechange;
                    (!fn.then ? Promise.resolve(fn(response)) : fn(response)).then(function (res) {
                        resolve(res);
                    });
                },
                onabort: (response) => {
                    if (!options.onabort) {
                        console.error('on abort. ');
                        reject({cause: 'abort'});
                    } else {
                        const fn = options.onabort;
                        (!fn.then ? Promise.resolve(fn(response)) : fn(response)).then(function (res) {
                            resolve(res);
                        });
                    }

                },
                onerror: (response) => {
                    if (!options.onerror) {
                        console.error('on error. ');
                        reject({cause: 'error', response: response});
                    } else {
                        const fn = options.onerror;
                        (!fn.then ? Promise.resolve(fn(response)) : fn(response)).then(function (res) {
                            resolve(res);
                        });
                    }
                },
                onprogress: (response) => {
                    if (!options.onprogress) return console.log('on progress. ');
                    const fn = options.onprogress;
                    (!fn.then ? Promise.resolve(fn(response)) : fn(response)).then(function (res) {
                        resolve(res);
                    });
                }
                ,
                ontimeout: (response) => {
                    if (!options.ontimeout) {
                        console.error('on timeout. ');
                        reject({cause: 'timeout', response: response});
                    }
                    const fn = options.ontimeout;
                    (!fn.then ? Promise.resolve(fn(response)) : fn(response)).then(function (res) {
                        resolve(res);
                    });
                },
                onload: (response) => {
                    if (!options.onload) {
                        console.log('on load. ');
                        resolve(response);
                    } else {
                        const fn = options.onload;
                        (!fn.then ? Promise.resolve(fn(response)) : fn(response)).then(function (res) {
                            resolve(res);
                        });
                    }
                },
            })
        });
    }

    static get(url, options) {
        return JMRequest.request('GET', url, options);
    }

    static post(url, options) {
        return JMRequest.request('POST', url, options);
    }

    static put(url, options) {
        return JMRequest.request('PUT', url, options);
    }

    static delete(url, options) {
        return JMRequest.request('DELETE', url, options);
    }

    static head(url, options) {
        return JMRequest.request('HEAD', url, options);
    }

    static patch(url, options) {
        return JMRequest.request('PATCH', url, options);
    }
}

module.exports = {
    Request: JMRequest,
    Header: JMRequestHeader,
};