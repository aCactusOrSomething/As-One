import Mech from "./Mech.js";
import * as Act from "./Action.js";
import UIHandler from "./UIHandler.js";

var p1status = document.getElementById("p1status");
var actionList = document.getElementById("actionList");
var actionQueue = document.getElementById("actionQueue");
var p2status = document.getElementById("p2status");
var combatLogs = document.getElementById("combatLogs");

var p1mech = Mech.getSampleMech();
var p2mech = Mech.getSampleMech();

UIHandler.setContext(p1mech,p2mech);
UIHandler.buildUI();
/*
actionList.append(Act.Action.getDiv());
actionList.append(Act.Flail.getDiv());

for(var i = 0; i < 5; i++) {
    p1status.append(p1mech.parts[i].getDiv());
}
*/