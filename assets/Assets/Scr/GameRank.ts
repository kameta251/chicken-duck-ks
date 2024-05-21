import { _decorator, assetManager, CCBoolean, CCString, Component, ImageAsset, instantiate, Label, labelAssembler, Node, Prefab, randomRange, randomRangeInt, Sprite, SpriteFrame, Texture2D } from 'cc';
import { GameManager } from '../../Scripts/Manager/GameManager';
import { NetManager } from '../../Scripts/Net/NetManager';
const { ccclass, property } = _decorator;

@ccclass(`GameRank_PlayerPrefab`)
class GameRank_PlayerPrefab {
    @property({ type: [Prefab], displayName: `预制体，0=鸡 1=鸭` })
    Prefab: Prefab[] = []
    @property({ type: CCString, displayName: `用户名字` })
    NamePath: string
    @property({ type: CCString, displayName: `排行` })
    RankPath: string
    @property({ type: CCString, displayName: `头像` })
    HeadImagePath: string
    @property({ type: CCString, displayName: `连胜` })
    curlianshengPath: string
    @property({ type: CCString, displayName: `分数` })
    ScorePath: string
    @property({ type: CCString, displayName: `世界排行` })
    WorldRankPath: string
    @property({ type: CCString, displayName: `获得连胜` })
    GetLianshengPath: string
    @property({ type: CCString, displayName: `获得积分` })
    GetScorePath: string
}
@ccclass(`GameRank_Ranking`)
class GameRank_Ranking {
    @property({ type: Node, displayName: `整个item` })
    Node: Node
    @property({ type: Sprite, displayName: `头像` })
    HeadImage: Sprite
    @property({ type: Label, displayName: `名字` })
    NickName: Label
    @property({ type: Label, displayName: `分数` })
    Score: Label
    @property({ type: Label, displayName: `获得分数` })
    GetScore: Label
    @property({ type: Label, displayName: `世界排行` })
    WorldRank: Label
    @property({ type: Label, displayName: `连胜` })
    Liansheng: Label
    @property({ type: Label, displayName: `获得连胜` })
    GetLiansheng: Label
    @property({ type: [Node], displayName: `鸡的标志` })
    ChickenSign: Node[] = []
    @property({ type: [Node], displayName: `鸭的标志` })
    DuckSign: Node[] = []
}
@ccclass('GameRank')
export class GameRank extends Component {
    @property({ type: CCBoolean, displayName: `测试模式` })
    TestModel: boolean
    TestData: GameRankkItemInfo[] = []
    private GameRankItemList: Node[] = []


    public GameRankData: GameRankkItemInfo

    @property({ type: Sprite })
    GameRank_Btn_Close: Sprite;
    
    @property({type:[Node],displayName: `鸡标题`})
    Chicken_Title: Node[] = []
    @property({ type: [Node],displayName:`鸭标题` })
    Duck_Title: Node[] = []

    @property({ type: SpriteFrame, displayName: `默认头像` })
    DefaultHeadImage: SpriteFrame
    @property({ type: [GameRank_Ranking] })
    GameRank_Ranking: GameRank_Ranking[] = []
    @property({ type: Node, displayName: `item的根节点` })
    GameRank_Ranking_Root: Node

    @property({ type: GameRank_PlayerPrefab })
    GameRank_PlayerPrefab: GameRank_PlayerPrefab = new GameRank_PlayerPrefab()
    @property({ type: Sprite, displayName: `世界排行按钮` })
    WorldRank_Btn: Sprite;
    @property({ type: Node })
    WorldRank: Node
    protected onLoad(): void {

        this.GameRank_Btn_Close.node.on("touch-start", this.closeBtn.bind(this));
        this.WorldRank_Btn.node.on("touch-start", this.ClickWorldRank.bind(this));
        this.GameRankItemList = []

        this.LoadTestData(randomRangeInt(0,2))

    }

