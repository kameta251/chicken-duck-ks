import { _decorator, Component, find, Label, math, Node, Sprite, UITransform, Vec3, Animation, AnimationState, randomRange } from 'cc';
import { GameManager, GameState } from '../Manager/GameManager';
const { ccclass, property } = _decorator;

/**
 * 游戏对局进度条
 */
@ccclass('GameProgress')
export class GameProgress {
    ProgressBar: Node;

    /**
     * 0-0.5
     */
    ProgressBG_Chicken: Sprite;
    /**
     * 0-0.5
     */
    ProgressBG_Duck: Sprite;

    ProgressIcon_Huoguo: Sprite;

    chickenWidth: number;
    huoguoWidth: number;

    TargetInfo_Label_Chicken: Label;
    TargetInfo_Label_Duck: Label;

    initProgress: number;

    ProgressBG_Chicken_Anim: Animation;
    ProgressBG_Duck_Anim: Animation;

    onLoad() {

        this.initProgress = GameManager.instance.DataManager.BaseProgress;

        this.ProgressBar = find("Canvas/GameUI/ProgressBar");

        this.ProgressBG_Chicken = find("Canvas/GameUI/ProgressBar/ProgressBG_Chicken").getComponent(Sprite);
        this.ProgressBG_Duck = find("Canvas/GameUI/ProgressBar/ProgressBG_Duck").getComponent(Sprite);
        this.ProgressIcon_Huoguo = find("Canvas/GameUI/ProgressBar/ProgressIcon_Huoguo").getComponent(Sprite);

        this.ProgressBG_Chicken_Anim = find("Canvas/GameUI/ProgressBar/ProgressBG_Chicken").getComponent(Animation);
        this.ProgressBG_Duck_Anim = find("Canvas/GameUI/ProgressBar/ProgressBG_Duck").getComponent(Animation);

        this.TargetInfo_Label_Chicken = find("Canvas/GameUI/ProgressBar/ProgressTarget_Chicken/TargetInfo_Label").getComponent(Label);
        this.TargetInfo_Label_Duck = find("Canvas/GameUI/ProgressBar/ProgressTarget_Duck/TargetInfo_Label").getComponent(Label);


        // this.ProgressBG_Chicken.type=3;
        // this.ProgressBG_Chicken.fillStart=0;
        // this.ProgressBG_Chicken.fillRange=0.5;

        // this.ProgressBG_Duck.type=3;
        // this.ProgressBG_Duck.fillStart=0;
        // this.ProgressBG_Duck.fillRange=0.5;

        // setTimeout(() => {
        //     this.ProgressBG_Chicken_Anim.defaultClip.speed = 0.2;
        //     this.ProgressBG_Duck_Anim.defaultClip.speed = 5;
        //     this.ProgressBG_Duck_Anim.play()
        //     this.ProgressBG_Chicken_Anim.play()
        // }, 0);

        // this.ProgressBG_Chicken_Anim.playOnLoad= false;
        // this.ProgressBG_Duck_Anim.playOnLoad=false;
        // this.ProgressBG_Chicken_Anim.defaultClip.speed = 0.2;
        // this.ProgressBG_Duck_Anim.defaultClip.speed = 0;
        

            // this.ProgressBG_Chicken_Anim.play()
            // this.ProgressBG_Duck_Anim.play()

            this.ProgressBG_Duck_Anim.getState(this.ProgressBG_Duck_Anim.defaultClip.name).speed=0.5;
            this.ProgressBG_Chicken_Anim.getState( this.ProgressBG_Chicken_Anim.defaultClip.name).speed=0.5;
        //     this.ProgressBG_Chicken_Anim.defaultClip.speed = 0.2;
        // this.ProgressBG_Duck_Anim.defaultClip.speed = 0;
        


        let chickenUITransform = this.ProgressBG_Chicken.getComponent(UITransform);
        this.chickenWidth = chickenUITransform.contentSize.width;

        let huoguoUITransform = this.ProgressIcon_Huoguo.getComponent(UITransform);
        this.huoguoWidth = huoguoUITransform.contentSize.width;

        console.log("chickenWidth:"+this.chickenWidth)
        console.log("huoguoWidth:"+this.huoguoWidth)

        this.setReset();

        // GameManager.instance.DataManager.BaseProgress = 1158;
        // this.setProgress();




    }

