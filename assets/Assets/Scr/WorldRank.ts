import { _decorator, assetManager, CCBoolean, CCString, Component, find, ImageAsset, instantiate, Label, Layout, Node, Prefab, profiler, ScrollView, Sprite, SpriteFrame, Texture2D, Vec2, Vec3 } from 'cc';
// import { Sleep } from '../Scripts/Util/Util';
const { ccclass, property } = _decorator;
/**
 * 世界排行榜
 */
@ccclass(`WorldRank_PlayerPrefab`)
class WorldRank_PlayerPrefab {
    @property({ type: CCString, displayName: `用户名字` })
    NamePath: string
    @property({ type: CCString, displayName: `头像` })
    HeadImagePath: string
    @property({ type: CCString, displayName: `分数` })
    ScorePath: string
    @property({ type: CCString, displayName: `世界排行` })
    WorldRankPath: string
}
@ccclass(`WorldRank_Ranking`)
class WorldRank_Ranking {
    @property({ type: Node, displayName: `整个item` })
    Node: Node
    @property({ type: Sprite, displayName: `头像` })
    HeadImage: Sprite
    @property({ type: Label, displayName: `名字` })
    NickName: Label
    @property({ type: Label, displayName: `分数` })
    Score: Label
}
@ccclass('WorldRank')
export class WorldRank extends Component {
    @property({ type: CCBoolean, displayName: `测试模式` })
    TestModel: boolean
    TestData: WorldRankItemInfo[] = []
    private WorldRankItemList: Node[] = []

    @property({ type: Sprite })
    WorldRank_Btn_Close: Sprite;

    @property({ type: [WorldRank_Ranking] })
    WorldRank_Ranking: WorldRank_Ranking[] = []
    @property({ type: Node, displayName: `item的根节点` })
    WorldRank_Ranking_Root: Node
    @property({ type: Prefab })
    WorldRank_PlayerPrefab: Prefab

    @property({ type: WorldRank_PlayerPrefab })
    WorldRank_PlayerPrefabPath: WorldRank_PlayerPrefab = new WorldRank_PlayerPrefab();


    protected onLoad(): void {

        this.WorldRank_Btn_Close.node.on("touch-start", this.closeBtn.bind(this));

        this.LoadTestData()

    }
    async LoadTestData() {
        if (!this.TestModel) { return }
        for (let i = 1; i < 100; i++) {
            let avatar_sprite = await this.loadImage(`http://cdn.adota.cn//temp/avatar/0158aecf15014a88412622449019c11ca08a81bb.jpg`)
            let item: WorldRankItemInfo = {
                open_id: `${i}`,
                avatar_url: `http://cdn.adota.cn//temp/avatar/0158aecf15014a88412622449019c11ca08a81bb.jpg`,
                nickname: `${i}`,
                rank_no: i,
                total_score: 2 * (100 - i),
                lastweek_rank_no: 3 * (100 - i),
                avatar_sprite: avatar_sprite
            }
            this.TestData.push(item);
        }
        console.log(`TestData: `, this.TestData)
        this.PreLoadWorldRank(this.TestData)
    }

    start() {
    }

    OnPreLoadWorldRank(Data: WorldRankItemInfo[]) {
        this.PreLoadWorldRank(Data)
        this.node.active = false
    }
    OnShowWorldRank() {
        this.node.active = true
    }

    PreLoadWorldRank(users: WorldRankItemInfo[]) {
        for (let i = 0; i < 3; i++) {
            this.WorldRank_Ranking[i].Node.active = true
            if (i >= users.length) {
                //不显示
                this.WorldRank_Ranking[i].Node.active = false
                continue
            }
            this.WorldRank_Ranking[i].HeadImage.spriteFrame = users[i].avatar_sprite
            this.WorldRank_Ranking[i].NickName.string = users[i].nickname
            this.WorldRank_Ranking[i].Score.string = this.Reduce_10KFloor(users[i].total_score) + ``
        }
        if (users.length < 3) { return }
        for (let i = 3; i < users.length; i++) {
            let item = null
            if (Array.isArray(this.WorldRankItemList)) { item = this.WorldRankItemList[i - 3] } else { item = null }
            if (item == null) {
                item = instantiate(this.WorldRank_PlayerPrefab)
                item.parent = this.WorldRank_Ranking_Root
                this.WorldRankItemList.push(item)
            }
            item.getChildByPath(this.WorldRank_PlayerPrefabPath.NamePath).getComponent(Label).string = users[i].nickname
            item.getChildByPath(this.WorldRank_PlayerPrefabPath.WorldRankPath).getComponent(Label).string = `${i + 1}`
            item.getChildByPath(this.WorldRank_PlayerPrefabPath.ScorePath).getComponent(Label).string = this.Reduce_10KFloor(users[i].total_score) + ``
            item.getChildByPath(this.WorldRank_PlayerPrefabPath.HeadImagePath).getComponent(Sprite).sizeMode = Sprite.SizeMode.CUSTOM
            item.getChildByPath(this.WorldRank_PlayerPrefabPath.HeadImagePath).getComponent(Sprite).spriteFrame = users[i].avatar_sprite

        }


    }

    /**
     * 关闭按钮
     */
    closeBtn() {
        this.node.active = false
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
    /**超过10万，简化万 */
    Reduce_10KFloor(source: number): string {
        return source < 100000 ? Math.floor(source) + `` : (source / 10000).toFixed(2) + `万`
    }
}

/**世界排行 */
type WorldRankItemInfo = {
    //用户id
    open_id: string
    //用户头像url
    avatar_url: string
    //用户名字
    nickname: string
    //用户世界排行
    rank_no: number
    //用户总积分
    total_score: number
    //用户上周排行
    lastweek_rank_no: number
    //头像
    avatar_sprite?: SpriteFrame
}

