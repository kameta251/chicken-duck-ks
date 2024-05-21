import { _decorator, CCBoolean, Component, director, Enum, Node } from 'cc';
import { Logger } from '../Util/Logger';
import { ByteSDK } from './ByteSDK';
import { OnDmHandleModule } from './Handle/OnDmHandleModule';
const { ccclass, property } = _decorator;

enum SDKType {
    Byte = 1
}
export enum GameProgress {
    /**游戏刚启动 */
    GP_None = 0,
    /**已获取直播间RoomID，Token，和前一百排行榜 */
    GP_Token = 1,
    /**主播端：游戏启动前准备 */
    GP_PreGame = 2,
    /**正在加载资源 */
    GP_Loading = 3,
    /**进入游戏场景 */
    GP_OnGame = 4,
    /**游戏进行中 */
    GP_Gaming = 5,
    /**观众启动准备 */
    GP_PreAudience = 10,
}

@ccclass('NetManager')
export class NetManager extends Component {
    static _instance: NetManager;
    static get instance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new NetManager();
        return this._instance
    }

    OnDmHandleModule: OnDmHandleModule
    ByteSDK: ByteSDK
    //token获取不到roomid的弹窗
    @property({type:Node})
    TokenWin: Node

    onLoad() {
        NetManager._instance = this
        director.addPersistRootNode(this.node)
        director.addPersistRootNode(this.ReConneted)
        if (!this.CurSDK) { Logger.ConsoleWarn(`未选择使用当前SDK`) }
        this.OnDmHandleModule = new OnDmHandleModule()
        this.ByteSDK = new ByteSDK()
        this.ByteSDK.OnLoad();
        this.OnDmHandleModule.OnLoad()
    }

    update() {
        this.OnDmHandleModule.OnUpdate()
    }

    @property({ type: Enum(SDKType) })
    public CurSDK: SDKType
    @property({ type: CCBoolean, displayName: '*使用线上接口' })
    public isOnlineMode: boolean;
    @property({ type: CCBoolean, displayName: '*编辑器启动' })
    public isEditor: boolean
    @property({type: Node})
    public ReConneted: Node
    public CurProgress: GameProgress = GameProgress.GP_None

    /**直接连ws */
    async ByteSDKLogin() {
        this.ByteSDK.WebSocketConnect();
    }

    /**获取前X名世界排行 */
    SendGetWorldRank(){
        this.ByteSDK.SendGetWorldRank()
        this.ByteSDK.SendGetWorldRankAndLastWorldRank()
    }

    /**解码 */
    DeCode(msg: string): string {
        let dmjson = JSON.parse(msg)
        if (dmjson.cmdCode == 0 || dmjson.data == null) { return dmjson }
        let dataarr = dmjson.data.toString().replace(/ /g, '').split(',');
        let uint8Array = new Uint8Array(dataarr.map(byte => parseInt(byte)));
        let arrayBuffer = uint8Array.buffer;
        let data = NetManager.instance.ByteSDK.BinaryTostring(arrayBuffer)
        try {
            dmjson.data = JSON.parse(data);
        } catch (e) {
            console.error('JSON 解析错误：' + data);
        }

        switch (dmjson.cmdMerge) {
            case 720897:
                let valuesarr = dmjson.data.values.toString().replace(/ /g, '').split(',');
                let values_uint8Array = new Uint8Array(valuesarr.map(byte => parseInt(byte)));
                let values_arrayBuffer = values_uint8Array.buffer;
                let values = NetManager.instance.ByteSDK.BinaryTostring(values_arrayBuffer)
                /**分割字符串 */
                let str_720897 = values.split(`{"data"`)
                //删除数组的第一个元素,修复}
                str_720897.shift();for(let i = 0;i<str_720897.length;i++){str_720897[i] = `{"data"` + str_720897[i]}
                let result_720897 = str_720897.map(item => JSON.parse(item));
                dmjson.data.values = result_720897
                break
            case 720909:
                let valuesarr_720909 = dmjson.data.values.toString().replace(/ /g, '').split(',');
                let values_uint8Array_720909 = new Uint8Array(valuesarr_720909.map(byte => parseInt(byte)));
                let values_arrayBuffer_720909 = values_uint8Array_720909.buffer;
                let values_720909 = NetManager.instance.ByteSDK.BinaryTostring(values_arrayBuffer_720909)
                if(values_720909.length<1){return dmjson}
                /**分割字符串 */
                let str_720909 = values_720909.split(`}`)
                //删除数组的最后一个元素,修复}
                str_720909.pop();for(let i = 0;i<str_720909.length;i++){str_720909[i] += `}`}
                let result_720909 = str_720909.map(item => JSON.parse(item));
                dmjson.data.values = result_720909
                break
            case 720903:
                let valuesarr_720903 = dmjson.data.values.toString().replace(/ /g, '').split(',');
                let values_uint8Array_720903 = new Uint8Array(valuesarr_720903.map(byte => parseInt(byte)));
                let values_arrayBuffer_720903 = values_uint8Array_720903.buffer;
                let values_720903 = NetManager.instance.ByteSDK.BinaryTostring(values_arrayBuffer_720903)
                if(values_720903.length<1){return dmjson}
                /**分割字符串 */
                let str_720903 = values_720903.split(`}`)
                //删除数组的最后一个元素,修复}
                str_720903.pop();for(let i = 0;i<str_720903.length;i++){str_720903[i] += `}`}
                let result_720903 = str_720903.map(item => JSON.parse(item));
                dmjson.data.values = result_720903
                break
            case 720910:
                break
            case 720911:
                let valuesarr_720911 = dmjson.data.values.toString().replace(/ /g, '').split(',');
                let values_uint8Array_720911 = new Uint8Array(valuesarr_720911.map(byte => parseInt(byte)));
                let values_arrayBuffer_720911 = values_uint8Array_720911.buffer;
                let values_720911 = NetManager.instance.ByteSDK.BinaryTostring(values_arrayBuffer_720911)
                if(values_720911.length<1){return dmjson}
                /**分割字符串 */
                let str_720911 = values_720911.split(`}`)
                //删除数组的最后一个元素,修复}
                str_720911.pop();for(let i = 0;i<str_720911.length;i++){str_720911[i] += `}`}
                let result_720911 = str_720911.map(item => JSON.parse(item));
                dmjson.data.values = result_720911
                break
        }
        return dmjson
    }

    InitFail(){
        
        if(NetManager.instance.isEditor){return}
        this.TokenWin.active = true
    }

    /**打码 */
    EnCode(ReqObj: string, data: string) {
        let dataArray = this.ByteSDK.stringToBinary(JSON.parse(data))
        let ReqJson = JSON.parse(ReqObj)
        ReqJson.data = `[` + dataArray + `]`
        return this.ByteSDK.stringToBinary(ReqJson.toString())
    }
}


