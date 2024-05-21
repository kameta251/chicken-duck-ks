import { _decorator, assetManager, CCFloat, CCInteger, CCString, Component, director, Enum, find, Font, ImageAsset, JsonAsset, Node, Prefab, sp, Sprite, SpriteFrame, Texture2D ,AudioClip} from 'cc';
import { GameProgress, NetManager } from '../Net/NetManager';
import { GameManager } from '../Manager/GameManager';
const { ccclass, property } = _decorator;

enum ImageType {
  None,
  EntityAssets,
  TipAssets,
}


@ccclass('ResUtil')
export class ResUtil extends Component {
  @property(JsonAsset)
  public configjson: JsonAsset;
  //配置表
  GameConfig: GameConfig = new GameConfig()
  //预制体
  @property
  resPrefabs: resPrefabs = new resPrefabs()
  //图像
  @property
  resImages: resImages = new resImages()
  //spine
  @property
  resSpine: resSpine = new resSpine()
  @property
  resFont:resFont=new resFont()
  @property
  resAudio:resAudio=new resAudio()

  private static _instance: ResUtil;
  static get instance() {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new ResUtil();
    return this._instance;
  }

  onLoad() {
    director.addPersistRootNode(this.node)
    ResUtil._instance = this;
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

  /**加载头像，直接显示出来sprite */
  async GetIconImage(icon_url: string, sp: Sprite) {
    //Logger.ConsoleLog("GetIconImage export :" + icon_url)
    if (icon_url.length <= 0) {
      return;
    }
    assetManager.loadRemote(icon_url, { ext: `.png` }, (err, asset: ImageAsset) => {
      const spriteFrame = new SpriteFrame();
      const texture = new Texture2D()
      texture.image = asset
      spriteFrame.texture = texture
      sp.spriteFrame = spriteFrame
      sp.spriteFrame.packable = false
      //Logger.ConsoleLog("sp:" + sp.node.name + " || asset:" + asset); 
    });
  }
}

export class GameConfig {
  public configjson: JsonAsset;

  /**保存配置表 */
  async SaveAllConfig(data) {
    let jsonData: any = data
    console.log(`配置表: `, jsonData)
    GameManager.instance.DataManager.ActionData.LoadCoinfig(jsonData.LevelCoinfig, jsonData.Score, jsonData.BroadcastConfig)
    GameManager.instance.DataManager.ChickenData.LoadCofnig(jsonData.Monster)
    GameManager.instance.DataManager.DuckData.LoadCofnig(jsonData.Monster)
    GameManager.instance.DataManager.MapData.LoadCoinfig(jsonData.MapConfig)
  }
}

/** *******************************各种enumProperty的基本属性**************************************************** */

@ccclass(`ChickenPrefabs`)
class ChickenPrefabs {
  @property({ type: Prefab })
  Chicken_1100: Prefab
  @property({ type: Prefab })
  Chicken_1200: Prefab
  @property({ type: Prefab })
  Chicken_1300: Prefab
  @property({ type: Prefab })
  Chicken_1400: Prefab
  @property({ type: Prefab })
  Chicken_1500: Prefab
  @property({ type: Prefab })
  Chicken_1600: Prefab
  @property({ type: Prefab })
  Chicken_1401: Prefab
  @property({ type: Prefab })
  Chicken_1501: Prefab
  @property({ type: Prefab })
  Chicken_1601: Prefab
}
@ccclass(`DuckPrefabs`)
class DuckPrefabs {
  @property({ type: Prefab })
  Duck_2100: Prefab
  @property({ type: Prefab })
  Duck_2200: Prefab
  @property({ type: Prefab })
  Duck_2300: Prefab
  @property({ type: Prefab })
  Duck_2400: Prefab
  @property({ type: Prefab })
  Duck_2500: Prefab
  @property({ type: Prefab })
  Duck_2600: Prefab
  @property({ type: Prefab })
  Duck_2401: Prefab
  @property({ type: Prefab })
  Duck_2501: Prefab
  @property({ type: Prefab })
  Duck_2601: Prefab
}

@ccclass(`TipPrefabs`)
class TipPrefabs {
  @property({ type: Prefab })
  Tip: Prefab
  @property({ type: Prefab })
  JoinCampHint_Chicken_Prefab: Prefab
  @property({ type: Prefab })
  JoinCampHint_Duck_Prefab: Prefab
  @property({ type: Prefab })
  JoinHint_Chicken_Prefab: Prefab
  @property({ type: Prefab })
  JoinHint_Duck_Prefab: Prefab
  
  @property({ type: Prefab })
  TotalsHint_Pro_Prefab: Prefab
  @property({ type: Prefab })
  JoinCampHint2_Chicken_Prefab: Prefab
  @property({ type: Prefab })
  JoinCampHint2_Duck_Prefab: Prefab


