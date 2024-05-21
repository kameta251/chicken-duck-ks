// 创建观察者接口
interface Observer {
    CallBack(data: any): void;
}

// 创建主题类
class Subject {
    observers: Observer[] = [];

    // 添加观察者
    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    // 移除观察者
    removeObserver(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    // 通知所有观察者
    notify(data: NotificationData): void {
        for (const observer of this.observers) {
            observer.CallBack(data);
        }
    }
}

interface NotificationData {
    action: string;
    data?: any;
}