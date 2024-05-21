import { _decorator, Component, director, game, Label, Node, ProgressBar } from 'cc';
import { GameProgress, NetManager } from '../Net/NetManager';
import { ResUtil } from '../Res/ResUtil';
import { GameManager } from '../Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('StartScene')
export class StartScene extends Component {

    @property({ type: ProgressBar })
    Loding: ProgressBar
    @property({ type: Label })
    LoadingLabel: Label

    LoadingTime: number = 0

    start() {
        this.Init();
    }

    async Init() {
        // if (NetManager.instance.isEditor) { NetManager.instance.CurProgress = GameProgress.GP_Token; NetManager.instance.ReConneted.active = false; return }
        NetManager.instance.ByteSDKLogin()
    }

    update(deltaTime: number) {
        this.LoadingTime += deltaTime * 3
        let LoadingText = `加载中.`
        let num = this.LoadingTime % 3
        if (num > 0 && num < 1) { LoadingText = `加载中.` }
        if (num > 1 && num < 2) { LoadingText = `加载中..` }
        if (num > 2 && num < 3) { LoadingText = `加载中...` }
        this.LoadingLabel.string = LoadingText

        switch (NetManager.instance.CurProgress) {
            case GameProgress.GP_None:
                break;
            case GameProgress.GP_Token:
                if (NetManager.instance.isEditor) { NetManager.instance.CurProgress = GameProgress.GP_PreGame; return }
                if (NetManager.instance.isOnlineMode) { console.log("当前使用的是线上接口"); }
                break;
            case GameProgress.GP_PreGame:
                NetManager.instance.CurProgress = GameProgress.GP_Loading;
                this.OnPreGame();
                break;
            case GameProgress.GP_OnGame:
                // director.preloadScene('Main', (completedCount, totalCount, item) => {
                //     let p = completedCount / totalCount;
                //     /**设置进度条进度, this.progress为进度条组件的节点 */
                //     this.Loding.progress = p;
                // }, () => {
                // })
                director.loadScene('Main', this.OnGameLoad);
                NetManager.instance.CurProgress = GameProgress.GP_Gaming;
                break;
            case GameProgress.GP_Gaming:
            case GameProgress.GP_Loading://加载资源中
                //啥也不做
                break;
            case GameProgress.GP_PreAudience:
                director.loadScene("Audience", this.OnAudienceLoad);
                NetManager.instance.CurProgress = GameProgress.GP_Gaming;
                break;
            default:
                break;
        }
    }

    /**准备进入游戏，读配置表 */
    async OnPreGame() {
        /**TODO加载资源，展示开机动画 */
        // NetManager.instance.ByteSDK.GetGameConfig()
        // await ResUtil.instance.GameConfig.SaveAllConfig(ResUtil.instance.configjson.json);

        NetManager.instance.CurProgress = GameProgress.GP_OnGame
        NetManager.instance.SendGetWorldRank()
    }
    OnGameLoad() {
        GameManager.instance.curscene = director.getScene()
        GameManager.instance.LoadSceneMain()
    }
    OnAudienceLoad() {
    }
}