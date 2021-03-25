//an action represents things your mech can do on it's turn.

import Damage from "./Damage.js";
import UIComponent from "./UIComponent.js";
import * as Eff from "./Effect.js";
import Random from "./Random.js";

export class Action {

    static info = {
        name: "action",
        flavor: "you cannot do anything with this action.",
        src: "uncertainty.svg"
    };

    static uiComponent = new UIComponent(this.info.name, this.info.flavor, this.info.src);

    //array representing how many of each type of part must be available to perform this action.
    static req_inst = [
        0, //head
        0, //arm
        0, //leg
        0  //any (does NOT include what's already being used)
    ];

    static req_targ = [ //this one works a little differently than for instigators - pay attention!
        [false,false], //permissions for targeting your parts & an opponents parts respectively.
        0 //how many parts can be targeted. -1 means "target the whole mech."
    ]; 

    static ignoreAlive = false; //sometimes you gotta ignore whether or not something is alive.


    constructor(instigators, targets) {
        this.instigators = instigators;
        this.targets = targets;
        this.uiComponent = new UIComponent_Action(this.constructor.info, this.instigators, this.targets);


    }

    //this is the function to be called when you wanna DO THE THING - it checks to see if the action can occur first. Returns a string describing the action's results.
    //DO NOT OVERRIDE THIS. OVERRIDE EXECUTEACT INSTEAD.
    execute() {
        if(this.preExecute()) {
            return this.executeAct();
        } else {
            return this.targets.toString() + " Was unable to perform do anything!";
        }
    }

    //performs the action, and returns a string describing the action's results.
    executeAct() {
        return "This action does nothing. Nothing has changed.";
    }

    //helper function that occurs BEFORE execution. Please use this.
    preExecute() {
        this.undo();
        if (!this.constructor.verify(this.instigators)) return false;
        return true;
    }

    //checks to see if the action can be done with the given parts. optional parameter ignores availability.
    static verify(parts, availables = false) {
        //same format as the requirements array - we're going to compare them.
        var capabilities = [0, 0, 0, 0];

        for (var i = 0; i < parts.length; i++) { //loop through all parts in the list
            //determine if it's functional
            if (parts[i].canAct(this.ignoreAlive) || (availables && parts[i].aliveCheck())) {
                //check to see if we have enough of this type
                var t = parts[i].type;
                if (capabilities[t] < this.req_inst[t]) { //add it to the right slot if we need more, add it to the any slot if we don't.
                    capabilities[t]++;
                } else {
                    capabilities[3]++;
                }
            }
        }
        for (var i = 0; i < this.req_inst.length; i++) {
            if (capabilities[i] < this.req_inst[i]) {
                return false;
            }
        }
        return true;
    }

    //verify, but instead of true/false, it returns the requirements that are still not met.
    static getUnmet(parts) {
        //same format as the requirements array - we're going to compare them.
        var capabilities = [0, 0, 0, 0];

        for (var i = 0; i < parts.length; i++) { //loop through all parts in the list
            //determine if it's functional
            if (parts[i].canAct(this.ignoreAlive)) {
                //check to see if we have enough of this type
                var t = parts[i].type;
                if (capabilities[t] + 1 < this.req_inst[t]) { //add it to the right slot if we need more, add it to the any slot if we don't.
                    capabilities[t]++;
                } else {
                    capabilities[3]++;
                }
            }
        }
        var ret = [];
        for (var i = 0; i < this.req_inst.length; i++) {
            if (capabilities[i] < this.req_inst[i]) {
                ret.push(this.req_inst[i] - capabilities[i]);
            } else {
                ret.push(0);
            }
        }
        return ret;
    }

    static verifyTarget(parts) {//todo
        if(parts.length >= this.req_targ[1]) {
            return true;
        }
        return false;
    }

    prepare() {//marks instigators as "prepared" so they seem occupied
        for (var i = 0; i < this.instigators.length; i++) {
            this.instigators[i].available = false;
        }
    }

