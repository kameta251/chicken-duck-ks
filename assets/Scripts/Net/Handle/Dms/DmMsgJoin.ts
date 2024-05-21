import { _decorator, Component, game, instantiate, isValid, Label, Node, Vec3 } from 'cc';
import { Queue } from '../../../Util/Queue';
import { GameManager, GameState } from '../../../Manager/GameManager';
const { ccclass, property } = _decorator;

export interface DmJoin {
    playerid: string,
    avatar_url: string,
    nickname: string,
    timestamp: number
}

/**boos玩家加入游戏队列 */
@ccclass('DmMsgJoin')
export class DmMsgJoin {
    private Queue: Queue<DmJoin> = new Queue<DmJoin>()
    public ShowTime: number = -2000  
    public isDecoDmshowing: boolean = false

    OnUpdate() {
        if (GameManager.instance.state == GameState.GameOver || GameManager.instance.state == GameState.Home){return}
        this.Emit()
    }

    ShowWorldTip(Name: string, playerid: string) {
    }

    Insert(playerid: string, avatar_url: string, nickname: string, timestamp: number):boolean {
        if (GameManager.instance.state == GameState.GameOver || GameManager.instance.state == GameState.Home){return false}
        let msg: DmJoin = {
            playerid: playerid,
            avatar_url: avatar_url,
            nickname: nickname,
            timestamp: timestamp
        }
        this.Queue.enqueue(msg)
        return true
    }

    Emit():boolean{
        if (this.Queue.size() > 0  && !this.isDecoDmshowing) {
            let DM = this.Queue.dequeue()
            this.ShowWorldTip(DM.nickname,DM.playerid)
            this.isDecoDmshowing = true
            this.ShowTime = game.totalTime
            return true
        }
        if (this.ShowTime + 2000 < game.totalTime) { this.isDecoDmshowing = false }
    }

    Clear(): boolean{
        if(GameManager.instance.state!=GameState.GameOver){return false}
        this.Queue.clear()
        return true
    }
}


