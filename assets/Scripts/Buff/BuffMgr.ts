import Factory from "./BuffFactory";
import { BuffBase, eAttrType, eBuffGroup, eBuffType } from "./BuffBase";

export class BuffMgr {
    //Hero类是所有需要buff管理的类的基类，可以自己实现一个
    private mObj: any;
    private mBuffFactory: Factory;
    private mBuffArray: Array<BuffBase> = [];

    constructor(obj: any) {

        this.mObj = obj;
        this.init();
    }

    private init() {
        this.mBuffArray = new Array<BuffBase>();
        this.mBuffFactory = new Factory();
    }

    public update(dt: number) {
        for (let i = 0; i < this.mBuffArray.length;) {
            let buff = this.mBuffArray[i];
            if (buff.getLive() === false) {
                buff.Exit();
                this.mBuffArray.splice(i, 1);
            }
            else {
                buff._update(dt);
                i++;
            }
        }
    }

    public getAttr(attrType: eAttrType) {
        let value = 0;
        for (let i = 0; i < this.mBuffArray.length; i++) {
            value += this.mBuffArray[i].getAttr(attrType);
        }

        return value;
    }

    public createBuff(buffType: eBuffType, param?: {}) {
        let oldBuff = this.getBuff(buffType);
        if (oldBuff) {
            if (oldBuff.isMaxCount()) {
                oldBuff.resetCD();
            }
            else {
                oldBuff.upNowCount(1);
                oldBuff.Enter()
            }
        }
        else {
            let buff = this.mBuffFactory?.createState(buffType, this.mObj, param);
            if (!buff) return;
            
            // buff.Action();
            // this.removeBuffByGroup(buff.getClashGroup());

            this.mBuffArray.push(buff);
        }
    }

    public getBuff(buffType: eBuffType) {
        for (let i = 0; i < this.mBuffArray.length; i++) {
            if (this.mBuffArray[i].getBuffType() === buffType) {
                return this.mBuffArray[i];
            }
        }

        return null;
    }

    public removeBuff(buffType: eBuffType) {
        for (let i = 0; i < this.mBuffArray.length; i++) {
            if (this.mBuffArray[i].getBuffType() === buffType) {
                this.mBuffArray[i].setLive(false);
            }
        }
    }

    public removeBuffByGroup(groupType: eBuffGroup) {
        //if (groupType === -1) return;

        for (let i = 0; i < this.mBuffArray.length; i++) {
            if (this.mBuffArray[i].getGroup() === groupType) {
                this.mBuffArray[i].setLive(false);
            }
        }
    }

    public HasBuff(buffType:eBuffType): boolean{
        for (let i = 0; i < this.mBuffArray.length; i++) {
            if (this.mBuffArray[i].getBuffType() === buffType) {
                return true
            }
        }
        return false
    }
}
