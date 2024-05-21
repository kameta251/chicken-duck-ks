import { _decorator, Component, director, EditBox, Label, Node, randomRangeInt, TextAsset } from 'cc';
import { GameManager } from './Manager/GameManager';
import { NetManager } from './Net/NetManager';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    @property({ type: TextAsset })
    HeadTextAsset: TextAsset
    @property({ type: EditBox, displayName: "PlayerId" })
    public PlayerId: EditBox
    @property({ type: EditBox, displayName: "循环次数" })
    public Count: EditBox
    @property({ type: Label })
    public TextLabel: Label

    HeadUrls: string[] = [];

    onLoad() {
        director.addPersistRootNode(this.node)
        this.HeadUrls = this.HeadTextAsset.text.split("\n")!

    }
    protected update(dt: number): void {
        this.TextLabel.string = GameManager.instance.DataManager.BaseProgress + ``
        // let cache = textureCache.getAllTextures()
    }

    OnJoinChicken() {
        let playerid = this.PlayerId.string
        NetManager.instance.OnDmHandleModule.OnDmJoinChicken(playerid, playerid, this.HeadUrls[randomRangeInt(0, 100)], 1,randomRangeInt(0,2))
    }

    OnJoinDuck() {
        let playerid = this.PlayerId.string
        NetManager.instance.OnDmHandleModule.OnDmJoinDuck(playerid, playerid, this.HeadUrls[randomRangeInt(0, 100)], 1,randomRangeInt(0,2))
    }

    OnLikeClick() {
        if (this.Count.string == ``) { this.Count.string = `1` }
        let playerid = this.PlayerId.string
        NetManager.instance.OnDmHandleModule.OnDmLike(playerid, +this.Count.string)
    }

    OnSend666() {
        if (this.Count.string == ``) { this.Count.string = `1` }
        let playerid = this.PlayerId.string
        NetManager.instance.OnDmHandleModule.OnDmSend666(playerid)
    }

    OnSendGift(event, Type: string) {
        if (this.Count.string == ``) { this.Count.string = `1` }
        let playerid = this.PlayerId.string
        let type = +Type
        let firstBlood = GameManager.instance.PlayerManager.HasPlayer(playerid)? 0 : 1
        console.log(`firstBlood: `,firstBlood,GameManager.instance.PlayerManager.HasPlayer(playerid))
        NetManager.instance.OnDmHandleModule.OnGift(playerid, NetManager.instance.OnDmHandleModule.GiftStr[type], this.Count.string, `1`, firstBlood, firstBlood, playerid, this.HeadUrls[randomRangeInt(0, 100)], 1,randomRangeInt(0,2))
    }

    OnEnd(){
        GameManager.instance.GameOver(0);
    }

    QuaryWorldRank() {
        NetManager.instance.SendGetWorldRank()
    }
}


