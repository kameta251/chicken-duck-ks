import { AttDuck } from "../../Data/DuckData";
import { GameManager, GameState } from "../../Manager/GameManager";
import { Player } from "../../Manager/PlayerManager"
import { Animation, Node, Sprite, Vec3, game, sp } from "cc";
import { ResUtil } from "../../Res/ResUtil";
import { BuffMgr } from "../../Buff/BuffMgr";
import { eAttrType, eBuffType } from "../../Buff/BuffBase";
import { PoolManager } from "../../Manager/PoolManager";

export class Duck {
    public EntityID: number
    public MonsterID: number
    public owner: Player
    public Entity: Node
    public Force: number
    public AnimationController: AnimationController
    public PlayerInfo: PlayerInfo
    public LiveTime: number
    public PlayerInfoHeight: number = 65

    //实现工具
    private CenterPos: boolean
    public isMainChar: boolean
    public MaxLiveTime: number
    CPosScale: number;
    NorScale: number;
    private TempForce: number = 0
    private Coin1Force: number = 0
    public Coin1Count: number = 0
    private Coin1CD: number = 0
    private MultForce: number = 0

    constructor(EntityID: number, Entity: Node, MonsterID: number, owner: Player) {
        this.EntityID = EntityID
        this.owner = owner
        this.Entity = Entity
        this.MonsterID = MonsterID
        this.AnimationController = new AnimationController(this.Entity)
        //玩家信息
        let playerinfo = GameManager.instance.EntityFactory.CreaterPlyaerInfo()
        this.PlayerInfo = new PlayerInfo(playerinfo, this.MonsterID, this)
        this.SetAtt(this.MonsterID)
        if (MonsterID == 2100) {
            this.LevelUp(MonsterID)
        }
    }

    OnUpdate() {
        this.CheckIsOne()
        this.UpdateCheckCoin1()
        this.AnimationUpdate()
    }

    OnGamingUpdate() {
        if (!this.isMainChar) {
            this.LiveTime -= game.deltaTime
            if (this.LiveTime <= 0) {
                GameManager.instance.DuckManager.DeleteDuck(this.EntityID)
                this.OnDestory()
            }
        }
        this.PlayerInfo.OnGamingUpdate()
    }

    AnimationUpdate() {
        if (GameManager.instance.state != GameState.Gaming) { this.playAnimation(AnimationState.Run1); return }
        if (this.TempForce > 0 || this.Coin1Force>0 || this.MultForce > 1) { this.playAnimation(AnimationState.Run2); return }
        else if (GameManager.instance.DataManager.ChickenData.totalForce > GameManager.instance.DataManager.DuckData.totalForce * 2 && this.isMainChar) { this.playAnimation(AnimationState.Run3); return }
        else { this.playAnimation(AnimationState.Run1) }
    }

    LikeClick() {
        if (GameManager.instance.state != GameState.Gaming) { return }
        let f = this.owner.GetOnceLikeAddForce
        this.TempForce += f
        setTimeout(() => {
            this.TempForce -= f
        }, 3000);
    }

    Send666() {
        if (GameManager.instance.state != GameState.Gaming) { return }
        let f = this.owner.GetOnceSendAddForce
        this.TempForce += f
        setTimeout(() => {
            if (!GameManager.instance.DataManager.DuckEntity.has(this.EntityID)) { return }
            this.TempForce -= f
        }, 10000);
    }

    SetAtt(MonsterID: number) {
        let Att = GameManager.instance.DataManager.DuckData.MonsterConfig.get(MonsterID)
        this.Force = Att.Force
        this.LiveTime = this.MaxLiveTime = Att.LiveTime
        this.CPosScale = Att.CPosScale
        this.NorScale = Att.NorScale
        this.PlayerInfoHeight = Att.InfoHeight
    }
    /**升级 */
    LevelUp(MonsterID: number) {
        this.MonsterID = MonsterID
        let Config = GameManager.instance.DataManager.ActionData.LevelCoinfig.find(config => config.mosnter_id === MonsterID);
        this.owner.GetOnceLikeAddForce = Config.like_add_force
        this.owner.GetOnceSendAddForce = Config.send_add_force
        this.AnimationController.SetSktData(this.MonsterID)
        this.AnimationController.ChangeState(AnimationState.None)
    }

