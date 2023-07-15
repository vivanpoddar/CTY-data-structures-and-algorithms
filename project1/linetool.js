//creates a class LineTool that extends the Tool class and thus inherits the properties and methods of the Tool class
class LineTool extends Tool{
    //how big you want the points to be (radius)
    static POINT_RADIUS = 10;
    //how far apart you want the points to be
    static SELECTION_PADDING = 20

    // constructor defines the properties of a LineTool objects
    constructor() {
        
        // super is a placeholder for tool.js
        super();
        this.points = new LinkedList();

        this.selectedPoint = null;
        this.pointMoved = false;
        this.building = true;
        this.isSelected = false;
    }

    //runs when the mouse is clicked
    handleMouseDown(event) {
        // gets the mouse position
        let mousePos = [event.clientX, event.clientY]
        
        //initializes isSelected
        this.isSelected = false;

        //get the last point, when the canvas is blank the last point does not exist
        let lastPoint = null;
        //number of points
        let p = 0
        // For each loop: when the method is evoked by a function, it goes through each point in the canvas

        var point = this.points.head;
        while(point!=null) {
            // gets the distance between the x of mouse and the x of point, and squares. other one does the same for y
            // uses Euclidean math to determine whether the user is clicking on a point
            let xSquared = (mousePos[0] - point.val[0]) * (mousePos[0] - point.val[0])
            let ySquared = (mousePos[1] - point.val[1]) * (mousePos[1] - point.val[1])

            //if the difference between the mouse position and point squared is less than the point radius, then it enters this if statement. (when you click a point)
            // this is how the algorithm knows if you are trying to click on a point
            if( xSquared + ySquared < LineTool.POINT_RADIUS*LineTool.POINT_RADIUS ) {
                //this makes the selected point the p
                this.selectedPoint = p;
                //This makes the specific point selected
                this.isSelected = true;
                break;
            }

            //if the last point exists
            if( lastPoint !== null && !this.building ){
                let midPoint = [(point.val[0]+lastPoint.val[0])/2, (point.val[1]+lastPoint.val[1])/2]
                //changes xSquared and ySquared to the distance between the mouse and the midpoint
                xSquared = (mousePos[0] - midPoint[0]) * (mousePos[0] - midPoint[0])
                ySquared = (mousePos[1] - midPoint[1]) * (mousePos[1] - midPoint[1])
                //if the distance between the mouse and the midpoint is less than the point radius, then it enters this if statement. (when you click a midpoint)
                if( xSquared + ySquared < LineTool.POINT_RADIUS*LineTool.POINT_RADIUS ) {
                    this.points.splice(p,0,midPoint)
                    this.numClicked = 0;
                    this.selectedPoint = p;
                    this.isSelected = true;
                    break;
                }
            }

            lastPoint = point;
            point = point.next;
            p += 1
        }
        // return either outcome depending on where mouse position is in relation to the buttons
        return this.isSelected || this.building;
    }
    //selected point is determined by the above test and that is used to run other functions

    handleMouseUp(event) {
        if( this.building ) {
            if(this.selectedPoint == this.points.size - 1){
                // new point is not within building so it sets this.building to false
                this.building = false;
            }
            else {
                this.points.push([event.clientX, event.clientY])
                // adds

            } 
        }
        // if there if a selected point
        else if( this.selectedPoint !== null ) {
            console.log("up")
            if( event.shiftKey ) {
                console.log("shift")
                // splice removed an element; in this case, selectedPoint
                this.points.splice( this.selectedPoint, 1)
            }
        }
        // if no selected point
        this.selectedPoint = null;
        return this.isSelected;
    }

    handleMouseMove(event){
        let currentNode = this.points.head;
        // if you are currently building and you move your mouse it skips this function
        // only cares if moving but not building; if handleMouseDown occurs
        if(this.building) {
            return false;
        }
        // if there is a point selected AND the event handleMouseMove occurs then the point moves to the coordinates clientX and clientY
        if(this.selectedPoint !== null ){
            
            this.pointMoved = true;

            for(let i=0; i<this.selectedPoint; i++) {
                currentNode = currentNode.next;
            }
            currentNode.val = [event.clientX, event.clientY]
        }

        return this.selectedPoint !== null;
    }
    // does nothing
    handleDoubleClick(event){
        return false;
    }

    //renders the canvas 
    render( canvas ) {
        //when the canvas is blank, so lastpoint starts at null
        let currentNode = this.points.head;
        let lastpoint = null;
        // initialized minMaxX and minMaxY
        let minMaxX = [Infinity, -Infinity]
        let minMaxY = [Infinity, -Infinity]

        let ctx = canvas.getContext("2d")
        //goes through each point
        
        while(currentNode != null) {
            //finds the minimum between the minimum maxiumum
            minMaxX[0] = Math.min(minMaxX[0], currentNode.val[0])
            minMaxX[1] = Math.max(minMaxX[1], currentNode.val[0])

            minMaxY[0] = Math.min(minMaxY[0], currentNode.val[1])
            minMaxY[1] = Math.max(minMaxY[1], currentNode.val[1])
            
            ctx.beginPath()
            // creates a stroke with the following attributes
            ctx.arc(currentNode.val[0], currentNode.val[1], LineTool.POINT_RADIUS, 0, 2*Math.PI);
            ctx.fill();
            if( lastpoint !== null ) {
                ctx.beginPath()
                ctx.moveTo(lastpoint[0], lastpoint[1])
                ctx.lineTo( currentNode.val[0], currentNode.val[1]);
                ctx.stroke()
                // ends the stroke
                //there should be as many lines on the program as the function beginPath gets called

                let lastfill = ctx.fillStyle;
                // creates midpoint point
                // fills the color of the point
                ctx.fillStyle = 'rgba(0, 0, 255, 0.4)';
                let midpoint = [(currentNode.val[0]+lastpoint[0])/2,(currentNode.val[1]+lastpoint[1])/2]
                // creates circle
                ctx.beginPath()
                ctx.arc(midpoint[0], midpoint[1], LineTool.POINT_RADIUS, 0, 2*Math.PI);
                ctx.fill();
                ctx.fillStyle = lastfill;
            }
            lastpoint = currentNode.val;
            currentNode = currentNode.next;
        }


        if( this.isSelected) {
            ctx.strokeRect(minMaxX[0] - LineTool.SELECTION_PADDING, 
                minMaxY[0] - LineTool.SELECTION_PADDING, 
                Math.abs(minMaxX[1]-minMaxX[0]) + 2*LineTool.SELECTION_PADDING, 
                Math.abs(minMaxY[1]-minMaxY[0]) + 2*LineTool.SELECTION_PADDING)
        }
    }
}