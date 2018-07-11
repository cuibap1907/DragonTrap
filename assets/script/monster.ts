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


@ccclass
export default class Monster extends cc.Component {

    @property([cc.Prefab])
    weaponDataList: cc.Prefab [] = [];

    /*
        -1 go left
        1 go right
    */
    _directionMove: number = 1;
    _speed: number = 50;

    onLoad () 
    {
        this.schedule(()=> {
            this.spawnNewWeapon();
        }, 3, 1000);
    }

    start () {

    }

    spawnNewWeapon()
    {
        let numberWeaponRand: number = Math.floor((cc.rand() % 100) + 0);
        let numberWeapon: number = 1;
        if(numberWeaponRand < 50)
            numberWeapon = 2;
        
        let weaponID: number = Math.floor((cc.rand() % 4) + 0);
        cc.log(" -------------- Id Weapon: " + weaponID);
        let newWeapon: cc.Node = cc.instantiate(this.weaponDataList[weaponID]);
        let rigid = newWeapon.getComponent(cc.RigidBody);
        rigid.linearVelocity = cc.v2(15, 100);
        this.node.getChildByName("weapon_spawn").addChild(newWeapon);


        if(numberWeapon > 1)
        {
            let weaponID2: number = Math.floor((cc.rand() % 4) + 0);
            cc.log(" -------------- Id Weapon: " + weaponID2);
            let newWeapon2: cc.Node = cc.instantiate(this.weaponDataList[weaponID2]);
            let rigid = newWeapon2.getComponent(cc.RigidBody);
            rigid.linearVelocity = cc.v2(-150, 100);
            this.node.getChildByName("weapon_spawn").addChild(newWeapon2);
        }
    }

    update (dt) {

        if(Global.instance.isGameOver)
        {
            this.unscheduleAllCallbacks();
            return;
        }

        let delta: number = this._speed * dt * this._directionMove;
        this.node.x += delta;
        if(this.node.x * this._directionMove > 250) // go to limit
        {
            this._directionMove = - this._directionMove;
        }
    }
}
