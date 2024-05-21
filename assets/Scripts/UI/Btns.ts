import { _decorator, Button, Component, find, Node } from 'cc';
import { GameManager, GameState } from '../Manager/GameManager';
import { NetManager } from '../Net/NetManager';
const { ccclass, property } = _decorator;

@ccclass('Btns')
export class Btns {
    GameStart: Node
    ExitGameRank: Node
    NullExitGameRank: Node
    OnLoadMain() {
        // 获取并添加 ExitGameRank 节点的点击事件监听
        this.ExitGameRank = find("Canvas/Ranking/GameRank/GameRank_Btn_GamePlay");
        this.ExitGameRank.on('touch-start', this.onGameRankExit, this);
        this.NullExitGameRank = find(`Canvas/Ranking/NullGameRank/GameRank_Btn_GamePlay`)
        this.NullExitGameRank.on('touch-start', this.onGameRankExit, this)

        // 获取并添加 GameStart 节点的点击事件监听
        this.GameStart = find("Canvas/GameStartUI/Btn_GameStart");
        this.GameStart.addComponent(Button);
        this.GameStart.on('click', this.onGameStartClick, this);
    }

    /**注册onGameStart按钮点击事件 */
    onGameStartClick() {
        // GameManager.instance.state = GameState.Gaming
        this.GameStart.active = false
        GameManager.instance.notify({action: `OnGameStart`})
        GameManager.instance.Maps.PlayGuanzhong(true)
        NetManager.instance.ByteSDK.SendGameStart()
        // GameManager.instance.start_time = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" })).valueOf()+""
    }

    /**注册退出GameRank按钮点击事件 */
    onGameRankExit(){
        GameManager.instance.state = GameState.Watting
        this.GameStart.active = true    
        GameManager.instance.OnExitGameRank()
    }
}