    /**检查是否有Coin1 */
    UpdateCheckCoin1() {
        if (this.Coin1CD < game.totalTime - 5000) {
            if (this.Coin1Count <= 0) { this.Coin1Force = 0; return }
            this.Coin1CD = game.totalTime
            this.Coin1Count -= 1
            this.Coin1Force = this.owner.GetOnceLikeAddForce
        }
    }

    CheckIsOne() {
        if (!this.isMainChar) {
            this.PlayerInfo.IsNotOne(this.Entity.position)
            return
        }
        if (this.EntityID == GameManager.instance.DataManager.DuckFrontPlayers[0].main_character_id) {
            this.Entity.position = new Vec3(680, 960)
            this.Entity.scale = new Vec3(this.CPosScale, this.CPosScale, this.CPosScale)
            this.CenterPos = true
            this.PlayerInfo.IsOne(this.Entity.position)
        } else {
            if (this.CenterPos == true || this.CenterPos == null) {
                this.CenterPos = false
                this.Entity.position = GameManager.instance.DuckManager.GetRandomPos()
                this.Entity.scale = new Vec3(this.NorScale, this.NorScale, this.NorScale)
                this.PlayerInfo.IsNotOne(this.Entity.position)
            }
        }
    }

    public async playAnimation(state: AnimationState) {
        const clipName = this.AnimationController.getClipName(state);
        if (clipName) {
            if (this.AnimationController.ChangeState(state)) {
                await this.AnimationController.playSpineAnimation(clipName);
            }
        } else {
            console.error(`Spine animation clip ${state} not found`);
        }
    }
    /**计算力气 */
    GetForce() {
        let Mult_Birth = 1
        if (!this.isMainChar) {
            if (this.LiveTime > this.MaxLiveTime - 2) {
                Mult_Birth = 3
            }
        }
        this.MultForce = Mult_Birth
        if (GameManager.instance.state != GameState.Gaming) { this.MultForce = Mult_Birth = 1 }
        let Mult_Base = this.Force + this.TempForce + this.Coin1Force
        if(!this.isMainChar){
            Mult_Base = this.Force
        }
        return Mult_Base * Mult_Birth
    }

    OnDestory() {
        this.PlayerInfo.OnDestory()
        PoolManager.instance.InPool(this.MonsterID,this.Entity)
    }
}

enum AnimationState {
    None = "None",
    Run1 = "Run1",
    Run2 = "Run2",
    Run3 = "Run3"
}
// 这是你的角色动画控制器类
class AnimationController {
    private spineComponent: sp.Skeleton;
    private curState: AnimationState = AnimationState.Run1
    private animations: Record<AnimationState, string> = {
        [AnimationState.None]: "None",
        [AnimationState.Run1]: "Run1",
        [AnimationState.Run2]: "Run2",
        [AnimationState.Run3]: "Run3",
    };

    constructor(node: Node) {
        this.spineComponent = node.getComponent(sp.Skeleton);
        this.playSpineAnimation(AnimationState.Run1)
    }
    public ChangeState(state: AnimationState): boolean {
        if (this.curState == state) {
            return false
        } else {
            this.curState = state
            return true
        }
    }
    public playSpineAnimation(clipName: string): Promise<void> {
        return new Promise<void>(resolve => {
            this.spineComponent.setCompleteListener(() => {
                resolve();
            });
            this.spineComponent.setAnimation(0, clipName, true);
        });
    }
    public getClipName(state: AnimationState): string | null {
        return this.animations[state] || null;
    }

