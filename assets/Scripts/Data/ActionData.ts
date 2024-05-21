import { GameManager } from "../Manager/GameManager"

export class ActionData {
    LevelCoinfig: LevelCoinfig[] = []
    ActionScore: number[] = []
    BroadcastConfig: Map<number, number[]> = new Map()

    //读配置表
    LoadCoinfig(LevelCoinfig, ScoreCoinfig, BroadcastConfig) {
        this.ActionScore = ScoreCoinfig
        GameManager.instance.DataManager.ActionData.LevelCoinfig = LevelCoinfig
        // 遍历对象数组，将 "Score" 字段值添加到 ActionScore 数组中
        for (let i = 0; i < ScoreCoinfig.length; i++) {
            GameManager.instance.DataManager.ActionData.ActionScore[i] = ScoreCoinfig[i].Score;
        }
        for (let i = 0; i < BroadcastConfig.length; i++) {
            let config: number[] = [
                BroadcastConfig[i].Broadcast1,
                BroadcastConfig[i].Broadcast2,
                BroadcastConfig[i].Broadcast3,
                BroadcastConfig[i].Broadcast4,
                BroadcastConfig[i].Broadcast5,
                BroadcastConfig[i].Broadcast6,
                BroadcastConfig[i].Broadcast7,
                BroadcastConfig[i].Broadcast8,
                BroadcastConfig[i].Broadcast9
            ]
            config = config.filter((item) => item !== null && item !== undefined);
            GameManager.instance.DataManager.ActionData.BroadcastConfig.set(BroadcastConfig[i].ID, config)
        }
    }
}

type LevelCoinfig = {
    /**阶段 */
    stage: number
    /**对应ID */
    mosnter_id: number
    /**需要的coin1 */
    gift_num_count: number
    /**点赞加多少力 */
    like_add_force: number
    /**发送加多少力 */
    send_add_force: number
} 