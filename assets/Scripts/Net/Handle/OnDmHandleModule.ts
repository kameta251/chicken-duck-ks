import { _decorator, Component, Node, randomRange, Scene } from 'cc';
import { GameManager } from '../../Manager/GameManager';
import { Logger } from '../../Util/Logger';
import { DmMsgGift } from './Dms/DmMsgGift';
import { DmMsgJoin } from './Dms/DmMsgJoin';
import { DmMsgLike } from './Dms/DmMsgLike';
import { NetManager } from '../NetManager';
import { ResUtil } from '../../Res/ResUtil';
import { DataManager } from '../../Manager/DataManager';
import { Player } from '../../Manager/PlayerManager';
const { ccclass, property } = _decorator;

export interface NormalData {
    avatar_url: string
    gift_num: number
    gift_value: number
    msg_id: string
    nickname: string
    sec_gift_id: string
    sec_openid: string
    timestamp: number
    ack?: string
    like_num?: number
    content?: string
    liveType: string
}

@ccclass('OnDmHandleModule')
export class OnDmHandleModule {
    public GiftStr: Array<string> = new Array(6);
    private DmMsgGift: DmMsgGift = new DmMsgGift()
    private DmMsgJoin: DmMsgJoin = new DmMsgJoin()      /**用不上，暂无需要 */
    private DmMsgLike: DmMsgLike = new DmMsgLike()

    OnLoad() {
        this.GiftStr[0] = "n1/Dg1905sj1FyoBlQBvmbaDZFBNaKuKZH6zxHkv8Lg5x2cRfrKUTb8gzMs="
        this.GiftStr[1] = "28rYzVFNyXEXFC8HI+f/WG+I7a6lfl3OyZZjUS+CVuwCgYZrPrUdytGHu0c="
        this.GiftStr[2] = "fJs8HKQ0xlPRixn8JAUiL2gFRiLD9S6IFCFdvZODSnhyo9YN8q7xUuVVyZI="
        this.GiftStr[3] = "PJ0FFeaDzXUreuUBZH6Hs+b56Jh0tQjrq0bIrrlZmv13GSAL9Q1hf59fjGk="
        this.GiftStr[4] = "IkkadLfz7O/a5UR45p/OOCCG6ewAWVbsuzR/Z+v1v76CBU+mTG/wPjqdpfg="
        this.GiftStr[5] = "gx7pmjQfhBaDOG2XkWI2peZ66YFWkCWRjZXpTqb23O/epru+sxWyTV/3Ufs="
    }

    OnUpdate() {
        this.DmMsgJoin.OnUpdate()
        this.DmMsgGift.OnUpdate()
        this.DmMsgLike.OnUpdate()
    }

    /**处理消息 */
    async DistributeMsg(msg) {
        switch (msg.cmdMerge) {
            case 720896:
                console.log(`InitRes: `, msg)
                if (msg.responseStatus != 0) {
                    //弹窗token获取roomid失败弹窗
                    NetManager.instance.InitFail()
                    return
                }
                if (msg.data.anchor_open_id == null) {
                    //断线重连直接return
                    return
                }
                NetManager.instance.ByteSDK.LiveRoomId = msg.data.room_id
                NetManager.instance.ByteSDK.anchorOpenId = msg.data.anchor_open_id
                NetManager.instance.ByteSDK.anchorName = msg.data.nick_name
                NetManager.instance.ByteSDK.anchorAvatarurl = msg.data.avatar_url
                NetManager.instance.ByteSDK.SendttPushRpc(0, 0)
                NetManager.instance.ByteSDK.SendGetScorePool()
                NetManager.instance.ByteSDK.SendGiftRpc()
                break

            case 720902:
                console.log(`收到信息`)
                this.DMHandle(msg)
                break

            case 720903:
                console.log(`ttGetWorldRank: `, msg)
                await GameManager.instance.DataManager.UpdateWorldRank(msg.data.values)
                break

            case 720898:
                console.log(`GameStart: `, msg)
                GameManager.instance.CurRoundid = msg.data.roundid
                break
            case 720908:
                console.log(`GameConfig: `, msg)
                if(NetManager.instance.isEditor){
                    ResUtil.instance.GameConfig.SaveAllConfig(ResUtil.instance.configjson.json)
                }else{
                    ResUtil.instance.GameConfig.SaveAllConfig(JSON.parse(msg.data.gameInfo))
                }
                break

            case 720909:
                msg.data.values.forEach(item => {
                    GameManager.instance.DataManager.AllPlayers.get(item.openId).rank_no = item.worldRankNo
                });

                GameManager.instance.notify({ action: `OnPreGameRank`, data: { Winner: GameManager.instance.winner } })

                /**刷新世界排行 */
                NetManager.instance.ByteSDK.SendGetWorldRank()
                break
            case 720910:
                GameManager.instance.DataManager.ScorePool = msg.data.scores
                break

        }
    }

