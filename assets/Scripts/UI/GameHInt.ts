import { _decorator, Component, find, instantiate, Label, Layout, Node, random, Sprite, SpriteFrame, Skeleton, tween, Vec3, sp, AudioClip, AudioSource, log } from 'cc';
import { GameManager } from '../Manager/GameManager';
import { ResUtil } from '../Res/ResUtil';
import { Player } from '../Manager/PlayerManager';

const { ccclass, property } = _decorator;

/**
 * 玩家加入等提示
 */
@ccclass('GameHInt')
export class GameHInt {

    GameHint: Node;
    GameUI: Node

    audioSource:AudioSource

    //小鸡加入
    JoinCampHint_Chicken_Prefab: Node;
    JoinCampHint_Chicken_Number = 0;
    JoinCampHint_Chicken_map = new Map<number, Node>();
    Show_JoinCampHint_Chicken = false


    //小鸭加入
    JoinCampHint_Duck_Prefab: Node;
    JoinCampHint_Duck_Number = 0;
    JoinCampHint_Duck_map = new Map<number, Node>();
    Show_JoinCampHint_Duck = false


    //召唤小鸡升级小播报
    JoinHint_Chicken_Prefab: Node;
    JoinHint_Chicken_Prefab_Number = 0;
    JoinHint_Chicken_Prefab_map = new Map<number, Node>();
    Show_JoinHint_Chicken_Prefab = false


    //召唤小鸭小播报
    JoinHint_Duck_Prefab: Node;
    JoinHint_Duck_Prefab_Number = 0;
    JoinHint_Duck_Prefab_map = new Map<number, Node>();
    Show_JoinHint_Duck_Prefab = false


    //粉丝团小鸡加入
    JoinCampHint2_Chicken_Prefab: Node;
    JoinCampHint2_Chicken_Prefab_Number = 0;
    JoinCampHint2_Chicken_Prefab_map = new Map<number, Node>();
    Show_JoinCampHint2_Chicken = false


    //粉丝团小鸭加入
    JoinCampHint2_Duck_Prefab: Node;
    JoinCampHint2_Duck_Prefab_Number = 0;
    JoinCampHint2_Duck_Prefab_map = new Map<number, Node>();
    Show_JoinCampHint2_Duck = false


    //小鸡累计积分小播报
    TotalsHint_Mini_Chicken_Point_Prefab: Node;
    TotalsHint_Mini_Chicken_Point_Prefab_Number = 0;
    TotalsHint_Mini_Chicken_Point_Prefab_map = new Map<number, Node>();
    Show_TotalsHint_Mini_Chicken_Point_Prefab = false


    //小鸭累计积分小播报
    TotalsHint_Mini_Duck_Point_Prefab: Node;
    TotalsHint_Mini_Duck_Point_Prefab_Number = 0;
    TotalsHint_Mini_Duck_Point_Prefab_map = new Map<number, Node>();
    Show_TotalsHint_Mini_Duck_Point_Prefab = false


    //小鸡点赞手速
    TotalsHint_Mini_Chicken_Great_Prefab: Node;
    TotalsHint_Mini_Chicken_Great_Prefab_Number = 0;
    TotalsHint_Mini_Chicken_Great_Prefab_map = new Map<number, Node>();
    Show_TotalsHint_Mini_Chicken_Great_Prefab = false

    //小鸭点赞手速
    TotalsHint_Mini_Duck_Great_Prefab: Node;
    TotalsHint_Mini_Duck_Great_Prefab_Number = 0;
    TotalsHint_Mini_Duck_Great_Prefab_map = new Map<number, Node>();
    Show_TotalsHint_Mini_Duck_Great_Prefab = false

    //礼物全屏出场动画
    GiftChuChang_Prefab_Number = 0;
    GiftChuChang_Prefab_map = new Map<number, GiftDesc>();
    Show_GiftChuChang_Prefab = false


    //累计积分大播报
    // TotalsHint_Pro_Prefab: Node;
    // Show_TotalsHint_Pro_Prefab=false;
    // TotalsHint_Pro_PlayerHead_Sprite:Sprite
    // TotalsHint_Pro_PlayerName_Label:Label
    // //累计积分
    // TotalsHint_Pro_PlayerTotalsh_Label:Label 

    postionY = 100;


    onLoad() {

        this.GameUI = find("Canvas/GameUI")
        this.GameHint = find("Canvas/GameUI/GameHint");
        this.GameHint.active = true
        this.audioSource=find("Canvas/GameUI").getComponent(AudioSource)

        // this.addJoinHintDuckTip(null)

        // for (let index = 0; index < 10; index++) {
        //     this.addFansDuckTip(null);

        // }
        

    }

    setReset() {
        this.JoinCampHint_Chicken_map.clear();
        this.JoinCampHint_Duck_map.clear();
        this.JoinCampHint2_Chicken_Prefab_map.clear();
        this.JoinCampHint2_Duck_Prefab_map.clear();
        this.JoinHint_Chicken_Prefab_map.clear();
        this.JoinHint_Duck_Prefab_map.clear();
        this.TotalsHint_Mini_Chicken_Great_Prefab_map.clear()
        this.TotalsHint_Mini_Duck_Great_Prefab_map.clear()
        this.TotalsHint_Mini_Chicken_Point_Prefab_map.clear()
        this.TotalsHint_Mini_Duck_Point_Prefab_map.clear()
        this.GiftChuChang_Prefab_map.clear()
    }

