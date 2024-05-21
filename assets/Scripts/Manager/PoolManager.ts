import { _decorator, Component, Node, NodePool } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('PoolManager')
export class PoolManager extends Component {
    static _instance: PoolManager;
    static get instance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new PoolManager();
        return this._instance
    }
    public monsterPools: Map<number, NodePool> = new Map();
    public monsterParents: Map<number, Node> = new Map();

    onLoad(){
        PoolManager._instance = this

    }

    OnLoadMain(){
        let monsterIDs = [
            1100, 1101, 1102, 1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110, 1200, 1300, 1400, 1401, 1500, 1501, 1600, 1601,
            2100, 2101, 2102, 2103, 2104, 2105, 2106, 2107, 2108, 2109, 2110, 2200, 2300, 2400, 2401, 2500, 2501, 2600, 2601];
            for(let i = 0; i < monsterIDs.length; i++) {
              this.monsterPools.set(monsterIDs[i], new NodePool());
              if(i < 19) {
                this.monsterParents.set(monsterIDs[i], GameManager.instance.Maps.ChickenRoot);
            } else {
                this.monsterParents.set(monsterIDs[i], GameManager.instance.Maps.DuckRoot);
            }
            }
            
            console.log("monsterPools",this.monsterPools)
    }
    
    InPool(monsterID: number, node:Node){
        let monsterPool = this.monsterPools.get(monsterID);
        if(monsterPool) {
            monsterPool.put(node);
        } else {
            // 打印错误信息（需要制定你的日志记录方法）
            console.log(`Monster ID ${monsterID} does not exist.`);
        }
    }

    OutPool(monsterID: number){
        let monsterPool = this.monsterPools.get(monsterID);
        if(monsterPool) {
            let monster = this.monsterPools.get(monsterID).get();
            if(monster == null){return null}
            let parent = this.monsterParents.get(monsterID);
            // 确保找到父对象，这里需要判断 parent 是否为 null，并且按需赋值 parent
            monster.parent = parent ? parent : null;
            return monster;
        } else {
            // 打印错误信息（需要制定你的日志记录方法）
            console.log(`Monster ID ${monsterID} does not exist.`);
            return null;
        }
    }
}



