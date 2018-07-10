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
import GameMessage   from './game-messages'
import EventManager from './event-manager'
import {SWIPE_SIDE} from './mc'
import Global from './global'

@ccclass
export default class Game extends cc.Component {
    @property({
        type: [cc.Node],
        tooltip: "Lane touched."
    })
    limitLane: cc.Node [] = [];

    currentLaneID: number = 1; // at starting game.
    nextLaneID: number = -1; // touched lane.

    startTouch: cc.Vec2;
    endTouch: cc.Vec2;

    onMCTouched: boolean = false;
    
    onLoad () {
        cc.director.getPhysicsManager().enabled = true;

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    getLaneTouched(pTouched: cc.Vec2): number
    {
        for(let iii = 0; iii < this.limitLane.length; ++ iii)
        {
            if(this.limitLane[iii].getBoundingBox().contains(pTouched))
                return iii;
        }

        return -1;
    }

    onTouchMove(event: cc.Event.EventTouch) {
    }

    onTouchEnd(event: cc.Event.EventTouch) {
        if(Global.instance.useKeyboard)
            return;

        let touchP: cc.Vec2 = this.node.convertToNodeSpaceAR(event.getLocation());
        this.endTouch = touchP;
        let dirSwipe = cc.pSub(this.endTouch, this.startTouch);
        let deg = cc.radiansToDegrees(cc.pToAngle(dirSwipe));
        let leng: number = Math.sqrt(Math.pow(dirSwipe.x, 2) + Math.pow(dirSwipe.y, 2));

        if(leng >= 100) // this is swipe
        {
            if(deg > 0 && deg < 90)
            {
                // up - right
                EventManager.instance.dispatch(GameMessage.CHARACTER_MOVE_SWIPE_BY_TOUCH, SWIPE_SIDE.UP_RIGHT);
            } else if(deg > 90 && deg < 180)
            {
                // up - left
                EventManager.instance.dispatch(GameMessage.CHARACTER_MOVE_SWIPE_BY_TOUCH, SWIPE_SIDE.UP_LEFT);
            }
            return;
        }

        
        EventManager.instance.dispatch(GameMessage.CHARACTER_MOVE_OFF_BY_TOUCH);
    }

    onTouchCancel(event: cc.Event.EventTouch) {
    }

    onTouchStart(event: cc.Event.EventTouch) {

        if(Global.instance.useKeyboard)
            return;

        let touchP: cc.Vec2 = this.node.convertToNodeSpaceAR(event.getLocation());
        this.startTouch = touchP;

        let idLaneTouched: number = this.getLaneTouched(touchP);

        if(this.node.getChildByName("character").getBoundingBox().contains(touchP))
        {
            this.onMCTouched = true;
        }
        if(this.onMCTouched) // this will swipe to jump.
            return;

        let characterPos: cc.Vec2 = this.node.getChildByName("character").position;
        let convertVerticalPos: cc.Vec2 = cc.p(touchP.x, characterPos.y); // pos to come to
        let dir = cc.pSub(convertVerticalPos, characterPos);
        let keycodeTouched: number = -1;
        if(touchP.x > characterPos.x)
        {
            keycodeTouched = cc.KEY.right;
        }
        else if(touchP.x < characterPos.x)
        {
            keycodeTouched = cc.KEY.left;
        }
        EventManager.instance.dispatch(GameMessage.CHARACTER_MOVE_ON_BY_TOUCH, cc.pNormalize(dir), convertVerticalPos, keycodeTouched);
    }

    start () {

    }

    update (dt) {}

    onPauseGame()
    {
        cc.director.pause();
    }
}