    onUpdate() {


        //小鸡加入
        this.JoinCampHint_Chicken_map.forEach((val, key) => {

            if (this.Show_JoinCampHint_Chicken) {
                return
            }

            this.Show_JoinCampHint_Chicken = true;
            val.parent = this.GameHint;
            this.JoinCampHint_Chicken_map.delete(key);

            tween(val).to(0.1, { position: new Vec3(-400, this.postionY, 0) },
                {
                    onComplete: (target?: object) => {
                        setTimeout(() => {
                            this.Show_JoinCampHint_Chicken = false
                            val.removeFromParent();
                        }, 1000);

                    }
                }
            ).start();
        })


        //小鸭加入
        this.JoinCampHint_Duck_map.forEach((val, key) => {

            if (this.Show_JoinCampHint_Duck) {
                return
            }

            this.Show_JoinCampHint_Duck = true;
            val.parent = this.GameHint;
            this.JoinCampHint_Duck_map.delete(key);

            tween(val).to(0.1, { position: new Vec3(400, this.postionY, 0) },
                {
                    onComplete: (target?: object) => {
                        setTimeout(() => {
                            this.Show_JoinCampHint_Duck = false
                            val.removeFromParent();
                        }, 1000);

                    }
                }
            ).start();
        })



        //小鸡粉丝加入
        this.JoinCampHint2_Chicken_Prefab_map.forEach((val, key) => {

            if (this.Show_JoinCampHint2_Chicken) {
                return
            }

            this.Show_JoinCampHint2_Chicken = true;
            val.parent = this.GameHint;
            this.JoinCampHint2_Chicken_Prefab_map.delete(key);

            tween(val).to(0.1, { position: new Vec3(-400, 300 + this.postionY, 0) },
                {
                    onComplete: (target?: object) => {
                        setTimeout(() => {
                            this.Show_JoinCampHint2_Chicken = false
                            val.removeFromParent();
                        }, 1000);

                    }
                }
            ).start();
        })



        //小鸭粉丝加入
        this.JoinCampHint2_Duck_Prefab_map.forEach((val, key) => {

            if (this.Show_JoinCampHint2_Duck) {
                return
            }

            this.Show_JoinCampHint2_Duck = true;
            val.parent = this.GameHint;
            this.JoinCampHint2_Duck_Prefab_map.delete(key);

            tween(val).to(0.1, { position: new Vec3(400, 300 + this.postionY, 0) },
                {
                    onComplete: (target?: object) => {
                        setTimeout(() => {
                            this.Show_JoinCampHint2_Duck = false
                            val.removeFromParent();
                        }, 1000);

                    }
                }
            ).start();
        })


        //召唤小鸡升级
        this.JoinHint_Chicken_Prefab_map.forEach((val, key) => {

            if (this.Show_JoinHint_Chicken_Prefab) {
                return
            }

            this.Show_JoinHint_Chicken_Prefab = true;
            val.parent = this.GameHint;
            this.JoinHint_Chicken_Prefab_map.delete(key);

            tween(val).to(0.1, { position: new Vec3(-400, 150 + this.postionY, 0) },
                {
                    onComplete: (target?: object) => {
                        setTimeout(() => {
                            this.Show_JoinHint_Chicken_Prefab = false
                            val.removeFromParent();
                        }, 2000);

                    }
                }
            ).start();
        })


        //召唤小鸭升级
        this.JoinHint_Duck_Prefab_map.forEach((val, key) => {

            if (this.Show_JoinHint_Duck_Prefab) {
                return
            }

            this.Show_JoinHint_Duck_Prefab = true;
            val.parent = this.GameHint;
            this.JoinHint_Duck_Prefab_map.delete(key);

            tween(val).to(0.1, { position: new Vec3(400, 150 + this.postionY, 0) },
                {
                    onComplete: (target?: object) => {
                        setTimeout(() => {
                            this.Show_JoinHint_Duck_Prefab = false
                            val.removeFromParent();
                        }, 2000);

                    }
                }
            ).start();
        })





        //小鸡点赞小播报
        this.TotalsHint_Mini_Chicken_Great_Prefab_map.forEach((val, key) => {

            if (this.Show_TotalsHint_Mini_Chicken_Great_Prefab) {
                return
            }

            let PlayerTotalsh_Label = val.getChildByPath("TotalsInfo/PlayerTotalsh_Label").getComponent(Label);
            let shuzhi = PlayerTotalsh_Label.string;
            PlayerTotalsh_Label.string = 0 + "";

            this.Show_TotalsHint_Mini_Chicken_Great_Prefab = true;
            val.parent = this.GameHint;
            this.TotalsHint_Mini_Chicken_Great_Prefab_map.delete(key);
            this.showShuzhi(PlayerTotalsh_Label, Number(shuzhi))

            tween(val).to(0.1, { position: new Vec3(-400, -90 + this.postionY, 0) },
                {
                    onComplete: (target?: object) => {
                        setTimeout(() => {
                            this.Show_TotalsHint_Mini_Chicken_Great_Prefab = false
                            val.removeFromParent();
                        }, 2000);

                    }
                }
            ).start();
        })




        //小鸭点赞小播报
        this.TotalsHint_Mini_Duck_Great_Prefab_map.forEach((val, key) => {

            if (this.Show_TotalsHint_Mini_Duck_Great_Prefab) {
                return
            }

            let PlayerTotalsh_Label = val.getChildByPath("TotalsInfo/PlayerTotalsh_Label").getComponent(Label);
            let shuzhi = PlayerTotalsh_Label.string;
            PlayerTotalsh_Label.string = 0 + "";

            this.Show_TotalsHint_Mini_Duck_Great_Prefab = true;
            val.parent = this.GameHint;
            this.TotalsHint_Mini_Duck_Great_Prefab_map.delete(key);
            this.showShuzhi(PlayerTotalsh_Label, Number(shuzhi))

            tween(val).to(0.1, { position: new Vec3(400, -90 + this.postionY, 0) },
                {
                    onComplete: (target?: object) => {
                        setTimeout(() => {
                            this.Show_TotalsHint_Mini_Duck_Great_Prefab = false
                            val.removeFromParent();
                        }, 2000);

                    }
                }
            ).start();
        })



        //小鸡累计积分小播报
        this.TotalsHint_Mini_Chicken_Point_Prefab_map.forEach((val, key) => {

            if (this.Show_TotalsHint_Mini_Chicken_Point_Prefab) {
                return
            }

            this.Show_TotalsHint_Mini_Chicken_Point_Prefab = true;

            let PlayerTotalsh_Label = val.getChildByPath("TotalsInfo/PlayerTotalsh_Label").getComponent(Label);
            let shuzhi = PlayerTotalsh_Label.string;
            PlayerTotalsh_Label.string = 0 + "";

            val.parent = this.GameHint;
            this.TotalsHint_Mini_Chicken_Point_Prefab_map.delete(key);
            this.showShuzhi(PlayerTotalsh_Label, Number(shuzhi))

            tween(val).to(0.1, { position: new Vec3(-400, -180 + this.postionY, 0) },
                {
                    onComplete: (target?: object) => {


                        setTimeout(() => {
                            this.Show_TotalsHint_Mini_Chicken_Point_Prefab = false
                            val.removeFromParent();
                        }, 2000);

                    }
                }
            ).start();
        })




        //小鸭累计积分小播报
        this.TotalsHint_Mini_Duck_Point_Prefab_map.forEach((val, key) => {

            if (this.Show_TotalsHint_Mini_Duck_Point_Prefab) {
                return
            }

            this.Show_TotalsHint_Mini_Duck_Point_Prefab = true;

            let PlayerTotalsh_Label = val.getChildByPath("TotalsInfo/PlayerTotalsh_Label").getComponent(Label);
            let shuzhi = PlayerTotalsh_Label.string;
            PlayerTotalsh_Label.string = 0 + "";

            val.parent = this.GameHint;
            this.TotalsHint_Mini_Duck_Point_Prefab_map.delete(key);
            this.showShuzhi(PlayerTotalsh_Label, Number(shuzhi))

            tween(val).to(0.1, { position: new Vec3(400, -180 + this.postionY, 0) },
                {
                    onComplete: (target?: object) => {


                        setTimeout(() => {
                            this.Show_TotalsHint_Mini_Duck_Point_Prefab = false
                            val.removeFromParent();
                        }, 2000);

                    }
                }
            ).start();
        })





        //礼物全屏出场动画
        this.GiftChuChang_Prefab_map.forEach((val, key) => {

            if (this.Show_GiftChuChang_Prefab ) {
                return
            }

            this.Show_GiftChuChang_Prefab = true;
            this.GiftChuChang_Prefab_map.delete(key);
            if(val.type===3){
              this.showWorldGameFull(val.Player)
            }else{
                this.showGiftFull(val)
            }
            
        })
        

    }

