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
import Global from './global'

export enum SWIPE_SIDE {
    UP_LEFT     =   1,
    UP_RIGHT    =   2
}

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
    body: cc.RigidBody;
    jumpSpeed: number = 500;
    _jumps: number = 2;

    onLoad () {
        EventManager.instance.register(GameMessage.CHARACTER_MOVE_ON_BY_TOUCH, this.onTouchControl, this);
        EventManager.instance.register(GameMessage.CHARACTER_MOVE_OFF_BY_TOUCH, this.offTouchControl, this);
        EventManager.instance.register(GameMessage.CHARACTER_MOVE_SWIPE_BY_TOUCH, this.onSwipeControl, this);
        EventManager.instance.register(GameMessage.CONTACT_ENABLE_JUMP, this.enableCanJumpOnGround, this);
        EventManager.instance.register(GameMessage.CONTACT_DISABLE_JUMP, this.disableCanJumpOnGround, this);


        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.onKeyPressed.bind(this),
            onKeyReleased: this.onKeyReleased.bind(this),
        }, this.node);
        this.behavior = this.node.getComponent("player-behavior");
        this.body = this.getComponent(cc.RigidBody);
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

    onSwipeControl(side: SWIPE_SIDE)
    {
        switch(side)
        {
            case SWIPE_SIDE.UP_LEFT:
            {
                let rigid = this.node.getComponent(cc.RigidBody);
                rigid.linearVelocity = cc.v2(0, 400);
                //rigid.angularVelocity = 45;
                rigid.fixedRotation = true;
                break;
            }

            case SWIPE_SIDE.UP_RIGHT:
            {
                let rigid = this.node.getComponent(cc.RigidBody);
                rigid.linearVelocity = cc.v2(0, 400);
                //rigid.angularVelocity = 45;
                rigid.fixedRotation = true;
                break;
            }
        }
    }


    onTouchControl(newDir: cc.Vec2, moveTo: cc.Vec2, keyCode: number = -1)
    {
        //cc.log("Called touch controll.");
        this.currentKeyCode = keyCode;
        if(Global.instance.useKeyboard)
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

    offTouchControl()
    {
        if(Global.instance.useKeyboard)
        {
            switch(this.currentKeyCode)
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
            //cc.log("dung me no roi...........");
            this.moveDir = null;
            this.moveToPos = null;
        }

        this.currentKeyCode = -1;
        this.mcIdleState();
    }

    _jump: boolean = false;
    _upPressed: boolean = false;

    canJumpOnGround: boolean = true;

    enableCanJumpOnGround()
    {
        this.canJumpOnGround = true;
    }

    disableCanJumpOnGround()
    {
        this.canJumpOnGround = false;
    }

    onKeyPressed(keyCode, event) {
        switch(keyCode)
        {
            case cc.KEY.a:
            case cc.KEY.left:
            {
                this._moveFlags |= MOVE_LEFT;
                this.mcRunState(false);
                break;
            }

            case cc.KEY.d:
            case cc.KEY.right:
            {
                this._moveFlags |= MOVE_RIGHT;
                this.mcRunState(true);
                break;
            }

            case cc.KEY.w:
            case cc.KEY.up:
            {
                if(!this._upPressed && this.canJumpOnGround)
                    this._jump = true;
                this._upPressed = true;
                break;
            }

            case cc.KEY.s:
            case cc.KEY.down:
            {
                this._moveFlags |= MOVE_DOWN;
                break;
            }
        }
    }

    onKeyReleased(keyCode, event) {
        switch(keyCode)
        {
            case cc.KEY.a:
            case cc.KEY.left:
            {
                this._moveFlags &= ~MOVE_LEFT;
                break;
            }

            case cc.KEY.d:
            case cc.KEY.right:
            {
                this._moveFlags &= ~MOVE_RIGHT;
                break;
            }

            case cc.KEY.w:
            case cc.KEY.up:
            {
                this._upPressed = false;
                break;
            }

            case cc.KEY.s:
            case cc.KEY.down:
            {
                this._moveFlags &= ~MOVE_DOWN;
                break;
            }
        }
        this.mcIdleState();
    }

    onCollisionEnter(other) {
        cc.log("Player collide with: " + other.node.name);
        
    }

    onCollisionExit(other, self) {
        
    }

    moveDir: cc.Vec2;
    currentKeyCode: number = -1;
    moveOffX: number = 0.0;
    moveOffY: number = 0.0;
    limitPos: cc.Vec2;
    moveToPos: cc.Vec2;

    updateNewDir(newDir: cc.Vec2)
    {
        this.moveDir = newDir;
    }

    update (dt) {
        var speed = this.body.linearVelocity;

        if(Global.instance.isGameOver)
            return;

        if(this.node.y < -560 || this.node.y > 420)
        {
            cc.log("GAME OVER.");
            EventManager.instance.dispatch(GameMessage.GAME_OVER_STATE);
            return;
        }

        let delta: number = 0;
        delta = this.speed * dt;
        if(delta > MAX_SPEED)
            delta = MAX_SPEED;
        
        if(Global.instance.useKeyboard)
        {
            if(this._moveFlags == MOVE_LEFT)
            {
                //if(this.node.x - delta > this.limitPos.x)
                {
                    this.node.x -= delta;
                } 
                // else 
                // {
                //     //this.releaseAll();
                //     this.mcIdleState();
                //     //cc.log("ko co chay duoc Left");
                // }
                
            } else if(this._moveFlags == MOVE_RIGHT)
            {
                //if(this.node.x + delta < this.limitPos.x)
                {
                    this.node.x += delta;
                }
                // else
                // {
                //     //this.releaseAll();
                //     this.mcIdleState();
                //     //cc.log("ko co chay duoc Right.");
                // }
            }

            if(Math.abs(speed.y) < 50) {
                this._jumps   = 2;
            }

            if (this._jump && this._jumps > 0) {
                speed.y = this.jumpSpeed;
                this._jumps --;
            }
            this._jump = false;
            
            this.body.linearVelocity = speed;

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

    onEndContact (contact, selfCollider, otherCollider) 
    {
        cc.log(" End Contact : " + otherCollider.body.node.name);
        this.disableCanJumpOnGround();
    }

    onBeginContact (contact, selfCollider, otherCollider) {

        // if(otherCollider.body.node.name == "player")
        // {
        //     Global.instance.player.updateScore();
        //     this.node.destroy();
        // }
        let groundName = otherCollider.body.node.name;
        cc.log(" Begin Contact: " + groundName);
        if(groundName == "death_ground")
        {
            EventManager.instance.dispatch(GameMessage.GAME_OVER_STATE);
            return;
        }
        this.enableCanJumpOnGround();
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

    onDestroy()
    {
        EventManager.instance.unregisterTarget(this);
    }
}
