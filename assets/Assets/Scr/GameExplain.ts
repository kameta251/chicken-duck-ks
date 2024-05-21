import { _decorator, CCFloat, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameExplain')
export class GameExplain extends Component {
    @property({ type: CCFloat, displayName: `轮播速度(单位秒)` })
    Carousel_Speed: number
    @property({ type: [Node], displayName: `轮播图片` })
    Carousel_List: Node[] = []
    private Index: number = 0
    private Progress: number = 0
    update(deltaTime: number) {
        if(this.Carousel_List.length==0 || this.Carousel_Speed==null){return}
        this.Progress+=deltaTime
        this.ShowCarousel(this.Index)
        if(this.Progress>=this.Carousel_Speed){
            this.Progress = 0
            this.Index++
            if(this.Index>=this.Carousel_List.length){this.Index = 0}
        }
    }

    ShowCarousel(index: number) {
        if (index > this.Carousel_List.length) { return }
        for (var i = 0; i < this.Carousel_List.length; i++) {
            if(i == index){this.Carousel_List[i].active = true;continue}
            this.Carousel_List[i].active = false
        }
    }

    OnClickGameExplain(){
        this.node.active = !this.node.active
    }
}


