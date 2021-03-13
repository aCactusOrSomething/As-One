import * as Act from "./Action.js";
import Entity from "./Entity.js";
import MechPart from "./MechPart.js";
import Pilot from "./Pilot.js";
import * as Eff from "./Effect.js";
import Random from "./Random.js";

export default class Mech extends Entity {
    constructor(name, mechParts) {
        super(name);
        this.parts = mechParts;
        //this.gainEffect(new Eff.Scanned(true, -12));
    }

    //so long as 1 pilot and 1 part are alive, the mech is alive.
    aliveCheck() {
        var partAlive = false;
        var pilotAlive = false;
        for(var i = 0; i < this.parts.length; i++) {
            if(this.parts[i].aliveCheck()) {
                partAlive = true;
            }
            if(this.parts[i].pilot !== null &&  this.parts[i].pilot.aliveCheck()) {
                pilotAlive = true;
            }
        }
        if(partAlive && pilotAlive) {
            return true;
        }
        return false;
    }

    //Returns an array representing what types of parts this mech has
    getLimbBudget() {
        var budget = [0,0,0,0]
        for(var i = 0; i < this.parts.length; i++) {
            var curr = this.parts[i];
            if(curr.canAct()) {
                budget[3]++;
                budget[curr.type]++;
            }
        }
        return budget;
    }

    //returns a list of all actions this mech can do.
    getActions() {
        var list = [Act.Flail, Act.Swap];
        function addUnique(array, next) {
            for(var i = 0; i < array.length; i++) {
                if(next.info.name == array[i].info.name)
                    return array;
            }
            array.push(next);
            return array;
        }

        for(var i = 0; i < this.parts.length; i++) {
            var current = this.parts[i].actionList;
            for(var j = 0; j < current.length; j++) {
                list = addUnique(list, current[j]);
            }
        }
        return list;
    }

    //getActions but only what's available with the current limb budget.
    getAffordableActions() {
        var list = [];
        var old = this.getActions();
        for(var i = 0; i < old.length; i++) {
            if(old[i].verify(this.parts)) {
                list.push(old[i]);
            }
        }
        return list;
    }


    //returns a simple, boring mech for debug purposes.
    static getSampleMech() {        
        var head = new MechPart("Head", 0, 100, new Pilot("Alph", 100), [Act.XRay]);
        var lArm = new MechPart("Left Arm", 1, 100, new Pilot("Brittany", 100), [Act.Cannon,Act.Laser,Act.Shotgun,Act.Radiation]);
        var rArm = new MechPart("Right Arm", 1, 100, new Pilot("Charlie", 100), [Act.Cannon,Act.Laser,Act.Shotgun,Act.Radiation]);
        var lLeg = new MechPart("Left Leg", 2, 100, new Pilot("Olimar", 100), [Act.HullShielding,Act.CockpitShielding]);
        var rLeg = new MechPart("Right Leg", 2, 100, new Pilot("Louie", 100), [Act.HullShielding,Act.CockpitShielding]);

        var assembledParts = [head, lArm, rArm, lLeg, rLeg];

        return new Mech("DRAKE", assembledParts);
    }

    makeAvailable() {
        for(var i = 0; i < this.mechParts.length; i++) {
            this.mechParts[i].available = true;
        }
    }

    //returns the divs of each part of this robot. setting isPlayer to false will hide the pilot unless an effect says otherwise. 
    getDivs(isPlayer = true) {
        var isVisible = Eff.Effect.applyEffects(this.effects, "isVisible", isPlayer);

        var ret = [];
        for (var i = 0; i < 5; i++) {
            ret.push(this.parts[i].getDiv(isVisible));
        }
        return ret;
    }

    progressEffects(duration = 1) {
        super.progressEffects(duration);
        for(var i = 0; i < this.parts.length; i++) {
            var part = this.parts[i];
            part.progressEffects(duration);
        }
    }

    //returns a list of actions that an AI wants to do.
    //currently HELLA basic and random. the AI is just random numbers.
    //i should probably split this up into chunks.
    actionListAI(targetMech) {
        var ret = [];
        var temp = this.getAffordableActions();
        console.log(temp);
        while(temp.length > 0) {
            //pick a random action to do
            var index = Random.randBetween(0, temp.length);
            var action = temp[index];
            //console.log(action);
            
            //choose who will do this action
            var shuffledParts = Random.shuffle(this.parts);
            console.log(shuffledParts);
            console.log(this.parts);
            var instigators = [];
            for(var i = 0; i < shuffledParts.length; i++) {
                var me = shuffledParts[i];
                var neededType = action.getUnmet(instigators)[me.type];
                var neededAny = action.getUnmet(instigators)[3];
                if(me.canAct() && (neededType > 0 || neededAny > 0)) {
                    instigators.push(me);
                }
            }

            //choose who to target
            var viableTargets = [];
            if(action.req_targ[0][0]) { //can target yourself
                for(var i = 0; i < this.parts.length; i++) {
                    viableTargets.push(this.parts[i]);
                }
            }
            if(action.req_targ[0][1]) { //can target opponent
                for(var i = 0; i < targetMech.parts.length; i++) {
                    viableTargets.push(targetMech.parts[i]);
                }
            }
            var viableTargets = Random.shuffle(viableTargets);
            var targets = [];
            if(action.req_targ[1] < 0) {
                targets = viableTargets;
            } else {
                for(var i = 0; i < action.req_targ[1]; i++) {
                    targets.push(viableTargets[i]);
                }
            }
            /*
            console.log("action:");
            console.log(action);
            console.log("instigators:");
            console.log(instigators);
            console.log("targets:");
            console.log(targets);*/
            var myAction = new action(instigators, targets);
            myAction.prepare();
            ret.push(myAction);
            
            //gotta reset temp.
            temp = this.getAffordableActions();
            console.log(temp);

        }
        return ret;
    }
}