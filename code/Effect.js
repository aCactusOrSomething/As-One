import UIComponent from "./UIComponent.js";

/*
KNOWN EFFECT TAGS:
isVisible(bool visible)
getHit(Damage damage)
addEffect(Effect effect)
*/

export class Effect {
    static info = {
        name: "effect",
        flavor: "the base effect, which does nothing.",
        src: "uncertainty.svg"
    };
    static uiComponent = new UIComponent(this.info.name, this.info.flavor, this.info.src);

    constructor(permanent = false, duration = 1) {
        this.permanent = permanent;
        this.duration = duration;
        this.updateText = "";
    }

    //getHit(damage) { return damage;}
    
    static applyEffects(effects, func, parameter) {
        var ret = parameter;
        for(var i = 0; i < effects.length; i++) {
            if(func in effects[i]) {
                ret = effects[i][func](parameter);
            }
        }
        return ret;
    }

    //returns whether or not the effect is still allowed to live.
    hasTime() {
        if(this.duration <= 0) return this.permanent;
        return true;
    }
}

export class PartShield extends Effect {
    static info = {
        name: "Armored",
        flavor: "Prevents all machine damage.",
        src: "uncertainty.svg"
    };
    static uiComponent = new UIComponent(this.info.name, this.info.flavor, this.info.src);
    
    getHit(damage) {
        damage.partDmg = 0;
        damage.updateText += "Machine damage was blocked by a shield! ";
        return damage;
    }
}

export class PilotShield extends Effect {
    static info = {
        name: "Protected",
        flavor: "Prevents all pilot damage.",
        src: "uncertainty.svg"
    };
    static uiComponent = new UIComponent(this.info.name, this.info.flavor, this.info.src);
    
    getHit(damage) {
        damage.pilotDmg = 0;
        damage.updateText += "Pilot damage was blocked by a shield! ";
        return damage;
    }
}

export class Scanned extends Effect {
    static info = {
        name: "Scanned",
        flavor: "Your opponent will see where your pilots are.",
        src: "uncertainty.svg",
    };
    static uiComponent = new UIComponent(this.info.name, this.info.flavor, this.info.src);

    isVisible(visible) {
        return true;
    }
}