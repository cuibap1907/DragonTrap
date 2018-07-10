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
import Global from './global'

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
    displayTime: number = 5;

    groundSpeed: number = 60;

    startTime: number = 7;
    timeToHide: number = 0;


    onLoad () 
    {

    }

    start () {
        if(this.groundType == GROUNDTYPE.ICE_GROUND)
            this.timeToHide = this.startTime - cc.director.getDeltaTime();
    }

    outOfScreen(): boolean
    {
        if(this.node.y > 550)
            return true;
        return false;
    }

    enableHL()
    {
        this.node.getChildByName("highlight").active = true;
    }

    disableHL()
    {
        this.node.getChildByName("highlight").active = false;
    }

    displayHL: boolean = false;
    update (dt) {
        if(Global.instance.isGameOver)
            return;

        if(this.groundType == GROUNDTYPE.ICE_GROUND)
        {
            this.timeToHide = this.timeToHide - cc.director.getDeltaTime();
            if(this.timeToHide < 0.01)
            {
                this.node.getChildByName("highlight").stopAllActions();
                this.node.destroy();
            }

            if(this.timeToHide < 4 && !this.displayHL)
            {
                this.displayHL = true;
                let actionBlink = cc.blink(20, 15);
                this.node.getChildByName("highlight").active = true;
                this.node.getChildByName("highlight").runAction(cc.repeatForever(actionBlink));
            }
        }
        
        this.node.y += this.groundSpeed * dt;
        if(this.outOfScreen())
        {
            this.node.destroy();
        }
    }
}