  @property({ type: Prefab })
  TotalsHint_Mini_Chicken_Great_Prefab: Prefab
  @property({ type: Prefab })
  TotalsHint_Mini_Chicken_Point_Prefab: Prefab
  @property({ type: Prefab })
  TotalsHint_Mini_Duck_Great_Prefab: Prefab
  @property({ type: Prefab })
  TotalsHint_Mini_Duck_Point_Prefab: Prefab

  @property({ type: Prefab })
  GiftChuChangChicken_Prefab: Prefab
  @property({ type: Prefab })
  GiftChuChangDuck_Prefab: Prefab
  @property({ type: Prefab })
  GiftChuChangOther_Prefab: Prefab
  @property({ type: Prefab })
  WordRankAnim_Prefab: Prefab
  

}

@ccclass(`TipImages`)
class TipImages {
  

  @property({ type: [SpriteFrame] })
  WorldRankChicken=new Array<SpriteFrame>()
  @property({ type: [SpriteFrame ]})
  WorldRankDuck=new Array<SpriteFrame>()


  @property({ type: [SpriteFrame] })
  Food_Chicken_Icon=new Array<SpriteFrame>()
  @property({ type: [SpriteFrame] })
  Food_Chicken_Title=new Array<SpriteFrame>()

  @property({ type: [SpriteFrame] })
  Food_Duck_Icon=new Array<SpriteFrame>()
  @property({ type: [SpriteFrame] })
  Food_Duck_Title=new Array<SpriteFrame>()
  
}

/**
 * 礼物头像类型小鸡
 */
@ccclass(`GiftChickenImages`)
class GiftChickenImages {
  @property({ type: [SpriteFrame] })
  JoinHint_ICON_11=new Array<SpriteFrame>()

  @property({ type: [SpriteFrame] })
  JoinHint_ICON_12=new Array<SpriteFrame>()

  @property({ type: [SpriteFrame] })
  JoinHint_ICON_13=new Array<SpriteFrame>()

  @property({ type: [SpriteFrame] })
  JoinHint_ICON_14=new Array<SpriteFrame>()

  @property({ type: [SpriteFrame] })
  JoinHint_ICON_15=new Array<SpriteFrame>()

  @property({ type: [SpriteFrame] })
  JoinHint_ICON_16=new Array<SpriteFrame>()
}


/**
 * 礼物头像类型小鸭
 */
@ccclass(`GiftDuckImages`)
class GiftDuckImages {
  @property({ type: [SpriteFrame] })
  JoinHint_ICON_21=new Array<SpriteFrame>()

  @property({ type: [SpriteFrame] })
  JoinHint_ICON_22=new Array<SpriteFrame>()

  @property({ type: [SpriteFrame] })
  JoinHint_ICON_23=new Array<SpriteFrame>()

  @property({ type: [SpriteFrame] })
  JoinHint_ICON_24=new Array<SpriteFrame>()

  @property({ type: [SpriteFrame] })
  JoinHint_ICON_25=new Array<SpriteFrame>()

  @property({ type: [SpriteFrame] })
  JoinHint_ICON_26=new Array<SpriteFrame>()
}


/** ***************************resPrefabs和resImages********************************************************** */
@ccclass('resPrefabs')
class resPrefabs {
  @property({ type: Enum(ImageType) })
  enumProperty: ImageType = ImageType.EntityAssets;
  @property({ type: ChickenPrefabs, visible() { return this.enumProperty === ImageType.EntityAssets; } })
  ChickenPrefabs: ChickenPrefabs = new ChickenPrefabs()
  @property({ type: DuckPrefabs, visible() { return this.enumProperty === ImageType.EntityAssets; } })
  DuckPrefabs: DuckPrefabs = new DuckPrefabs()
  @property({ type: TipPrefabs, visible() { return this.enumProperty === ImageType.TipAssets; } })
  TipPrefabs: TipPrefabs = new TipPrefabs()
  @property({ type: Prefab, visible() { return this.enumProperty === ImageType.EntityAssets; } })
  PlayerInfo: Prefab
  @property({ type: Prefab, visible() { return this.enumProperty === ImageType.EntityAssets; } })
  Map0: Prefab
  @property({ type: Prefab, visible() { return this.enumProperty === ImageType.EntityAssets; } })
  Map1: Prefab
  @property({ type: Prefab, visible() { return this.enumProperty === ImageType.EntityAssets; } })
  Map2: Prefab
  @property({ type: Prefab, visible() { return this.enumProperty === ImageType.EntityAssets; } })
  Map3: Prefab
  @property({ type: Prefab, visible() { return this.enumProperty === ImageType.EntityAssets; } })
  Scaleplate: Prefab
  @property({ type: Prefab, visible() { return this.enumProperty === ImageType.EntityAssets; } })
  Map_End_Chook: Prefab
  @property({ type: Prefab, visible() { return this.enumProperty === ImageType.EntityAssets; } })
  Map_End_Duck: Prefab
  @property({ type: Prefab, visible() { return this.enumProperty === ImageType.EntityAssets; } })
  Shadow: Prefab
}
@ccclass('resImages')
class resImages {
  @property({ type: Enum(ImageType) })
  enumProperty: ImageType = ImageType.EntityAssets;
  @property({ type: TipImages, visible() { return this.enumProperty === ImageType.TipAssets; } })
  TipImages: TipImages = new TipImages()
  @property({ type: GiftChickenImages, visible() { return this.enumProperty === ImageType.TipAssets; } })
  GiftChickenImages:GiftChickenImages=new GiftChickenImages()
  @property({ type: GiftDuckImages, visible() { return this.enumProperty === ImageType.TipAssets; } })
  GiftDuckImages:GiftDuckImages=new GiftDuckImages()
}
@ccclass(`resSpine`)
class resSpine {
  @property({ type: Enum(ImageType) })
  enumProperty: ImageType = ImageType.EntityAssets;
  @property({ type: [sp.SkeletonData], visible() { return this.enumProperty === ImageType.EntityAssets; } })
  ChickenSpine: sp.SkeletonData[] = []
  @property({ type: [sp.SkeletonData], visible() { return this.enumProperty === ImageType.EntityAssets; } })
  DuckSpine: sp.SkeletonData[] = []


