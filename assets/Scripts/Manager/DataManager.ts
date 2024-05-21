import { _decorator, Component, Node, SpriteFrame } from 'cc';
import { Player } from './PlayerManager';
import { GameManager } from './GameManager';
import { Duck } from '../GameObject/Entity/Duck';
import { Chicken } from '../GameObject/Entity/Chicken';
import { ResUtil } from '../Res/ResUtil';
import { DuckData } from '../Data/DuckData';
import { ChickenData } from '../Data/ChickenData';
import { ActionData } from '../Data/ActionData';
import { MapData } from '../Data/MapData';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager {
    /**首充数量 */
    firstBloodCount: number = 0
    /**积分池 */
    ScorePool: number = 0
    MaxProgeress = 1200
    /**锅的进度，0-1200 */
    public BaseProgress: number = 600
    MaxGameTime: number = 1800
    /**当前游戏时间 */
    public CurTime: number = 1800
    /**玩家世界排行 */
    public CurWorldRank: Map<string, WorldRankItemInfo> = new Map()
    /**上周世界排行 */
    public LastWorldRank: Map<string, WorldRankItemInfo> = new Map()
    /**玩家世界排行(升序) */
    public get CurWorldRankList(): WorldRankItemInfo[] {
        return Array.from(this.CurWorldRank.values()).sort((a, b) => a.rank_no - b.rank_no);;
    }
    /**所有玩家 */
    public AllPlayers: Map<string, Player> = new Map()
    /**鸡玩家 */
    public ChickenPlayers: Map<string, Player> = new Map()
    /**鸭玩家 */
    public DuckPlayers: Map<string, Player> = new Map()
    /**所有玩家积分排行前100 */
    public get GameRankInfo(): GameRankItemInfo[] {
        const sortedRankList = Array.from(this.AllPlayers.values()).sort((a, b) => b.totalScore - a.totalScore);
        const gameRankkItemInfoList: GameRankItemInfo[] = [];
        for (let i = 0; i < sortedRankList.length; i++) {
            const player = sortedRankList[i];
            const gameRankkItemInfo = {
                open_id: player.playerid,
                avatar_url: player.avatar_url,
                nickname: player.nickname,
                rank_no: player.rank_no,
                curliansheng: player.curLianSheng,
                getLiansheng: player.getLiansheng,
                score: Math.floor(player.totalScore) ,
                getScore: Math.floor(player.getScore) ,
                lastweek_rank_no: player.lastweek_rank_no,
                player_type: player.player_type,
                avatar_sprite: player.avatar_sprite
            };
            gameRankkItemInfoList.push(gameRankkItemInfo);
        }
        return gameRankkItemInfoList;
    }
    /**鸡玩家前三 */
    public get ChickenFrontPlayers(): Player[] {
        return GameManager.instance.PlayerManager.GetArrayChickenFrontPlayers();
    }
    /**鸭玩家前三 */
    public get DuckFrontPlayers(): Player[] {
        return GameManager.instance.PlayerManager.GetArrayDuckFrontPlayers()
    }
    public ChickenEntity: Map<number, Chicken> = new Map()
    public DuckEntity: Map<number, Duck> = new Map()


    /**鸭子数据包含总分，总力 */
    public DuckData: DuckData = new DuckData()
    /**鸡数据包含总分，总力 */
    public ChickenData: ChickenData = new ChickenData()
    /**行为数据 */
    public ActionData: ActionData = new ActionData()
    /**地图数据 */
    public MapData:MapData = new MapData() 
    /**总分 */
    public get TotalScore():number{
        return this.DuckData.totalScore + this.ChickenData.totalScore
    }
    /**更新排行榜 */
    async UpdateWorldRank(userList): Promise<Map<string, WorldRankItemInfo>> {

        let p = new Promise<Map<string, WorldRankItemInfo>>((resolve, reject) => {
            let promises = userList.map(async item => {
                let rank_item: WorldRankItemInfo = {
                    open_id: item.openId,
                    avatar_url: item.avatarUrl,
                    nickname: item.nickName,
                    rank_no: item.currentWorldRankNo,
                    total_score: item.totalScores,
                    lastweek_rank_no: item.lastWorldRankNo,
                    avatar_sprite: await ResUtil.instance.loadImage(item.avatarUrl)
                }
                GameManager.instance.DataManager.CurWorldRank.set(item.openId, rank_item)
            })
            Promise.all(promises)
            .then(() => {
                resolve(GameManager.instance.DataManager.CurWorldRank)
            })
            .catch(error => {
                //可以添加错误处理
                reject(error)
            })

        })
        let res = await p

        if (GameManager.instance.curscene.name === `Main`) {
            console.log(res)
            GameManager.instance.notify({ action: `OnPreLoadWorldRank` })
        }
    
        return res
    
    }

    LoadGameCoinfig(){
        
    }

    clear(){
        this.BaseProgress = this.MaxProgeress / 2
        this.CurTime = this.MaxGameTime
        GameManager.instance.DataManager.firstBloodCount = 0
        this.AllPlayers.forEach((Player, key) => {
            Player = null
        });
        this.ChickenEntity.forEach(item=>{
            item.OnDestory()
            GameManager.instance.ChickenManager.DeleteChicken(item.EntityID)
        })
        this.DuckEntity.forEach(item=>{
            item.OnDestory()
            GameManager.instance.DuckManager.DeleteDuck(item.EntityID)
        })
        this.AllPlayers.clear()
        this.ChickenPlayers.clear()
        this.DuckPlayers.clear()
        this.ChickenEntity.clear()
        this.DuckEntity.clear()
    }

}

/**世界排行 */
type WorldRankItemInfo = {
    //用户id
    open_id: string
    //用户头像url
    avatar_url: string
    //用户名字
    nickname: string
    //用户世界排行
    rank_no: number
    //用户总积分
    total_score: number
    //用户上周排行
    lastweek_rank_no: number
    //头像
    avatar_sprite: SpriteFrame
}
type GameRankItemInfo = {
    //用户id
    open_id: string
    //用户头像url
    avatar_url: string
    //用户名字
    nickname: string
    //用户世界排行
    rank_no: number
    //当前连胜
    curliansheng: number
    //获得连胜
    getLiansheng: number
    //用户当局积分
    score: number
    //用户获得积分
    getScore: number
    //用户上周排行
    lastweek_rank_no: number
    //玩家类型 0 === 鸡，1 === 鸭
    player_type: number
    //头像
    avatar_sprite: SpriteFrame
}