    /**
     * 
     * @param play 小鸡玩家加入
     */
    addChickenTip(player: Player) {


        // if (this.JoinCampHint_Chicken_Prefab == null) {
        this.JoinCampHint_Chicken_Prefab = instantiate(ResUtil.instance.resPrefabs.TipPrefabs.JoinCampHint_Chicken_Prefab);
        // }
        this.JoinCampHint_Chicken_Prefab.position = new Vec3(-610, this.postionY, 0)
        let JoinCampHint_PlayerHead = this.JoinCampHint_Chicken_Prefab.getChildByPath("JoinCampHint_PlayerHead").getComponent(Sprite);
        let PlayerNameLabel = this.JoinCampHint_Chicken_Prefab.getChildByPath("PlayerNameLabel").getComponent(Label);

        // ResUtil.instance.GetIconImage("http://cdn.adota.cn//temp/avatar/0158aecf15014a88412622449019c11ca08a81bb.jpg", JoinCampHint_PlayerHead);
        JoinCampHint_PlayerHead.spriteFrame = player.avatar_sprite
        PlayerNameLabel.string = player.nickname;

        this.JoinCampHint_Chicken_Number++;
        this.JoinCampHint_Chicken_map.set(this.JoinCampHint_Chicken_Number, this.JoinCampHint_Chicken_Prefab)



    }


    /**
     * 
     * @param player 小鸭玩家加入
     */
    addDuckTip(player: Player) {

        // if (this.JoinCampHint_Duck_Prefab == null) {
        this.JoinCampHint_Duck_Prefab = instantiate(ResUtil.instance.resPrefabs.TipPrefabs.JoinCampHint_Duck_Prefab);
        this.JoinCampHint_Duck_Prefab.position = new Vec3(610, this.postionY, 0)
        // }

        let JoinCampHint_PlayerHead = this.JoinCampHint_Duck_Prefab.getChildByPath("JoinCampHint_PlayerHead").getComponent(Sprite);
        let PlayerNameLabel = this.JoinCampHint_Duck_Prefab.getChildByPath("PlayerNameLabel").getComponent(Label);

        JoinCampHint_PlayerHead.spriteFrame = player.avatar_sprite
        PlayerNameLabel.string = player.nickname;

        this.JoinCampHint_Duck_Number++;
        this.JoinCampHint_Duck_map.set(this.JoinCampHint_Duck_Number, this.JoinCampHint_Duck_Prefab)

    }


    /**
    * 
    * @param player 小鸡粉丝加入
    */
    addFansChickenTip(player: Player) {

        // if (this.JoinHint_Chicken_Prefab == null) {
        this.JoinCampHint2_Chicken_Prefab = instantiate(ResUtil.instance.resPrefabs.TipPrefabs.JoinCampHint2_Chicken_Prefab);
        this.JoinCampHint2_Chicken_Prefab.position = new Vec3(-800, 300 + this.postionY, 0)
        // }

        let JoinCampHint_PlayerHead = this.JoinCampHint2_Chicken_Prefab.getChildByPath("JoinCampHint_BaseBG/JoinCampHint_PlayerHead").getComponent(Sprite);
        let PlayerNameLabel = this.JoinCampHint2_Chicken_Prefab.getChildByPath("PlayerNameLabel").getComponent(Label);



        JoinCampHint_PlayerHead.spriteFrame = player.avatar_sprite
        PlayerNameLabel.string = player.nickname;

        this.JoinCampHint2_Chicken_Prefab_Number++;
        this.JoinCampHint2_Chicken_Prefab_map.set(this.JoinCampHint2_Chicken_Prefab_Number, this.JoinCampHint2_Chicken_Prefab)

    }