    async LoadTestData(WinTeam:number) {
        if (!this.TestModel) { return }
        for (let i = 1; i < 101; i++) {
            let avatar_sprite = await this.loadImage(`http://cdn.adota.cn//temp/avatar/0158aecf15014a88412622449019c11ca08a81bb.jpg`)
            let item: GameRankkItemInfo = {
                open_id: `${i}`,
                avatar_url: `http://cdn.adota.cn//temp/avatar/0158aecf15014a88412622449019c11ca08a81bb.jpg`,
                nickname: `${i}`,
                rank_no: i,
                score: (44 - 4 * i) * 10000,
                getScore: (22 - 2 * i) * 10000,
                curliansheng: randomRange(0, 100) < 50 ? 0 : randomRangeInt(0, 100),
                getLiansheng: randomRange(0, 100) < 50 ? 1 : -1,
                player_type: randomRange(0, 100) < 50 ? 1 : 0,
                lastweek_rank_no: 3 * (100 - i),
                avatar_sprite: avatar_sprite
            }
            this.TestData.push(item);
        }
        console.log(`TestData: `, this.TestData)
        this.PreLoadGameRank(this.TestData,WinTeam)
    }

    OnPreLoadGameRank(Data: GameRankkItemInfo[],WinTeam: number) {
        this.PreLoadGameRank(Data,WinTeam)
        this.node.active = false
    }

    /**预加载
    * @param values，玩家信息
    * @param WinTeam,胜利队 0===鸡，1===鸭
    *  */
    PreLoadGameRank(values: GameRankkItemInfo[],WinTeam: number) {
        if(WinTeam==0){
            this.Chicken_Title.forEach((item)=>{item.active = true})
            this.Duck_Title.forEach((item)=>{item.active = false})
        }else{
            this.Chicken_Title.forEach((item)=>{item.active = false})
            this.Duck_Title.forEach((item)=>{item.active = true})

        }
        let players = values
        for (let i = 0; i < 3; i++) {
            this.GameRank_Ranking[i].GetLiansheng.node.parent.active = true
            if (i >= players.length) {
                //默认设置
                this.SetTopDefaultItem(this.GameRank_Ranking[i])
                continue
            }
            this.GameRank_Ranking[i].HeadImage.sizeMode = Sprite.SizeMode.CUSTOM
            this.GameRank_Ranking[i].HeadImage.spriteFrame = players[i].avatar_sprite
            this.GameRank_Ranking[i].NickName.string = players[i].nickname
            this.GameRank_Ranking[i].Score.string = `${players[i].score < 100000 ? players[i].score : Math.floor(players[i].score / 10000) + `万`}`
            this.GameRank_Ranking[i].Liansheng.string = players[i].curliansheng + ``
            this.GameRank_Ranking[i].WorldRank.string = players[i].rank_no + ``
            this.GameRank_Ranking[i].GetScore.string = `+${players[i].getScore < 100000 ? players[i].getScore : Math.floor(players[i].getScore / 10000) + `万`}`
            if(players[i].getScore == 0){this.GameRank_Ranking[i].GetScore.string = ``}
            if (players[i].getLiansheng <= 0) {
                this.GameRank_Ranking[i].GetLiansheng.string = ``
            } else {
                this.GameRank_Ranking[i].GetLiansheng.string = `(+${players[i].getLiansheng})`
            }

            if (players[i].player_type == 0) {
                this.GameRank_Ranking[i].ChickenSign.forEach( (item)=>{ item.active = true} )
                this.GameRank_Ranking[i].DuckSign.forEach( (item)=>{ item.active = false} )
            } else {
                this.GameRank_Ranking[i].ChickenSign.forEach( (item)=>{ item.active = false} )
                this.GameRank_Ranking[i].DuckSign.forEach( (item)=>{ item.active = true} )
            }
        }
        if (players.length <= 3) { return }
        for (let i = 3; i < players.length && i < 100; i++) {
            this.SetUnderItem(players[i], i)
        }
    }