    /**
     * 重置显示
     */
    setReset() {
        this.TargetInfo_Label_Chicken.string = this.initProgress + "米"
        this.TargetInfo_Label_Duck.string = this.initProgress + "米"

        this.ProgressIcon_Huoguo.node.position = new Vec3(0, -16, 0);

        this.ProgressBG_Chicken.fillStart=0
        this.ProgressBG_Chicken.fillRange = 0.5;
        this.ProgressBG_Duck.fillStart=0
        this.ProgressBG_Duck.fillRange = 0.5;

    }

    onUpdate() {

        if (!this.ProgressBar) {
            return;
        }
        if (GameManager.instance.state == GameState.Gaming) {
            this.setProgress();
        }
    }

    setProgress() {

        

        let progress = GameManager.instance.DataManager.BaseProgress / GameManager.instance.DataManager.MaxProgeress;

        this.ProgressBG_Chicken.fillRange = progress;
        this.ProgressBG_Duck.fillRange = 1 - progress;
       

        /**
         * 设置火锅的位置
         */
        let x = 0;
        if (progress == 0.5) {
            x = 0;

            this.TargetInfo_Label_Chicken.string = Math.floor(GameManager.instance.DataManager.BaseProgress) + "米"
            this.TargetInfo_Label_Duck.string = Math.floor(GameManager.instance.DataManager.MaxProgeress - GameManager.instance.DataManager.BaseProgress) + "米"

        } else if (progress < 0.5) {
            x = (this.chickenWidth - this.huoguoWidth/2) * Math.abs(progress - 0.5)+this.huoguoWidth/2 * Math.abs(progress - 0.5);
           

            x = -x;
            // console.log(" xxx:"+ x)


            let chickJuli = GameManager.instance.DataManager.MaxProgeress - GameManager.instance.DataManager.BaseProgress;
            let duckJuli = GameManager.instance.DataManager.BaseProgress
            let chazhi = GameManager.instance.DataManager.MaxProgeress - chickJuli - duckJuli;
            if (chazhi <= 1) {
                chickJuli = Math.ceil(chickJuli);
                duckJuli = Math.floor(duckJuli);
            } else {
                chickJuli = Math.ceil(chickJuli);
                duckJuli = Math.ceil(duckJuli);
            }

            //策划要求鸡鸭要反过来
            this.TargetInfo_Label_Chicken.string = duckJuli + "米"
            this.TargetInfo_Label_Duck.string = chickJuli + "米"

        } else {
            x = (this.chickenWidth - this.huoguoWidth/2) * Math.abs(progress - 0.5)+this.huoguoWidth/2 * Math.abs(progress - 0.5);
            // console.log(" xxx:"+ x)

            let chickJuli = GameManager.instance.DataManager.MaxProgeress - GameManager.instance.DataManager.BaseProgress;
            let duckJuli = GameManager.instance.DataManager.BaseProgress
            let chazhi = GameManager.instance.DataManager.MaxProgeress - chickJuli - duckJuli;
            if (chazhi <= 1) {
                chickJuli = Math.ceil(chickJuli);
                duckJuli = Math.floor(duckJuli);
            } else {
                chickJuli = Math.ceil(chickJuli);
                duckJuli = Math.ceil(duckJuli);
            }

            //策划要求鸡鸭要反过来
            this.TargetInfo_Label_Chicken.string = duckJuli + "米"
            this.TargetInfo_Label_Duck.string = chickJuli + "米"
        }
        this.ProgressIcon_Huoguo.node.position = new Vec3(x, -16, 0);



    }


}

