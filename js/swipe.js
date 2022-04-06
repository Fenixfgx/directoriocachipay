withSlopeFinite = function(object) {
    /* Define the coordinates to events touchstart and touchend */
    var startObjX, startObjY, endObjX, endGalleryY, slopeObj, touchMoveObj, firstLocalSlopeObj, startObj, endObj;
    var n = 0;
    var myArray = new Array();

    /* In container event */
    object.addEventListener('touchstart', function(event)
    {
        touchMoveObj = false;
        //var e = event.originalEvent;
        var e = event;
        //e.preventDefault();
        var touch = e.touches[0];
        startObj = touch.screenX; // Obtain the Y startObj coordinate in the event touchstart.
        startObjX = touch.screenX; // Obtain the X startObj coordinate in the event touchstart.
        startObjY = touch.screenY; // Obtain the Y startObj coordinate in the event touchstart.
    });

    object.addEventListener("touchmove", function(event)
    {
        touchMoveObj = true;
        //var e = event.originalEvent;
        var e = event;
        var localEndMoveX, localEndMoveY, localSlope;
        var touch = e.changedTouches[0];
        localEndMoveX = touch.screenX; //Obtain the X end coordinate in the event touchend.
        localEndMoveY = touch.screenY; //Obtain the Y end coordinate in the event touchend.
        localSlope = (startObjY - localEndMoveY) / (startObjX - localEndMoveX);
        myArray[n] = localSlope;
        n++;
        /* Calculate the gradient in touchmove to identify the lock and the no lock the screen */
        if (localSlope >= -1 && localSlope <= 1)
        {
            e.preventDefault();
        }
        else if (localSlope < -1 || slopeObj > 1)
        {
            //console.log('user move Vertical')
        }
    }, false);

    /* In container event */
    object.addEventListener('touchend', function(event)
    {
        //var e = event.originalEvent;
        var e = event;
        //e.preventDefault();
        var touch = e.changedTouches[0];
        endObj = touch.screenX; //Obtain the Y endObj coordinate in the event touchend.
        var direction = (endObj - startObj);
        endObjX = touch.screenX; //Obtain the X endObj coordinate in the event touchend.
        endGalleryY = touch.screenY; //Obtain the Y endObj coordinate in the event touchend.

        if (touchMoveObj)
        {
            if (startObjX == endObjX)
            {
                //console.log('Es totaly vertical');
            }
            else if (startObjY == endGalleryY)
            {
                /* Is totaly horizontal, check the direction and implement the actions */
                /* The direction is right to left */
                if (direction > 0)
                {
                    //console.log("Direction Left to Right");
                    document.getElementById("arrowPrevious").click();
                }

                /* The direction is left to right */
                else
                {
                    //console.log("Direction Right to Left");
                    document.getElementById("arrowNext").click();
                }
            }
            else
            {
                /* In this part, can calculate the slopeObj */
                /* Calculate the slopeObj */
                slopeObj = (startObjY - endGalleryY) / (startObjX - endObjX);
                n = 0;
                firstLocalSlopeObj = myArray[0];

                if (firstLocalSlopeObj >= -1 && firstLocalSlopeObj <= 1)
                {
                    /* The direction is right to left */
                    if (direction > 0)
                    {
                        //console.log("Direction Left to Right");
                        document.getElementById("arrowPrevious").click();
                    }

                    /* The direction is left to right */
                    else
                    {
                        //console.log("Direction Right to Left");
                        document.getElementById("arrowNext").click();
                    }
                }
                else if (slopeObj < -1 || slopeObj > 1)
                {
                    //console.log('More Vertical than Horizontal');
                }
            }
        }
    }, false);
};