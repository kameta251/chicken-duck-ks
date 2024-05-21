import { BuffBase, eAttrType } from "../BuffBase";

export class LikeAddForce extends BuffBase{
    protected init(param:any)
    {
        super.init(param);
        this.mLiveTime = 3
        this.mMaxCount = 30
        this.mTriggerTime = 1
    }
    public resetCD(){
        this.mNowLiveTime = this.mNowLiveTime;
    }
    public Enter(): void {
        this.mLiveTime = (-1 * this.mNowCount + 31) / 10
    }
    public getAttr(attrType: eAttrType)
    {
        if(this.getLive() === false) return 0;

        switch(attrType)
        {
            case eAttrType.eForce:
                return this.mObjCtrl.GetOnceLikeAddForce * this.mNowCount;
            break;
        }

        return 0;
    }
}