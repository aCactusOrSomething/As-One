//a MechPart is one portion of a robot.
//there are specific types of MechPart (such as Head, Arm, Leg), which also may have subtypes.
/*
type index:
0: head
1: arm
2: leg
*/

import { EntityHP } from "./Entity.js";
import UIComponent from "./UIComponent.js";
import  * as Eff from "./Effect.js";

export default class MechPart extends EntityHP {
    constructor(name, type, health, pilot, actionList) {
        super(name, health);
        this.type = type;
        this.pilot = pilot;
        this.actionList = actionList;
        this.uiComponent = new UIComponent_MechPart(this);
        this.available = true;

    }

    //todo improve on this for the FUTURE.
    canAct(ignoreAlive = false) {
        if (this.available && this.pilot.canAct(ignoreAlive) && (this.aliveCheck() || ignoreAlive) ) {
            return true;
        }
        return false;
    }

    getHit(damage) {
        var ret = Eff.Effect.applyEffects(this.effects, "getHit", damage);
        this.health.now -= ret.partDmg;
        if (this.pilot !== null) return this.pilot.getHit(ret);
        return ret;
    }

    getDiv(visible = true) {
        var isVisible = Eff.Effect.applyEffects(this.effects, "isVisible", visible);
        return this.uiComponent.combine(this, isVisible);
    }

    progressEffects(duration = 1) {
        super.progressEffects(duration);
        this.pilot.progressEffects(duration);
    } 

}

class UIComponent_MechPart extends UIComponent {
    //todo this won't be good for long,b ut works for now
    static srcs = [
        "mecha-mask.svg",
        "robot-grab.svg",
        "metal-boot.svg",
    ];

    constructor(part) {
        super(part.name, "", UIComponent_MechPart.srcs[part.type]);
    }

    combine(mechPart, visible = true) {
        var ret = document.createElement("div");

        var cssClass = document.createAttribute("class");
        cssClass.value = "menuItem row";
        ret.setAttributeNode(cssClass);

        var partDiv = mechPart.uiComponent.getDivHP(mechPart.health.now, mechPart.health.max);
        partDiv.style.float = "left";
        partDiv.style.width = "50%";
        ret.appendChild(partDiv);

        var pilotDiv = mechPart.pilot.getDiv();//gotta put this outside so the animations update!
        if (mechPart.pilot !== null && visible) {
            pilotDiv.style.float = "left";
            pilotDiv.style.width = "50%";
            ret.appendChild(pilotDiv);
        }


        return ret;
    }
}