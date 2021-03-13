import  * as Eff from "./Effect.js";
export default class Entity {
    constructor(name) {
        this.name = name;
        this.effects = [];
    }

    aliveCheck() {
        return false; //ASSUME EVERYTHING IS DEAD by default.
    }

    toString() {
        return this.name;
    }

    gainEffect(effect) {
        var ret = Eff.Effect.applyEffects(this.effects, "applyEffects", effect);
        if(ret.hasTime()) {
            this.effects.push(ret);
        }
        return ret;
    }

    progressEffects(amount = 1) {
        var newEffects = [];
        for(var i = 0; i < this.effects.length; i++) {
            var effect = this.effects[i];
            effect.duration -= amount;
            if(effect.hasTime()) {
                newEffects.push(effect);
            }
        }
        this.effects = newEffects;
    }
}

export class EntityHP extends Entity {

    constructor(name, health) {
        super(name);
        this.health = {};
        this.health.max = health;
        this.health.now = health;
    }

    aliveCheck() {
        if(this.health.now <= 0) {
            return false;
        }
        return true;
    }

    getHit(damage) {
        var ret = Eff.Effect.applyEffects(this.effects, "getHit", damage);
        this.health.now -= ret.pilotDmg;
        return ret;
    }
}
