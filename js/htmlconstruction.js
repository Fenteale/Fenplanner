const path = require('path');
var fs = require('fs');
var dbfunc = require('./database');

const htmlRoot = path.join(__dirname, '..', 'res', 'html');
const header = fs.readFileSync(path.join(htmlRoot, 'header.html'));
const footer = fs.readFileSync(path.join(htmlRoot, 'footer.html'));
const mid    = fs.readFileSync(path.join(htmlRoot, 'mid.html'));

var nowdate = new Date();
const tzOffset = nowdate.getTimezoneOffset()*60 * 1000;
nowdate.setTime(nowdate.getTime() - tzOffset);

async function constructHomePage()
{
    delete nowdate;
    nowdate = new Date();
    //nowdate.setTime(nowdate.getTime() - tzOffset);
    var resData = header;
    var ent = await dbfunc.getEntries();
    ent.forEach(function(item, index, array) {
        if (item.hour > 0)
            resData += constructEntry(item);
    });
    resData += `<p><small><small>Time is now: ${nowdate}</small></small></p>`
    resData += mid;
    ent.forEach(function(item, index, array) {
        if (item.hour < 0)
            resData += constructPerpEntry(item);
    });
    resData += `<p><small><small>Time is now: ${nowdate}</small></small></p>`
    resData += footer;
    return resData;
}

function constructEntry(row) {
    var rowDate = new Date(row.year, row.month - 1, row.day, row.hour, row.minute, 0, 0);
    var color = [255, 255, 255];
    var extraStyle = "";
    var day_difference = (rowDate.getTime() - nowdate.getTime() ) / (1000 * 60 * 60 * 24);

    if (day_difference > 0) {
        if (day_difference <= 30) {
            color = [252, 156, 53];
            if (day_difference <= 7) {
                const redoffset = (255 * day_difference / 7);
                if (day_difference <= 1)
                    extraStyle = "border:10px solid yellow;";
                color = [255 , redoffset, redoffset];
            }
        }
    } else { //even has passed
        //day_difference = Math.abs(day_difference);
        if (Math.abs(day_difference) <= 10) {
            extraStyle = "border:10px solid yellow;";
            color = [89, 68, 48];
        } else {
            color = [102, 102, 102];
        }
    }
    
    var entryStr = `
    <div class="card" style="background-color: rgb(${color[0].toString()}, ${color[1].toString()}, ${color[2].toString()}); ${extraStyle}">
        <h2>${row.title}</h2>
        <p>${row.description}</p>
        <div class="endcard"><div style="float: left; width: 80%;"><small><small>${rowDate}. Days left: ${Math.floor(day_difference)}</small></small></div>
        <div align="right" style="float: right; width: 20%;"><button onclick="makePerp(${row.id})">Make Perpetual</button> <button onclick="deletePost(${row.id})">X</button></div></div>
    </div>`;
    return entryStr;
}

function constructPerpEntry(row) {
    var entryStr = `
    <div class="card" style="background-color: aquamarine;">
        <h2>${row.title}</h2>
        <p>${row.description}</p>
        <div class="endcard"><div style="float: left; width: 80%;"><small><small>Perpetual</small></small></div>
        <div align="right" style="float: right; width: 20%;"><button onclick="deletePost(${row.id})">X</button></div></div>
    </div>`;
    return entryStr;
}

module.exports = {constructHomePage};