    /**设置后4名item */
    SetUnderItem(player: GameRankkItemInfo, rankIndex: number) {
        let item = this.GameRank_Ranking_Root.children[rankIndex - 3]
        if (item == null) {
            let Prefab = player.player_type == 0 ? this.GameRank_PlayerPrefab.Prefab[0] : this.GameRank_PlayerPrefab.Prefab[1]
            item = instantiate(Prefab)
            item.parent = this.GameRank_Ranking_Root
        }
        let RankingLabel = item.getChildByPath(this.GameRank_PlayerPrefab.RankPath).getComponent(Label)
        let HeadImage = item.getChildByPath(this.GameRank_PlayerPrefab.HeadImagePath).getComponent(Sprite)
        let NameLabel = item.getChildByPath(this.GameRank_PlayerPrefab.NamePath).getComponent(Label)
        let curlianshengLabel = item.getChildByPath(this.GameRank_PlayerPrefab.curlianshengPath).getComponent(Label)
        let ScoreLabel = item.getChildByPath(this.GameRank_PlayerPrefab.ScorePath).getComponent(Label)
        let WorldRankLabel = item.getChildByPath(this.GameRank_PlayerPrefab.WorldRankPath).getComponent(Label)
        let GetLianshengLabel = item.getChildByPath(this.GameRank_PlayerPrefab.GetLianshengPath).getComponent(Label)
        let GetScoreLabel = item.getChildByPath(this.GameRank_PlayerPrefab.GetScorePath).getComponent(Label)

        HeadImage.sizeMode = Sprite.SizeMode.CUSTOM
        HeadImage.spriteFrame = player.avatar_sprite
        RankingLabel.string = rankIndex + 1 + ``
        NameLabel.string = player.nickname
        ScoreLabel.string = `${player.score < 100000 ? player.score : Math.floor(player.score / 10000) + `万`}`
        curlianshengLabel.string = player.curliansheng + ``
        WorldRankLabel.string = player.rank_no + ``
        if (player.getLiansheng <= 0) {
            GetLianshengLabel.string = `吃了${player.curliansheng}道菜`
        } else {
            GetLianshengLabel.string = `吃了${player.curliansheng}道菜(+${player.getLiansheng})`
        }

        if(player.getScore!=0){
            GetScoreLabel.string = `+${player.getScore < 100000 ? player.getScore : Math.floor(player.getScore / 10000) + `万`}`
        }else{
            GetScoreLabel.string = ``
        }

    }


    SetTopDefaultItem(Item: GameRank_Ranking) {
        Item.HeadImage.sizeMode = Sprite.SizeMode.CUSTOM
        Item.HeadImage.spriteFrame = this.DefaultHeadImage
        Item.NickName.string = ``
        Item.Score.string = ``
        Item.WorldRank.string = ``
        Item.Liansheng.string = ``
        Item.GetScore.string = ``
        Item.ChickenSign.forEach( (item)=>{ item.active = false} )
        Item.DuckSign.forEach( (item)=>{ item.active = false} )
        Item.GetLiansheng.node.parent.active = false
    }

    ClickWorldRank() {
        this.WorldRank.active = true
    }

    /**
     * 关闭按钮
     */
    closeBtn() {
        this.GameRank_Ranking_Root.removeAllChildren()
        for(let i = 0;i<3;i++){
            this.GameRank_Ranking[i].ChickenSign.forEach(item=>{item.active = false})
            this.GameRank_Ranking[i].DuckSign.forEach(item=>{item.active = false})
        }
        this.node.active = false;
    }
    /**加载头像，返回spriteframe */
    loadImage(icon_url: string) {
        if (icon_url.length <= 3) { return; }
        return new Promise<SpriteFrame>((resolve, reject) => {
            assetManager.loadRemote(icon_url, { ext: `.png` }, (err, asset: ImageAsset) => {
                if (err) {
                    reject(err);
                } else {
                    const spriteFrame = new SpriteFrame();
                    const texture = new Texture2D()
                    texture.image = asset
                    spriteFrame.texture = texture
                    spriteFrame.packable = false
                    resolve(spriteFrame)
                }
            });
        });
    }
}


type GameRankkItemInfo = {
    //用户id
    open_id: string
    //用户头像url
    avatar_url: string
    //用户名字
    nickname: string
    //用户世界排行
    rank_no: number
    //当前连胜
    curliansheng: number
    //获得连胜
    getLiansheng: number
    //用户当局积分
    score: number
    //用户获得积分
    getScore: number
    //用户上周排行
    lastweek_rank_no: number
    //玩家类型 0 === 鸡，1 === 鸭
    player_type: number
    //头像
    avatar_sprite: SpriteFrame
}
