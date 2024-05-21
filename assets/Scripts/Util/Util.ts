import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export class Collision {
    /**计算距离 */
    static getDistance(start, end): number {
        var pos = new Vec2(start.x - end.x, start.y - end.y);
        var dis = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
        return dis;
    }
    /**计算角度,y值判正负 */
    static VectorAngle(from: Vec3, to: Vec3): number {
        let angle = Vec2.angle(from, to);
        return from.y < to.y ? angle : -angle;
    }

}

export class Sleep {
    static sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export class Util {
    /**打乱数组 */
    static shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}