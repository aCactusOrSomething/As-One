
import { EntityHP } from "./Entity.js";
import UIComponent from "./UIComponent.js";
import  * as Eff from "./Effect.js";

//A Pilot represents a character operating a portion of the robot.
export default class Pilot extends EntityHP{
    constructor(name, health) {
        super(name, health);

        this.uiComponent = new UIComponent_Pilot(this);
    }

    canAct(ignoreAlive = false) {
        if(this.aliveCheck()) {
            return true;
        }
        return ignoreAlive;
    }


    getDiv() {
        return this.uiComponent.getDivHP(this.health.now, this.health.max);
    }
}

class UIComponent_Pilot extends UIComponent {
    constructor(pilot) {
        super(pilot.name, "", "person.svg");
    }

}