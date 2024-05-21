import { Animation, AnimationState, Vec3, randomRange, randomRangeInt } from "cc";
import { GameManager } from "./GameManager";
import { Player } from "./PlayerManager";
import { MathUtil } from "../Util/MathUtil";
import { Chicken } from "../GameObject/Entity/Chicken";
import { PoolManager } from "./PoolManager";

export class ChickenManager {
    OnUpdate() {
        GameManager.instance.DataManager.ChickenEntity.forEach(item => { item.OnUpdate() })
    }
    OnGamingUpdate() {
        GameManager.instance.DataManager.ChickenEntity.forEach(item => { item.OnGamingUpdate() })

    }
    /**生成鸡,返回entityid */
    CreaterChicken(MonsterID: number, player: Player, count: number = 1) {
        for (var i = 0; i < count; i++) {
            let entity = PoolManager.instance.OutPool(MonsterID)
            if(entity == null){   
                entity = GameManager.instance.EntityFactory.CreaterEntity(MonsterID)
            }
            entity.position = GameManager.instance.ChickenManager.GetRandomPos()
            let chicken = new Chicken(MathUtil.GetEntity(), entity, MonsterID, player)
            GameManager.instance.DataManager.ChickenEntity.set(chicken.EntityID, chicken)
            player.all_character_id.push(chicken.EntityID)
        }
    }
    /**生成初始的鸡 */
    CreaterInitChicken(MonsterID: number, player: Player) {
        let entity = PoolManager.instance.OutPool(MonsterID)
        if(entity == null){   
            entity = GameManager.instance.EntityFactory.CreaterEntity(MonsterID)
        }
        entity.position = this.GetRandomPos()
        let chicken = new Chicken(MathUtil.GetEntity(), entity, MonsterID, player)
        GameManager.instance.DataManager.ChickenEntity.set(chicken.EntityID, chicken)
        player.all_character_id.push(chicken.EntityID)
        return chicken.EntityID
    }
    /**升级 */
    LevelUp(player: Player, count: number) {
        let HasNotity: boolean = false
        let MainChar = GameManager.instance.DataManager.ChickenEntity.get(player.main_character_id)
        let CurMonsterID = MainChar.MonsterID
        MainChar.Force += count * 5
        MainChar.LevelUp(this.GetMonsterIDBygift_num(player.gift_num[0]))
        player.stage = this.GetMonsterIDBygift_num(player.gift_num[0]) - 1100
        if (count >= 10) { GameManager.instance.notify({ action: `OnLevelUp`, data: { player: player } });HasNotity = true }
        if (CurMonsterID == this.GetMonsterIDBygift_num(player.gift_num[0])) { return }
        if(!HasNotity){HasNotity = true;GameManager.instance.notify({ action: `OnLevelUp`, data: { player: player } })}
    }

    /**随机位置 */
    GetRandomPos(): Vec3 {
        let x = randomRangeInt(180, 500)
        let y = randomRangeInt(620, 1320)
        if (x > 350) {
            y = randomRange(0, 100) < 50 ? randomRangeInt(620, 800) : randomRangeInt(1050, 1320)
        }
        let pos = new Vec3(x, y, -y/2)
        return pos
    }
    /**根据gift_num[0]的数量返回对应的MonsterID */
    GetMonsterIDBygift_num(gift_num: number) {
        let LevelCoinfig = GameManager.instance.DataManager.ActionData.LevelCoinfig
        if (gift_num == 0) { return 1100 }
        if (gift_num >= 1 && gift_num < LevelCoinfig[2].gift_num_count) { return 1101 }
        if (gift_num >= LevelCoinfig[2].gift_num_count && gift_num < LevelCoinfig[3].gift_num_count) { return 1102 }
        if (gift_num >= LevelCoinfig[3].gift_num_count && gift_num < LevelCoinfig[4].gift_num_count) { return 1103 }
        if (gift_num >= LevelCoinfig[4].gift_num_count && gift_num < LevelCoinfig[5].gift_num_count) { return 1104 }
        if (gift_num >= LevelCoinfig[5].gift_num_count && gift_num < LevelCoinfig[6].gift_num_count) { return 1105 }
        if (gift_num >= LevelCoinfig[6].gift_num_count && gift_num < LevelCoinfig[7].gift_num_count) { return 1106 }
        if (gift_num >= LevelCoinfig[7].gift_num_count && gift_num < LevelCoinfig[8].gift_num_count) { return 1107 }
        if (gift_num >= LevelCoinfig[8].gift_num_count && gift_num < LevelCoinfig[9].gift_num_count) { return 1108 }
        if (gift_num >= LevelCoinfig[9].gift_num_count && gift_num < LevelCoinfig[10].gift_num_count) { return 1109 }
        if (gift_num >= LevelCoinfig[10].gift_num_count) { return 1110 }
    }

    /**删除鸡 */
    DeleteChicken(EntityID: number){
        GameManager.instance.DataManager.ChickenEntity.delete(EntityID)
    }
}