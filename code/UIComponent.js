export default class UIComponent {
    constructor(name, flavor, src) {
        this.name = name;
        this.src = src;
        this.flavor = flavor;
        this.div = this.update(); 
        this.oldHealthProgress = 1;      
    }
    
    //builds an SVG 
    static buildSVG(src) {
        var ret = document.createElement("img");
        
        //the SRC
        var srcAtt = document.createAttribute("src");
        srcAtt.value = "./images/" + src;
        ret.setAttributeNode(srcAtt);

        //class so i can mostly do this with css
        var classAtt = document.createAttribute("class");
        classAtt.value = "menuItemIcon";
        ret.setAttributeNode(classAtt);

        return ret;
    }

    //returns a freshly updated copy of the element's ~~DIV~~ Button
    update() {
        //var ret = document.createElement("div");
        var ret = document.createElement("button");

        var yourDiv = document.createElement("div");
        yourDiv.innerHTML = "<b>" + this.name + "</b><br>" + this.flavor;
        //yourDiv.style.float = "left";
        if(this.src != null) {
            var yourImg = UIComponent.buildSVG(this.src);
            ret.appendChild(yourImg);
        }
        ret.appendChild(yourDiv);
        
        var cssClass = document.createAttribute("class");
        cssClass.value = "menuItem";
        ret.setAttributeNode(cssClass);

        return ret;
    }

    //GET THAT DIV
    getDiv() {
        return this.div.cloneNode(true);
    }

    //returns the div but appends a funky lil HP bar to it
    getDivHP(health,max) {
        var ret = this.update();
        var hpBar = document.createElement("span");
        hpBar.classList.add("healthBar");
        hpBar.style.width = "" + 5* this.oldHealthProgress + "em";
        setTimeout(function() { //TODO jesus DICK this is bad form. you gotta redesign this at some point. 
            hpBar.style.width= "" + 5* (health / max) + "em";
            
        }, 50);
        this.oldHealthProgress =(health / max);
        ret.appendChild(hpBar);
        return ret;
    }
}