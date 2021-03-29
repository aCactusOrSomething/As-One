import Mech from "./Mech.js";
import * as Act from "./Action.js";
import UIHandlerCombat from "./UIHandlerCombat.js";
import Dashing from './dashing.js';

var combatUIHolder = document.getElementById("combatUI");
var homeUIHolder = document.getElementById("homeUI");
var beginFightButton = document.getElementById("beginFight");
var settingsButton = document.getElementById("settingsOption");
var background = document.getElementById('background');

//hide unused menus
combatUIHolder.classList.add("hidden");

//temporary main menu code
beginFightButton.addEventListener("click", function() {
    combatUIHolder.classList.remove("hidden");
    homeUIHolder.classList.add("hidden");
    var p1mech = Mech.getSampleMech();
    var p2mech = Mech.getSampleMech();
    UIHandlerCombat.setContext(p1mech,p2mech);
    UIHandlerCombat.buildUI();
});

//background
initializeBackground();
var dash = new Dashing(background, Math.PI / 2);
dash.color = "lavender";


//keeping the canvas to the window size
function initializeBackground() {
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
}
function resizeCanvas() {
    background.width = window.innerWidth;
    background.height = window.innerHeight;
}