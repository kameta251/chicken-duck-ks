import { _decorator, Component, find, Label, math, Node } from 'cc';
const { ccclass, property } = _decorator;
import { GameState } from '../Manager/GameManager';
import { GameManager } from '../Manager/GameManager';
import { DataManager } from '../Manager/DataManager';

/**
 * 终点警告提示框
 */
@ccclass('GameHUD')
export class GameHUD{

    GameHUD:Node;
    AlarmLabel:Label;

    onLoad() {

        this.GameHUD=find("Canvas/GameHUD");
        this.AlarmLabel=find("Canvas/GameHUD/Alarm/AlarmLabel").getComponent(Label);
        this.GameHUD.active=false;
    }

    onUpdate() {

        if (GameManager.instance.state == GameState.Gaming) {

            
            let distance=GameManager.instance.DataManager.MaxProgeress-GameManager.instance.DataManager.BaseProgress;
            let disDuck=GameManager.instance.DataManager.BaseProgress;

            
            if(distance<=100 || disDuck<=100){
                this.GameHUD.active=true;
            }else{
                this.GameHUD.active=false;
            }

            if(distance<=100){
                this.AlarmLabel.string=Math.floor(distance)+""; 
            }
            if(disDuck<=100){
                this.AlarmLabel.string=Math.floor(disDuck)+""; 
            }

            if( (distance<=100 && distance>30) || (disDuck<=50 && disDuck>30)){

                this.AlarmLabel.color=math.color("00FF54");

            }else if( (distance<=30 && distance>10) || (disDuck<=30 && disDuck>10)){

                this.AlarmLabel.color=math.color("FFFC00");

            }else if( (distance<=10 && distance>=0) || (disDuck<=10 && disDuck>=0)){

                this.AlarmLabel.color=math.color("FF0000");

            }
        }
        
    }

    setRest(){
        this.GameHUD.active=false;
    }
}

