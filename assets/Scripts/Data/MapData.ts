export class MapData{
    minSpeed: number
    maxSpeed: number
    ration: number
    baseLine: number
    limitTimeMinSpeed: number
    limitTimeMaxSpeed: number
    limitTimeRation: number
    limitTimeBaseLine: number
    

    //读配置表
    LoadCoinfig(MapConfig) {
        let config = MapConfig[0]
        this.minSpeed = config.minSpeed
        this.maxSpeed = config.maxSpeed
        this.ration = config.ration
        this.baseLine = config.baseLine
        this.limitTimeMinSpeed = config.limitTimeMinSpeed
        this.limitTimeMaxSpeed = config.limitTimeMaxSpeed
        this.limitTimeRation = config.limitTimeRation
        this.limitTimeBaseLine = config.limitTimeBaseLine
    }
}