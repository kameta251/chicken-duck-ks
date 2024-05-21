

//---------------buff---------------
export enum eBuffType
{
    eLikeAddForce,
    eSendAddForce
}

export enum eBuffGroup
{
    eNoGroup,
    eChangeHeroGroup,
}


export enum eAttrType
{
    eForce
}


export class BuffBase {

    private mBuffType: eBuffType;

    protected mGroup: eBuffGroup = eBuffGroup.eNoGroup;
    protected mClashGroup: eBuffGroup = eBuffGroup.eNoGroup;

    protected mNowLiveTime: number = 0;
    protected mLiveTime: number = 0;

    protected mNowTriggerTime: number=0;
    protected mTriggerTime: number = 0;

    protected mNowCount: number = 0;
    protected mMaxCount: number = 1;

    private mParam: any = null;
    protected mObjCtrl: any = null;
    private mIsLive: boolean = true;

    constructor(buffType: eBuffType, objCtrl: any, param?: {})
    {      
        this.mBuffType = buffType;
        this.mObjCtrl = objCtrl;
        this.mParam = param;

        this.init(param);
    }

    protected init(param:any)
    {
        this.mNowCount = 1;
    }

    public Enter()
    {
        
    }

    public Action()
    {
        
    }

    public Exit()
    {
        
    }

    public getAttr(attrType: eAttrType)
    {
        return 0;
    }

    public _update(dt: number)
    {
        if(this.mTriggerTime||this.mNowTriggerTime == 0)
        {
            this.mNowTriggerTime += dt;
            if(this.mNowTriggerTime >= this.mTriggerTime)
            {
                this.mNowTriggerTime = 0;
                this.Action();
            }
        }

        this.mNowLiveTime += dt;
        if(this.mNowLiveTime >= this.mLiveTime)
        {
            this.mNowLiveTime = 0;
            this.mNowCount -= 1;
            if(this.mNowCount <= 0)
            {
                this.setLive(false);
            }
        }
    }

    public setLive(isLive: boolean)
    {
        this.mIsLive = isLive;
    }

    public getLive()
    {
        return this.mIsLive
    }

    //------------------------------------
    public getNowCount()
    {
        return this.mNowCount;
    }

    public setNowCount(value: number)
    {
        this.mNowCount = value;

        if(this.mNowCount > this.mMaxCount)
        {
            this.mNowCount = this.mMaxCount;
        }
    }

    public upNowCount(value: number)
    {
        this.setNowCount(this.mNowCount+1)
    }

    //------------------------------------
    public isMaxCount()
    {
        if(this.mNowCount === this.mMaxCount)
        {
            return true;
        }

        return false;
    }

    public resetCD()
    {
        this.mNowLiveTime = 0;
    }



    //---------------------------------
    public getBuffType()
    {
        return this.mBuffType;
    }

    public getParam()
    {
        return this.mParam;
    }

    public getGroup()
    {
        return this.mGroup;
    }

    public getClashGroup()
    {
        return this.mClashGroup;
    }

    //-----------------------------------
    public FinishOnce(){
        
    }
}
