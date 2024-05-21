import { _decorator, Component, find, Label, Node } from 'cc';
import { Player } from '../Manager/PlayerManager';
import { GameManager } from '../Manager/GameManager';
const { ccclass, property } = _decorator;

/**
 * 游戏活动提示
 */
@ccclass('GameActivity')
export class GameActivity {

    //首充
    GameActivity1: Node;
    Activity_Info_Label: Label
    Activity_PlayerName_Label: Label


    onLoad() {

        this.GameActivity1 = find("Canvas/GameUI/GameActivity1")
        // this.GameActivity1.active = false
        this.Activity_Info_Label = find("Canvas/GameUI/GameActivity1/Activity_Info_Label").getComponent(Label)
        this.Activity_PlayerName_Label = find("Canvas/GameUI/GameActivity1/Activity_PlayerName_Label").getComponent(Label)

        this.showFirstTopUP(0);

    }

    onUpdate() {

        this.showFirstTopUP(GameManager.instance.DataManager.firstBloodCount)

    }

    /**
     * 首充
     */
    showFirstTopUP(num: number) {
        if (num > 20) {
            num = 20
        }
        
        this.Activity_Info_Label.string = "剩：" + num + "/20"
        // this.Activity_PlayerName_Label.string = player.nickname
        // setTimeout(() => {
        //     this.GameActivity1.active = false
        // }, 2000);
    }


}

