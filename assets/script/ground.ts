// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

export enum GROUNDTYPE {
    AUTO_HIDE_GROUND    =   0,
    FINE_GROUND         =   1,
    ICE_GROUND          =   2
}

@ccclass
export default class Ground extends cc.Component {

    @property({
        type: cc.Enum(GROUNDTYPE),
        tooltip: "type of ground"
    })
    groundType: GROUNDTYPE = GROUNDTYPE.FINE_GROUND;

    @property({
        type: cc.Integer,
        tooltip: "time display of auto hide ground"
    })
    displayTime: number = 3;

    groundSpeed: number = 60;

    onLoad () {}

    start () {

    }

    outOfScreen(): boolean
    {
        if(this.node.y > 550)
            return true;
        return false;
    }

    update (dt) {
        this.node.y += this.groundSpeed * dt;
        if(this.outOfScreen())
        {
            cc.log("Auto detroyed.");
            this.node.destroy();
        }
    }
}