  @property({ type: [sp.SkeletonData], visible() { return this.enumProperty === ImageType.TipAssets; } })
  Xiaoji_11: sp.SkeletonData[] = []
  @property({ type: [sp.SkeletonData], visible() { return this.enumProperty === ImageType.TipAssets; } })
  Xiaoji_12: sp.SkeletonData[] = []
  @property({ type: [sp.SkeletonData], visible() { return this.enumProperty === ImageType.TipAssets; } })
  Xiaoji_13: sp.SkeletonData[] = []
  @property({ type: [sp.SkeletonData], visible() { return this.enumProperty === ImageType.TipAssets; } })
  Xiaoji_14: sp.SkeletonData[] = []
  @property({ type: [sp.SkeletonData], visible() { return this.enumProperty === ImageType.TipAssets; } })
  Xiaoji_15: sp.SkeletonData[] = []
  @property({ type: [sp.SkeletonData], visible() { return this.enumProperty === ImageType.TipAssets; } })
  Xiaoji_16: sp.SkeletonData[] = []

  @property({ type: [sp.SkeletonData], visible() { return this.enumProperty === ImageType.TipAssets; } })
  Xiaoya_21: sp.SkeletonData[] = []
  @property({ type: [sp.SkeletonData], visible() { return this.enumProperty === ImageType.TipAssets; } })
  Xiaoya_22: sp.SkeletonData[] = []
  @property({ type: [sp.SkeletonData], visible() { return this.enumProperty === ImageType.TipAssets; } })
  Xiaoya_23: sp.SkeletonData[] = []
  @property({ type: [sp.SkeletonData], visible() { return this.enumProperty === ImageType.TipAssets; } })
  Xiaoya_24: sp.SkeletonData[] = []
  @property({ type: [sp.SkeletonData], visible() { return this.enumProperty === ImageType.TipAssets; } })
  Xiaoya_25: sp.SkeletonData[] = []
  @property({ type: [sp.SkeletonData], visible() { return this.enumProperty === ImageType.TipAssets; } })
  Xiaoya_26: sp.SkeletonData[] = []

  @property({ type: [sp.SkeletonData], visible() { return this.enumProperty === ImageType.TipAssets; } })
  WirldAnim_31: sp.SkeletonData[] = []
} 

@ccclass(`resFont`)
class resFont {
  @property({ type:Font})
  WorldFont1: Font
  @property({ type:Font})
  WorldFont2: Font
  @property({ type:Font})
  WorldFont3: Font
}
@ccclass(`resAudio`)
class resAudio {
  @property({ type:[AudioClip]})
  xiaoji_1400: AudioClip[]=[]
  @property({ type:[AudioClip]})
  xiaoji_1500: AudioClip[]=[]
  @property({ type:[AudioClip]})
  xiaoji_1600: AudioClip[]=[]

  @property({ type:[AudioClip]})
  xiaoya_2400: AudioClip[]=[]
  @property({ type:[AudioClip]})
  xiaoya_2500: AudioClip[]=[]
  @property({ type:[AudioClip]})
  xiaoya_2600: AudioClip[]=[]
}