    /**
  * 
  * @param player 小鸭粉丝加入
  */
    addFansDuckTip(player: Player) {

        // if (this.JoinCampHint2_Duck_Prefab == null) {
        this.JoinCampHint2_Duck_Prefab = instantiate(ResUtil.instance.resPrefabs.TipPrefabs.JoinCampHint2_Duck_Prefab);
        this.JoinCampHint2_Duck_Prefab.position = new Vec3(800, 300 + this.postionY, 0)
        // }

        let JoinCampHint_PlayerHead = this.JoinCampHint2_Duck_Prefab.getChildByPath("JoinCampHint_BaseBG/JoinCampHint_PlayerHead").getComponent(Sprite);
        let PlayerNameLabel = this.JoinCampHint2_Duck_Prefab.getChildByPath("PlayerNameLabel").getComponent(Label);


        JoinCampHint_PlayerHead.spriteFrame = player.avatar_sprite
        PlayerNameLabel.string = player.nickname;

        this.JoinCampHint2_Duck_Prefab_Number++;
        this.JoinCampHint2_Duck_Prefab_map.set(this.JoinCampHint2_Duck_Prefab_Number, this.JoinCampHint2_Duck_Prefab)

    }




    /**
     * 召唤小鸡升级小播报
     * @param player 
     */
    addJoinHintChickenTip(data: NotificationData) {
        let player = data.data.player as Player
        // 0,1,2,3,4,5五种礼物
        let GiftIndex = data.data.giftIndexID as number
        //这次礼物送的数量
        let gift_num = data.data.gift_num as number
        let stage = player.stage as number

        let start_num = player.gift_num[GiftIndex] > 5 ? 5 : player.gift_num[GiftIndex]
        if (GiftIndex === 0 || GiftIndex === 1 || GiftIndex === 2) {
            start_num = 0;
        }



        this.JoinHint_Chicken_Prefab = instantiate(ResUtil.instance.resPrefabs.TipPrefabs.JoinHint_Chicken_Prefab);
        this.JoinHint_Chicken_Prefab.position = new Vec3(-680, 150 + this.postionY, 0)
        // this.JoinHint_Chicken_Prefab.parent = this.GameHint


        let JoinHint_TempHead = this.JoinHint_Chicken_Prefab.getChildByPath("JoinHint_BaseBG_Chicken/JoinHint_TempHead").getComponent(Sprite);
        let PlayerNameLabel = this.JoinHint_Chicken_Prefab.getChildByPath("JoinHint_BaseBG_Chicken/PlayerNameLabel").getComponent(Label);
        let JoinHint_ICON = this.JoinHint_Chicken_Prefab.getChildByPath("JoinHint_BaseBG_Chicken/JoinHint_ICON").getComponent(Sprite);
        let JoinHintLabel = this.JoinHint_Chicken_Prefab.getChildByPath("JoinHint_BaseBG_Chicken/JoinHintLabel").getComponent(Label)

        //x999
        let QuantityLabel = this.JoinHint_Chicken_Prefab.getChildByPath('JoinHint_BaseBG_Chicken/JoinHintQuantity/QuantityLabel').getComponent(Label)

        //星星
        let StarsNode = this.JoinHint_Chicken_Prefab.getChildByPath('JoinHint_BaseBG_Chicken/Stars')
        StarsNode.active = true;

        let Stars = StarsNode.children;
        if (start_num === 0) {
            StarsNode.active = false;
        }

        for (let index = 0; index < Stars.length; index++) {
            Stars[index].active = false;
        }

        for (let index = 0; index < start_num; index++) {
            Stars[index].active = true;
        }


        JoinHint_TempHead.spriteFrame = player.avatar_sprite
        PlayerNameLabel.string = player.nickname;
        QuantityLabel.string = gift_num + ''

        JoinHintLabel.string = this.getGiftChicken(GiftIndex, start_num, stage).desc
        JoinHint_ICON.spriteFrame = this.getGiftChicken(GiftIndex, start_num, stage).icon

        this.JoinHint_Chicken_Prefab_Number++;
        this.JoinHint_Chicken_Prefab_map.set(this.JoinHint_Chicken_Prefab_Number, this.JoinHint_Chicken_Prefab)

        if (GiftIndex > 0) {
            // console.log("GiftIndex:" + GiftIndex)
            let gift = this.getGiftChicken(GiftIndex, start_num, stage)
            gift.type = 2
            this.addGiftFullTips(gift, player)
        }


    }

    /**
  * 召唤小鸭升级小播报
  * @param player 
  */
    addJoinHintDuckTip(data: NotificationData) {
        let player = data.data.player as Player
        // 0,1,2,3,4,5五种礼物
        let GiftIndex = data.data.giftIndexID as number
        //这次礼物送的数量
        let gift_num = data.data.gift_num as number

        let stage = player.stage as number

        let start_num = player.gift_num[GiftIndex] > 5 ? 5 : player.gift_num[GiftIndex]

        if (GiftIndex === 0 || GiftIndex === 1 || GiftIndex === 2) {
            start_num = 0;
        }


        this.JoinHint_Duck_Prefab = instantiate(ResUtil.instance.resPrefabs.TipPrefabs.JoinHint_Duck_Prefab);
        this.JoinHint_Duck_Prefab.position = new Vec3(680, 150 + this.postionY, 0)

        let JoinHint_TempHead = this.JoinHint_Duck_Prefab.getChildByPath("JoinHint_BaseBG_Duck/JoinHint_TempHead").getComponent(Sprite);
        let PlayerNameLabel = this.JoinHint_Duck_Prefab.getChildByPath("JoinHint_BaseBG_Duck/PlayerNameLabel").getComponent(Label);
        let JoinHint_ICON = this.JoinHint_Duck_Prefab.getChildByPath("JoinHint_BaseBG_Duck/JoinHint_ICON").getComponent(Sprite);
        let JoinHintLabel = this.JoinHint_Duck_Prefab.getChildByPath("JoinHint_BaseBG_Duck/JoinHintLabel").getComponent(Label)
        //x999
        let QuantityLabel = this.JoinHint_Duck_Prefab.getChildByPath('JoinHint_BaseBG_Duck/JoinHintQuantity/QuantityLabel').getComponent(Label)

        //星星
        let StarsNode = this.JoinHint_Duck_Prefab.getChildByPath('JoinHint_BaseBG_Duck/Stars')
        StarsNode.active = true;

        let Stars = StarsNode.children;
        if (start_num === 0) {
            StarsNode.active = false;
        }

        for (let index = 0; index < Stars.length; index++) {
            Stars[index].active = false;
        }

        for (let index = 0; index < start_num; index++) {
            Stars[index].active = true;
        }


        JoinHint_TempHead.spriteFrame = player.avatar_sprite
        PlayerNameLabel.string = player.nickname;
        QuantityLabel.string = gift_num + ''

        JoinHintLabel.string = this.getGiftDuck(GiftIndex, start_num, stage).desc
        JoinHint_ICON.spriteFrame = this.getGiftDuck(GiftIndex, start_num, stage).icon

        this.JoinHint_Duck_Prefab_Number++;
        this.JoinHint_Duck_Prefab_map.set(this.JoinHint_Duck_Prefab_Number, this.JoinHint_Duck_Prefab)



        if (GiftIndex > 0) {
            // console.log("GiftIndex:" + GiftIndex)
            let gift = this.getGiftDuck(GiftIndex, start_num, stage)
            gift.type = 2
            this.addGiftFullTips(gift, player)
        }

    }



