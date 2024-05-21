import { _decorator, Component, Node } from 'cc';
import { SocketTask, uni } from './PLATFORM';
import { GameProgress, NetManager } from './NetManager';
import { Logger } from '../Util/Logger';
import { GameManager } from '../Manager/GameManager';
import { Player } from '../Manager/PlayerManager';
const { ccclass, property } = _decorator;
// const danmu_tt_token = "QToda/UMhBMp3d6XvMUzQ9wWqsFC7+qmbG7oDCNoWP2wegQdgUPuCMpfEt0CW/RzoTxZ3VFVH9thMyR1ECe8kVOOPD3yi6hm9ptTdVcar0srqCKO5Ye37lpP6ps="
const danmu_tt_token = globalThis['danmuSystem']?.danmuRoomCode

@ccclass('ByteSDK')
export class ByteSDK extends Component {

    LiveRoomId: string = `9527`
    anchorOpenId: string = "_000s_XG0HT84Bkqz8EfZy31L2HnZ3PY9sXF"
    anchorName: string = ``
    anchorAvatarurl: string = ``
    gamecode: string = "JY"

    OnLoad() {
    }

    private socketTask: SocketTask;
    WebSocketConnect() {
        this.socketTask = uni.connectSocket({
            url: NetManager.instance.isOnlineMode ?
                "wss://game.qizi-networks.com/websocket" :
                "wss://game-test.qizi-networks.com/websocket",
        });

        this.socketTask?.onOpen(async () => {
            NetManager.instance.CurProgress = GameProgress.GP_Token;
            Logger.ConsoleLog("WebSocket 已连接");
            this.schedule(this.SendPingPong, 4)
            NetManager.instance.ByteSDK.SendLoginRpc()
            NetManager.instance.ReConneted.active = false
            NetManager.instance.ByteSDK.GetGameConfig()
        });

        this.socketTask?.onClose(() => {              //服务器链接断开回调
            Logger.ConsoleLog("WebSocket 已断开");

            this.ReConneting()
        });

        this.socketTask?.onMessage((message) => {
            let dm = this.BinaryTostring(message.data as ArrayBuffer)
            let data = NetManager.instance.DeCode(dm)
            Logger.ConsoleLog("WebSocket 接收信息:", data);
            NetManager.instance.OnDmHandleModule.DistributeMsg(data)
        })

        this.socketTask?.onError((error) => {
            Logger.ConsoleLog("WebSocket 发生错误:", error);
            this.ReConneting()
        });
    }

    /**初始化ws */
    SendLoginRpc() {
        let data: string = `{
            "gamecode": "${NetManager.instance.ByteSDK.gamecode}",
            "platform": "DouYin",
            "version":"1.0",
            "token": "${danmu_tt_token}"
        }`
        let ReqObj: string = `{
            "cmdCode": 1,
            "cmdMerge": 720896,
            "data": [${this.stringToBinary(data)}]
        }`

        // let Req = NetManager.instance.EnCode(ReqObj,data)
        let Req = this.stringToBinary(ReqObj)

        this.socketTask?.send({
            data: Req,
            success: () => {
                let parm: string = `{
                    "cmdCode": 1,
                    "cmdMerge": 720896,
                    "data": ${data}
                }`
                Logger.ConsoleLog("Socket发送InitReq成功", JSON.parse(parm));
                NetManager.instance.CurProgress = GameProgress.GP_PreGame;
            },
            fail: (err?) => {
                Logger.ConsoleLog("Socket发送InitReq失败", err);
            },
        })
    }

    /**礼物置顶 */
    SendGiftRpc() {
        let data: string = `{
            "gamecode": "${NetManager.instance.ByteSDK.gamecode}",
            "platform": "DouYin",
            "version":"1.0",
            "roomid": "${this.LiveRoomId}"
        }`
        let ReqObj: string = `{
            "cmdCode": 1,
            "cmdMerge": 720906,
            "data": [${this.stringToBinary(data)}]
        }`
        let Req = this.stringToBinary(ReqObj)
        this.socketTask?.send({
            data: Req,
            success: () => {
                let req = JSON.parse(ReqObj)
                req.data = JSON.parse(data)
                Logger.ConsoleLog("Socket发送ttGiftRpc成功", req);
            },
            fail: () => {
                Logger.ConsoleLog("Socket发送ttGiftRpc失败");
            },
        })
    }

