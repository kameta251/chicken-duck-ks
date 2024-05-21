import { BuffBase, eAttrType } from "../BuffBase";

export class SendAddForce extends BuffBase{
    protected init(param:any)
    {
        super.init(param);
        this.mLiveTime = 5
        this.mMaxCount = 10
        this.mTriggerTime = 1
    }
    public resetCD(){
        this.mNowLiveTime = this.mNowLiveTime;
    }
    public getAttr(attrType: eAttrType)
    {
        if(this.getLive() === false) return 0;

        switch(attrType)
        {
            case eAttrType.eForce:
                return this.mObjCtrl.GetOnceSendAddForce * this.mNowCount;
            break;
        }

        return 0;
    }

}