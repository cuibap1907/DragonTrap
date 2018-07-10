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

export enum INITLANE {
    ONE_LANE    =   1,
    TWO_LANE    =   2
}

@ccclass
export default class GroundControl extends cc.Component {

    @property({
        type: [cc.Prefab],
        tooltip: "Data for ground."
    })
    groundData: cc.Prefab [] = [];

    @property({
        type: [cc.Node],
        tooltip: "node spawn ground."
    })
    spawnGroundNode: cc.Node [] = [];

    /*
     0 - Death
     1 - Fine
     2 - Ice
     */  
    GROUND_DATA: number [] [] = [[1, -1, 1],
                                 [-1, 2, 1],
                                 [0, 1, -1],
                                 [2, 1, 2],
                                 [2, -1, 0],
                                 [-1, 1, 0],
                                 [1, 0, 1],
                                 [2, -1, 0],
                                 [-1, 1, 1],
                                 [0, 1, -1],
                                 [2, 1, -1],
                                 [-1, -1, 1],
                                 [-1, 2, 1]
                                ];

    prevLane: number = -1;
    stepGround: number = -1;

    onLoad () {
        let lenGround: number = this.GROUND_DATA.length;
        cc.log("Len Ground:  " + lenGround);
        this.schedule(()=>{
            this.spawnGroundStep();
        }, 3.0, lenGround - 1);
    }

    spawnGroundStep()
    {
        this.stepGround ++; // next floor.
        cc.log("Floor:  " + this.stepGround);

        let idGroundLane1: number = this.GROUND_DATA[this.stepGround][0];
        if(idGroundLane1 != -1)
        {
            let line1Node: cc.Node = cc.instantiate(this.groundData[idGroundLane1]);
            line1Node.setPosition(this.spawnGroundNode[0].getPosition());
            this.node.addChild(line1Node);
        }

        let idGroundLane2: number = this.GROUND_DATA[this.stepGround][1];
        if(idGroundLane2 != -1)
        {
            let line2Node: cc.Node = cc.instantiate(this.groundData[idGroundLane2]);
            line2Node.setPosition(this.spawnGroundNode[1].getPosition());
            this.node.addChild(line2Node);
        }

        let idGroundLane3: number = this.GROUND_DATA[this.stepGround][2];
        if(idGroundLane3 != -1)
        {
            let line3Node: cc.Node = cc.instantiate(this.groundData[idGroundLane3]);
            line3Node.setPosition(this.spawnGroundNode[2].getPosition());
            this.node.addChild(line3Node);
        }
    }

    start () {

    }

    // update (dt) {}
}