    /**心跳 */
    SendPingPong() {
        let ReqObj: string = `{"cmdCode":0}`
        let Req = this.stringToBinary(ReqObj)
        this.socketTask?.send({
            data: Req,
            success: () => {
                Logger.ConsoleLog("Socket发送数据成功", JSON.parse(ReqObj));
            },
            fail: () => {
                Logger.ConsoleLog("Socket发送数据失败");
            },
        })
    }

    /**断线重连 */
    ReConneting() {
        NetManager.instance.ReConneted.active = true
        this.socketTask = uni.connectSocket({
            url: NetManager.instance.isOnlineMode ?
                "wss://game.qizi-networks.com/websocket" :
                "wss://game-test.qizi-networks.com/websocket",
        });
        this.socketTask?.onOpen(async () => {
            Logger.ConsoleLog("WebSocket 已连接");
            NetManager.instance.ByteSDK.SendReConnetRpc()
            NetManager.instance.ReConneted.active = false
        });
        this.socketTask?.onClose(() => {              //服务器链接断开回调
            Logger.ConsoleLog("WebSocket 已断开");

            this.ReConneting()
        });

        this.socketTask?.onMessage((message) => {
            let dm = this.BinaryTostring(message.data as ArrayBuffer)
            let data = NetManager.instance.DeCode(dm)
            Logger.ConsoleLog("WebSocket 接收信息:", data);
            NetManager.instance.OnDmHandleModule.DistributeMsg(data)
        })

        this.socketTask?.onError((error) => {
            Logger.ConsoleLog("WebSocket 发生错误:", error);
            this.ReConneting()
        });
    }
    /**重连化 */
    SendReConnetRpc() {
        let data: string = `{
            "gamecode": "${NetManager.instance.ByteSDK.gamecode}",
            "platform": "DouYin",
            "version":"1.0",
            "roomid": "${this.LiveRoomId}"
        }`
        let ReqObj: string = `{
            "cmdCode": 1,
            "cmdMerge": 720896,
            "data": [${this.stringToBinary(data)}]
        }`
        let Req = this.stringToBinary(ReqObj)

        this.socketTask?.send({
            data: Req,
            success: () => {
                let parm: string = `{
                    "cmdCode": 1,
                    "cmdMerge": 720896,
                    "roomid": ${this.LiveRoomId}
                }`
                Logger.ConsoleLog("Socket发送InitReq成功", JSON.parse(parm));
            },
            fail: (err?) => {
                Logger.ConsoleLog("Socket发送InitReq失败", err);
            },
        })
    }

    /**获取配置表 */
    GetGameConfig() {
        let data: string = `{
            "gamecode": "${NetManager.instance.ByteSDK.gamecode}",
            "platform": "DouYin",
            "version":"1.0",
            "roomid": "${this.LiveRoomId}"
        }`
        let ReqObj: string = `{
            "cmdCode": 1,
            "cmdMerge": 720908,
            "data": [${this.stringToBinary(data)}]
        }`
        let Req = this.stringToBinary(ReqObj)

        this.socketTask?.send({
            data: Req,
            success: () => {
                let parm: string = `{
                    "cmdCode": 1,
                    "cmdMerge": 720908,
                    "roomid": ${this.LiveRoomId}
                }`
                Logger.ConsoleLog("Socket发送GetGameConfig成功", JSON.parse(parm));
            },
            fail: (err?) => {
                Logger.ConsoleLog("Socket发送GetGameConfig失败", err);
            },
        })
    }

    Test() {
        let data: string = `{"gamecode":"JW","name":"showlike","platform":"DouYin","version":"1.0"}`
        let ReqObj: string = `{
            "cmdCode": 1,
            "cmdMerge": 720905,
            "data": [${this.stringToBinary(data)}]
        }`
        let Req = this.stringToBinary(ReqObj)

        this.socketTask?.send({
            data: Req,
            success: () => {
                let req = JSON.parse(ReqObj)
                req.data = JSON.parse(data)
                Logger.ConsoleLog("Socket发送Test成功", req.data);
            },
            fail: () => {
                Logger.ConsoleLog("Socket发送Test失败");
            },
        })
    }