    /**
     * 小鸡玩家点赞小播报
     */
    addGreatChicken(player: Player) {


        this.TotalsHint_Mini_Chicken_Great_Prefab = instantiate(ResUtil.instance.resPrefabs.TipPrefabs.TotalsHint_Mini_Chicken_Great_Prefab);
        this.TotalsHint_Mini_Chicken_Great_Prefab.position = new Vec3(-700, -90 + this.postionY, 0)
        // this.TotalsHint_Mini_Chicken_Great_Prefab.parent = this.GameHint


        let TotalsHint_Head1 = this.TotalsHint_Mini_Chicken_Great_Prefab.getChildByPath("TotalsHint_BaseBG1/TotalsHint_Head1").getComponent(Sprite);
        let PlayerName_Label = this.TotalsHint_Mini_Chicken_Great_Prefab.getChildByPath("PlayerName_Label").getComponent(Label);
        //手速
        let PlayerTotalsh_Label = this.TotalsHint_Mini_Chicken_Great_Prefab.getChildByPath("TotalsInfo/PlayerTotalsh_Label").getComponent(Label);


        TotalsHint_Head1.spriteFrame = player.avatar_sprite
        PlayerName_Label.string = player.nickname;
        PlayerTotalsh_Label.string = player.like_num + ""


        this.TotalsHint_Mini_Chicken_Great_Prefab_Number++;
        this.TotalsHint_Mini_Chicken_Great_Prefab_map.set(this.TotalsHint_Mini_Chicken_Great_Prefab_Number, this.TotalsHint_Mini_Chicken_Great_Prefab)



    }



    /**
    * 小鸭玩家点赞小播报
    */
    addGreatDuck(player: Player) {


        this.TotalsHint_Mini_Duck_Great_Prefab = instantiate(ResUtil.instance.resPrefabs.TipPrefabs.TotalsHint_Mini_Duck_Great_Prefab);
        this.TotalsHint_Mini_Duck_Great_Prefab.position = new Vec3(700, -90 + this.postionY, 0)
        // this.TotalsHint_Mini_Duck_Great_Prefab.parent = this.GameHint


        let TotalsHint_Head1 = this.TotalsHint_Mini_Duck_Great_Prefab.getChildByPath("TotalsHint_BaseBG1/TotalsHint_Head1").getComponent(Sprite);
        let PlayerName_Label = this.TotalsHint_Mini_Duck_Great_Prefab.getChildByPath("PlayerName_Label").getComponent(Label);
        //手速
        let PlayerTotalsh_Label = this.TotalsHint_Mini_Duck_Great_Prefab.getChildByPath("TotalsInfo/PlayerTotalsh_Label").getComponent(Label);


        TotalsHint_Head1.spriteFrame = player.avatar_sprite
        PlayerName_Label.string = player.nickname;
        PlayerTotalsh_Label.string = player.like_num + ""


        this.TotalsHint_Mini_Duck_Great_Prefab_Number++;
        this.TotalsHint_Mini_Duck_Great_Prefab_map.set(this.TotalsHint_Mini_Duck_Great_Prefab_Number, this.TotalsHint_Mini_Duck_Great_Prefab)



    }



    /**
     * 小鸡累计小积分小播报
     */
    addTotalsPointChicken(player: Player) {


        this.TotalsHint_Mini_Chicken_Point_Prefab = instantiate(ResUtil.instance.resPrefabs.TipPrefabs.TotalsHint_Mini_Chicken_Point_Prefab);
        this.TotalsHint_Mini_Chicken_Point_Prefab.position = new Vec3(-700, -180 + this.postionY, 0)


        // this.TotalsHint_Mini_Prefab.parent = this.GameHint;

        let TotalsHint_Head1 = this.TotalsHint_Mini_Chicken_Point_Prefab.getChildByPath("TotalsHint_BaseBG1/TotalsHint_Head1").getComponent(Sprite);
        let PlayerName_Label = this.TotalsHint_Mini_Chicken_Point_Prefab.getChildByPath("PlayerName_Label").getComponent(Label);
        //累计积分
        let PlayerTotalsh_Label = this.TotalsHint_Mini_Chicken_Point_Prefab.getChildByPath("TotalsInfo/PlayerTotalsh_Label").getComponent(Label);


        TotalsHint_Head1.spriteFrame = player.avatar_sprite
        PlayerName_Label.string = player.nickname;
        PlayerTotalsh_Label.string = player.Game_Score + ""

        this.TotalsHint_Mini_Chicken_Point_Prefab_Number++;
        this.TotalsHint_Mini_Chicken_Point_Prefab_map.set(this.TotalsHint_Mini_Chicken_Point_Prefab_Number, this.TotalsHint_Mini_Chicken_Point_Prefab)



    }



