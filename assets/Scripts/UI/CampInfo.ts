import { _decorator, Component, find, Label, labelAssembler, Node, Sprite } from 'cc';
import { GameManager, GameState } from '../Manager/GameManager';
const { ccclass, property } = _decorator;

/**
 * 阵营前三信息展示
 */
@ccclass('CampInfo')
export class CampInfo {

    /**
     * 鸡阵营
     */
    CampInfo_Chicken: Node;
    Chicken_CampInfo_WinsLabel: Label; //吃了几道菜
    Chicken_CampInfo_PowerLabel: Label;//推力
    Chicken_CampInfoRank: Node;

    Ranking1_Chicken: Node;
    Ranking1_Chicken_CampRanking_PlayerHead_Chicken: Sprite; //头像
    Ranking1_Chicken_NameLabel: Label;//名字
    Ranking1_Chicken_WinsLabel: Label;

    Ranking2_Chicken: Node;
    Ranking2_Chicken_CampRanking_PlayerHead_Chicken: Sprite; //头像
    Ranking2_Chicken_NameLabel: Label;//名字
    Ranking2_Chicken_WinsLabel: Label;

    Ranking3_Chicken: Node;
    Ranking3_Chicken_CampRanking_PlayerHead_Chicken: Sprite; //头像
    Ranking3_Chicken_NameLabel: Label;//名字
    Ranking3_Chicken_WinsLabel: Label;





    /**
     * 鸭子阵营
     */
    CampInfo_Duck: Node;
    Duck_CampInfo_WinsLabel: Label; //吃了几道菜
    Duck_CampInfo_PowerLabel: Label;//推力
    Duck_CampInfoRank: Node;

    Ranking1_Duck: Node;
    Ranking1_Duck_CampRanking_PlayerHead_Chicken: Sprite; //头像
    Ranking1_Duck_NameLabel: Label;//名字
    Ranking1_Duck_WinsLabel: Label;

    Ranking2_Duck: Node;
    Ranking2_Duck_CampRanking_PlayerHead_Chicken: Sprite; //头像
    Ranking2_Duck_NameLabel: Label;//名字
    Ranking2_Duck_WinsLabel: Label;

    Ranking3_Duck: Node;
    Ranking3_Duck_CampRanking_PlayerHead_Chicken: Sprite; //头像
    Ranking3_Duck_NameLabel: Label;//名字
    Ranking3_Duck_WinsLabel: Label;