    /**处理弹幕 */
    DMHandle(msg) {
        switch (msg.data.msgType) {
            case `live_gift`:
                this.GiftHandle(msg)
                break
            case `live_comment`:
                this.CommentHandle(msg)
                break
            case `live_like`:
                this.LikeHandle(msg)
                break
        }
    }

    /**处理礼物 */
    private GiftHandle(msg) {
        let user = JSON.parse(msg.data.requestBody)[0]
        msg.data.requestBody = user
        console.log(`收到礼物: `, user)
        this.OnGift(user.sec_openid, user.sec_gift_id, user.gift_num, user.gift_value, user.firstBlood, user.timestamp, user.nickname, user.avatar_url, user.liansheng, user.fans)
    }

    /**处理评论 */
    private CommentHandle(msg) {
        let user = JSON.parse(msg.data.requestBody)[0]
        msg.data.requestBody = user
        Logger.ConsoleLog(`收到评论: `, user)
        switch (user.content + ``) {
            case `1`:
            case `鸡`:
                this.OnDmJoinChicken(user.sec_openid, user.nickname, user.avatar_url, user.liansheng, user.fans)
                break
            case `2`:
            case `鸭`:
                this.OnDmJoinDuck(user.sec_openid, user.nickname, user.avatar_url, user.liansheng, user.fans)
                break
            case `666`:
                this.OnDmSend666(user.sec_openid)
                break
        }
    }

    /**处理点赞 */
    private LikeHandle(msg) {
        let user = JSON.parse(msg.data.requestBody)[0]
        msg.data.requestBody = user
        Logger.ConsoleLog(`收到点赞: `, user)
        this.OnDmLike(user.sec_openid, user.like_num)
    }

    async OnDmJoinChicken(playerid: string, nickname: string, avatar_url: string, liansheng: number, fans: number) {
        if (GameManager.instance.PlayerManager.HasPlayer(playerid)) { return }
        if (GameManager.instance.PlayerManager.HasPlayer(playerid)) { return }
        GameManager.instance.PlayerManager.JoinChicken(playerid, nickname, avatar_url, liansheng, fans)
    }

    async OnDmJoinDuck(playerid: string, nickname: string, avatar_url: string, liansheng: number, fans: number) {
        if (GameManager.instance.PlayerManager.HasPlayer(playerid)) { return }
        if (GameManager.instance.PlayerManager.HasPlayer(playerid)) { return }
        GameManager.instance.PlayerManager.JoinDuck(playerid, nickname, avatar_url, liansheng, fans)
    }
    OnDmLike(playerid: string, count: number) {
        let player = GameManager.instance.PlayerManager.Query(playerid)
        if (player == null) { return }
        player.OnLikeClick(count)
    }

    OnDmSend666(playerid: string) {
        let player = GameManager.instance.PlayerManager.Query(playerid)
        if (player == null) { return }
        player.OnSend666()
    }

    //随机加入一个阵营
    JoinRandomCamp(playerid: string, nickname: string, avatar_url: string, liansheng: number, fans: number) {
        return new Promise<Player>((resolve, reject) => {
            resolve(randomRange(0, 100) < 50 ?
                GameManager.instance.PlayerManager.JoinChicken(playerid, nickname, avatar_url, liansheng, fans) :
                GameManager.instance.PlayerManager.JoinDuck(playerid, nickname, avatar_url, liansheng, fans))
        })
    }

    async OnDmGiftJoin(playerid: string, gift_id: string, count: string, gift_value: string, firstBlood: number, timestamp: number, nickname: string, avatar_url: string, liansheng: number, fans: number) {
        if (GameManager.instance.PlayerManager.HasPlayer(playerid)) { this.OnGift(playerid, gift_id, count, gift_value, firstBlood, timestamp, nickname, avatar_url, liansheng, fans); return }
        //拿到liansheng，fans继续以下代码
        await this.JoinRandomCamp(playerid, nickname, avatar_url, liansheng, fans)
        this.OnGift(playerid, gift_id, count, gift_value, firstBlood, timestamp, nickname, avatar_url, liansheng, fans)
    }
    /**送礼物 */
    OnGift(playerid: string, gift_id: string, count: string, gift_value: string, firstBlood: number, timestamp: number, nickname: string, avatar_url: string, liansheng: number, fans: number) {
        let player = GameManager.instance.PlayerManager.Query(playerid)
        if (player == null) { this.OnDmGiftJoin(playerid, gift_id, count, gift_value, firstBlood, timestamp, nickname, avatar_url, liansheng, fans); return }
        this.DmMsgGift.Insert(player, gift_id, +count, +gift_value, firstBlood, timestamp)
    }
    Clear() {
        this.DmMsgGift.Clear()
        this.DmMsgJoin.Clear()
        this.DmMsgLike.Clear()
    }
}