    /**
     * 小鸡鸭累计小积分小播报
     */
    addTotalsPointDuck(player: Player) {


        this.TotalsHint_Mini_Duck_Point_Prefab = instantiate(ResUtil.instance.resPrefabs.TipPrefabs.TotalsHint_Mini_Duck_Point_Prefab);
        this.TotalsHint_Mini_Duck_Point_Prefab.position = new Vec3(700, -180 + this.postionY, 0)


        let TotalsHint_Head1 = this.TotalsHint_Mini_Duck_Point_Prefab.getChildByPath("TotalsHint_BaseBG1/TotalsHint_Head1").getComponent(Sprite);
        let PlayerName_Label = this.TotalsHint_Mini_Duck_Point_Prefab.getChildByPath("PlayerName_Label").getComponent(Label);
        //累计积分
        let PlayerTotalsh_Label = this.TotalsHint_Mini_Duck_Point_Prefab.getChildByPath("TotalsInfo/PlayerTotalsh_Label").getComponent(Label);


        TotalsHint_Head1.spriteFrame = player.avatar_sprite
        PlayerName_Label.string = player.nickname;
        PlayerTotalsh_Label.string = player.Game_Score + ""

        this.TotalsHint_Mini_Duck_Point_Prefab_Number++;
        this.TotalsHint_Mini_Duck_Point_Prefab_map.set(this.TotalsHint_Mini_Duck_Point_Prefab_Number, this.TotalsHint_Mini_Duck_Point_Prefab)



    }



    /**
         * 玩家累计积分大播报
         */
    addTotalsHintPro(player: Player) {


        // if (this.TotalsHint_Pro_Prefab == null) {
        let TotalsHint_Pro_Prefab = instantiate(ResUtil.instance.resPrefabs.TipPrefabs.TotalsHint_Pro_Prefab);
        TotalsHint_Pro_Prefab.position = new Vec3(0, 460 + this.postionY, 0)
        TotalsHint_Pro_Prefab.parent = this.GameHint;

        let TotalsHint_Pro_PlayerHead_Sprite = TotalsHint_Pro_Prefab.getChildByPath("TotalsHint_BaseBG2/TotalsHint_Head2BG/PlayerHead_Sprite").getComponent(Sprite);
        let TotalsHint_Pro_PlayerName_Label = TotalsHint_Pro_Prefab.getChildByPath("TotalsHint_BaseBG2/TotalsHint_Head2BG/PlayerName_Label").getComponent(Label);
        //累计积分
        let TotalsHint_Pro_PlayerTotalsh_Label = TotalsHint_Pro_Prefab.getChildByPath("TotalsHint_BaseBG2/TotalsInfo/PlayerTotalsh_Label").getComponent(Label);

        // }

        // if(!this.Show_TotalsHint_Pro_Prefab){
        //     this.Show_TotalsHint_Pro_Prefab=true
        //     this.TotalsHint_Pro_Prefab.active=true
        // }

        TotalsHint_Pro_PlayerHead_Sprite.spriteFrame = player.avatar_sprite
        TotalsHint_Pro_PlayerName_Label.string = player.nickname;
        TotalsHint_Pro_PlayerTotalsh_Label.string = player.Game_Score + ""

        let shuzi = TotalsHint_Pro_PlayerTotalsh_Label.string
        TotalsHint_Pro_PlayerTotalsh_Label.string = 0 + ""
        this.showShuzhi(TotalsHint_Pro_PlayerTotalsh_Label, Number(shuzi))

        setTimeout(() => {
            TotalsHint_Pro_Prefab.removeFromParent();
            // this.Show_TotalsHint_Pro_Prefab=false
            // this.TotalsHint_Pro_Prefab.active=false
        }, 3000);
    }



    /**
     * 
     * @param GiftDesc 礼物全屏出场动画
     */
    addGiftFullTips(GiftDesc: GiftDesc, Player: Player) {

        GiftDesc.Player = Player
        this.GiftChuChang_Prefab_Number++
        this.GiftChuChang_Prefab_map.set(this.GiftChuChang_Prefab_Number, GiftDesc)
        // console.log("GiftChuChangChicken_Prefab_map:" + this.GiftChuChangChicken_Prefab_map.size)
    }

    addWorldRank( Player: Player){
        let giftDesc=new GiftDesc();
        giftDesc.type=3
        giftDesc.Player = Player
        this.GiftChuChang_Prefab_Number++
        
        
        let tempMap=new Map<number, GiftDesc>();
        tempMap.set(this.GiftChuChang_Prefab_Number, giftDesc)
        this.GiftChuChang_Prefab_map.forEach((val,key) => {
            tempMap.set(key,val)
        });
        this.GiftChuChang_Prefab_map=tempMap
        
    }

