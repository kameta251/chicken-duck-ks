import { find } from "cc";
import { GameManager } from "../Manager/GameManager";
import { Btns } from "./Btns";
import { UIGameObj } from "./UIGameObj";
import { GameRank } from "../../Assets/Scr/GameRank";
import { WorldRank } from "../../Assets/Scr/WorldRank";
import { Player } from "../Manager/PlayerManager";

export class UIManager implements Observer {
    CallBack(data: NotificationData): void {
        switch (data.action) {
            /**游戏一开始OnLoad */
            case `OnLoad`:
                this.OnLoad()
                break

            /**进入新一轮，UI初始化 */
            case `OnNewRound`:
                this.OnResetUI();
                break

            /**每帧运行 */
            case `OnUpdate`:
                this.OnUpdate()
                break
            /**游戏进行时每帧运行 */
            case `OnGamingUpdate`:
                break

            /**加载Main后首次OnLoad */
            case `OnLoadMain`:
                this.OnLoadMain()
                break

            /**预加载世界排行 */
            case `OnPreLoadWorldRank`:
                this.OnPreLoadWorldRank()
                break

            /**一局游戏开始 */
            case `OnGameStart`:
                this.OnGameStart()
                break

            /**游戏结束，播放游戏结束动画，预加载结算排行 */
            case `OnPreGameRank`:
                //winner 0===鸡，1===鸭
                let winner = data.data.Winner
                this.OnPreLoadGameRank(winner)
                this.onGameOver()
                //TODO 播放游戏结束动画
                this.UIGameObj.gameEndUI.showTip(winner, () => {
                    this.OnShowGameRank()
                })
                //TODO 展示GameRank,延迟两秒
                // GameManager.instance.scheduleOnce(() => { this.OnShowGameRank() }, 2)
                break

            /**加入全屏特效
             * @param data.data.FullscreenType 全屏特效类型： `WorldRank`;`Gift`
             */
            case `OnJoinFullscreenEffect`:
                if (data.data.FullscreenType == `WorldRank`) {
                    console.log("--WorldRank---")
                    let player=data.data.player as Player
                    if(player.rank_no<=100){
                        this.UIGameObj.gameHint.addWorldRank(data.data.player as Player)
                    }
                    
                }
                if (data.data.FullscreenType == `Gift`) { }
                break

            /**玩家加入提示 */
            case `OnTipJoin`:
                let player_join = data.data.player as Player
                let player_type = player_join.player_type;
                let fans = data.data.fans
                if (player_type === 0) {
                    this.UIGameObj.gameHint.addChickenTip(player_join);
                    if (fans === 1) {
                        this.UIGameObj.gameHint.addFansChickenTip(player_join)
                    }
                } else {
                    this.UIGameObj.gameHint.addDuckTip(player_join);
                    if (fans === 1) {
                        this.UIGameObj.gameHint.addFansDuckTip(player_join)
                    }
                }



                break

            //升级召唤小播报
            case `OnTipGift`:
                let player_gift = data.data.player as Player
                // 0,1,2,3,4五种礼物
                let GiftIndex = data.data.giftIndexID as number
                //这次礼物送的数量
                let gift_num = data.data.gift_num as number
                //只有仙女才有
                let stage = player_gift.stage as number

                let start_num = player_gift.gift_num[GiftIndex] > 5 ? 5 : player_gift.gift_num[GiftIndex]
                if (GiftIndex === 0 || GiftIndex === 1 || GiftIndex === 2) {
                    start_num = 0;
                }
                // console.log("GiftIndex:"+GiftIndex)
                // console.log("start_num:"+start_num)

                if (player_gift.player_type === 0) {
                    this.UIGameObj.gameHint.addJoinHintChickenTip(data);
                } else {
                    this.UIGameObj.gameHint.addJoinHintDuckTip(data);
                }


                break

            /**升级弹播报 */
            case `OnLevelUp`:
                let player_levelup = data.data.player as Player
                //玩家本局Coin1数量
                let LevelUp_start_num = player_levelup.gift_num[0]
                //只有仙女才有
                let LevelUp_stage = player_levelup.stage as number
                // console.log("OnLevelUp LevelUp_stage:" + LevelUp_stage)

                let config = GameManager.instance.DataManager.ActionData.LevelCoinfig.find(config => config.stage === player_levelup.stage + 1)
                let needStar = null
                if (config != null) {
                    needStar = config.gift_num_count - player_levelup.gift_num[0]
                }
                if (player_levelup.player_type === 0) {
                    let giftdesc = this.UIGameObj.gameHint.getGiftChicken(0, LevelUp_stage, LevelUp_stage)
                    giftdesc.needStar=needStar
                    giftdesc.type = 1
                    this.UIGameObj.gameHint.addGiftFullTips(giftdesc, player_levelup)
                } else {
                    let giftdesc = this.UIGameObj.gameHint.getGiftDuck(0, LevelUp_stage, LevelUp_stage)
                    giftdesc.needStar=needStar
                    giftdesc.type = 1
                    this.UIGameObj.gameHint.addGiftFullTips(giftdesc, player_levelup)
                }
                break

            /**点赞播报 */
            case `OnTipLike`:
                let player_like = data.data.player as Player
                if (player_like.player_type === 0) {
                    this.UIGameObj.gameHint.addGreatChicken(player_like)
                } else {
                    this.UIGameObj.gameHint.addGreatDuck(player_like)
                }
                console.log(`点赞: `, player_like.like_num)
                break

            /**大得分播报 */
            case `OnTipBigScore`:
                let player_BigScore = data.data.player as Player
                this.UIGameObj.gameHint.addTotalsHintPro(player_BigScore)
                break

            /**小得分播报 */
            case `OnTipSmallScore`:
                let player_SmallScore = data.data.player as Player
                if (player_SmallScore.player_type === 0) {
                    this.UIGameObj.gameHint.addTotalsPointChicken(player_SmallScore)
                } else {
                    this.UIGameObj.gameHint.addTotalsPointDuck(player_SmallScore)
                }
                break

        }
    }
    UIGameObj: UIGameObj = new UIGameObj()
    WorldRank: WorldRank
    GameRank: GameRank
    Btns: Btns = new Btns()
    OnLoad() {
        this.UIGameObj.OnLoad()
    }

