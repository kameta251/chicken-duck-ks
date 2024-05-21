import { _decorator, Component, find, Node, sp, Skeleton } from 'cc';
const { ccclass, property } = _decorator;
import { GameManager,GameState } from '../Manager/GameManager';

/**
 * 游戏对局VS 开始动画
 */
@ccclass('GameStartVS')
export class GameStartVS {

    GameStart: sp.Skeleton;

    onLoad() {

        this.GameStart = find("Canvas/GameUI/GameStart").getComponent(sp.Skeleton);
        this.GameStart.timeScale=0.6
        // this.GameStart.setEndListener(this.animation);
        this.GameStart.setCompleteListener(this.animStop.bind(this));


        // this.start();
    }

    start() {

        this.GameStart.node.active = true;
        this.GameStart.animation = "GameStart";
    }

    animStop() {
        this.GameStart.node.active = false;
        GameManager.instance.state = GameState.Gaming
        GameManager.instance.start_time = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" })).valueOf() + ""

    }
}

