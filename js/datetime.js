function parseDateTime (dateTimeString) {
    var retvec = [0, 0, 0, 0, 0];

    var p1 = dateTimeString.split('T');
    if (p1.length <= 1) { //perpetual event
        retvec = [-1, -1, -1, -1, -1];
    } else {
        var pd = p1[0].split('-');
        retvec[0] = parseInt(pd[2]); //day
        retvec[1] = parseInt(pd[1]); //month
        retvec[2] = parseInt(pd[0]); //year

        var pt = p1[1].split(':');
        retvec[3] = parseInt(pt[0]); //hour
        retvec[4] = parseInt(pt[1]); //minutes
    }
    return retvec;
}

module.exports = {parseDateTime};