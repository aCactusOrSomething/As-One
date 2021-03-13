var combatLogs = document.getElementById("combatLogs");


export default function logText(text) {
    var div = document.createElement("div");
    div.textContent = text;
    combatLogs.insertBefore(div, combatLogs.firstChild);
}