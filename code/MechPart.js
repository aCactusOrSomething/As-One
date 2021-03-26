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
import * as Act from "./Action.js";

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


//BIG LIST OF ALL PARTS
export class HeadBasic extends MechPart {
    static info = {
        name: "Basic Head",
        flavor: "The default head.",
        src: "mecha-mask.svg",
        type: 0
    };

    static moveset = [
        Act.XRay,
        Act.HeatSeekingShot
        //TODO: Aim
    ];

    constructor(pilot) {
        super(HeadBasic.info.name, HeadBasic.info.type, 100, pilot, HeadBasic.moveset);
    }
}

export class ArmBasic extends MechPart {
    static info = {
        name: "Basic Arm",
        flavor: "The default arm.",
        src: "robot-grab.svg",
        type: 1
    };

    static moveset = [
        Act.Cannon,
        Act.Laser,
        Act.Shotgun,
        Act.Radiation
    ];

    constructor(pilot) {
        super(ArmBasic.info.name, ArmBasic.info.type, 100, pilot, ArmBasic.moveset);
    }
}

export class LegBasic extends MechPart {
    static info = {
        name: "Basic Leg",
        flavor: "The default leg.",
        src: "metal-boot.svg",
        type: 2
    };

    static moveset = [
        Act.HullShielding,
        Act.CockpitShielding
        //TODO: Mirror Defense, Predictive Defense
    ];

    constructor(pilot) {
        super(LegBasic.info.name, LegBasic.info.type, 100, pilot, LegBasic.moveset);
    }
}



export class HeadMelee extends MechPart {
    static info = {
        name: "Melee Head",
        flavor: "The Melee head.",
        src: "metal-golem-head.svg",
        type: 0
    };

    static moveset = [
        //TODO
    ];

    constructor(pilot) {
        super(HeadMelee.info.name, HeadMelee.info.type, 100, pilot, HeadMelee.moveset);
    }
}

export class ArmMelee extends MechPart {
    static info = {
        name: "Melee Arm",
        flavor: "The Melee arm.",
        src: "mailed-fist.svg",
        type: 1
    };

    static moveset = [
        //TODO
    ];

    constructor(pilot) {
        super(ArmMelee.info.name, ArmMelee.info.type, 100, pilot, ArmMelee.moveset);
    }
}

export class LegMelee extends MechPart {
    static info = {
        name: "Melee Leg",
        flavor: "The Melee leg.",
        src: "robot-leg.svg",
        type: 2
    };

    static moveset = [
        //TODO
    ];

    constructor(pilot) {
        super(LegMelee.info.name, LegMelee.info.type, 100, pilot, LegMelee.moveset);
    }
}



export class HeadScavenger extends MechPart {
    static info = {
        name: "Scavenger Head",
        flavor: "The Scavenger head.",
        src: "robot-antennas.svg",
        type: 0
    };

    static moveset = [
        //TODO
    ];

    constructor(pilot) {
        super(HeadScavenger.info.name, HeadScavenger.info.type, 100, pilot, HeadScavenger.moveset);
    }
}

export class ArmScavenger extends MechPart {
    static info = {
        name: "Scavenger Arm",
        flavor: "The Scavenger arm.",
        src: "pizza-cutter.svg",
        type: 1
    };

    static moveset = [
        //TODO
    ];

    constructor(pilot) {
        super(ArmScavenger.info.name, ArmScavenger.info.type, 100, pilot, ArmScavenger.moveset);
    }
}

export class LegScavenger extends MechPart {
    static info = {
        name: "Scavenger Leg",
        flavor: "The Scavenger leg.",
        src: "walking-scout.svg",
        type: 2
    };

    static moveset = [
        //TODO
    ];

    constructor(pilot) {
        super(LegScavenger.info.name, LegScavenger.info.type, 100, pilot, LegScavenger.moveset);
    }
}



export class HeadFlame extends MechPart {
    static info = {
        name: "Flame Head",
        flavor: "The Flame head.",
        src: "robot-helmet.svg",
        type: 0
    };

    static moveset = [
        //TODO
    ];

    constructor(pilot) {
        super(HeadFlame.info.name, HeadFlame.info.type, 100, pilot, HeadFlame.moveset);
    }
}

export class ArmFlame extends MechPart {
    static info = {
        name: "Flame Arm",
        flavor: "The Flame arm.",
        src: "flaming-claw.svg",
        type: 1
    };

    static moveset = [
        //TODO
    ];

    constructor(pilot) {
        super(ArmFlame.info.name, ArmFlame.info.type, 100, pilot, ArmFlame.moveset);
    }
}

export class LegFlame extends MechPart {
    static info = {
        name: "Flame Leg",
        flavor: "The Flame leg.",
        src: "rocket-thruster.svg",
        type: 2
    };

    static moveset = [
        //TODO
    ];

    constructor(pilot) {
        super(LegFlame.info.name, LegFlame.info.type, 100, pilot, LegFlame.moveset);
    }
}



export class HeadRune extends MechPart {
    static info = {
        name: "Rune Head",
        flavor: "The Rune head.",
        src: "android-mask.svg",
        type: 0
    };

    static moveset = [
        //TODO
    ];

    constructor(pilot) {
        super(HeadRune.info.name, HeadRune.info.type, 100, pilot, HeadRune.moveset);
    }
}

export class ArmRune extends MechPart {
    static info = {
        name: "Rune Arm",
        flavor: "The Rune arm.",
        src: "rune-sword.svg",
        type: 1
    };

    static moveset = [
        //TODO
    ];

    constructor(pilot) {
        super(ArmRune.info.name, ArmRune.info.type, 100, pilot, ArmRune.moveset);
    }
}

export class LegRune extends MechPart {
    static info = {
        name: "Rune Leg",
        flavor: "The Rune leg.",
        src: "leg-armor.svg",
        type: 2
    };

    static moveset = [
        //TODO
    ];

    constructor(pilot) {
        super(LegRune.info.name, LegRune.info.type, 100, pilot, LegRune.moveset);
    }
}



export class HeadSniper extends MechPart {
    static info = {
        name: "Sniper Head",
        flavor: "The Sniper head.",
        src: "cyborg-face.svg",
        type: 0
    };

    static moveset = [
        //TODO
    ];

    constructor(pilot) {
        super(HeadSniper.info.name, HeadSniper.info.type, 100, pilot, HeadSniper.moveset);
    }
}

export class ArmSniper extends MechPart {
    static info = {
        name: "Sniper Arm",
        flavor: "The Sniper arm.",
        src: "tesla-turret.svg",
        type: 1
    };

    static moveset = [
        //TODO
    ];

    constructor(pilot) {
        super(ArmSniper.info.name, ArmSniper.info.type, 100, pilot, ArmSniper.moveset);
    }
}

export class LegSniper extends MechPart {
    static info = {
        name: "Sniper Leg",
        flavor: "The sniper leg.",
        src: "tank-tread.svg",
        type: 2
    };

    static moveset = [
        //TODO
    ];

    constructor(pilot) {
        super(LegSniper.info.name, LegSniper.info.type, 100, pilot, LegSniper.moveset);
    }
}