    public SetSktData(MonsterID: number) {
        switch (MonsterID) {
            case 2100:
                this.spineComponent.skeletonData = ResUtil.instance.resSpine.DuckSpine[0]
                break

            case 2101:
                this.spineComponent.skeletonData = ResUtil.instance.resSpine.DuckSpine[1]
                break

            case 2102:
                this.spineComponent.skeletonData = ResUtil.instance.resSpine.DuckSpine[2]
                break

            case 2103:
                this.spineComponent.skeletonData = ResUtil.instance.resSpine.DuckSpine[3]
                break

            case 2104:
                this.spineComponent.skeletonData = ResUtil.instance.resSpine.DuckSpine[4]
                break

            case 2105:
                this.spineComponent.skeletonData = ResUtil.instance.resSpine.DuckSpine[5]
                break

            case 2106:
                this.spineComponent.skeletonData = ResUtil.instance.resSpine.DuckSpine[6]
                break

            case 2107:
                this.spineComponent.skeletonData = ResUtil.instance.resSpine.DuckSpine[7]
                break

            case 2108:
                this.spineComponent.skeletonData = ResUtil.instance.resSpine.DuckSpine[8]
                break

            case 2109:
                this.spineComponent.skeletonData = ResUtil.instance.resSpine.DuckSpine[9]
                break

            case 2110:
                this.spineComponent.skeletonData = ResUtil.instance.resSpine.DuckSpine[10]
                break

        }
    }

}
class PlayerInfo {
    Node: Node
    Owner: Duck
    HeadImage: Sprite
    ChickenProgress: Sprite
    DuckProgress: Sprite
    Shadow: Node
    constructor(Node: Node, MonsterID: number, Owner: Duck) {
        this.Node = Node
        this.Owner = Owner
        this.HeadImage = this.Node.getChildByPath(`PlayerInfo_HeadBG/PlayerInfo_Head`).getComponent(Sprite)
        this.ChickenProgress = this.Node.getChildByPath(`TimeDown/Time_Chicken`).getComponent(Sprite)
        this.DuckProgress = this.Node.getChildByPath(`TimeDown/Time_Duck`).getComponent(Sprite)
        this.HeadImage.sizeMode = Sprite.SizeMode.CUSTOM
        this.ChickenProgress.node.active = false
        this.ChickenProgress.node.active = true
        this.ChickenProgress.fillRange = 1
        this.DuckProgress.fillRange = 1
        this.InitProgress(MonsterID)
        this.HeadImage.spriteFrame = this.Owner.owner.avatar_sprite
        this.Shadow = GameManager.instance.EntityFactory.CreaterShadow()
        switch (MonsterID) {
            case 2200:
            case 2300:
                break
            case 2400:
                this.Shadow.scale = new Vec3(2,1,1)
                break
            case 2401:
                this.Shadow.scale = new Vec3(2.5,1,1)
                break
            case 2500:
            case 2501:
                this.Shadow.scale = new Vec3(2,1,1)
                break
            case 2600:
            case 2601:
                break
        }
    }
    InitProgress(MonsterID: number) {
        this.ChickenProgress.node.parent.active = false
        switch (MonsterID) {
            case 2200:
            case 2300:
            case 2400:
            case 2500:
            case 2600:
            case 2401:
            case 2501:
            case 2601:
                this.ChickenProgress.node.parent.active = true
                this.ChickenProgress.node.active = false
                this.DuckProgress.node.active = true
                break
        }   
    }
    OnGamingUpdate() {
        if (this.Owner.isMainChar) { return }
        this.DuckProgress.fillRange = this.Owner.LiveTime / this.Owner.MaxLiveTime
    }
    IsOne(Pos: Vec3) {
        this.Node.position = new Vec3(0, 128, 0).add(Pos)
        this.Shadow.position = Pos
    }
    IsNotOne(Pos: Vec3) {
        this.Node.position = new Vec3(0, this.Owner.PlayerInfoHeight, 0).add(Pos)
        this.Shadow.position = Pos
    }
    OnDestory() {
        this.Node.destroy()
        this.Shadow.destroy()
    }
}