    onLoad() {

        this.CampInfo_Chicken = find("Canvas/GameUI/CampInfo_Chicken");
        this.Chicken_CampInfo_WinsLabel = find("Canvas/GameUI/CampInfo_Chicken/CampInfo_WinsLabel").getComponent(Label);
        this.Chicken_CampInfo_PowerLabel = find("Canvas/GameUI/CampInfo_Chicken/CampInfo_PowerLabel").getComponent(Label);
        this.Chicken_CampInfoRank = find("Canvas/GameUI/CampInfo_Chicken/CampInfoRank");


        this.Ranking1_Chicken = find("Canvas/GameUI/CampInfo_Chicken/CampInfoRank/Ranking1");

        this.Ranking1_Chicken_CampRanking_PlayerHead_Chicken = find("Canvas/GameUI/CampInfo_Chicken/CampInfoRank/Ranking1/CampRanking_PlayerHeadBG_Chicken/CampRanking_PlayerHead_Chicken").getComponent(Sprite);
        this.Ranking1_Chicken_NameLabel = find("Canvas/GameUI/CampInfo_Chicken/CampInfoRank/Ranking1/CampRanking_InfoBG_Chicken/NameLabel").getComponent(Label);
        this.Ranking1_Chicken_WinsLabel = find("Canvas/GameUI/CampInfo_Chicken/CampInfoRank/Ranking1/CampRanking_InfoBG_Chicken/WinsLabel").getComponent(Label);

        this.Ranking2_Chicken = find("Canvas/GameUI/CampInfo_Chicken/CampInfoRank/Ranking2");

        this.Ranking2_Chicken_CampRanking_PlayerHead_Chicken = find("Canvas/GameUI/CampInfo_Chicken/CampInfoRank/Ranking2/CampRanking_PlayerHeadBG_Chicken/CampRanking_PlayerHead_Chicken").getComponent(Sprite);
        this.Ranking2_Chicken_NameLabel = find("Canvas/GameUI/CampInfo_Chicken/CampInfoRank/Ranking2/CampRanking_InfoBG_Chicken/NameLabel").getComponent(Label);
        this.Ranking2_Chicken_WinsLabel = find("Canvas/GameUI/CampInfo_Chicken/CampInfoRank/Ranking2/CampRanking_InfoBG_Chicken/WinsLabel").getComponent(Label);

        this.Ranking3_Chicken = find("Canvas/GameUI/CampInfo_Chicken/CampInfoRank/Ranking3");

        this.Ranking3_Chicken_CampRanking_PlayerHead_Chicken = find("Canvas/GameUI/CampInfo_Chicken/CampInfoRank/Ranking3/CampRanking_PlayerHeadBG_Chicken/CampRanking_PlayerHead_Chicken").getComponent(Sprite);
        this.Ranking3_Chicken_NameLabel = find("Canvas/GameUI/CampInfo_Chicken/CampInfoRank/Ranking3/CampRanking_InfoBG_Chicken/NameLabel").getComponent(Label);
        this.Ranking3_Chicken_WinsLabel = find("Canvas/GameUI/CampInfo_Chicken/CampInfoRank/Ranking3/CampRanking_InfoBG_Chicken/WinsLabel").getComponent(Label);




        this.CampInfo_Duck = find("Canvas/GameUI/CampInfo_Duck");
        this.Duck_CampInfo_WinsLabel = find("Canvas/GameUI/CampInfo_Duck/CampInfo_WinsLabel").getComponent(Label);
        this.Duck_CampInfo_PowerLabel = find("Canvas/GameUI/CampInfo_Duck/CampInfo_PowerLabel").getComponent(Label);
        this.Duck_CampInfoRank = find("Canvas/GameUI/CampInfo_Duck/CampInfoRank");


        this.Ranking1_Duck = find("Canvas/GameUI/CampInfo_Duck/CampInfoRank/Ranking1");

        this.Ranking1_Duck_CampRanking_PlayerHead_Chicken = find("Canvas/GameUI/CampInfo_Duck/CampInfoRank/Ranking1/CampRanking_PlayerHeadBG_Chicken/CampRanking_PlayerHead_Chicken").getComponent(Sprite);
        this.Ranking1_Duck_NameLabel = find("Canvas/GameUI/CampInfo_Duck/CampInfoRank/Ranking1/CampRanking_InfoBG_Chicken/NameLabel").getComponent(Label);
        this.Ranking1_Duck_WinsLabel = find("Canvas/GameUI/CampInfo_Duck/CampInfoRank/Ranking1/CampRanking_InfoBG_Chicken/WinsLabel").getComponent(Label);

        this.Ranking2_Duck = find("Canvas/GameUI/CampInfo_Duck/CampInfoRank/Ranking2");

        this.Ranking2_Duck_CampRanking_PlayerHead_Chicken = find("Canvas/GameUI/CampInfo_Duck/CampInfoRank/Ranking2/CampRanking_PlayerHeadBG_Chicken/CampRanking_PlayerHead_Chicken").getComponent(Sprite);
        this.Ranking2_Duck_NameLabel = find("Canvas/GameUI/CampInfo_Duck/CampInfoRank/Ranking2/CampRanking_InfoBG_Chicken/NameLabel").getComponent(Label);
        this.Ranking2_Duck_WinsLabel = find("Canvas/GameUI/CampInfo_Duck/CampInfoRank/Ranking2/CampRanking_InfoBG_Chicken/WinsLabel").getComponent(Label);

        this.Ranking3_Duck = find("Canvas/GameUI/CampInfo_Duck/CampInfoRank/Ranking3");

        this.Ranking3_Duck_CampRanking_PlayerHead_Chicken = find("Canvas/GameUI/CampInfo_Duck/CampInfoRank/Ranking3/CampRanking_PlayerHeadBG_Chicken/CampRanking_PlayerHead_Chicken").getComponent(Sprite)
        this.Ranking3_Duck_NameLabel = find("Canvas/GameUI/CampInfo_Duck/CampInfoRank/Ranking3/CampRanking_InfoBG_Chicken/NameLabel").getComponent(Label)
        this.Ranking3_Duck_WinsLabel = find("Canvas/GameUI/CampInfo_Duck/CampInfoRank/Ranking3/CampRanking_InfoBG_Chicken/WinsLabel").getComponent(Label);

        this.setReset();

        this.Ranking1_Chicken_CampRanking_PlayerHead_Chicken.sizeMode = Sprite.SizeMode.CUSTOM
        this.Ranking2_Chicken_CampRanking_PlayerHead_Chicken.sizeMode = Sprite.SizeMode.CUSTOM
        this.Ranking3_Chicken_CampRanking_PlayerHead_Chicken.sizeMode = Sprite.SizeMode.CUSTOM
        this.Ranking1_Duck_CampRanking_PlayerHead_Chicken.sizeMode = Sprite.SizeMode.CUSTOM
        this.Ranking2_Duck_CampRanking_PlayerHead_Chicken.sizeMode = Sprite.SizeMode.CUSTOM
        this.Ranking3_Duck_CampRanking_PlayerHead_Chicken.sizeMode = Sprite.SizeMode.CUSTOM

    }

    onUpdate() {


        this.setInfo();

    }

