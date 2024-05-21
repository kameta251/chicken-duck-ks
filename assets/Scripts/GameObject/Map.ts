import { Label, Node, Size, Skeleton, Sprite, UITransform, Vec2, Vec3, find, instantiate, randomRange, sp } from "cc"
import { GameManager } from "../Manager/GameManager"
import { ResUtil } from "../Res/ResUtil"

export class Maps {
    GameMap: Node
    GameMapRoot: Node
    GameMapGuangzhongRoot: Node
    ChickenRoot: Node
    DuckRoot: Node
    PlayerInfoRoot: Node
    CharacterShadow: Node
    Scaleplate: Node
    GameChar: Node
    NullGameRank: Node
    Guanzhong: sp.Skeleton[] = []
    DragMark_Right: DragMark = new DragMark()
    DragMark_Left: DragMark = new DragMark()
    MaxLeft: number = 0
    MaxRight: number = 0
    OnLoadMain() {
        this.GameMap = find(`Canvas/GameMap`)
        this.GameChar = find(`Canvas/GameChar`)
        this.NullGameRank = find(`Canvas/Ranking/NullGameRank`)
        this.DragMark_Left.Node = find(`Canvas/GameMap/DragMark/DragMark1_b`)
        this.DragMark_Right.Node = find(`Canvas/GameMap/DragMark/DragMark1_a`)
        this.DragMark_Left.Vertex = find(`Canvas/GameMap/DragMark/DragMark2b`)
        this.DragMark_Left.VSktAni = this.DragMark_Left.Vertex.getComponent(sp.Skeleton)
        this.DragMark_Left.Sprite = find(`Canvas/GameMap/DragMark/DragMark1_b`).getComponent(Sprite)
        this.DragMark_Right.Vertex = find(`Canvas/GameMap/DragMark/DragMark2a`)
        this.DragMark_Right.VSktAni = this.DragMark_Right.Vertex.getComponent(sp.Skeleton)
        this.DragMark_Right.Sprite = find(`Canvas/GameMap/DragMark/DragMark1_a`).getComponent(Sprite)
        this.Scaleplate = find(`Canvas/GameMap/Map_Scaleplate`)
        this.GameMapRoot = new Node(`GameMapRoot`)
        this.GameMapGuangzhongRoot = find(`Canvas/GameMapGuangzhongRoot`)
        this.ChickenRoot = new Node(`ChickenRoot`)
        this.DuckRoot = new Node(`DuckRoot`)
        this.CharacterShadow = new Node(`CharacterShadow`)
        this.PlayerInfoRoot = new Node(`PlayerInfoRoot`)
        this.ChickenRoot.addComponent(UITransform).contentSize = new Size(1080, 1920)
        this.DuckRoot.addComponent(UITransform).contentSize = new Size(1080, 1920)
        this.CharacterShadow.addComponent(UITransform).contentSize = new Size(1080, 1920)
        this.PlayerInfoRoot.addComponent(UITransform).contentSize = new Size(1080, 1920)
        this.ChickenRoot.position = new Vec3(-540, -960, 0)
        this.DuckRoot.position = new Vec3(-540, -960, 0)
        this.PlayerInfoRoot.position = new Vec3(-540, -960, 0)
        this.CharacterShadow.position = new Vec3(-540, -960, 0)
        this.DragMark_Left.Node.getComponent(UITransform).contentSize = new Size(12600, 70)
        this.DragMark_Right.Node.getComponent(UITransform).contentSize = new Size(12600, 70)

        this.GameChar.removeAllChildren()
        this.GameChar.addChild(this.CharacterShadow)
        this.GameChar.addChild(this.ChickenRoot)
        this.GameChar.addChild(this.DuckRoot)
        this.GameChar.addChild(this.PlayerInfoRoot)
        this.GameMap.insertChild(this.GameMapRoot, 0)

        this.InitMap()
    }

    OnGamingUpdate(speed: number) {
        this.GameMapRoot.position = new Vec3(-speed, 0, 0).add(this.GameMapRoot.position)
        if (GameManager.instance.DataManager.BaseProgress > this.MaxRight) {
            this.MaxRight = GameManager.instance.DataManager.BaseProgress;
            //播放右边土堆动画
            this.DragMark_Right.PlayVertexAniamtion()
        }
        if (GameManager.instance.DataManager.BaseProgress < this.MaxLeft) {
            this.MaxLeft = GameManager.instance.DataManager.BaseProgress
            //播放左边土堆动画
            this.DragMark_Left.PlayVertexAniamtion()
        }

        let Mid = GameManager.instance.DataManager.MaxProgeress / 2
        let Posx_left = (this.MaxLeft - Mid) * 21 
        let Posx_right = (this.MaxRight - Mid) * 21 
        let Progress_Left = (Mid - this.MaxLeft) / Mid
        let Progress_Right = (this.MaxRight - Mid) / Mid
        this.DragMark_Left.Vertex.position = new Vec3(Posx_left, 25, 0)
        this.DragMark_Right.Vertex.position = new Vec3(Posx_right, 25, 0)
        this.DragMark_Left.Sprite.fillRange = Progress_Left
        this.DragMark_Right.Sprite.fillRange = Progress_Right
        this.GameMapGuangzhongRoot.position = this.GameMapRoot.position

    }

