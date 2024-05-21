import { _decorator, Component, find, Label, Node, ISchedulable } from 'cc';
import { GameManager } from '../Manager/GameManager';
import { MathUtil } from '../Util/MathUtil';
const { ccclass, property } = _decorator;
import { GameProgress } from './GameProgress';
import { GameStartVS } from './GameStartVS';
import { CampInfo } from './CampInfo';
import { GameState } from '../Manager/GameManager';
import { GameHUD } from './GameHUD';
import { GameEndUI } from './GameEndUI';
import { GameHInt } from './GameHInt';
import { GameActivity } from './GameActivity';

@ccclass('UIGameObj')
export class UIGameObj {
    //游戏时间
    GameTimeLabel: Label
    //积分池
    GameTime_ScoreLabel: Label;
    //回调函数参数
    mCallback;
    //默认倒计时时间
    countdownTime: number = 60 * 30;

    gameProgress = new GameProgress();
    gameStartVS = new GameStartVS();
    campInfo = new CampInfo();
    gameHUD = new GameHUD();
    gameEndUI = new GameEndUI();
    gameHint = new GameHInt();
    gameAct=new GameActivity();



    OnLoad() {
    }
    OnUpdate() {


        if (GameManager.instance.state == GameState.Gaming) {


            this.gameProgress.onUpdate();
            this.gameHUD.onUpdate();
            this.gameEndUI.onUpdate();
            

            this.GameTimeLabel.string = MathUtil.ClockSting(GameManager.instance.DataManager.CurTime) + ``
           
        }

        if (GameManager.instance.state == GameState.Gaming || GameManager.instance.state == GameState.Watting) {

            this.campInfo.onUpdate();
            this.gameHint.onUpdate();
            this.gameAct.onUpdate();
            //更新积分池信息
            this.GameTime_ScoreLabel.string = "积分池："+MathUtil.Reduce_10KFloor(GameManager.instance.DataManager.ScorePool) + "";

        }

    }

    OnLoadMain() {

        this.gameProgress.onLoad();
        this.gameStartVS.onLoad();
        this.campInfo.onLoad();
        this.gameHUD.onLoad();
        this.gameEndUI.onLoad();
        this.gameHint.onLoad();
        this.gameAct.onLoad()

        this.GameTimeLabel = find('Canvas/GameUI/GameTime/GameTimeLabel').getComponent(Label)
        this.GameTimeLabel.string = MathUtil.ClockSting(GameManager.instance.DataManager.CurTime) + ``

        this.GameTime_ScoreLabel = find("Canvas/GameUI/GameTime/GameTime_ScoreLabel").getComponent(Label);


    }

    setReset(){
        GameManager.instance.DataManager.CurTime=GameManager.instance.DataManager.MaxGameTime
        this.GameTimeLabel.string = MathUtil.ClockSting(GameManager.instance.DataManager.CurTime) + ``
        GameManager.instance.DataManager.firstBloodCount=0
        this.gameAct.showFirstTopUP(GameManager.instance.DataManager.firstBloodCount);
    }


    /**
     * 倒计时
     * @param time 计时时间
     * @param callback 回调函数
     */
    startGameTime(callback) {
        this.mCallback = callback;

        GameManager.instance.schedule(this.updateCountdown.bind(this), 1, this.countdownTime - 1, 0);
    }

    cancelTime() {
        GameManager.instance.unschedule(this.updateCountdown);
    }

    updateCountdown() {

        this.countdownTime--;

        // 更新倒计时文本
        // this.GameTimeLabel.string  = this.countdownTime.toString();
        // this.GameTimeLabel.string = MathUtil.ClockSting(GameManager.instance.DataManager.CurTime) + ``

        // 如果倒计时结束，取消schedule
        if (this.countdownTime === 0) {
            GameManager.instance.unschedule(this.updateCountdown);
            this.mCallback();
        }

    }

}

