
import { sp } from "cc";
import { BuffBase, eBuffType } from "./BuffBase";
import { LikeAddForce } from "./Buffs/LikeAddForce";
import { SendAddForce } from "./Buffs/SendAddForce";

export default class BuffFactory {

    public createState(stateType: eBuffType, objCtrl: any, param?: {}): BuffBase {
        let instance: BuffBase;

        switch (stateType) {
            case eBuffType.eLikeAddForce:
                instance = new LikeAddForce(stateType, objCtrl, param);
                break
            case eBuffType.eSendAddForce:
                instance = new SendAddForce(stateType, objCtrl, param)
                break
        }

        return instance;
    }
}
