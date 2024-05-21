import { _decorator, Component, game, Node, randomRangeInt, SpriteFrame, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { MathUtil } from '../Util/MathUtil';
import { ResUtil } from '../Res/ResUtil';
import { Chicken } from '../GameObject/Entity/Chicken';
import { Duck } from '../GameObject/Entity/Duck';
import { NetManager } from '../Net/NetManager';
const { ccclass, property } = _decorator;

export enum chaType {
    Fish,
    Overworker
}

export class Player {

    playerid: string
    nickname: string
    avatar_url: string
    avatar_sprite: SpriteFrame
    stage: number = 0
    curLianSheng: number = 0
    rank_no: number
    lastweek_rank_no: number
    player_type: number
    getScore: number = 0
    getLiansheng: number = 0
    totalScore: number = 0
    gift_num: number[] = [0, 0, 0, 0, 0, 0]
    private _Game_Score: number = 0
    get Game_Score(): number {
        return this._Game_Score
    }
    set Game_Score(number: number) {
        for (let num = this._Game_Score; num <= number; num++) {
            this.notifyIfInBroadcastConfig(num, 2, `OnTipBigScore`)
            this.notifyIfInBroadcastConfig(num, 3, `OnTipSmallScore`)
            if (num == number) { continue }
            this._Game_Score += 1
        }
    }
    notifyIfInBroadcastConfig(num: number, index: number, action: string) {
        if (GameManager.instance.DataManager.ActionData.BroadcastConfig.get(index).indexOf(num) != -1) {
            GameManager.instance.notify({ action: action, data: { player: this } });
        }
    }

    private _like_num: number = 0
    get like_num(): number {
        return this._like_num
    }
    set like_num(number: number) {
        for (let num = this._like_num + 1; num <= number; num++) {
            this._like_num = num
            if (GameManager.instance.DataManager.ActionData.BroadcastConfig.get(1).indexOf(num) != -1) {
                GameManager.instance.notify({ action: `OnTipLike`, data: { player: this } })
            }
        }
    }

    /**游戏结束统计总分 */
    CalaTotalScore(winner: number) {
        let winMult: number = this.player_type == winner ? 0.1 : 0
        let lianshengMult: number = this.curLianSheng / 100
        this.totalScore = this.getScore + this.Game_Score * (1 + winMult + lianshengMult)
    }

    //游戏逻辑
    main_character_id: number
    all_character_id: number[] = []
    public GetOnceLikeAddForce: number = 0
    public GetOnceSendAddForce: number = 0

    constructor(playerid: string, nickname: string, avatar_url: string, liansheng: number) {
        this.playerid = playerid
        this.nickname = nickname
        this.avatar_url = avatar_url
        this.curLianSheng = liansheng
        this.rank_no = GameManager.instance.PlayerManager.QueryWorldRank(this.playerid)
    }
    OnUpdate() {
    }
    /**礼物进来的人，设置连胜 */
    SetLiangsheng(Liansheng: number){
        if(this.curLianSheng!=null){return}
        this.curLianSheng = Liansheng

    }
    OnLikeClick(count: number) {
        let Char: Chicken[] | Duck[] = []
        let MainChar: Chicken | Duck
        if(this.main_character_id==null){return}
        console.log(this.main_character_id)
        if (this.player_type == 0) { MainChar = GameManager.instance.DataManager.ChickenEntity.get(this.main_character_id); Char = this.getChickens(this.all_character_id) }
        if (this.player_type == 1) { MainChar = GameManager.instance.DataManager.DuckEntity.get(this.main_character_id); Char = this.getDucks(this.all_character_id) }
        MainChar.LikeClick()
        // for (var i = 0; i < count; i++) {
        //     Char.forEach((item: Chicken | Duck) => { item.LikeClick() })
        // }
        this.Game_Score += GameManager.instance.DataManager.ActionData.ActionScore[PlayerAction.LikeClick] * count
        GameManager.instance.DataManager.ScorePool += GameManager.instance.DataManager.ActionData.ActionScore[PlayerAction.LikeClick + 8] * count
        this.like_num += count
    }
    OnSend666() {
        let MainChar: Chicken | Duck
        if (this.player_type == 0) { MainChar = GameManager.instance.DataManager.ChickenEntity.get(this.main_character_id) }
        if (this.player_type == 1) { MainChar = GameManager.instance.DataManager.DuckEntity.get(this.main_character_id) }
        MainChar.Send666()
    }
    OnGetCoin1Force(Count: number) {
        let Char: Chicken[] | Duck[]
        let MainChar: Chicken | Duck
        if (this.player_type == 0) { MainChar = GameManager.instance.DataManager.ChickenEntity.get(this.main_character_id); Char = this.getChickens(this.all_character_id) }
        if (this.player_type == 1) { MainChar = GameManager.instance.DataManager.DuckEntity.get(this.main_character_id); Char = this.getDucks(this.all_character_id)  }
        MainChar.Coin1Count += Count
        Char.forEach((item: Chicken | Duck) => { item.Coin1Count += Count })
    }

    getChickens(numbers: number[]) {
        const result: Chicken[] = [];
        for (const number of numbers) {
            const chicken = GameManager.instance.DataManager.ChickenEntity.get(number);
            if (chicken == null) { continue }
            result.push(chicken);
        }
        return result;
    }
    getDucks(numbers: number[]) {
        const result: Duck[] = [];
        for (const number of numbers) {
            const duck = GameManager.instance.DataManager.DuckEntity.get(number);
            if (duck == null) { continue }
            result.push(duck);
        }
        return result;
    }

}

@ccclass('PlayerManager')
export class PlayerManager {

    OnUpdate() {
        GameManager.instance.DataManager.AllPlayers.forEach(Player => { Player.OnUpdate() })
    }

    /**加入鸡 */
    async JoinChicken(playerid: string, nickname: string, avatar_url: string, liansheng: number, fans: number) {
        let player = new Player(playerid, nickname, avatar_url, liansheng)
        GameManager.instance.DataManager.AllPlayers.set(playerid, player)
        player.avatar_sprite = await ResUtil.instance.loadImage(avatar_url)
        player.player_type = 0
        player.Game_Score += GameManager.instance.DataManager.ActionData.ActionScore[PlayerAction.Join]
        GameManager.instance.DataManager.ScorePool += GameManager.instance.DataManager.ActionData.ActionScore[PlayerAction.Join + 8]
        GameManager.instance.DataManager.ChickenPlayers.set(playerid, player)
        let id = GameManager.instance.ChickenManager.CreaterInitChicken(1100, player)
        player.main_character_id = id
        GameManager.instance.DataManager.ChickenEntity.get(id).isMainChar = true
        GameManager.instance.notify({ action: `OnJoinFullscreenEffect`, data: { player: player, FullscreenType: `WorldRank` } })
        
        let data = await NetManager.instance.ByteSDK.GetData(playerid)
        player.curLianSheng = data.liansheng
        fans = data.fans
        
        GameManager.instance.notify({ action: `OnTipJoin`, data: { player: player, fans: fans } })
        return new Promise<Player>((resolve, reject) => { resolve(player) })
    }

    /**加入鸭 */
    async JoinDuck(playerid: string, nickname: string, avatar_url: string, liansheng: number, fans: number) {
        let player = new Player(playerid, nickname, avatar_url, liansheng)
        GameManager.instance.DataManager.AllPlayers.set(playerid, player)
        player.avatar_sprite = await ResUtil.instance.loadImage(avatar_url)
        player.player_type = 1
        player.Game_Score += GameManager.instance.DataManager.ActionData.ActionScore[PlayerAction.Join]
        GameManager.instance.DataManager.ScorePool += GameManager.instance.DataManager.ActionData.ActionScore[PlayerAction.Join + 8]
        GameManager.instance.DataManager.DuckPlayers.set(playerid, player)
        let id = GameManager.instance.DuckManager.CreaterInitDuck(2100, player)
        player.main_character_id = id
        GameManager.instance.DataManager.DuckEntity.get(id).isMainChar = true
        GameManager.instance.notify({ action: `OnJoinFullscreenEffect`, data: { player: player, FullscreenType: `WorldRank` } })
        
        let data = await NetManager.instance.ByteSDK.GetData(playerid)
        player.curLianSheng = data.liansheng
        fans = data.fans
        GameManager.instance.notify({ action: `OnTipJoin`, data: { player: player, fans: fans } })
        return new Promise<Player>((resolve, reject) => { resolve(player) })
    }

    /**计算胜方前十获得的连胜 */
    GetLiansheng_Winner(Type: chaType) {
    }

    /**存在player返回true，否则返回false */
    HasPlayer(playerid: string): boolean {
        let player = GameManager.instance.DataManager.AllPlayers.get(playerid)
        if (player == null) { return false } else { return true }
    }

    /**返回player,若不存在则返回空 */
    Query(playerid: string): Player {
        return GameManager.instance.DataManager.AllPlayers.get(playerid)
    }

    /**查询世界排行 */
    QueryWorldRank(playerid: string) {
        let rank = GameManager.instance.DataManager.CurWorldRank.get(playerid)?.rank_no
        if (rank == null) { rank = 9999 }
        return rank
    }

    /**返回DuckPlayers数组 */
    GetArrayDuckPlayers(): Player[] {
        return Array.from(GameManager.instance.DataManager.DuckPlayers.values())
    }

    /**返回ChickenPlayers数组 */
    GetArrayChickenPlayers(): Player[] {
        return Array.from(GameManager.instance.DataManager.ChickenPlayers.values())
    }

    /**返回ChickenPlayers数组前三 */
    GetArrayChickenFrontPlayers() {
        let playerArr = GameManager.instance.PlayerManager.GetArrayChickenPlayers().sort((a, b) => { return b.Game_Score - a.Game_Score })
        let frontPlayers: Player[] = []
        if (playerArr.length > 3) { frontPlayers = playerArr.slice(0, 3) } else { frontPlayers = playerArr }
        return playerArr;
    }

    /**返回DuckPlayers数组前三 */
    GetArrayDuckFrontPlayers() {
        let playerArr = GameManager.instance.PlayerManager.GetArrayDuckPlayers().sort((a, b) => { return b.Game_Score - a.Game_Score })
        let frontPlayers: Player[] = []
        if (playerArr.length > 3) { frontPlayers = playerArr.slice(0, 3) } else { frontPlayers = playerArr }
        return playerArr;
    }

    /**返回AllPlayers */
    GetAllPlayers() {
        return GameManager.instance.DataManager.AllPlayers
    }

    /**检查是否第一名 */
    CheckIsNoOne(playerid: string) {
        const duckFrontPlayers = this.GetArrayDuckFrontPlayers();
        const chickenFrontPlayers = this.GetArrayChickenFrontPlayers();
        if ((duckFrontPlayers.length > 0 && playerid === duckFrontPlayers[0].playerid) || (chickenFrontPlayers.length > 0 && playerid === chickenFrontPlayers[0].playerid)) { return true; } else { return false; }
    }

    /**游戏结束分胜负 
     * @param 0-咸鱼，1-卷王
    */
    GameOver(Type: chaType) {
        this.GetLiansheng_Winner(Type)
    }
}

export enum PlayerAction {
    Join = 0,
    LikeClick = 1,
    Coin1 = 2,
    Coin10 = 3,
    Coin19 = 4,
    Coin52 = 5,
    Coin99 = 6,
    Coin199 = 7
}