    /**
     * 重开局
     */
    setReset() {

        this.Chicken_CampInfo_WinsLabel.string = "吃了 " + 0 + " 道菜";
        this.Chicken_CampInfo_PowerLabel.string = "推力：" + 0;

        this.Duck_CampInfo_WinsLabel.string = "吃了 " + 0 + " 道菜";
        this.Duck_CampInfo_PowerLabel.string = "推力：" + 0;


        this.Chicken_CampInfoRank.active = false;
        this.Ranking1_Chicken.active = false;
        this.Ranking2_Chicken.active = false;
        this.Ranking3_Chicken.active = false;

        this.Duck_CampInfoRank.active = false;
        this.Ranking1_Duck.active = false;
        this.Ranking2_Duck.active = false;
        this.Ranking3_Duck.active = false;

    }

    setInfo() {

        this.Chicken_CampInfo_WinsLabel.string = "吃了 " + GameManager.instance.DataManager.ChickenData.totalLiansheng + " 道菜";
        this.Chicken_CampInfo_PowerLabel.string = "推力：" + GameManager.instance.DataManager.ChickenData.totalForce;

        this.Duck_CampInfo_WinsLabel.string = "吃了 " + GameManager.instance.DataManager.DuckData.totalLiansheng + " 道菜";
        this.Duck_CampInfo_PowerLabel.string = "推力：" + GameManager.instance.DataManager.DuckData.totalForce;



        let ChickenFrontPlayers = GameManager.instance.DataManager.ChickenFrontPlayers;
        let DuckFrontPlayers = GameManager.instance.DataManager.DuckFrontPlayers;


        if (ChickenFrontPlayers != null && ChickenFrontPlayers.length > 0) {
            this.Chicken_CampInfoRank.active = true;

            for (let i = 0; i < ChickenFrontPlayers.length; i++) {
                if (i == 0) {

                    this.Ranking1_Chicken.active = true;
                    this.Ranking1_Chicken_CampRanking_PlayerHead_Chicken.spriteFrame = ChickenFrontPlayers[i].avatar_sprite;
                    this.Ranking1_Chicken_NameLabel.string = ChickenFrontPlayers[i].nickname;
                    this.Ranking1_Chicken_WinsLabel.string = "吃了 " + ChickenFrontPlayers[i].curLianSheng + " 道菜";

                } else if (i == 1) {

                    this.Ranking2_Chicken.active = true;
                    this.Ranking2_Chicken_CampRanking_PlayerHead_Chicken.spriteFrame = ChickenFrontPlayers[i].avatar_sprite;
                    this.Ranking2_Chicken_NameLabel.string = ChickenFrontPlayers[i].nickname;
                    this.Ranking2_Chicken_WinsLabel.string = "吃了 " + ChickenFrontPlayers[i].curLianSheng + " 道菜";

                } else if (i == 2) {

                    this.Ranking3_Chicken.active = true;
                    this.Ranking3_Chicken_CampRanking_PlayerHead_Chicken.spriteFrame = ChickenFrontPlayers[i].avatar_sprite;
                    this.Ranking3_Chicken_NameLabel.string = ChickenFrontPlayers[i].nickname;
                    this.Ranking3_Chicken_WinsLabel.string = "吃了 " + ChickenFrontPlayers[i].curLianSheng + " 道菜";

                }

            }
        }

        if (DuckFrontPlayers != null && DuckFrontPlayers.length > 0) {
            this.Duck_CampInfoRank.active = true;

            for (let i = 0; i < DuckFrontPlayers.length; i++) {
                if (i == 0) {

                    this.Ranking1_Duck.active = true;
                    this.Ranking1_Duck_CampRanking_PlayerHead_Chicken.spriteFrame = DuckFrontPlayers[i].avatar_sprite;
                    this.Ranking1_Duck_NameLabel.string = DuckFrontPlayers[i].nickname;
                    this.Ranking1_Duck_WinsLabel.string = "吃了 " + DuckFrontPlayers[i].curLianSheng + " 道菜";

                } else if (i == 1) {

                    this.Ranking2_Duck.active = true;
                    this.Ranking2_Duck_CampRanking_PlayerHead_Chicken.spriteFrame = DuckFrontPlayers[i].avatar_sprite;
                    this.Ranking2_Duck_NameLabel.string = DuckFrontPlayers[i].nickname;
                    this.Ranking2_Duck_WinsLabel.string = "吃了 " + DuckFrontPlayers[i].curLianSheng + " 道菜";

                } else if (i == 2) {

                    this.Ranking3_Duck.active = true;
                    this.Ranking3_Duck_CampRanking_PlayerHead_Chicken.spriteFrame = DuckFrontPlayers[i].avatar_sprite;
                    this.Ranking3_Duck_NameLabel.string = DuckFrontPlayers[i].nickname;
                    this.Ranking3_Duck_WinsLabel.string = "吃了 " + DuckFrontPlayers[i].curLianSheng + " 道菜";

                }

            }
        }
    }

}

