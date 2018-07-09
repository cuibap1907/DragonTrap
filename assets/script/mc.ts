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
const MAX_SPEED     =   500;
@ccclass
export default class CharacterControll extends cc.Component {

    @property({
        type: cc.Integer,
        tooltip: "speed of Main Character."
    })
    speed: number = 50;

    _moveFlags: number = 0;

    leftKey: any = cc.KEY.left;
    rightKey: any = cc.KEY.right;

    private behavior: PlayerBehavior = null;

    onLoad () {
        EventManager.instance.register(GameMessage.CHARACTER_MOVE_ON_BY_TOUCH, this.onTouchControl, this);
        EventManager.instance.register(GameMessage.CHARACTER_MOVE_OFF_BY_TOUCH, this.offTouchControl, this);
        this.behavior = this.node.getComponent("player-behavior");
    }

    start () {

    }

    mcRunState(isRight: boolean = false)
    {
        this.behavior.setAnimName("Side");
        this.behavior.runStatus(isRight);
    }

    mcIdleState()
    {
        this.behavior.setAnimName("Front");
        this.behavior.idleStatus();
    }

    releaseAll()
    {
        this._moveFlags = -1;
    }


    onTouchControl(newDir: cc.Vec2, moveTo: cc.Vec2, keyCode: number = -1)
    {
        cc.log("Called touch controll.");
        if(this.useKeyboard)
        {
            this.limitPos = moveTo;
            switch(keyCode)
            {
                case this.leftKey:
                {
                    this._moveFlags &= ~MOVE_RIGHT;
                    this._moveFlags |= MOVE_LEFT;
                    this.mcRunState(false);
                    break;
                }

                case this.rightKey:
                {
                    this._moveFlags &= ~MOVE_LEFT;
                    this._moveFlags |= MOVE_RIGHT;
                    this.mcRunState(true);
                    break;
                }
            }
        } else {
            this.moveDir = newDir;
            this.moveToPos = moveTo;
        }
    }

    offTouchControl(keyCode)
    {
        if(this.useKeyboard)
        {
            switch(keyCode)
            {
                case this.leftKey:
                {
                    this._moveFlags &= ~MOVE_LEFT;
                    break;
                }

                case this.rightKey:
                {
                    this._moveFlags &= ~MOVE_RIGHT;
                    break;
                }
            }
        } else {
            cc.log("dung me no roi...........");
            this.moveDir = null;
            this.moveToPos = null;
        }
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
    useKeyboard: boolean = true;
    moveOffX: number = 0.0;
    moveOffY: number = 0.0;
    limitPos: cc.Vec2;
    moveToPos: cc.Vec2;

    updateNewDir(newDir: cc.Vec2)
    {
        this.moveDir = newDir;
    }

    update (dt) {
        if(this.node.y < -560)
        {
            cc.log("GAME OVER.");
        }

        let delta: number = 0;
        delta = this.speed * dt;
        if(delta > MAX_SPEED)
            delta = MAX_SPEED;
        
        if(this.useKeyboard)
        {
            if(this._moveFlags == MOVE_LEFT)
            {
                if(this.node.x - delta > this.limitPos.x)
                {
                    this.node.x -= delta;
                } else 
                {
                    //this.releaseAll();
                    this.mcIdleState();
                    cc.log("ko co chay duoc Left");
                }
                
            } else if(this._moveFlags == MOVE_RIGHT)
            {
                if(this.node.x + delta < this.limitPos.x)
                {
                    this.node.x += delta;
                }
                else
                {
                    //this.releaseAll();
                    this.mcIdleState();
                    cc.log("ko co chay duoc Right.");
                }
            }

        } else {
            if (this.moveDir  && !this.canStopMovingMC())
            {
                this.moveOffX = this.speed * this.moveDir.x * dt;
                this.moveOffY = this.speed * this.moveDir.y * dt;
                //if(!this.isGoingOutside(cc.p(this.moveOffX, this.moveOffY))) // will not go out limit.
                {
                    this.node.x += this.moveOffX;
                    this.node.y += this.moveOffY;
                    let dir: cc.Vec2 = cc.pSub(this.moveToPos, this.node.position);
                    // let deg = cc.radiansToDegrees(cc.pToAngle(this.moveDir));    
                    // if (deg >= 45 && deg < 135) {
                    // } else if (deg >= 135 || deg < -135) {
                    // } else if (deg >= -45 && deg < 45) {
                    // } else {
                    // }                
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