    /**開啟、查詢、關閉抖音對服務端的推送能力 */
    SendttPushRpc(msgTypeIndex: number, typeIndex: number) {
        let msgType = [`all`, `live_like`, `live_comment`, `live_gift`]
        let type = [`start`, `query`, `stop`]
        let data: string = `{
            "gamecode": "${NetManager.instance.ByteSDK.gamecode}",
            "platform": "DouYin",
            "version":"1.0",
            "roomid":"${this.LiveRoomId}",
            "msgType": "${msgType[msgTypeIndex]}",
            "type": "${type[typeIndex]}"
        }`
        let dataArray = this.stringToBinary(data)
        let ReqObj: string = `{
            "cmdCode": 1,
            "cmdMerge": 720897,
            "data": [${dataArray}]
        }`
        let Req = this.stringToBinary(ReqObj)
        this.socketTask?.send({
            data: Req,
            success: () => {
                let req = JSON.parse(ReqObj)
                req.data = JSON.parse(data)
                Logger.ConsoleLog("Socket发送ttPushReq成功", req);
            },
            fail: () => {
                Logger.ConsoleLog("Socket发送ttPushReq失败");
            },
        })
    }

    /**发送开始游戏 */
    SendGameStart() {
        let data: string = `{
            "gamecode": "JW",
            "platform": "DouYin",
            "version":"1.0",
            "roomid": "${NetManager.instance.ByteSDK.LiveRoomId}",
            "anchorOpenId":"${NetManager.instance.ByteSDK.anchorOpenId}"
        }`
        let ReqObj: string = `{
            "cmdCode": 1,
            "cmdMerge": 720898,
            "data": [${this.stringToBinary(data)}]
        }`
        let Req = this.stringToBinary(ReqObj)
        this.socketTask?.send({
            data: Req,
            success: () => {
                let req = JSON.parse(ReqObj)
                req.data = JSON.parse(data)
                Logger.ConsoleLog("Socket发送ttGameStart成功", req);
            },
            fail: () => {
                Logger.ConsoleLog("Socket发送ttGameStart失败");
            },
        })
    }

    /**查询本周世界排行前百 */
    SendGetWorldRank() {
        let data: string = `{
            "gamecode": "${NetManager.instance.ByteSDK.gamecode}",
            "platform": "DouYin",
            "version":"1.0",
            "roomid": "${this.LiveRoomId}"
        }`
        let ReqObj: string = `{
            "cmdCode": 1,
            "cmdMerge": 720903,
            "data": [${this.stringToBinary(data)}]
        }`
        let Req = this.stringToBinary(ReqObj)
        this.socketTask?.send({
            data: Req,
            success: () => {
                let req = JSON.parse(ReqObj)
                req.data = JSON.parse(data)
                Logger.ConsoleLog("Socket发送ttGetWorldRank成功", req);
            },
            fail: () => {
                Logger.ConsoleLog("Socket发送ttGetWorldRank失败");
            },
        })
    }

    /**查詢或者設置主播的積分池的分數,status=1是代表需要設置scores，2是代表只是取scores,,scores:如果是1，這個就是必傳 */
    SendSetScorePool() {
        let data: string = `{
            "gamecode": "${NetManager.instance.ByteSDK.gamecode}",
            "platform": "DouYin",
            "version":"1.0",
            "anchorOpenId":"${NetManager.instance.ByteSDK.anchorOpenId}",
            "status":1,
            "scores":${GameManager.instance.DataManager.ScorePool}
        }`
        let ReqObj: string = `{
            "cmdCode": 1,
            "cmdMerge": 720910,
            "data": [${this.stringToBinary(data)}]
        }`
        let Req = this.stringToBinary(ReqObj)
        this.socketTask?.send({
            data: Req,
            success: () => {
                let req = JSON.parse(ReqObj)
                req.data = JSON.parse(data)
                Logger.ConsoleLog("Socket发送ttSetScorePool成功", req);
            },
            fail: () => {
                Logger.ConsoleLog("Socket发送ttSetScorePool失败");
            },
        })
    }

    /**查詢或者設置主播的積分池的分數,status=1是代表需要設置scores，2是代表只是取scores,,scores:如果是1，這個就是必傳 */
    SendGetScorePool() {
        let data: string = `{
            "gamecode": "${NetManager.instance.ByteSDK.gamecode}",
            "platform": "DouYin",
            "version":"1.0",
            "anchorOpenId":"${NetManager.instance.ByteSDK.anchorOpenId}",
            "status":2
        }`
        let ReqObj: string = `{
            "cmdCode": 1,
            "cmdMerge": 720910,
            "data": [${this.stringToBinary(data)}]
        }`
        let Req = this.stringToBinary(ReqObj)
        this.socketTask?.send({
            data: Req,
            success: () => {
                let req = JSON.parse(ReqObj)
                req.data = JSON.parse(data)
                Logger.ConsoleLog("Socket发送ttGetScorePool成功", req);
            },
            fail: () => {
                Logger.ConsoleLog("Socket发送ttGetScorePool失败");
            },
        })
    }

