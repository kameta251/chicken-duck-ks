var uni;

export interface SocketTask {
    onMessage(callback: (data: { data: string | ArrayBuffer }) => void): void;
    send(options: { data: string | ArrayBuffer; success?: () => void; fail?: () => void; complete?: () => void }): void;
    close(options: { code?: number; reason?: string; success?: () => void; fail?: () => void; complete?: () => void }): void;
    onOpen(callback: () => void): void;
    onClose(callback: (data: { code?: number; reason?: string }) => void): void;
    onError(callback: (data: { errMsg: string }) => void): void;
}

class H5SocketTask implements SocketTask {
    constructor(public socket: WebSocket) {

    }
    _onmessage: ((data: { data: string | ArrayBuffer; }) => void)
    // _send: { data: string | ArrayBuffer; success?: () => void; fail?: () => void; complete?: () => void; }
    // _close: { code?: number; reason?: string; success?: () => void; fail?: () => void; complete?: () => void; }
    _onopen: (() => void)
    _onclose: (data: { code?: number; reason?: string; }) => void
    _onerror: (data: { errMsg: string; }) => void


    onMessage(callback: (data: { data: string | ArrayBuffer; }) => void): void {
        this._onmessage = callback;
    }
    send(options: { data: string | ArrayBuffer; success?: () => void; fail?: (any?) => void; complete?: () => void; }): void {
        try {
            this.socket.send(options.data)
            options?.success()
        } catch (error) {
            options?.fail(error)
        }
    }
    close(options: { code?: number; reason?: string; success?: () => void; fail?: (any) => void; complete?: () => void; }): void {
        // console.log(`客户端主动关闭ws`) 
        // try {
        //     this.socket.close()
        //     options?.success()
        // } catch (error) {
        //     options?.fail(error)
        // }
    }
    onOpen(callback: () => void): void {
        this._onopen = callback;
    }
    onClose(callback: (data: { code?: number; reason?: string; }) => void): void {
        this._onclose = callback;
    }
    onError(callback: (data: { errMsg: string; }) => void): void {
        this._onerror = callback;
    }

}

interface ConnectSocketOptions {
    url: string;
    protocols?: string | string[]
}


if (globalThis['ks']) {
    uni = globalThis['ks']
} else if (globalThis['tt']) {
    uni = globalThis['tt']
} else if (globalThis['wx']) {
    uni = globalThis['wx']
} else {
    uni = {
        request(options) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.open(options.method || 'GET', options.url);
                xhr.timeout = options.timeout || 0;

                xhr.onload = () => {
                    const headers = xhr.getAllResponseHeaders();
                    const cookies = headers
                        .split('\n')
                        .filter(h => h.startsWith('Set-Cookie:'))
                        .map(h => h.split(';')[0].substr(12));
                    const response = {
                        data: JSON.parse(xhr.response),
                        statusCode: xhr.status,
                        header: headers,
                        cookies: cookies
                    };
                    if (options.success) {
                        options.success(response)
                    }
                    resolve(response);
                };

                xhr.onerror = (err) => {
                    if (options.fail) {
                        options.fail(err);
                    }
                    reject(new Error('Network error'));
                };

                xhr.ontimeout = (err) => {
                    if (options.fail) {
                        options.fail(err);
                    }
                    reject(new Error('Timeout error'));
                };

                if (options.header) {
                    Object.keys(options.header).forEach(key => {
                        xhr.setRequestHeader(key, options.header[key]);
                    });
                }

                if (options.data) {
                    let data = options.data;
                    if (typeof data === 'object') {
                        data = JSON.stringify(data);
                    }
                    xhr.send(data);
                } else {
                    xhr.send();
                }
            });
        },
        connectSocket(options: ConnectSocketOptions): SocketTask {
            const socket = new WebSocket(options.url, options.protocols);
            socket.binaryType = 'arraybuffer';
            var task = new H5SocketTask(socket);

            socket.onopen = (event) => {
                task?._onopen()
            };

            socket.onmessage = (event) => {
                task?._onmessage({data:event.data})
            };

            socket.onclose = (event) => {
                task?._onclose({ code: event.code, reason: event.reason });
            };

            socket.onerror = (event) => {
                task?._onerror({ errMsg: event["message"] });
            };
            return task;
        }
    }
}

export { uni };