    undo() {
        for (var i = 0; i < this.instigators.length; i++) {
            this.instigators[i].available = true;
        }
    }

    static getDiv() {
        return this.uiComponent.getDiv();
    }

    getDiv() {
        return this.uiComponent.getDiv();
    }
}

class UIComponent_Action extends UIComponent {
    constructor(info, instigators, targets) {
        //todo maybe make these into helper functions.
        var str = document.createElement("div");
        for(var i = 0; i < instigators.length; i++) {
            var icon = UIComponent.buildSVG(instigators[i].uiComponent.src);
            var classAtt = document.createAttribute("class");
            classAtt.value = "menuItemIconS";
            icon.setAttributeNode(classAtt);
            str.append(icon);
        }
        var icon = UIComponent.buildSVG("plain-arrow.svg");
        var classAtt = document.createAttribute("class");
        classAtt.value = "menuItemIconS";
        icon.setAttributeNode(classAtt);
        str.append(icon);
        for(var i = 0; i < targets.length; i++) {
            var icon = UIComponent.buildSVG(targets[i].uiComponent.src);
            var classAtt = document.createAttribute("class");
            classAtt.value = "menuItemIconS";
            icon.setAttributeNode(classAtt);
            str.append(icon);
        }

        super(info.name, str.outerHTML, info.src);
    }
}




//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//WRITE THE ACTIONS HERE
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export class Flail extends Action {

    static info = {
        name: "Flail",
        flavor: "A weak attack that can be done with any part.",
        src: "slap.svg"
    };
    static uiComponent = new UIComponent(this.info.name, this.info.flavor, this.info.src);

    static req_inst = [0, 0, 0, 1];
    static req_targ = [[false,true], 1];

    static damage = [10,10];

    executeAct() {
        const me=this;
        var ret = this.instigators.toString() + " attempts to use " + this.constructor.info.name + " on " + this.targets.toString() + ".";
        for (var i = 0; i < this.targets.length; i++) {
            var result = this.targets[i].getHit(new Damage(this.constructor.damage[0],this.constructor.damage[1], me));
            if(result.updateText != "") ret += "<br>" + this.targets[i].name + ": " + result.updateText;
        }
        return ret;
    }
}

export class Cannon extends Flail {
    static info = {
        name: "Cannon",
        flavor: "Launch a projectile. Does extra Machine damage.",
        src: "cannon-ball.svg"
    }
    static uiComponent = new UIComponent(this.info.name, this.info.flavor, this.info.src);

    
    static req_inst = [0,1,0,0];
    static damage = [20,15];
}

export class Laser extends Cannon {
    static info = {
        name: "Laser",
        flavor: "Fire a laser beam. Does extra Pilot damage.",
        src: "ray-gun.svg"
    }
    static uiComponent = new UIComponent(this.info.name, this.info.flavor, this.info.src);

    
    static req_inst = [0,1,0,0];
    static damage = [15,25];
}

export class Shotgun extends Flail {
    static info = {
        name: "Shotgun",
        flavor: "Lightly damages your opponent's entire robot. Does extra Machine damage.",
        src: "shotgun-rounds.svg"
    }
    static uiComponent = new UIComponent(this.info.name, this.info.flavor, this.info.src);

    static req_inst = [0,2,0,0];
    static req_targ = [[false,true],-1];
    static damage = [8,5];
}

export class Radiation extends Shotgun {
    static info = {
        name: "Radiation",
        flavor: "Lightly microwaves your opponent's entire robot. Does extra Pilot damage.",
        src: "radiations.svg"
    }
    static uiComponent = new UIComponent(this.info.name, this.info.flavor, this.info.src);

    static damage = [5, 8];
}

export class XRay extends Action {
    static info = {
        name: "X-Ray",
        flavor: "Briefly glimpse the state of your target's Pilots.",
        src: "skeleton-inside.svg",
    }
    static uiComponent = new UIComponent(this.info.name, this.info.flavor, this.info.src);

