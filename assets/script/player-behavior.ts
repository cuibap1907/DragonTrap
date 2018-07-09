
const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerBehavior extends cc.Component {

    // animation control
    private amatureDisplay: dragonBones.ArmatureDisplay = null;
    private amature: dragonBones.Armature = null; // this is Front
    private amatureBack: dragonBones.Armature = null;
    private amatureSide: dragonBones.Armature = null;
    private loaded: boolean = true;
    private canClock: boolean = false;
    animName: string = "Front";
    running: boolean = false;
    idling: boolean = false;

    onLoad () {
        this.amatureDisplay = this.getComponent(dragonBones.ArmatureDisplay);
        this.amature = this.amatureDisplay.armature();
        this.amatureDisplay.armature().display.removeFromParent();
        // this.amature.dispose();
        // this.amature = this.amatureDisplay.buildArmature("Front");
        this.amatureBack = this.amatureDisplay.buildArmature("Back");
        this.amatureSide = this.amatureDisplay.buildArmature("Side");
        this.amatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationEvent, this);
        this.amatureDisplay.addEventListener(dragonBones.EventObject.START, this.onAnimationEvent, this);

        this.node._sgNode.addChild(this.amature.display);
        this.node._sgNode.addChild(this.amatureSide.display);
        this.node._sgNode.addChild(this.amatureBack.display);

        this.amatureBack.display.setVisible(false);
        this.amatureSide.display.setVisible(false);

        this.setLoaded(this.loaded);
        dragonBones.WorldClock.clock.add(this.amature);
        dragonBones.WorldClock.clock.add(this.amatureBack);
        dragonBones.WorldClock.clock.add(this.amatureSide);
        this.canClock = true;
        this.idleStatus();

        cc.log("Get Amature.");
        let nameList = this.amatureDisplay.getArmatureNames();
        cc.log(" ---------- " + nameList.length);
        nameList.forEach(elem=> {
            cc.log("\n Name:   " + elem.toString());
        });
    }

    setLoaded(loaded: boolean) {
        this.loaded = loaded;
        if(this.amatureDisplay) {
            this.amatureDisplay.enabled = loaded;            
        }            
    }

    setAnimName(newName: string)
    {
        this.animName = newName;
    }

    resetRunning()
    {
        this.running = false;
    }

    idleStatus() {
        this.running = false;
        if(this.idling)
            return;
        this.idling = true;
        cc.log("Idle   Anim Name is:  " + this.animName);
        switch(this.animName)
        {
            case "Front":
            {
                this.amature.display.setVisible(true);
                this.amatureBack.display.setVisible(false);
                this.amatureSide.display.setVisible(false);
                this.amature.animation.play('idle', 1000);
                break;
            }
            case "Back":
            {
                this.amature.display.setVisible(false);
                this.amatureSide.display.setVisible(false);
                this.amatureBack.display.setVisible(true);
                this.amatureBack.animation.play('idle', 1000);
                break;
            }

            case "Side":
            {
                this.amature.display.setVisible(false);
                this.amatureBack.display.setVisible(false);
                this.amatureSide.display.setVisible(true);
                this.amatureSide.animation.play('idle', 1000);
                break;
            }
        }
    }

    runStatus(isRight: boolean = false) {
        this.idling = false;
        //if(this.running)
        //    return;
        this.running = true;
        cc.log("Run     Anim Name is:  " + this.animName);
        switch(this.animName)
        {
            case "Front":
            {
                this.amature.display.setVisible(true);
                this.amatureBack.display.setVisible(false);
                this.amatureSide.display.setVisible(false);
                this.amature.animation.play('run', 1000);
                break;
            }
            case "Back":
            {
                this.amature.display.setVisible(false);
                this.amatureSide.display.setVisible(false);
                this.amatureBack.display.setVisible(true);
                this.amatureBack.animation.play('run', 1000);
                break;
            }
            case "Side":
            {
                this.amature.display.setVisible(false);
                this.amatureBack.display.setVisible(false);
                this.amatureSide.display.setVisible(true);
                if(isRight)
                {
                    this.amatureSide.display.setRotationY(180);
                } else if(!isRight)
                {
                    {
                        cc.log("Chay qua trai.");
                        this.amatureSide.display.setRotationY(0);
                    }
                }
                this.amatureSide.animation.play('run', 1000);
                break;
            }
        }
    }

    changeDirectionStatus(isRight: boolean = false)
    {
        this.setAnimName("Front");
        this.amature.display.setVisible(false);
        this.amatureBack.display.setVisible(false);
        if(isRight)
        {
            this.amatureSide.display.setRotationY(180);
        } else if(!isRight)
        {
            {
                this.amatureSide.display.setRotationY(0);
            }
        }
        this.amatureSide.display.setVisible(true);
    }

    poundingStatus(isLeft: boolean = false)
    {
        this.setAnimName("Side");
        this.amature.display.setVisible(false);
        this.amatureBack.display.setVisible(false);
        this.amatureSide.display.setVisible(true);
        if(isLeft)
        {
            this.amatureSide.display.setRotationY(180);
        }
        this.amatureSide.animation.play('pound', 2);
    }

    private onAnimationEvent(event: cc.Event.EventCustom) {
        let eventObj: dragonBones.EventObject = event.detail;
        cc.log("ANIM event: " + event.type + " anim: " + event.detail.animationState.name);
        if(event.type === dragonBones.EventObject.COMPLETE) {
            if(eventObj.animationState.name === 'pound') {
                cc.log("co vao day ko Bay LLLLLLLLLLLLLLLLLLLLLLLL");
                this.setAnimName("Front");
                this.amature.display.setVisible(true);
                this.amatureBack.display.setVisible(false);
                this.amatureSide.display.setRotationY(0);
                this.amatureSide.display.setVisible(false);
                this.amature.animation.play('idle', -1);
            } else if(eventObj.animationState.name === 'bound') {
                
            }
        } else if(event.type === dragonBones.EventObject.START) {
            
        }
    }

    onDestroy()
    {
        this.amatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationEvent, this);
        this.amatureDisplay.removeEventListener(dragonBones.EventObject.START, this.onAnimationEvent, this);
        dragonBones.WorldClock.clock.remove(this.amature);
        dragonBones.WorldClock.clock.remove(this.amatureBack);
        dragonBones.WorldClock.clock.remove(this.amatureSide);
        this.amature = null;
        this.amatureBack = null;
        this.amatureSide = null;
    }

    update (dt) {
        if(this.canClock)
        dragonBones.WorldClock.clock.advanceTime(dt);
    }
}
