
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var img = document.getElementById("scream");

var c2 = document.getElementById("myCanvasX2");
var ctx2 = c2.getContext("2d");

document.getElementById("scream").onload = function () {

    ctx.drawImage(img, 0, 0, 220, 277);
    //ctx2.drawImage(img, 0, 0);

};

function inverseImage() {

    var imgData = ctx.getImageData(0, 0, c.width, c.height);
    var i;
    for (i = 0; i < imgData.data.length; i += 4) {

        imgData.data[i] = 255 - imgData.data[i];
        imgData.data[i + 1] = imgData.data[i + 1];
        imgData.data[i + 2] = imgData.data[i + 2];
        imgData.data[i + 3] = 255;
    }
    console.log('inverseImage() done.');
    ctx.putImageData(imgData, 0, 0);

    return imgData;
}

function grayScaleImage() {

    var imgData = ctx.getImageData(0, 0, c.width, c.height);
    var i;
    var w = imgData.width;
    var h = imgData.height;
    console.log('image width: ' + w + ' height: ' + h);

    for (i = 0; i < imgData.data.length; i += 4) {
        //average = ( imgData.data[i+1] + imgData.data[i+1] + imgData.data[i] ) / 3;
        average = (0.2126 * imgData.data[i + 1] + 0.7152 * imgData.data[i + 1] + 0.0722 * imgData.data[i]);
        imgData.data[i] = average;
        imgData.data[i + 1] = average;
        imgData.data[i + 2] = average;
        imgData.data[i + 3] = 255;

    }
    console.log('grayScaleImage() done.');
    ctx.putImageData(imgData, 0, 0);

    return imgData;
}

function scaleImageX2() {

    var imgData = ctx.getImageData(0, 0, c.width, c.height);
    var imgDataX2 = ctx2.getImageData(0, 0, c2.width, c2.height);

    var i;
    var w = imgData.width;
    var h = imgData.height;
    console.log('image width: ' + w + ' height: ' + h);
    console.log('TARGET image width: ' + c2.width + ' height: ' + c2.height);

    for (i = 0; i < imgData.data.length; i += 4) {

        var y = parseInt(i / w / 4, 10);
        var x = (i / 4 - y * w);

        var Yidx = y * 2; // coefficient for 2x scaling 
        var Xidx = x * 2;

        idx = (Yidx * c2.width + Xidx) * 4;
        plotPixels(imgDataX2, imgData, idx, i);

        idx = ((Yidx + 1) * c2.width + Xidx) * 4;
        plotPixels(imgDataX2, imgData, idx, i);

        idx = ((Yidx + 1) * c2.width + (Xidx + 1)) * 4;
        plotPixels(imgDataX2, imgData, idx, i);

        idx = ((Yidx) * c2.width + (Xidx + 1)) * 4;
        plotPixels(imgDataX2, imgData, idx, i);


        if (y % 40 === 0 && x % 40 === 0) {
            console.log('X: ' + x + ' Y: ' + y + 'for index: ' + i);
            //console.log('reconstrucxted index: ' +  (y * w + x) * 4);
        }

    }
    console.log('zoom() done.');
    ctx2.putImageData(imgDataX2, 0, 0);

    return imgData;
}

function plotPixels(imgDataX2, imgData, idx, i) {
    imgDataX2.data[idx] = imgData.data[i];
    imgDataX2.data[(idx + 1)] = imgData.data[i + 1];
    imgDataX2.data[(idx + 2)] = imgData.data[i + 2];
    imgDataX2.data[(idx + 3)] = 255; //alpha channel
}


function flipImage() {

    var imgData = ctx.getImageData(0, 0, c.width, c.height);
    var i;
    var w = imgData.width;
    for (i = 0; i < imgData.data.length; i += 4) {

        var y = parseInt(i / w / 4, 10);
        var x = (i / 4 - y * w);

        if (x < Math.floor(c.width / 2)) {

            Xmirror = (c.width - x);
            idx = (y * c.width + (Xmirror)) * 4;  // *4 is for the loop step compensation.

            //console.log('replacing: ' + x + ', ' + y + ' with: ' + XX + ', '+ y);

            R = imgData.data[i];
            G = imgData.data[i + 1];
            B = imgData.data[i + 2];
            A = imgData.data[i + 3];

            imgData.data[i] = imgData.data[idx];
            imgData.data[i + 1] = imgData.data[idx + 1];
            imgData.data[i + 2] = imgData.data[idx + 2];
            imgData.data[i + 3] = imgData.data[idx + 3];

            imgData.data[idx] = R;
            imgData.data[idx + 1] = G;
            imgData.data[idx + 2] = B;
            imgData.data[idx + 3] = A;

        }

    }
    console.log('flipImage() done.');
    ctx.putImageData(imgData, 0, 0);
    //return imgData;
}

function resetImage() {

    ctx.drawImage(img, 0, 0, 220, 277);
}

function mozaicEffect() {

    var imgData = ctx.getImageData(0, 0, c.width, c.height);
    var w = imgData.width;
    var h = imgData.height;

    var i;

    console.log('total length: ' + imgData.data.length);
    for (i = 0; i < imgData.data.length; i += 12) {

        var y = parseInt(i / w / 4, 10);
        var x = (i / 4 - y * w);

        var Yidx = y; // coefficient for 2x scaling 
        var Xidx = x;

        idx = (Yidx * c.width + Xidx);
        plotPixels(imgData, imgData, idx, i);

        idx = ((Yidx) * c.width + (Xidx + 1));
        plotPixels(imgData, imgData, idx, i);

        idx = ((Yidx) * c.width + (Xidx + 2));
        plotPixels(imgData, imgData, idx, i);

        idx = ((Yidx + 1) * c.width + Xidx);
        plotPixels(imgData, imgData, idx, i);

        idx = ((Yidx + 1) * c.width + (Xidx + 1));
        plotPixels(imgData, imgData, idx, i);

        idx = ((Yidx + 1) * c.width + (Xidx + 2));
        plotPixels(imgData, imgData, idx, i);

        idx = ((Yidx + 2) * c.width + Xidx);
        plotPixels(imgData, imgData, idx, i);

        idx = ((Yidx + 2) * c.width + (Xidx + 1));
        plotPixels(imgData, imgData, idx, i);

        idx = ((Yidx + 2) * c.width + (Xidx + 2));
        plotPixels(imgData, imgData, idx, i);


        if (i % c.width === 0) {
            i += (2 * c.width * 4 );
            //console.log('jumped to next 3rd row at index: ' + i);
        }

    }

    ctx.putImageData(imgData, 0, 0);

    console.log('mozaicImage() done.');
}