    /**查詢本週前100以及上週前30名的用戶 */
    SendGetWorldRankAndLastWorldRank() {
        let data: string = `{
            "gamecode": "${NetManager.instance.ByteSDK.gamecode}",
            "platform": "DouYin",
            "version":"1.0",
            "roomid": "${this.LiveRoomId}"
        }`
        let ReqObj: string = `{
            "cmdCode": 1,
            "cmdMerge": 720907  ,
            "data": [${this.stringToBinary(data)}]
        }`
        let Req = this.stringToBinary(ReqObj)
        this.socketTask?.send({
            data: Req,
            success: () => {
                let req = JSON.parse(ReqObj)
                req.data = JSON.parse(data)
                Logger.ConsoleLog("Socket发送ttGetWorldRankAndLastWorldRank成功", req);
            },
            fail: () => {
                Logger.ConsoleLog("Socket发送ttGetWorldRankAndLastWorldRank失败");
            },
        })
    }

    /**发送前十玩家 */
    SendTopPlayer(playersTop: Player[], final: boolean) {
        let players = playersTop.sort((a, b) => b.curLianSheng - a.curLianSheng)
        let winnerList: Object[] = []
        let loserList: Object[] = []
        let WinTotalScores: number
        let LoseTotalScores: number
        if (GameManager.instance.winner == 0) { WinTotalScores = GameManager.instance.DataManager.ChickenData.totalScore; LoseTotalScores = GameManager.instance.DataManager.DuckData.totalScore }
        if (GameManager.instance.winner == 1) { WinTotalScores = GameManager.instance.DataManager.DuckData.totalScore; LoseTotalScores = GameManager.instance.DataManager.ChickenData.totalScore }
        for (let i = 0; i < players.length; i++) {
            let itemInfo: Object = {
                open_id: players[i].playerid,
                nick_name: players[i].nickname,
                avatar_url: players[i].avatar_url,
                rank: i + 1,
                scores: players[i].totalScore,
                currentLiansheng: players[i].curLianSheng
            }
            if (players[i].player_type == GameManager.instance.winner) {
                winnerList.push(itemInfo)
                console.log(JSON.stringify(winnerList))
            } else {
                loserList.push(itemInfo)
            }
        }

        let data: string = `{
            "gamecode":"${NetManager.instance.ByteSDK.gamecode}",
            "platform":"DouYin",
            "version":"1.0",
            "roomid":"${NetManager.instance.ByteSDK.LiveRoomId}",
            "anchor_open_id": "${NetManager.instance.ByteSDK.anchorOpenId}",
            "anchor_nick_name": "${NetManager.instance.ByteSDK.anchorName}",
            "anchor_avatar_url": "${NetManager.instance.ByteSDK.anchorAvatarurl}",
            "winLianshengPool":${0}, 
            "lostLianshengPool":${0},
            "round_id": "${GameManager.instance.CurRoundid}",
            "start_time": ${GameManager.instance.start_time},
            "end_time": ${GameManager.instance.end_time},
            "end_status": 1,
            "finalUsers": ${final ? 1 : 0},
            "rank_lists": [{
                "rank_result": 1,
                "rank_result_comment": "Victory",
                "rank_users": ${JSON.stringify(winnerList)},
                "totalScores": ${0}
                }, {
                "rank_result": 2,
                "rank_result_comment": "Defeat",
                "rank_users": ${JSON.stringify(loserList)},
                "totalScores": ${0}
                }]
        }`

        let ReqObj: string = `{
            "cmdCode": 1,
            "cmdMerge": 720909,
            "data": [${this.stringToBinary(data)}]
        }`
        let Req = this.stringToBinary(ReqObj)
        this.socketTask?.send({
            data: Req,
            success: () => {
                Logger.ConsoleLog("Socket发送ttTopPlayer成功: ", JSON.parse(data));
            },
            fail: (err?) => {
                Logger.ConsoleLog("Socket发送ttTopPlayer失败: ", err);
            },
        })
    }

    /**根据playerid获取连胜和粉丝团 */
    GetData(playerid: string) {
        return new Promise<{ liansheng: any, fans: any }>((resolve, reject) => {
            let socket = new WebSocket(
                NetManager.instance.isOnlineMode ?
                    "wss://game.qizi-networks.com/websocket" :
                    "wss://game-test.qizi-networks.com/websocket",
            )
            socket.binaryType = 'arraybuffer';
            // 连接打开，发送请求
            socket.onopen = function () {
                NetManager.instance.ByteSDK.SendGetLianshengAndFans(playerid, socket)
            };
            // 处理服务器返回的消息
            socket.onmessage = function (event) {
                let dm = NetManager.instance.ByteSDK.BinaryTostring(event.data as ArrayBuffer)
                let data = NetManager.instance.DeCode(dm) as any
                if (data.responseCode != 0) { socket.close(); }
                if (data.cmdMerge == 720911) {
                    console.log(`ttGetLiansheng`, data)
                    socket.close();
                    resolve({ liansheng: data.data.values[0].liansheng, fans: data.data.values[0].fans });
                } else {
                    socket.close();
                }
            };
        })
    }

