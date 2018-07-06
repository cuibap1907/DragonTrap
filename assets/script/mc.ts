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

import PlayerBehavior from "./player-behavior"
import GameMessage   from './game-messages'
import EventManager from './event-manager'

const MOVE_LEFT     =   1;
const MOVE_RIGHT    =   2;
const MOVE_UP       =   3;
const MOVE_DOWN     =   4;
const MAX_SPEED     =   20;
@ccclass
export default class CharacterControll extends cc.Component {

    @property({
        type: cc.Integer,
        tooltip: "speed of Main Character."
    })
    speed: number = 30;

    _moveFlags: number = 0;
    _acceleration: number = 50;

    leftKey: any = cc.KEY.left;
    rightKey: any = cc.KEY.right;

    private behavior: PlayerBehavior = null;

    onLoad () {
        EventManager.instance.register(GameMessage.CHARACTER_MOVE_ON_BY_TOUCH, this.onTouchControl, this);
        EventManager.instance.register(GameMessage.CHARACTER_MOVE_OFF_BY_TOUCH, this.offTouchControl, this);
    }

    start () {

    }

    onTouchControl(newDir: cc.Vec2, moveTo: cc.Vec2)
    {
        // switch(keyCode)
        // {
        //     case this.leftKey:
        //     {
        //         this._moveFlags |= MOVE_LEFT;
        //         break;
        //     }

        //     case this.rightKey:
        //     {
        //         this._moveFlags |= MOVE_RIGHT;
        //         break;
        //     }
        // }
        this.moveDir = newDir;
        this.moveToPos = moveTo;
    }

    offTouchControl(keyCode)
    {
        // switch(keyCode)
        // {
        //     case this.leftKey:
        //     {
        //         this._moveFlags &= ~MOVE_LEFT;
        //         break;
        //     }

        //     case this.rightKey:
        //     {
        //         this._moveFlags &= ~MOVE_RIGHT;
        //         break;
        //     }
        // }
        this.moveDir = null;
        this.moveToPos = null;
    }

    onKeyPressed(keyCode, event) {
    }

    onKeyReleased(keyCode, event) {
    }

    onCollisionEnter(other) {
        cc.log("Player collide with: " + other.node.name);
        
    }

    onCollisionExit(other, self) {
        
    }

    moveDir: cc.Vec2;
    useKeyboard: boolean = false;
    moveOffX: number = 0.0;
    moveOffY: number = 0.0;
    limitPos: cc.Vec2;
    moveToPos: cc.Vec2;

    updateNewDir(newDir: cc.Vec2)
    {
        this.moveDir = newDir;
    }

    update (dt) {
        let delta: number = 0;
        delta = this._acceleration * dt;
        if(delta > MAX_SPEED)
            delta = MAX_SPEED;
        
        if(this.useKeyboard)
        {
            if(this._moveFlags == MOVE_LEFT)
            {
                //if(this.node.x - delta > this.limitPos.x)
                {
                    this.node.x -= delta;
                }
                
            } else if(this._moveFlags == MOVE_RIGHT)
            {
                //if(this.node.x + delta < this.limitPos.x)
                    this.node.x += delta;
            }
        } else {
            if (this.moveDir  && !this.canStopMovingMC())
            {
                this.moveOffX = this._acceleration * this.moveDir.x * dt;
                this.moveOffY = this._acceleration * this.moveDir.y * dt;
                //if(!this.isGoingOutside(cc.p(this.moveOffX, this.moveOffY))) // will not go out limit.
                {
                    this.node.x += this.moveOffX;
                    this.node.y += this.moveOffY;
                    let dir: cc.Vec2 = cc.pSub(this.moveToPos, this.node.position);
                    let deg = cc.radiansToDegrees(cc.pToAngle(this.moveDir));                    
                    this.updateNewDir(cc.pNormalize(dir));
                } 
            } 
        }

    }

    canStopMovingMC(): boolean
    {
        let bStop: boolean = false;
        let offX: number = this.moveToPos.x - this.node.position.x;
        let offY: number = this.moveToPos.y - this.node.position.y;
        if(Math.abs(offX) < 2 && Math.abs(offY) < 2) // cheat to stop MC, because animation will change position of MC. It's hard to check to destination or not (moveDir not null)
            return true;
        return bStop;
    }
}
