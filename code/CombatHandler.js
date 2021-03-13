import logText from "./TextLogs.js";


/*var CombatHandler = {
    executeActions(mechs, p1Actions, p2Actions = []) {
        for(var i = 0; i < mechs.length; i++) {
            var mech = mechs[i];
            mech.progressEffects();
        }
        var helper = function(actions, i) { if(actions.length > i) {logText(actions[i].execute());}};
        for(var i = 0; i < p1Actions.length || i < p2Actions.length; i++) {
            helper(p1Actions, i);
            helper(p2Actions, i);
        }
    }

}*/

var CombatHandler = {
    mechs: [],
    actions: [],
    prog: 0,

    initialize(mechs, p1Actions, p2Actions) {
        console.log("initialized!");
        this.mechs = mechs;
        this.actions = [];
        for(var i = 0; i < p1Actions.length || i < p2Actions.length; i++) {
            if(p1Actions.length > i) this.actions.push(p1Actions[i]); //TODO this should prioritize at random. sometimes p2 should act before p1.
            if(p2Actions.length > i) this.actions.push(p2Actions[i]);
        }
        this.prog = 0;
        
        for(var i = 0; i < this.mechs.length; i++) {
            var mech = this.mechs[i];
            mech.progressEffects();
        }
    },

    //function that walks through each action of the combat, logging it step by step. returns TRUE when it's walked through everything.
    iterate() {
        console.log(this.actions);
        if(this.prog >= this.actions.length) return true;
        console.log("not finished yet");
        logText(this.actions[this.prog].execute());
        this.prog++;
        return false;
    }
}

export default CombatHandler;