    showGiftFull(GiftDesc: GiftDesc) {

        let Player = GiftDesc.Player

        let GiftChuChang_Prefab;
        if (GiftDesc.type == 1) {
            // console.log("Player.player_type:"+Player.player_type)
            // console.log("needStar:"+needStar)
            if (Player.player_type === 0) {
                GiftChuChang_Prefab = instantiate(ResUtil.instance.resPrefabs.TipPrefabs.GiftChuChangChicken_Prefab)
            } else {
                GiftChuChang_Prefab = instantiate(ResUtil.instance.resPrefabs.TipPrefabs.GiftChuChangDuck_Prefab)
            }
        } else {
            GiftChuChang_Prefab = instantiate(ResUtil.instance.resPrefabs.TipPrefabs.GiftChuChangOther_Prefab)
        }


        GiftChuChang_Prefab.parent = this.GameUI
        GiftChuChang_Prefab.position = new Vec3(0, -960, 0)

        let chuchang_sp = GiftChuChang_Prefab.getComponent(sp.Skeleton)


        chuchang_sp.setCompleteListener(() => {

            GiftChuChang_Prefab.removeFromParent()
            this.Show_GiftChuChang_Prefab = false;
        })


        /** 需要播放音频的出场动画*/ 
        if (GiftDesc.type == 2 && GiftDesc.audioData) {
            // console.log("GiftDesc.chuchangBuff:" + GiftDesc.chuchangBuff.name)
            // console.log("GiftDesc.audioData:"+GiftDesc.audioData)
           this.audioSource.playOneShot(GiftDesc.audioData, 1);
        }


        
        chuchang_sp.skeletonData = GiftDesc.chuchangBuff
        // chuchang_sp.skeletonData = ResUtil.instance.resSpine.Xiaoji_11[3]
        chuchang_sp.animation = "Act_ChuChang"
        // chuchang_sp.set

        if (GiftDesc.type == 1) {
            let sk_PlayerHead = GiftChuChang_Prefab.getChildByPath("sk_PlayerHead").getComponent(Sprite)
            let sk_PlayerName = GiftChuChang_Prefab.getChildByPath("sk_PlayerName").getComponent(Label)
            let sk_UpgradeExp = GiftChuChang_Prefab.getChildByPath("sk_UpgradeExp_node/sk_UpgradeExp").getComponent(Label)
            sk_PlayerHead.spriteFrame = Player.avatar_sprite
            sk_PlayerName.string = Player.nickname
            if (GiftDesc.needStar) {
                sk_UpgradeExp.string = "（还需要" + GiftDesc.needStar + "升级）"
                if (GiftDesc.needStar <= 0) {
                    sk_UpgradeExp.string = ""
                }
            } else {
                sk_UpgradeExp.string = ""
            }
        }


    }


    



    showWorldGameFull(Player: Player) {

        let WordRankAnim_Prefab = instantiate(ResUtil.instance.resPrefabs.TipPrefabs.WordRankAnim_Prefab)

        WordRankAnim_Prefab.parent = this.GameUI
        WordRankAnim_Prefab.position = new Vec3(0, -960, 0)

        let chuchang_sp = WordRankAnim_Prefab.getComponent(sp.Skeleton)


        chuchang_sp.setCompleteListener(() => {

            WordRankAnim_Prefab.removeFromParent()

            this.Show_GiftChuChang_Prefab = false;

        })

        let player_icon = WordRankAnim_Prefab.getChildByPath("heaeNode/head/Sprite").getComponent(Sprite)
        let player_name = WordRankAnim_Prefab.getChildByPath("player_name/Label_name").getComponent(Label)
        let word_rank = WordRankAnim_Prefab.getChildByPath("word_rank").getComponent(Label)
        let player_type = WordRankAnim_Prefab.getChildByPath("player_type").getComponent(Sprite)


        let typeSp=0;
        if(Player.rank_no<=10){
            chuchang_sp.skeletonData =ResUtil.instance.resSpine.WirldAnim_31[2]
            word_rank.font=ResUtil.instance.resFont.WorldFont1
            typeSp=0
        }else if(Player.rank_no>10 && Player.rank_no<=30){
            chuchang_sp.skeletonData = ResUtil.instance.resSpine.WirldAnim_31[1]
            word_rank.font=ResUtil.instance.resFont.WorldFont2
            typeSp=1
        }else{
            chuchang_sp.skeletonData = ResUtil.instance.resSpine.WirldAnim_31[0]
            word_rank.font=ResUtil.instance.resFont.WorldFont3
            typeSp=2
        }
        
        chuchang_sp.animation = "Act_ChuChang"
       
        // console.log("Player.avatar_url:"+Player.avatar_url)
        // console.log("Player.avatar_sprite:"+Player)
        // player_icon.node.scale=new Vec3(5.2,5.2,1)
        player_icon.spriteFrame = Player.avatar_sprite
        player_name.string = Player.nickname
        word_rank.string = "r" + Player.rank_no + ""

        if (Player.player_type === 0) {
            player_type.spriteFrame = ResUtil.instance.resImages.TipImages.WorldRankChicken[typeSp]
        } else {
            player_type.spriteFrame = ResUtil.instance.resImages.TipImages.WorldRankDuck[typeSp]
        }



    }

    getGiftChicken(giftIndex: number, startNum: number, stage: number): GiftDesc {

        let giftDesc = new GiftDesc()

        if (giftIndex == 0) {
            giftDesc.desc = "武器升级"
            startNum = stage;

            if (startNum == 0) {
                startNum = 1
            }

            if (startNum > 10) {
                startNum = 10
            }

            giftDesc.icon = ResUtil.instance.resImages.GiftChickenImages.JoinHint_ICON_11[startNum]
            giftDesc.chuchangBuff = ResUtil.instance.resSpine.Xiaoji_11[startNum]

        } else if (giftIndex == 1) {
            giftDesc.desc = "滑板车"
            giftDesc.icon = ResUtil.instance.resImages.GiftChickenImages.JoinHint_ICON_12[0]
            giftDesc.chuchangBuff = ResUtil.instance.resSpine.Xiaoji_12[0]
        } else if (giftIndex == 2) {
            giftDesc.desc = "电动车"
            giftDesc.icon = ResUtil.instance.resImages.GiftChickenImages.JoinHint_ICON_13[0]
            giftDesc.chuchangBuff = ResUtil.instance.resSpine.Xiaoji_13[0]
        } else if (giftIndex == 3) {
            giftDesc.desc = "摩托车"
            if (startNum < 5) {
                startNum = 0
            } else {
                startNum = 1
            }
            giftDesc.icon = ResUtil.instance.resImages.GiftChickenImages.JoinHint_ICON_14[startNum]
            giftDesc.chuchangBuff = ResUtil.instance.resSpine.Xiaoji_14[startNum]
            giftDesc.audioData=ResUtil.instance.resAudio.xiaoji_1400[startNum]
        } else if (giftIndex == 4) {
            giftDesc.desc = "推土机"
            if (startNum < 5) {
                startNum = 0
            } else {
                startNum = 1
            }
            giftDesc.icon = ResUtil.instance.resImages.GiftChickenImages.JoinHint_ICON_15[startNum]
            giftDesc.chuchangBuff = ResUtil.instance.resSpine.Xiaoji_15[startNum]
            giftDesc.audioData=ResUtil.instance.resAudio.xiaoji_1500[startNum]
        } else if (giftIndex = 5) {
            giftDesc.desc = "飞机"
            if (startNum < 5) {
                startNum = 0
            } else {
                startNum = 1
            }
            giftDesc.icon = ResUtil.instance.resImages.GiftChickenImages.JoinHint_ICON_16[startNum]
            giftDesc.chuchangBuff = ResUtil.instance.resSpine.Xiaoji_16[startNum]
            giftDesc.audioData=ResUtil.instance.resAudio.xiaoji_1600[startNum]
        } else {
            giftDesc.desc = "召唤小鸡"
            giftDesc.icon = ResUtil.instance.resImages.GiftChickenImages.JoinHint_ICON_11[0]
            giftDesc.chuchangBuff = ResUtil.instance.resSpine.Xiaoji_11[0]
        }
        giftDesc.star = startNum
        return giftDesc
    }


