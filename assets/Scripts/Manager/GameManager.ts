import { _decorator, Component, director, game, lerp, Node, Scene, Vec3 } from 'cc';
import { Player, PlayerManager } from './PlayerManager';
import { DataManager } from './DataManager';
import { UIGameObj } from '../UI/UIGameObj';
import { UIManager } from '../UI/UIManager';
import { Maps } from '../GameObject/Map';
import { Btns } from '../UI/Btns';
import { EntityFactory } from '../GameObject/EntityFactory';
import { ChickenManager } from './ChickenManager';
import { DuckManager } from './DuckManager';
import { NetManager } from '../Net/NetManager';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;
export enum GameState {
    Home = 0,           //首页
    Watting = 1,        //等待
    Setting = 2,        //设置
    Gaming = 3,         //游戏中
    Stop = 4,           //游戏中暂停
    GameOver = 5,       //结束排行榜
}

@ccclass('GameManager')
export class GameManager extends Component implements Subject {
    static _instance: GameManager;
    static get instance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new GameManager();
        return this._instance
    }
    curscene: Scene
    //0===鸡，1==鸭
    winner: number = 0;
    CurRoundid: string = `0`;
    start_time: string = `0`;
    end_time: string = `0`;
    state: GameState = GameState.Home
    DataManager: DataManager = new DataManager()
    PlayerManager: PlayerManager = new PlayerManager()
    UIManager: UIManager = new UIManager()
    ChickenManager: ChickenManager = new ChickenManager()
    DuckManager: DuckManager = new DuckManager()
    Maps: Maps = new Maps()
    EntityFactory: EntityFactory = new EntityFactory()

    onLoad() {
        GameManager._instance = this
        GameManager.instance.curscene = director.getScene()
        this.addObserver(this.UIManager)
        this.notify({ action: `OnLoad`, data: { Ins: GameManager.instance } })
    }

    update() {
        this.notify({ action: `OnUpdate` })
        this.DuckManager.OnUpdate()
        this.ChickenManager.OnUpdate()
        this.PlayerManager.OnUpdate()
        switch (this.state) {
            case GameState.Gaming:
                GameManager.instance.DataManager.CurTime -= game.deltaTime
                this.CheckTimeOut()
                this.OnGamingUpdate()
                this.DuckManager.OnGamingUpdate()
                this.ChickenManager.OnGamingUpdate()
                this.notify({ action: `OnGamingUpdate` })
                break
        }
    }

    OnGamingUpdate() {
        let speed = this.getBaseMoveSpeed() * game.deltaTime
        GameManager.instance.DataManager.BaseProgress += this.getBaseMoveSpeed() * game.deltaTime
        speed = speed * 21           //表现调整
        this.Maps.OnGamingUpdate(speed)
        if (GameManager.instance.DataManager.BaseProgress > GameManager.instance.DataManager.MaxProgeress) {
            GameManager.instance.GameOver(0)
        }
        if (GameManager.instance.DataManager.BaseProgress <= 0) {
            GameManager.instance.GameOver(1)
        }
    }

    private CheckTimeOut() {
        if (GameManager.instance.DataManager.CurTime > 0) { return }
        if (GameManager.instance.DataManager.BaseProgress > GameManager.instance.DataManager.MaxProgeress / 2) {
            this.GameOver(0)
        } else {
            this.GameOver(1)
        }
    }

    transitionSpeed: boolean = false
    timeElapsed: number = 0
    initialSpeed: number = 0
    targetSpeed: number = 0
    /**极限时刻三秒内速度递减 */
    getCurSpeed() {
        if (this.transitionSpeed) {
            if (this.timeElapsed < 3) {
                let currentSpeed = lerp(this.initialSpeed, this.targetSpeed, this.timeElapsed / 3);
                this.timeElapsed += game.deltaTime
                return currentSpeed;
            } else {
                this.transitionSpeed = false;
                return this.targetSpeed
            }
        }
    }
    /**正方向右 */
    getBaseMoveSpeed() {
        let manager = GameManager.instance.DataManager;
        let minSpeed = manager.MapData.minSpeed
        let maxSpeed = manager.MapData.maxSpeed
        let ration = manager.MapData.ration
        let baseLine = manager.MapData.baseLine
        let chickenForce = manager.ChickenData.totalForce
        let duckFroce = manager.DuckData.totalForce
        if (chickenForce == duckFroce) { return 0 }
        let max = Math.max(chickenForce, duckFroce)
        let min = Math.min(chickenForce, duckFroce)
        let direction = chickenForce > duckFroce ? 1 : -1;
        let newSpeed = (minSpeed + Math.min((max / (min + baseLine)), maxSpeed) * ration)*direction;
        if (direction > 0 ? manager.BaseProgress > 1100 : manager.BaseProgress < 100) {
            this.transitionSpeed = true
            this.initialSpeed = minSpeed + Math.min((max / (min + baseLine)), maxSpeed) * ration;
            minSpeed = manager.MapData.limitTimeMinSpeed
            maxSpeed = manager.MapData.limitTimeMaxSpeed
            ration = manager.MapData.limitTimeRation
            baseLine = manager.MapData.limitTimeBaseLine
            this.targetSpeed = minSpeed + Math.min((max / (min + baseLine)), maxSpeed) * ration;
            newSpeed = this.getCurSpeed() * direction
        }else {
            this.transitionSpeed = false
            this.timeElapsed = 0
        }
        return newSpeed
        // if (chickenForce > duckFroce) {
        //     if (GameManager.instance.DataManager.BaseProgress > 1100) {
        //         this.transitionSpeed = true
        //         this.initialSpeed = minSpeed + Math.min((max / (min + baseLine)), maxSpeed) * ration
        //         minSpeed = GameManager.instance.DataManager.MapData.limitTimeMinSpeed
        //         maxSpeed = GameManager.instance.DataManager.MapData.limitTimeMaxSpeed
        //         ration = GameManager.instance.DataManager.MapData.limitTimeRation
        //         baseLine = GameManager.instance.DataManager.MapData.limitTimeBaseLine
        //         this.targetSpeed = minSpeed + Math.min((max / (min + baseLine)), maxSpeed) * ration;
        //         newSpeed = this.getCurSpeed()
        //     } else {
        //         this.transitionSpeed = false
        //         this.timeElapsed = 0
        //     }
        //     return newSpeed
        // } else {
        //     if (GameManager.instance.DataManager.BaseProgress < 100) {
        //         this.transitionSpeed = true
        //         this.initialSpeed = minSpeed + Math.min((max / (min + baseLine)), maxSpeed) * ration
        //         minSpeed = GameManager.instance.DataManager.MapData.limitTimeMinSpeed
        //         maxSpeed = GameManager.instance.DataManager.MapData.limitTimeMaxSpeed
        //         ration = GameManager.instance.DataManager.MapData.limitTimeRation
        //         baseLine = GameManager.instance.DataManager.MapData.limitTimeBaseLine
        //         this.targetSpeed = minSpeed + Math.min((max / (min + baseLine)), maxSpeed) * ration;
        //         newSpeed = this.getCurSpeed() * -1
        //     } else {
        //         this.transitionSpeed = false
        //         this.timeElapsed = 0
        //     }
        //     return newSpeed
        // }
    }

    Reset() {
        this.Maps.Reset()
    }

    /**关闭GameRank */
    OnExitGameRank() {
        GameManager.instance.DataManager.clear()
        NetManager.instance.OnDmHandleModule.Clear()
        this.OnNewRound()
    }

    /**新一轮 */
    OnNewRound() {
        this.Reset()
        this.notify({ action: `OnNewRound` })
    }

    /**加载场景Main */
    LoadSceneMain() {
        GameManager.instance.state = GameState.Watting
        GameManager.instance.DataManager.BaseProgress = GameManager.instance.DataManager.MaxProgeress / 2
        this.Maps.OnLoadMain()
        PoolManager.instance.OnLoadMain()
        this.notify({ action: `OnLoadMain` })
        NetManager.instance.SendGetWorldRank()
    }

    /**游戏结束 */
    GameOver(Winner: number) {
        if (GameManager.instance.DataManager.BaseProgress == GameManager.instance.DataManager.MaxProgeress / 2) {
            //平局弹平局窗口
            this.Maps.NullGameRank.active = true
            GameManager.instance.state = GameState.GameOver
            return
        }
        this.winner = Winner

        let winPlayer: Player[] = []
        if (this.winner == 0) { winPlayer = GameManager.instance.PlayerManager.GetArrayChickenPlayers() }
        else { winPlayer = GameManager.instance.PlayerManager.GetArrayDuckPlayers() }
        this.calculateWinningShares(GameManager.instance.DataManager.ScorePool, winPlayer)        /**瓜分积分池子，发送游戏结束 */
        GameManager.instance.DataManager.AllPlayers.forEach(item => {
            if (item.player_type == Winner) {
                if (item.Game_Score >= 250) { item.curLianSheng += 1; item.getLiansheng = 1 }
            } else { item.getLiansheng = -1; item.curLianSheng = item.curLianSheng - 1 < 0 ? 0 : item.curLianSheng - 1 }
            item.CalaTotalScore(Winner)
        })
        if (GameManager.instance.DataManager.BaseProgress != GameManager.instance.DataManager.MaxProgeress / 2) { GameManager.instance.DataManager.ScorePool = 0.2 * GameManager.instance.DataManager.ScorePool }

        GameManager.instance.end_time = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" })).valueOf() + ``
        NetManager.instance.ByteSDK.SendTopPlayer(Array.from(GameManager.instance.DataManager.AllPlayers.values()), true)
        /**播放结束动画 */
        NetManager.instance.ByteSDK.SendSetScorePool()
        GameManager.instance.state = GameState.GameOver
    }
    //如果胜利方参与人数不足5人，依旧瓜分积分池里80%的积分，胜利方瓜分比例=用户本局贡献积分/(胜利方用户本局贡献积分之和）
    //如果胜利方参与人数大于5人，依旧瓜分积分池里80%的积分，只给获胜方贡献积分前五瓜分资格，前五瓜分比例=用户本局贡献积分/(胜利发前五用户本局贡献积分之和）
    calculateWinningShares(scorePool: number, winPlayers: Player[]) {
        let totalWinningScore = 0;
        for (const player of winPlayers) {
            totalWinningScore += player.Game_Score;
        }
        if (winPlayers.length < 5) {
            for (const player of winPlayers) {
                player.getScore = (player.Game_Score / totalWinningScore) * 0.8 * scorePool;
            }
        } else {
            let topFiveWinningScore = 0;
            const topFivePlayers = winPlayers
                .sort((a, b) => b.Game_Score - a.Game_Score) // 按贡献积分降序排列
                .slice(0, 5); // 取前五个

            for (const player of topFivePlayers) {
                topFiveWinningScore += player.Game_Score;
            }

            for (const player of winPlayers) {
                if (topFivePlayers.indexOf(player) !== -1) {
                    player.getScore = (player.Game_Score / topFiveWinningScore) * 0.8 * scorePool;
                } else {
                    player.getScore = 0;
                }
            }
        }
    }



    observers: Observer[] = [];
    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }
    removeObserver(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }
    notify(data: NotificationData): void {
        for (const observer of this.observers) {
            observer.CallBack(data);
        }
    }
}