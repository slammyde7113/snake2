var tempMxobj = null;
var gameId = null;
var gameObject = null;
var score = 0;
$(".play").click(() => {
    mx.data.create({
        entity: "MyFirstModule.Score",
        callback: function (obj) {
            console.log("Object created on server");
            mx.data.commit({
                mxobj: obj,
                callback: function (mxobj) {
                    gameId = obj.getGuid();
                    console.log("Object committed: " + obj);
                },
                error: function (e) {
                    console.log("Error occurred attempting to commit: " + e);
                }
            });
            tempMxobj = obj;
        },
        error: function (e) {
            reject(e);
            console.log("an error occured: " + e);
        }
    });

    var canvas = $('<canvas id="gc" width="400" height="400"></canvas>');
    $(".play-grid").append(canvas);
    var canv = document.getElementById("gc");
    var ctx = canv.getContext("2d");
    document.addEventListener("keydown", keyPush);
    var timer = setInterval(game, 1000 / 15);

    var px = 10;
    var py = 10;
    var gs = 20;
    var tc = 20;
    var ax = 15;
    var ay = 15;
    var xv = 0;
    var yv = 0;
    var trail = [];
    var tail = 5;

    function game() {
        px += xv;
        py += yv;
        if (px < 0) {
            px = tc - 1;
        }
        if (px > tc - 1) {
            px = 0;
        }
        if (py < 0) {
            py = tc - 1;
        }
        if (py > tc - 1) {
            py = 0;
        }
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canv.width, canv.height);

        ctx.fillStyle = "lime";
        for (var i = 0; i < trail.length; i++) {
            ctx.fillRect(trail[i].x * gs, trail[i].y * gs, gs - 2, gs - 2);
            if (trail[i].x == px && trail[i].y == py) {
                tail = 5;
                score = tail - 5;
            }
        }
        trail.push({
            x: px,
            y: py
        });
        while (trail.length > tail) {
            trail.shift();
        }

        if (ax == px && ay == py) {
            tail++;
            score = tail - 5;
            ax = Math.floor(Math.random() * tc);
            ay = Math.floor(Math.random() * tc);
        }
        ctx.fillStyle = "red";
        ctx.fillRect(ax * gs, ay * gs, gs - 2, gs - 2);
    }

    function keyPush(evt) {
        switch (evt.keyCode) {
            case 37:
                xv = -1;
                yv = 0;
                break;
            case 38:
                xv = 0;
                yv = -1;
                break;
            case 39:
                xv = 1;
                yv = 0;
                break;
            case 40:
                xv = 0;
                yv = 1;
                break;
        }
    }
});
$(".stop").click(() => {
    mx.data.get({
        guid: gameId,
        callback: function (obj) {
            tempMxobj = obj;
            console.log("Received MxObject with GUID " + obj.getGuid());
        }
    });
    console.log(tempMxobj);
    tempMxobj.set("Points", score);
    console.log(tempMxobj);
    mx.data.commit({
        mxobj: tempMxobj,
        callback: function (mxobj) {
            console.log("Object committed: " + mxobj);
        },
        error: function (e) {
            console.log("Error occurred attempting to commit: " + e);
        }
    });
    $("#gc").remove();
});