    Reset() {
        this.NullGameRank.active = false
        this.GameMapRoot.position = Vec3.ZERO
        this.GameMapGuangzhongRoot.position = Vec3.ZERO
        this.ChickenRoot.removeAllChildren()
        this.DuckRoot.removeAllChildren()
        this.CharacterShadow.removeAllChildren()
        this.PlayerInfoRoot.removeAllChildren()
        this.MaxLeft = GameManager.instance.DataManager.MaxProgeress / 2
        this.MaxRight = GameManager.instance.DataManager.MaxProgeress / 2
        this.DragMark_Left.Node.getComponent(UITransform).contentSize = new Size(12600, 70)
        this.DragMark_Right.Node.getComponent(UITransform).contentSize = new Size(12600, 70)
        this.DragMark_Left.Vertex.position = new Vec3(0, 25, 0)
        this.DragMark_Right.Vertex.position = new Vec3(0, 25, 0)
        this.DragMark_Left.Sprite.fillRange = 0
        this.DragMark_Right.Sprite.fillRange = 0
        this.Guanzhong.forEach((item)=>{item.setAnimation(0,`He_cai`,true)})
        this.PlayGuanzhong(false)
    }

    InitMap() {
        let Map0 = GameManager.instance.EntityFactory.CreaterMap(0)
        let Map2 = GameManager.instance.EntityFactory.CreaterMap(2)
        Map0.position = Vec3.ZERO
        Map2.position = Vec3.ZERO
        let skeleton0 = Map2.getChildByPath(`guanzhong`).getComponent(sp.Skeleton)
        this.Guanzhong.push(skeleton0)
        for (let i = 0; i < 21; i++) {
            if (i == 10) { continue }
            let Map1 = GameManager.instance.EntityFactory.CreaterMap(1)
            let Map3 = GameManager.instance.EntityFactory.CreaterMap(3)
            Map1.position = new Vec3(2556 * (i - 10), 0, 0)
            Map3.position = Map1.position
            let skeleton1 = Map3.getChildByPath(`guanzhong`).getComponent(sp.Skeleton)
            let Map_1_Middle_2 = Map1.getChildByPath(`Map_1_Middle_2`)
            randomRange(0,100)<50? Map_1_Middle_2.active = true: Map_1_Middle_2.active = false
            this.Guanzhong.push(skeleton1)
        }
        for (let i = 1; i < 24; i++) {
            let Scaleplate = GameManager.instance.EntityFactory.CreaterScaleplate()
            Scaleplate.position = new Vec3(1050 * (i - 12), 0, 0)
            Scaleplate.getChildByPath(`ScaleplateBG/ScaleplateLabel`).getComponent(Label).string = `${50 * Math.abs(i - 12)}m`
        }
        let Map_End_Chook = instantiate(ResUtil.instance.resPrefabs.Map_End_Chook)
        Map_End_Chook.parent = GameManager.instance.Maps.Scaleplate
        Map_End_Chook.position = new Vec3(1050 * (0 - 12), 80, 0)
        let Map_End_Duck = instantiate(ResUtil.instance.resPrefabs.Map_End_Duck)
        Map_End_Duck.parent = GameManager.instance.Maps.Scaleplate
        Map_End_Duck.position = new Vec3(1050 * (24 - 12), 80, 0)
        GameManager.instance.Maps.Scaleplate.parent = GameManager.instance.Maps.GameMapRoot
        this.DragMark_Left.Node.parent.parent = this.GameMapRoot
        this.Reset()
    }

    PlayGuanzhong(isPlay: boolean){
        this.Guanzhong.forEach((item)=>{item.paused = !isPlay;})
    } 
}

class DragMark {
    Node: Node
    Sprite: Sprite
    Vertex: Node
    VSktAni: sp.Skeleton
    VAniPlaying: Boolean = false

    /**播放顶点动画 */
    PlayVertexAniamtion() {
        this.VSktAni.setCompleteListener(() => {
            this.VAniPlaying = false
        })
        // 如果土堆动画正在播放，return
        if (this.VAniPlaying) { return }
        // 切换动画
        this.VSktAni.setAnimation(0, `act_DragMark`, false);
        this.VAniPlaying = true
    }
}   