    OnUpdate() {
        this.UIGameObj.OnUpdate()
    }

    OnLoadMain() {
        this.WorldRank = find(`Canvas/Ranking/WorldRank`).getComponent(WorldRank)
        this.GameRank = find(`Canvas/Ranking/GameRank`).getComponent(GameRank)
        this.UIGameObj.OnLoadMain()
        this.Btns.OnLoadMain()
        this.GameRank.node.parent.active = true
    }

    OnPreLoadWorldRank() {
        this.WorldRank.OnPreLoadWorldRank(GameManager.instance.DataManager.CurWorldRankList)
    }

    OnPreLoadGameRank(Winner: number) {
        this.GameRank.OnPreLoadGameRank(GameManager.instance.DataManager.GameRankInfo, Winner)
    }

    OnShowGameRank() {
        this.GameRank.node.active = true
    }

    OnGameStart() {
        this.UIGameObj.gameStartVS.start()
        // this.UIGameObj.startGameTime(this.gameTimeOver);
    }

    onGameOver() {
        //隐藏终点提示
        this.UIGameObj.gameHUD.setRest();
        this.UIGameObj.cancelTime();
        this.UIGameObj.gameHint.setReset()
    }

    OnResetUI() {
        console.log("----OnResetUI-----");
        this.UIGameObj.setReset();
        this.UIGameObj.campInfo.setReset();
        this.UIGameObj.gameProgress.setReset();
        // this.UIGameObj.gameStartVS.start()
        // this.UIGameObj.startGameTime(this.gameTimeOver);
    }

    gameTimeOver() {

    }

}