    static req_inst = [1,0,0,0];
    static req_targ = [[false,true],-1];

    executeAct() {
        const me=this;
        var ret = this.instigators.toString() + " attempts to use " + this.constructor.info.name + " on " + this.targets.toString() + ".";
        for (var i = 0; i < this.targets.length; i++) {
            var result = this.targets[i].gainEffect(new Eff.Scanned());
            if(result.updateText != "") ret += "<br>" + this.targets[i].name + ": " + result.updateText;
        }
        return ret;
    }
}

export class HullShielding extends Action {
    static info = {
        name: "Hull Shielding",
        flavor: "Apply Armor to a part for one round, making it immune to Machine damage.",
        src: "shieldcomb.svg",
    }
    static uiComponent = new UIComponent(this.info.name, this.info.flavor, this.info.src);

    static req_inst = [0,0,1,0];
    static req_targ = [[true,false],1];

    executeAct() {
        const me=this;
        var ret = this.instigators.toString() + " attempts to use " + this.constructor.info.name + " on " + this.targets.toString() + ".";
        for (var i = 0; i < this.targets.length; i++) {
            var result = this.targets[i].gainEffect(new Eff.PartShield());
            if(result.updateText != "") ret += "<br>" + this.targets[i].name + ": " + result.updateText;
        }
        return ret;
    }
}

export class CockpitShielding extends HullShielding {
    static info = {
        name: "Cockpit Shielding",
        flavor: "Apply Protection to a part for one round, making it immune to Pilot damage.",
        src: "bell-shield.svg",
    }
    static uiComponent = new UIComponent(this.info.name, this.info.flavor, this.info.src);

    executeAct() {
        const me=this;
        var ret = this.instigators.toString() + " attempts to use " + this.constructor.info.name + " on " + this.targets.toString() + ".";
        for (var i = 0; i < this.targets.length; i++) {
            var result = this.targets[i].gainEffect(new Eff.PilotShield());
            if(result.updateText != "") ret += "<br>" + this.targets[i].name + ": " + result.updateText;
        }
        return ret;
    }
}

export class Swap extends Action {
    static info = {
        name: "Swap",
        flavor: "Move your pilots around, even if they are unconscious.",
        src: "back-forth.svg"
    }
    static uiComponent = new UIComponent(this.info.name, this.info.flavor, this.info.src);

    static req_inst = [0,0,0,2];
    static req_targ = [[false,false],0];
    static ignoreAlive = true;

    executeAct() {
        const me=this;
        var ret = this.instigators.toString() + " attempts to use " + this.constructor.info.name + ".";
        const temp = this.instigators[0].pilot;
        this.instigators[0].pilot = this.instigators[1].pilot;
        this.instigators[1].pilot = temp;
        return ret;
    }
}

export class HeatSeekingShot extends Action {
    static info = {
        name: "Heat Seeking Shot",
        flavor: "This attack hones in on a random pilot in your opponent's mech.",
        src: "target-laser.svg"
    };
    static uiComponent = new UIComponent(this.info.name, this.info.flavor, this.info.src);

    static req_inst = [1, 1, 0, 0];
    static req_targ = [[false,true], -1];

    static damage = [20,20];

    executeAct() {
        const me=this;
        var ret = this.instigators.toString() + " attempts to use " + this.constructor.info.name + " on " + this.targets.toString() + ".";
        var viableTargets = [];
        for(var i = 0; i < this.targets.length; i++) {
            if(this.targets[i].pilot.aliveCheck()) {
                viableTargets.push(this.targets[i]);
            }
        }
        if(viableTargets.length == 0) {
            return ret + "<br>...but it missed!";
        }

        var index = Random.randBetween(0,viableTargets.length);
        var result = viableTargets[index].getHit(new Damage(this.constructor.damage[0],this.constructor.damage[1], me));
        if(result.updateText != "") ret += "<br>" + viableTargets[index].name + ": " + result.updateText;
        return ret;
    }
}