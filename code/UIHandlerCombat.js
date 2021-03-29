import CombatHandler from "./CombatHandler.js";
import UIComponent from "./UIComponent.js";


/* oh boy its state machine time
0: nothing selected
1: action selected; choosing INSTIGATORS
2: action selected; choosing TARGETS
3: queued action selected; choosing another to swap with
4: intermediary state used when swapping
5: iterating through combat options
*/
var p1status = document.getElementById("p1status");
var actionList = document.getElementById("actionList");
var actionQueue = document.getElementById("actionQueue");
var p2status = document.getElementById("p2status");
var queueButtons = document.getElementById("queueButtons");
var combatLogs = document.getElementById("combatLogs");
var contextClue = document.getElementById("contextClue");

var UIHandlerCombat = {
    state: 0, //see comment above
    action: 0, //store the CLASS somehow i guess. unless it's state 3
    instigators: [], //update these two in states 1&2
    targets: [],
    myActQueue: [],
    p1mech: 0,
    p2mech: 0,

    setContext(p1mech, p2mech) {
        this.p1mech = p1mech;
        this.p2mech = p2mech;
    },

    buildUI() {
        this.buildP1Status(this.p1mech);
        this.buildActionList(this.p1mech);
        this.buildP2Status(this.p2mech);
        this.buildActionQueue();
        this.buildQueueButtons();
        this.buildContextClue();
    },

    buildP1Status(p1mech) {
        clearNode(p1status);
        var components = p1mech.getDivs();
        for (var i = 0; i < 5; i++) {
            switch (this.state) {//technically this can just be an if, but i might add more states later?
                case 1:
                    var type = p1mech.parts[i].type;
                    var unmet = this.action.getUnmet(this.instigators);
                    if ((unmet[type] > 0 || unmet[3] > 0) && p1mech.parts[i].canAct()) {
                        var cssClass = document.createAttribute("class");
                        cssClass.value = "menuItem row selectable";
                        components[i].setAttributeNode(cssClass);

                        const me = this;
                        const para = p1mech.parts[i];
                        components[i].addEventListener("click", function () { me.handleClick(para); });
                    }
                    break;
                case 2:
                    if(this.action.req_targ[0][0]) {
                        var cssClass = document.createAttribute("class");
                        cssClass.value = "menuItem row selectable";
                        components[i].setAttributeNode(cssClass);

                        const me = this;
                        const para = p1mech.parts[i];
                        components[i].addEventListener("click", function () { me.handleClick(para); });
                    }
                    break;
            }
            p1status.append(components[i]);
        }
    },

    buildActionList(p1mech) {
        clearNode(actionList);
        var list = p1mech.getAffordableActions();
        for (var i = 0; i < list.length; i++) {
            var component = list[i].getDiv();
            switch (this.state) {
                case 0:
                    var cssClass = document.createAttribute("class");
                    cssClass.value = "menuItem selectable";
                    component.setAttributeNode(cssClass);

                    const me = this;
                    const para = list[i];
                    component.addEventListener("click", function () { me.handleClick(para); });
                    break;
                case 5:
                    component = "";
            }
            actionList.append(component);
        }
    },

    buildActionQueue() {
        clearNode(actionQueue);
        var list = this.myActQueue;
        for(var i = 0; i < list.length; i++) {
            var component = list[i].getDiv();
            const me = this;
            const para = i;
            switch (this.state) {
                case 0:
                    var cssClass = document.createAttribute("class");
                    cssClass.value = "menuItem selectable";
                    component.setAttributeNode(cssClass);

                    component.addEventListener("click", function () { me.state = 3; me.handleClick(para); });
                    break;
                case 3:
                    var cssClass = document.createAttribute("class");
                    cssClass.value = "menuItem selectable";
                    component.setAttributeNode(cssClass);

                    component.addEventListener("click", function () { me.state = 4; me.handleClick(para); });
                    break;
            }
            actionQueue.append(component);
        }
    },

    buildP2Status(p2mech) {
        clearNode(p2status);
        var components = p2mech.getDivs(false);
        for (var i = 0; i < components.length; i++) {
            switch (this.state) {
                case 2:
                    if(this.action.req_targ[0][1]) {
                        var cssClass = document.createAttribute("class");
                        cssClass.value = "menuItem row selectable";
                        components[i].setAttributeNode(cssClass);

                        const me = this;
                        const para = p2mech.parts[i];
                        components[i].addEventListener("click", function () { me.handleClick(para); });
                    }
                    break;
            }
            p2status.append(components[i]);
        }
    },

    buildQueueButtons() {
        clearNode(queueButtons);
        var component = document.createElement("div");

        var cssClass = document.createAttribute("class");
        cssClass.value = "menuItem row";
        component.setAttributeNode(cssClass);

        var cancelButton = new UIComponent("Cancel", "").update();
        cancelButton.style.float = "left";
        cancelButton.style.width = "50%";

        var goButton = new UIComponent("Execute", "").update();
        goButton.style.float = "left";
        goButton.style.width = "50%";

        const me = this;
        var selClass = document.createAttribute("class");
        selClass.value = "menuItem selectable";
        var borClass = document.createAttribute("class");
        borClass.value = "menuItem";
        switch(this.state) {
            case 1:
            case 2:
            case 3:
                cancelButton.setAttributeNode(selClass);
                cancelButton.addEventListener("click", function() {me.cancel()});
                goButton.setAttributeNode(borClass);
                break;
            case 0:
                goButton.setAttributeNode(selClass);
                goButton.addEventListener("click", function() {
                    console.log("reinitializing");
                    CombatHandler.initialize([me.p1mech, me.p2mech], me.myActQueue, me.p2mech.actionListAI(me.p1mech)); //TODO this has a placeholder
                    me.state = 5;
                    me.myActQueue = [];
                    me.cycle();
                    me.buildUI();
                });
                cancelButton.setAttributeNode(borClass);
                break;
            case 5:
                goButton.setAttributeNode(selClass);
                goButton.addEventListener("click", function() {
                    me.cycle();
                    me.buildUI();
                });
                cancelButton.setAttributeNode(borClass);
                break;
                
        }

        component.appendChild(cancelButton);
        component.appendChild(goButton);
        queueButtons.append(component);
    },

    buildContextClue() {
        clearNode(contextClue);
        switch(this.state) {
            case 0: //
                contextClue.append("Click on an action you wish to perform.");
                break;
            case 1:
                contextClue.append("Select the parts to perform this action.");
                break;
            case 2:
                contextClue.append("Select who this action targets.");
                break;
            case 3:
                contextClue.append("Select another action to switch places with.");
                break;
            case 5:
                contextClue.append("Press Execute to continue.");
                break;
        }
    },

    handleClick(clicked) {
        switch (this.state) {
            case 0: //an action was clicked.
                this.action = clicked;
                break;
            case 1:
                this.instigators.push(clicked);
                clicked.available = false;
                break;
            case 2:
                this.targets.push(clicked);
                break;
            case 3:
                this.action = clicked;
                break;
            case 4:
                this.swap(clicked);
                break;
        }
        this.cycle();
        //BUILD IT ALL AGAIN
        this.buildUI();
    },

    cycle() {
        console.log("state:" + this.state);
        if(this.state == 3)
            return this.state = 3;
        if (this.state == 5) {
            if(CombatHandler.iterate()) {
                this.buildUI();
                return this.state = 0;
            } else {
                return this.state = 5;
            }
        }
        if (this.action == 0 || this.state == 4)
            return this.state = 0;
        if (!this.action.verify(this.instigators, true))
            return this.state = 1;
        if (this.action.req_targ[1] == -1) {//this probably should not go here but it works. 
            var targ = [];
            if (this.action.req_targ[0][0]) { //adds ever
                this.p1mech.parts.forEach(el => {
                    targ.push(el);
                });
            }
            if (this.action.req_targ[0][1]) {
                this.p2mech.parts.forEach(el => {
                    targ.push(el);
                });
            }
            this.targets = targ;
        }
        if(!this.action.verifyTarget(this.targets))
            return this.state = 2;
        //end of cycle, build action
        var newAct = new this.action(this.instigators, this.targets);
        this.myActQueue.push(newAct);
        this.clear();
    },


    cancel() {
        for (var i = 0; i < this.instigators.length; i++) {
            this.instigators[i].available = true;
        }
        this.clear();
    },

    clear() {
        this.state = 0;
        this.instigators = [];
        this.targets = [];
        this.action = 0;
        this.buildUI();
    },

    swap(newAct) {
        const holdA = this.myActQueue[this.action];
        const holdB = this.myActQueue[newAct];
        this.myActQueue[this.action] = holdB;
        this.myActQueue[newAct] = holdA;
        this.clear();
    }
}

export default UIHandlerCombat;

function clearNode(node) {
    while (node.firstChild) {
        node.firstChild.remove()
    }
}
