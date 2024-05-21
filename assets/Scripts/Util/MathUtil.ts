import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MathUtil')
export class MathUtil {
    /**时钟 */
    static ClockSting(Sec: number): string {
        return `${this.tensitenum(Math.floor(Sec / 60))}:${this.tensitenum(Math.floor(Sec % 60))}`
    }
    private static tensitenum(num: number): string {
        if (num >= 10) {
            return num + ``
        }
        if (num < 10) {
            return `0` + num
        }
    }

    /**超过10万，简化万 */
    static Reduce_10K(source: number): string{
        return source < 100000 ? source + ``: Math.floor(source / 10000) + `万`
    }

    /**超过10万，简化万 */
    static Reduce_10KFloor(source: number): string{
        return source < 100000 ? Math.floor(source) + ``: (source / 10000).toFixed(2) + `万`
    }

    private static EntityIDPool: number = 1
    static GetEntity() { return MathUtil.EntityIDPool++ }
}


