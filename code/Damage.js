export default class Damage {
    constructor(partDmg,pilotDmg,source) {
        this.partDmg = partDmg;
        this.pilotDmg = pilotDmg;
        this.sourceAtk = source;
        this.updateText = ""; //update this with information on how the damage was modified.
    }

}