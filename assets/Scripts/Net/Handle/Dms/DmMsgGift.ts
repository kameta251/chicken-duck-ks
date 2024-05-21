import { _decorator, Component, game, instantiate, isValid, Label, Node, randomRange, Vec3 } from 'cc';
import { Queue } from '../../../Util/Queue';
import { GameManager, GameState } from '../../../Manager/GameManager';
import { chaType, Player, PlayerAction } from '../../../Manager/PlayerManager';
import { NetManager } from '../../NetManager';
import { ScoreRule } from '../../../Data/ScoreRule';
import { ResUtil } from '../../../Res/ResUtil';
const { ccclass, property } = _decorator;


export interface DmGift {
    player: Player,
    sec_gift_id: string,
    gift_num: number,
    gift_value: number,
    firstBlood: number,
    timestamp: number
}

/**玩家加入游戏队列 */
@ccclass('DmMsgGift')
export class DmMsgGift {
    private Queue: Queue<DmGift> = new Queue<DmGift>()
    public ShowTime: number = -50
    public isDecoDmshowing: boolean = false

    OnUpdate() {
        if (GameManager.instance.state == GameState.GameOver || GameManager.instance.state == GameState.Home) { return }
        this.Emit()
    }

    Insert(player: Player, sec_gift_id: string, gift_num: number, gift_value: number, firstBlood: number, timestamp: number): boolean {
        let msg: DmGift = {
            player: player,
            sec_gift_id: sec_gift_id,
            gift_num: gift_num,
            gift_value: gift_value,
            firstBlood: firstBlood,
            timestamp: timestamp
        }
        this.Queue.enqueue(msg)
        return true
    }

    Emit(): boolean {
        if (this.Queue.size() > 0 && !this.isDecoDmshowing) {
            let DM = this.Queue.dequeue()
            this.ShowTime = game.totalTime
            this._Emit(DM.player, DM.sec_gift_id, DM.gift_num, DM.firstBlood)
            this.isDecoDmshowing = true
            return true
        }
        if (this.ShowTime + 500 < game.totalTime) { this.isDecoDmshowing = false }
    }

    private _Emit(player: Player, sec_gift_id: string, gift_num: number, firstBlood: number) {
        if (GameManager.instance.state != GameState.Gaming && GameManager.instance.state != GameState.Watting) { return }
        let giftParams = [
            [null, 1200, 1300, 1400, 1500, 1600],
            [null, 2200, 2300, 2400, 2500, 2600]
        ];
        let isfirstbBlood: boolean = false
        let giftIndex = player.player_type;
        let params = giftParams[giftIndex];
        let giftIndexID = NetManager.instance.OnDmHandleModule.GiftStr.indexOf(sec_gift_id);
        let monsterID = params[giftIndexID];
        isfirstbBlood = this.CheckISfirstBlood(firstBlood)
        if (giftIndexID === 0) {
            this.Calagift_coin1(player, gift_num);
            GameManager.instance.notify({ action: `OnTipGift`, data: { player: player, giftIndexID: giftIndexID, gift_num: gift_num, firstBlood: firstBlood } })
        } else {
            let func = giftIndex == 0 ? GameManager.instance.ChickenManager.CreaterChicken : GameManager.instance.DuckManager.CreaterDuck
            this.Calagift_num(player, gift_num, giftIndexID, monsterID, func);
            GameManager.instance.notify({ action: `OnTipGift`, data: { player: player, giftIndexID: giftIndexID, gift_num: gift_num, firstBlood: firstBlood } })
        }
        if (isfirstbBlood) {
            if(player.player_type == 0){
                GameManager.instance.ChickenManager.CreaterChicken(1400,player,1)
                GameManager.instance.notify({action: `OnTipGift`,data: { player: player, giftIndexID: 3, gift_num: 1, firstBlood: firstBlood }})
            }else{
                GameManager.instance.DuckManager.CreaterDuck(2400,player,1)
                GameManager.instance.notify({action: `OnTipGift`,data: { player: player, giftIndexID: 3, gift_num: 1, firstBlood: firstBlood }})
            }
        }
    }

    CheckISfirstBlood(firstBlood: number): boolean {
        if (firstBlood == 1) {
            if (GameManager.instance.DataManager.firstBloodCount >= 20) { return false}
            GameManager.instance.DataManager.firstBloodCount += 1;
            return true
        }
        return false
    }

    Calagift_num(player: Player, gift_num: number, Index: number, MonsterID: number, CallBack: (MonsterID: number, player: Player, count: number) => void) {
        if (player.gift_num[Index] + gift_num <= 5 || Index < 3) {
            CallBack(MonsterID, player, gift_num);
        } else {
            CallBack(MonsterID + 1, player, gift_num);
        }
        player.gift_num[Index] += gift_num;

        player.Game_Score += GameManager.instance.DataManager.ActionData.ActionScore[Index + 2] * gift_num
        GameManager.instance.DataManager.ScorePool += GameManager.instance.DataManager.ActionData.ActionScore[Index + 2 + 8] * gift_num
    }

    Calagift_coin1(player: Player, gift_num: number) {
        player.gift_num[0] += gift_num
        if (player.player_type == 0) { GameManager.instance.ChickenManager.LevelUp(player, gift_num) }
        if (player.player_type == 1) { GameManager.instance.DuckManager.LevelUp(player, gift_num) }
        player.OnGetCoin1Force(gift_num)
        player.Game_Score += GameManager.instance.DataManager.ActionData.ActionScore[PlayerAction.Coin1] * gift_num
        GameManager.instance.DataManager.ScorePool += GameManager.instance.DataManager.ActionData.ActionScore[PlayerAction.Coin1 + 8] * gift_num
    }

    Clear(): boolean {
        this.Queue.clear()
        return true
    }
}
