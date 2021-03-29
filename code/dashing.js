//DASHING is a simple particle animation.
export default class Dashing {
    constructor(canvas, angle = 0, pSpeed = 0.00015, aSpeed = 0.0005, mass = 100, color = "grey", trail = 200) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.angle = angle;
        this.pSpeed = pSpeed;
        this.aSpeed = aSpeed;
        this.color = color;
        this.trail = trail;

        this.spawn = this.setSpawn(this.angle);
        this.particles = this.makeParticles(mass, this.spawn.rad);

        const me = this;
        window.requestAnimationFrame(function(x) {
            step(x, me);
        });
    }

    setSpawn(angle) {
        var centerX = this.canvas.width / 2;
        var centerY = this.canvas.height / 2;
        var radius = Math.sqrt(centerY * centerY + centerX * centerX); 

        var spawnX = centerX + radius * Math.cos(angle + Math.PI);
        var spawnY = centerY + radius * Math.sin(angle + Math.PI);
        var endX = centerX + radius * Math.cos(angle);
        var endY = centerY + radius * Math.sin(angle);
        return {
            x: spawnX,
            y: spawnY,
            xEnd: endX,
            yEnd: endY,
            rad: radius
        };
    }

    makeParticles(amount, volume) {
        var ret = [];
        for(let i = 0; i < amount; i++) {
            var offset = 2 * volume * Math.random() - volume;

            var part = new DashParticle(offset, Math.random());
            ret.push(part);
        }
        return ret;
    }

    drawParticles(time) {
        this.spawn = this.setSpawn(this.angle);
        var cos = Math.cos(this.angle);
        var sin = Math.sin(this.angle);
        var cosP = Math.cos(this.angle + Math.PI * 0.5);
        var sinP = Math.sin(this.angle + Math.PI * 0.5)
        

        this.context.strokeStyle = this.color;
        for(let i = 0; i < this.particles.length; i++) {
            let part = this.particles[i];
            let progress = easeIn((time + part.tOffset) % 1);
            let progLag = easeIn(((time + part.tOffset) % 1) - this.pSpeed * this.trail);

            var xOffset = cos + part.spOffset * cosP;
            var yOffset = sin + part.spOffset * sinP;
            
            let x1 = lerp(this.spawn.x, this.spawn.xEnd, progress) + xOffset;
            let y1 = lerp(this.spawn.y, this.spawn.yEnd, progress) + yOffset;
            let x2 = lerp(this.spawn.x, this.spawn.xEnd, progLag) + xOffset;
            let y2 = lerp(this.spawn.y, this.spawn.yEnd, progLag) + yOffset;
            
            this.context.beginPath();
            this.context.lineWidth = 5;
            this.context.moveTo(x2, y2);
            this.context.lineTo(x1, y1);
            this.context.stroke();
        }

        
    }
    
    //swap between two angles
    randAngle() {
        console.log("rand angle activated");
        var end = 2 * Math.PI * Math.random();
        var start = this.angle;
        const me = this;

        window.requestAnimationFrame(function(x) {
            angleStep(x, me, start, end);
        });
    }
}

class DashParticle {
    constructor(spOffset, tOffset) {
        this.spOffset = spOffset;
        this.tOffset = tOffset;
    }
}

function timerLoop(timestamp, speed) {
    return (timestamp * speed) % 1;
}

function timer(timestamp, speed) {
    var ret = timestamp * speed;
    if(ret > 1)
        return 1;
    return ret;
}

function step(timestamp, dashing) {
    const time = timerLoop(timestamp, dashing.pSpeed);
    dashing.context.clearRect(0, 0, dashing.canvas.width, dashing.canvas.height);

    dashing.drawParticles(time);
    window.requestAnimationFrame(function(x) {
        step(x, dashing);
    });
}

var aStepStart;
function angleStep(timestamp, dashing, start, end) {
    if(aStepStart === undefined) {
        aStepStart = timestamp;
    }
    const time = timer(timestamp-aStepStart, dashing.aSpeed);

    var diff = end - start;
    if(diff > Math.PI) {
        diff -= Math.PI * 2;
    } else if(diff < -1 * Math.PI) {
        diff += Math.PI * 2;
    }

    dashing.angle = lerp(start, start + diff,easeInOut(time)) % (2 * Math.PI);

    if(time < 1) {
        console.log("start: " + start + " end: " + end + " current: " + dashing.angle);
        window.requestAnimationFrame(function(x) {
            angleStep(x, dashing, start, end);
        });
    } else {
        aStepStart = undefined;
    }
}

function lerp(start, end, time) {
    return start + (end - start) * time;
}

function easeIn(x) {
    return x * x;
}

function easeOut(x) {
    return 1 - (1-x)*(1-x);
}

function easeInOut(x) {
    return x*x*(3-2*x);
}