    getGiftDuck(giftIndex: number, startNum: number, stage: number): GiftDesc {

        let giftDesc = new GiftDesc()

        if (giftIndex == 0) {
            giftDesc.desc = "武器升级"
            startNum = stage

            if (startNum == 0) {
                startNum = 1
            }

            if (startNum > 10) {
                startNum = 10
            }

            giftDesc.icon = ResUtil.instance.resImages.GiftDuckImages.JoinHint_ICON_21[startNum]
            giftDesc.chuchangBuff = ResUtil.instance.resSpine.Xiaoya_21[startNum]

        } else if (giftIndex == 1) {
            giftDesc.desc = "滑板车"
            giftDesc.icon = ResUtil.instance.resImages.GiftDuckImages.JoinHint_ICON_22[0]
            giftDesc.chuchangBuff = ResUtil.instance.resSpine.Xiaoya_22[0]
        } else if (giftIndex == 2) {
            giftDesc.desc = "电动车"
            giftDesc.icon = ResUtil.instance.resImages.GiftDuckImages.JoinHint_ICON_23[0]
            giftDesc.chuchangBuff = ResUtil.instance.resSpine.Xiaoya_23[0]
        } else if (giftIndex == 3) {
            giftDesc.desc = "摩托车"
            if (startNum < 5) {
                startNum = 0
            } else {
                startNum = 1
            }
            giftDesc.icon = ResUtil.instance.resImages.GiftDuckImages.JoinHint_ICON_24[startNum]
            giftDesc.chuchangBuff = ResUtil.instance.resSpine.Xiaoya_24[startNum]
            giftDesc.audioData=ResUtil.instance.resAudio.xiaoya_2400[startNum]
        } else if (giftIndex == 4) {
            giftDesc.desc = "推土机"
            if (startNum < 5) {
                startNum = 0
            } else {
                startNum = 1
            }
            giftDesc.icon = ResUtil.instance.resImages.GiftDuckImages.JoinHint_ICON_25[startNum]
            giftDesc.chuchangBuff = ResUtil.instance.resSpine.Xiaoya_25[startNum]
            giftDesc.audioData=ResUtil.instance.resAudio.xiaoya_2500[startNum]
        } else if (giftIndex = 5) {
            giftDesc.desc = "飞机"
            if (startNum < 5) {
                startNum = 0
            } else {
                startNum = 1
            }
            giftDesc.icon = ResUtil.instance.resImages.GiftDuckImages.JoinHint_ICON_26[startNum]
            giftDesc.chuchangBuff = ResUtil.instance.resSpine.Xiaoya_26[startNum]
            giftDesc.audioData=ResUtil.instance.resAudio.xiaoya_2600[startNum]
        } else {
            giftDesc.desc = "召唤小鸭"
            giftDesc.icon = ResUtil.instance.resImages.GiftDuckImages.JoinHint_ICON_21[0]
            giftDesc.chuchangBuff = ResUtil.instance.resSpine.Xiaoya_21[0]
        }

        giftDesc.star = startNum
        return giftDesc
    }



    showShuzhi(showLabel: Label, num: number) {
        // showLabel.node.scale = new Vec3(1.5, 1.5, 1);
        tween(showLabel.node).to(0.1, { scale: new Vec3(1.25, 1.25, 1) }).start()
        this.countTime(num, (timer) => {
            showLabel.string = timer + ""
        }, () => {
            tween(showLabel.node).to(0.2, { scale: new Vec3(1, 1, 1) }).start()
        })
        // showLabel.node.scale = new Vec3(1, 1, 1);

    }

    countTime(RemainingTime, callback, endCallback) {
        let lower = 31; //建议尾数是1，看起来像每毫秒都在刷新。想快就调高


        const maxTime = RemainingTime

        let timer = setInterval(function () {
            if (RemainingTime > 0) {
                let curTime = maxTime - RemainingTime

                if (curTime <= 500) {
                    lower = 81;
                }
                if (curTime > 500 && curTime <= 1000) {
                    lower = 351;
                }
                if (curTime > 1000 && curTime <= 5000) {
                    lower = 991;
                }
                if (curTime > 5000 && curTime <= 10000) {
                    lower = 4551;
                }

                if (curTime > 10000 && curTime <= 100000) {
                    lower = 8501;
                }
                if (curTime > 100000 && curTime <= 500000) {
                    lower = 99951;
                }
                if (curTime > 500000 && curTime <= 1000000) {
                    lower = 295951;
                }
                if (curTime > 1000000) {
                    lower = 995951;
                }

                callback(curTime);
                RemainingTime = RemainingTime - lower;

            } else {
                clearInterval(timer);
                callback(maxTime);
                endCallback()
            }
        }, lower);
    }



}


@ccclass('GiftDesc')
class GiftDesc {
    //1是仙女棒 2是其他,3是世界排行
    type: number
    Player: Player
    star: number
    desc: string
    icon: SpriteFrame
    //全屏骨骼动画资源
    chuchangBuff: sp.SkeletonData
    needStar: number
    //部分出场动画音频
    audioData:AudioClip
}
