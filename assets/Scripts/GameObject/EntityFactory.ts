import { _decorator, Component, instantiate, Node, Vec2, Vec3 } from 'cc';
import { ResUtil } from '../Res/ResUtil';
import { GameManager } from '../Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('EntityFactory')
export class EntityFactory {

    /**创建实体 */
    CreaterEntity(MonsterID: number) {
        const chickenPrefabs = {
            1100: ResUtil.instance.resPrefabs.ChickenPrefabs.Chicken_1100,
            1200: ResUtil.instance.resPrefabs.ChickenPrefabs.Chicken_1200,
            1300: ResUtil.instance.resPrefabs.ChickenPrefabs.Chicken_1300,
            1400: ResUtil.instance.resPrefabs.ChickenPrefabs.Chicken_1400,
            1500: ResUtil.instance.resPrefabs.ChickenPrefabs.Chicken_1500,
            1600: ResUtil.instance.resPrefabs.ChickenPrefabs.Chicken_1600,
            1401: ResUtil.instance.resPrefabs.ChickenPrefabs.Chicken_1401,
            1501: ResUtil.instance.resPrefabs.ChickenPrefabs.Chicken_1501,
            1601: ResUtil.instance.resPrefabs.ChickenPrefabs.Chicken_1601,
        };

        const duckPrefabs = {
            2100: ResUtil.instance.resPrefabs.DuckPrefabs.Duck_2100,
            2200: ResUtil.instance.resPrefabs.DuckPrefabs.Duck_2200,
            2300: ResUtil.instance.resPrefabs.DuckPrefabs.Duck_2300,
            2400: ResUtil.instance.resPrefabs.DuckPrefabs.Duck_2400,
            2500: ResUtil.instance.resPrefabs.DuckPrefabs.Duck_2500,
            2600: ResUtil.instance.resPrefabs.DuckPrefabs.Duck_2600,
            2401: ResUtil.instance.resPrefabs.DuckPrefabs.Duck_2401,
            2501: ResUtil.instance.resPrefabs.DuckPrefabs.Duck_2501,
            2601: ResUtil.instance.resPrefabs.DuckPrefabs.Duck_2601,
        };

        let Ins;
        let parent;

        if (chickenPrefabs[MonsterID]) {
            Ins = instantiate(chickenPrefabs[MonsterID]);
            parent = GameManager.instance.Maps.ChickenRoot;
        } else if (duckPrefabs[MonsterID]) {
            Ins = instantiate(duckPrefabs[MonsterID]);
            parent = GameManager.instance.Maps.DuckRoot;
        }
        if (Ins) {
            Ins.parent = parent;
            Ins.scale = new Vec3(0.7, 0.7, 0.7)
            return Ins as Node
        }
        return null
    }

    CreaterPlyaerInfo() {
        let Ins = instantiate(ResUtil.instance.resPrefabs.PlayerInfo)
        Ins.parent = GameManager.instance.Maps.PlayerInfoRoot
        return Ins
    }

    CreaterScaleplate() {
        let Ins = instantiate(ResUtil.instance.resPrefabs.Scaleplate)
        Ins.parent = GameManager.instance.Maps.Scaleplate
        return Ins
    }

    CreaterShadow() {
        let Ins = instantiate(ResUtil.instance.resPrefabs.Shadow)
        Ins.parent = GameManager.instance.Maps.CharacterShadow
        return Ins
    }
    /**
     * 0 === 中，
     * 1 === 边
     */
    CreaterMap(Type: number) {
        let Ins: Node = null
        switch (Type) {
            case 0:
                Ins = instantiate(ResUtil.instance.resPrefabs.Map0)
                Ins.parent = GameManager.instance.Maps.GameMapRoot
                break
            case 1:
                Ins = instantiate(ResUtil.instance.resPrefabs.Map1)
                Ins.parent = GameManager.instance.Maps.GameMapRoot
                break
            case 2:
                Ins = instantiate(ResUtil.instance.resPrefabs.Map2)
                Ins.parent = GameManager.instance.Maps.GameMapGuangzhongRoot
                break
            case 3:
                Ins = instantiate(ResUtil.instance.resPrefabs.Map3)
                Ins.parent = GameManager.instance.Maps.GameMapGuangzhongRoot
                break
        }
        return Ins
    }
}