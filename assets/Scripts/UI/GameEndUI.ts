import { _decorator, Component, find, Node, Sprite, sp } from 'cc';
import { GameManager } from '../Manager/GameManager';
import { ResUtil } from '../Res/ResUtil';
const { ccclass, property } = _decorator;

/**
 * 游戏结束界面
 */
@ccclass('GameEndUI')
export class GameEndUI {

    GameEndUI: Node;
    GameEnd: sp.Skeleton;
    Food_Gouqidunji_Icon: Sprite
    Food_Gouqidunji_Title: Sprite

    mCallback

    onLoad() {

        this.GameEndUI = find("Canvas/GameEndUI");
        this.GameEndUI.active = false
        this.GameEnd = find("Canvas/GameEndUI/GameEnd").getComponent(sp.Skeleton)
        this.Food_Gouqidunji_Icon = find("Canvas/GameEndUI/GameEnd/Food_Gouqidunji_Icon").getComponent(Sprite)
        this.Food_Gouqidunji_Title = find("Canvas/GameEndUI/GameEnd/Food_Gouqidunji_Title").getComponent(Sprite)

        this.GameEnd.setCompleteListener((entity) => {
            this.GameEndUI.active = false
            if (this.mCallback) {
                this.mCallback();
            }
        });

        // this.showTip(1)

    }

    onUpdate() {

    }

    showTip(winner: number, callback) {
        this.mCallback = callback
        this.GameEndUI.active = true

        let max=5
        let min=0
        let index=Math.floor(Math.random() * (max - min + 1)) + min;


        // console.log("showTip index:"+index)

        //鸡赢了 播放鸭的
        if (winner === 1) {
            this.GameEnd.animation = 'Act_GameEnd_Chicken'
            this.Food_Gouqidunji_Icon.spriteFrame = ResUtil.instance.resImages.TipImages.Food_Chicken_Icon[index]
            this.Food_Gouqidunji_Title.spriteFrame = ResUtil.instance.resImages.TipImages.Food_Chicken_Title[index]

        } else {
            this.GameEnd.animation = 'Act_GameEnd_Duck'
            this.Food_Gouqidunji_Icon.spriteFrame = ResUtil.instance.resImages.TipImages.Food_Duck_Icon[index]
            this.Food_Gouqidunji_Title.spriteFrame = ResUtil.instance.resImages.TipImages.Food_Duck_Title[index]
            //   this.GameEnd.sockets[0].target.getComponent(Sprite).spriteFrame=ResUtil.instance.resPrefabs.TipPrefabs.Food_Gouqidunji_Icon

        }

    }
}

