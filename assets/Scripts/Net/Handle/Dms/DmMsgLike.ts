import { _decorator, Component, game, instantiate, isValid, Label, Node, Vec3 } from 'cc';
import { Queue } from '../../../Util/Queue';
import { GameManager, GameState } from '../../../Manager/GameManager';
import { Player } from '../../../Manager/PlayerManager';
const { ccclass, property } = _decorator;

export interface DmLike {
    player: Player
    like_num: number,
    timestamp: number
}

@ccclass('DmMsgLike')
export class DmMsgLike {
    private Queue: Queue<DmLike> = new Queue<DmLike>()
    public ShowTime: number = -50  
    public isDecoDmshowing: boolean = false

    OnUpdate() {
        if (GameManager.instance.state == GameState.GameOver || GameManager.instance.state == GameState.Home){return}
        this.Emit()
    }

    Emit(){
        if (this.Queue.size() > 0  && !this.isDecoDmshowing) {
            let DM = this.Queue.dequeue()
            this._EmitLike(DM.player,DM.like_num)
            this.isDecoDmshowing = true
            this.ShowTime = game.totalTime
        }
        if (this.ShowTime + 50 < game.totalTime) { this.isDecoDmshowing = false }
    }

    private _EmitLike(player: Player,count: number){
        player.OnLikeClick(count)
    }

    Insert(player: Player, like_num: number, timestamp: number):boolean {
        if (GameManager.instance.state == GameState.GameOver || GameManager.instance.state == GameState.Home){return false}
        let msg: DmLike = {
            player: player,
            like_num: like_num,
            timestamp: timestamp
        }
        this.Queue.enqueue(msg)
        return true
    }
    
    Clear(): boolean{
        if(GameManager.instance.state!=GameState.GameOver){return false}
        this.Queue.clear()
        return true
    }
}
