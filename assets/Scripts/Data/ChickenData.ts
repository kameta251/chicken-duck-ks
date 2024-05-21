import { GameManager } from "../Manager/GameManager"
import { PlayerAction } from "../Manager/PlayerManager"

export class ChickenData{
    get totalScore(): number{
        let score = 0
        GameManager.instance.DataManager.ChickenPlayers.forEach(item=>{score+=item.Game_Score})
        return score
    }
    get totalForce(): number{
        let Force = 0
        GameManager.instance.DataManager.ChickenEntity.forEach(item=>{Force+=item.GetForce()})
        return Force
    }
    get totalLiansheng(): number{
        
        let Liansheng = 0
        GameManager.instance.DataManager.ChickenPlayers.forEach(item=>{Liansheng+=item.curLianSheng})
        return Liansheng
    }
    public MonsterConfig: Map<number,AttChicken> = new Map()
    LoadCofnig(MonsterCoinfig: any[]){
        for (var i = 0; i < MonsterCoinfig.length; i++) {
            let config: AttChicken = {
                MonsterID: MonsterCoinfig[i].MonsterID,
                Force: MonsterCoinfig[i].Force,
                LiveTime: MonsterCoinfig[i].LiveTime,
                NorScale: MonsterCoinfig[i].NorScale,
                CPosScale: MonsterCoinfig[i].CPosScale,
                InfoHeight: MonsterCoinfig[i].InfoHeight
              }
              this.MonsterConfig.set(config.MonsterID, config)
        }
    
    }
}
export class AttChicken{
    MonsterID: number
    Force: number = 2
    LiveTime: number
    NorScale: number
    CPosScale: number
    InfoHeight: number
}