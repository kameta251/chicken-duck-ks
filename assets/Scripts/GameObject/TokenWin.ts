import { _decorator, Component, director, Node } from 'cc';
import { NetManager } from '../Net/NetManager';
const { ccclass, property } = _decorator;

@ccclass('TokenWin')
export class TokenWin extends Component {

    onLoad() {
        
        director.addPersistRootNode(this.node)
    }

    OnClickReConnet(){
        NetManager.instance.ByteSDK.SendLoginRpc();
        this.node.active = false
    }
}


