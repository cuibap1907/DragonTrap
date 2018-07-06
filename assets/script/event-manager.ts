// this class use for manage own event sending between game object
// why we do not use cocos event manager like emit, dispatchevent
//      - emit: it only work on the same node
//      - dispatch event: it only work buble (we not send cross object)

class Listenner {
    target: cc.Node = null;
    callback: Function = null;
    priority: number = 0;
    excuteOnce: boolean = false;
}

export default class EventManager {

    private static _instance: EventManager = null;
    static get instance() {
        if(EventManager._instance == null)
            EventManager._instance = new EventManager();

        return EventManager._instance;
    }

    private eventListenners: {[key: string]: Listenner[]} = {};

    register(event: string, callback: Function, target: any = null, priority: number = 0, excuteOnce: boolean = false): Function {
        let listenner = {target: target, callback: callback, priority: priority, excuteOnce: excuteOnce};
        if(this.eventListenners[event]) {   // already have evnt type -> push back it in list listenner
            this.eventListenners[event].push(listenner);
        } else { // if not create list
            this.eventListenners[event] = [];
            this.eventListenners[event].push(listenner);
        }
        // sort base on prirority
        this.eventListenners[event].sort((a, b) => {
            return b.priority - a.priority;         // bigger priority -> most front of array
        });

        return callback;    // return callback to easy store it, and use in unregister function
    }

    registerOnce(event: string, callback: Function, target: any = null, priority: number = 0) {
        this.register(event, callback, target, priority, true);
    }

    unregister(event: string, callback: Function, target: any = null) {
        if(this.eventListenners[event]) {
            let toRemove: number[] = [];
            for(let i = 0; i < this.eventListenners[event].length; i++) {
                let listenner = this.eventListenners[event][i];
                if(callback == null) {  // remove for all listenner on node target
                    if(listenner.target == target)
                        toRemove.push(i);
                }  else {
                    if(listenner.target == target && listenner.callback == callback)
                        toRemove.push(i);
                }                
            }
            this.eventListenners[event] = this.eventListenners[event].filter((val, id) => {
                return toRemove.indexOf(id) === -1;
            });
            // remove if event has empty
            if(this.eventListenners[event].length == 0) {
                delete this.eventListenners[event];
            }
        }
    }

    // unregister all listenner for target
    unregisterTarget(target: any) {
        for(let event in this.eventListenners) {
            let toRemove: number[] = [];
            for(let i = 0; i < this.eventListenners[event].length; i++) {
                let listenner = this.eventListenners[event][i];
                if(listenner.target == target)
                    toRemove.push(i);
            }
            this.eventListenners[event] = this.eventListenners[event].filter((val, id) => {
                return toRemove.indexOf(id) === -1;
            });
            // remove if event has empty
            if(this.eventListenners[event].length == 0) {
                delete this.eventListenners[event];
            }
        }
    }

    // remove all listener for event
    remove(event: string) {
        if(this.eventListenners[event]) {
            delete this.eventListenners[event];
        }
    }

    dispatch(event: string, ...params: any[]) {
        if(this.eventListenners[event]) {
            let excuteOnce: Listenner[] = [];
            this.eventListenners[event].forEach(listenner => {
                if(listenner.target) {
                    listenner.callback.call(listenner.target, params[0], params[1], params[2], params[3], params[4], params[5], params[6], params[7], params[8], params[9]);
                } else {
                    listenner.callback(params[0], params[1], params[2], params[3], params[4], params[5], params[6], params[7], params[8], params[9]);
                }
                if(listenner.excuteOnce == true) {
                    excuteOnce.push(listenner);
                }
            });

            excuteOnce.forEach(listenner => {
                this.unregister(event, listenner.callback, listenner.target);
            });
        }
    }
}
