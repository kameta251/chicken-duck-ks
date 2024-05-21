export class Queue<T> {
    private items: T[];
  
    constructor() {
      this.items = [];
    }

    /**向队列头部添加一个元素 */
    enqueueToFront(item: T) {
      this.items.unshift(item);
    }
  
    /**向队列尾部添加一个元素 */
    enqueue(item: T) {
      this.items.push(item);
    }
  
    /**从队列头部移除一个元素并返回它 */
    dequeue(): T | undefined {
      return this.items.shift();
    }
  
    /**判断队列是否为空 */
    isEmpty(): boolean {
      return this.items.length === 0;
    }
  
    /**返回队列元素的个数 */
    size(): number {
      return this.items.length;
    }
  
    /**返回队首元素 */
    peek(): T | undefined {
      return this.items[0];
    }

    /**清空 */
    clear(){
      this.items = []
    }
  }