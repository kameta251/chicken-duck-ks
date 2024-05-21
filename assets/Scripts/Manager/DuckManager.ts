import { Vec3, randomRange, randomRangeInt } from "cc";
import { GameManager } from "./GameManager";
import { Player } from "./PlayerManager";
import { Duck } from "../GameObject/Entity/Duck";
import { MathUtil } from "../Util/MathUtil";
import { PoolManager } from "./PoolManager";

export class DuckManager {


    OnUpdate() {
        GameManager.instance.DataManager.DuckEntity.forEach(item => { item.OnUpdate() })
    }

    OnGamingUpdate() {
        GameManager.instance.DataManager.DuckEntity.forEach(item => { item.OnGamingUpdate() })
    }

    /**生成鸭 */
    CreaterDuck(MonsterID: number, player: Player, count = 1) {
        for (var i = 0; i < count; i++) {
            let entity = PoolManager.instance.OutPool(MonsterID)
            if(entity == null){   
                entity = GameManager.instance.EntityFactory.CreaterEntity(MonsterID)
            }
            entity.position = GameManager.instance.DuckManager.GetRandomPos()
            let duck = new Duck(MathUtil.GetEntity(), entity, MonsterID, player)
            GameManager.instance.DataManager.DuckEntity.set(duck.EntityID, duck)
            player.all_character_id.push(duck.EntityID)
        }
    }
    /**生成初始化的鸭 */
    CreaterInitDuck(MonsterID: number, player: Player) {
        let entity = PoolManager.instance.OutPool(MonsterID)
        if(entity == null){   
            entity = GameManager.instance.EntityFactory.CreaterEntity(MonsterID)
        }
        entity.position = this.GetRandomPos()
        let duck = new Duck(MathUtil.GetEntity(), entity, MonsterID, player)
        GameManager.instance.DataManager.DuckEntity.set(duck.EntityID, duck)
        player.all_character_id.push(duck.EntityID)
        return duck.EntityID
    }
    /**升级 */
    LevelUp(player: Player, count: number) {
        let HasNotity: boolean = false
        let MainChar = GameManager.instance.DataManager.DuckEntity.get(player.main_character_id)
        let CurMonsterID = MainChar.MonsterID
        MainChar.Force += count * 5
        MainChar.LevelUp(this.GetMonsterIDBygift_num(player.gift_num[0]))
        player.stage = this.GetMonsterIDBygift_num(player.gift_num[0]) - 2100
        if (count >= 10) { GameManager.instance.notify({ action: `OnLevelUp`, data: { player: player } }); HasNotity = true }
        if (CurMonsterID == this.GetMonsterIDBygift_num(player.gift_num[0])) { return }
        if (!HasNotity) { HasNotity = true; GameManager.instance.notify({ action: `OnLevelUp`, data: { player: player } }) }
    }
    /**随机位置 */
    GetRandomPos() {
        let x = randomRangeInt(710, 900)
        let y = randomRangeInt(620, 1320)
        if (x < 800) {
            y = randomRange(0, 100) < 50 ? randomRangeInt(620, 800) : randomRangeInt(1050, 1320)
        }

        return new Vec3(x, y, -y/2)
    }
    /**根据gift_num[0]的数量返回对应的MonsterID */
    GetMonsterIDBygift_num(gift_num: number) {
        let LevelCoinfig = GameManager.instance.DataManager.ActionData.LevelCoinfig
        if (gift_num == 0) { return 2100 }
        if (gift_num >= 1 && gift_num < LevelCoinfig[2].gift_num_count) { return 2101 }
        if (gift_num >= LevelCoinfig[2].gift_num_count && gift_num < LevelCoinfig[3].gift_num_count) { return 2102 }
        if (gift_num >= LevelCoinfig[3].gift_num_count && gift_num < LevelCoinfig[4].gift_num_count) { return 2103 }
        if (gift_num >= LevelCoinfig[4].gift_num_count && gift_num < LevelCoinfig[5].gift_num_count) { return 2104 }
        if (gift_num >= LevelCoinfig[5].gift_num_count && gift_num < LevelCoinfig[6].gift_num_count) { return 2105 }
        if (gift_num >= LevelCoinfig[6].gift_num_count && gift_num < LevelCoinfig[7].gift_num_count) { return 2106 }
        if (gift_num >= LevelCoinfig[7].gift_num_count && gift_num < LevelCoinfig[8].gift_num_count) { return 2107 }
        if (gift_num >= LevelCoinfig[8].gift_num_count && gift_num < LevelCoinfig[9].gift_num_count) { return 2108 }
        if (gift_num >= LevelCoinfig[9].gift_num_count && gift_num < LevelCoinfig[10].gift_num_count) { return 2109 }
        if (gift_num >= LevelCoinfig[10].gift_num_count) { return 2110 }
    }
    /**删除鸡 */
    DeleteDuck(EntityID: number) {
        GameManager.instance.DataManager.DuckEntity.delete(EntityID)
    }
}