import { _decorator, Component, Node, log, warn, error } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Logger')
export class Logger extends Component {
    public static Log(...data: any[]){
        log(...data);
    }

    public static Warn(...data: any[]){
        warn(...data);
    }

    public static Error(...data: any[]){
        error(...data);
    }

    public static ConsoleLog(...data: any[]){
        console.log(...data);
    }

    public static ConsoleWarn(...data: any[]){
        console.warn(...data);
    }
}