    /**获取连胜和粉丝团 */
    SendGetLianshengAndFans(playerid: string, socket: WebSocket) {
        let openids = []
        openids.push(playerid)
        let data: string = `{
            "gamecode": "${NetManager.instance.ByteSDK.gamecode}",
            "platform": "DouYin",
            "version":"1.0",
            "roomid": "${NetManager.instance.ByteSDK.LiveRoomId}",
            "anchorOpenId":"${NetManager.instance.ByteSDK.anchorOpenId}",
            "openids":${JSON.stringify(openids)}
        }`
        let ReqObj: string = `{
            "cmdCode": 1,
            "cmdMerge": 720911  ,
            "data": [${this.stringToBinary(data)}]
        }`
        let Req = this.stringToBinary(ReqObj)
        socket.send(Req);
        let req = JSON.parse(ReqObj)
        req.data = JSON.parse(data)
        console.log("Socket发送ttGetLiansheng成功", req);
    }
    // /**发送十后玩家 */
    // SendBehinePlayer(playersBehine: Player[], final: boolean){
    //     let players = playersBehine
    //     let winnerList: Object[] = []
    //     let loserList: Object[] = []
    //     for (let i = 0; i < players.length; i++) {
    //         let itemInfo:Object = {
    //             open_id: players[i].playerid,
    //             nick_name: players[i].nickname,
    //             avatar_url: players[i].avatar_url,
    //             rank: i+1,
    //             scores: players[i].in_Game_Score,
    //             currentLiansheng: players[i].currentLiansheng
    //         }
    //         if (players[i].winner) {
    //             winnerList.push(itemInfo)
    //         } else {
    //             loserList.push(itemInfo)
    //         }
    //     }

    //     let data: string = `{
    //         "gamecode":"JW",
    //         "platform":"DouYin",
    //         "version":"1.0",
    //         "roomid":"${this.LiveRoomId}",
    //         "anchor_open_id": "${this.anchorOpenId}",
    //         "anchor_nick_name": "${this.anchorName}",
    //         "anchor_avatar_url": "${this.anchorAvatarurl}",
    //         "winLianshengPool":${GameManager.instance.ClassicManager.UIEnd.winLianshengPool}, 
    //         "lostLianshengPool":${GameManager.instance.ClassicManager.UIEnd.lostLianshengPool},
    //         "round_id": "${GameManager.instance.CurRoundid}",
    //         "start_time": ${GameManager.instance.start_time},
    //         "end_time": ${GameManager.instance.end_time},
    //         "end_status": 1,
    //         "finalUsers": ${final ? 1 : 0},
    //         "rank_lists": [{
    //             "rank_result": 1,
    //             "rank_result_comment": "Victory",
    //             "rank_users": ${JSON.stringify(winnerList)},
    //             "totalScores": ${GameManager.instance.ClassicManager.UIEnd.WinTotalScores},
    //             }, {
    //             "rank_result": 2,
    //             "rank_result_comment": "Defeat",
    //             "rank_users": ${JSON.stringify(loserList)},
    //             "totalScores": ${GameManager.instance.ClassicManager.UIEnd.LoseTotalScores},
    //             }]
    //     }`
    //     let ReqObj: string = `{
    //         "cmdCode": 1,
    //         "cmdMerge": 720901,
    //         "data": [${this.stringToBinary(data)}]
    //     }`
    //     let Req = this.stringToBinary(ReqObj)
    //     this.socketTask?.send({
    //         data: Req,
    //         success: () => {
    //             Logger.ConsoleLog("Socket发送ttBehinePlayer成功: ",data,JSON.parse(data));
    //         },
    //         fail: (err?) => {
    //             Logger.ConsoleLog("Socket发送ttBehinePlayer失败: ", err);
    //         },
    //     })
    // }

    stringToBinary(str: string): Uint8Array {
        const encoder = new TextEncoder();
        return encoder.encode(str);
    }
    BinaryTostring(Binary: ArrayBuffer): string {
        const decode = new TextDecoder()
        return decode.decode(Binary)
    }
}