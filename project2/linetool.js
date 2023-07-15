class LineTool extends Tool{
    /**
     * POINT_RADIUS - radius of each graphical point
     * SELECTION_PADDING - padding of the selection box around this object
     */
    static POINT_RADIUS = 10;
    static SELECTION_PADDING = 20

    constructor() {
        super();
        this.points = new LinkedList()

        /**
         * selectedPoint - current point being manipulated
         * pointMoved - indicates a point has moved
         * builing - indicates this object is currenly building a line
         * isSelected - indicates that we're currently selected
         */
        this.selectedPoint = null;
        this.pointMoved = false;
        this.building = true;
        this.isSelected = false;
    }

    handleMouseDown(event) {
        let mousePos = [event.offsetX, event.offsetY]
        
        this.isSelected = false;

        /**
         * Determine if the mouse location (offsetX,offsetY) is within 
         * one of our points.  We use point-circle collision and Euclidean distance.
         */
        let lastPoint = null;
        let p = 0
        for( let point of this.points ) {
            let xSquared = (mousePos[0] - point[0]) * (mousePos[0] - point[0])
            let ySquared = (mousePos[1] - point[1]) * (mousePos[1] - point[1])

            if( xSquared + ySquared < LineTool.POINT_RADIUS*LineTool.POINT_RADIUS ) {
                this.selectedPoint = p;
                this.isSelected = true;
                break;
            }

            /**
             * We're out of the building phase, so check to see if the user
             * clicked a midpoint circle (means we need to insert a point)
             */
            if( lastPoint !== null && !this.building ){
                let midPoint = [(point[0]+lastPoint[0])/2, (point[1]+lastPoint[1])/2]
                xSquared = (mousePos[0] - midPoint[0]) * (mousePos[0] - midPoint[0])
                ySquared = (mousePos[1] - midPoint[1]) * (mousePos[1] - midPoint[1])
    
                if( xSquared + ySquared < LineTool.POINT_RADIUS*LineTool.POINT_RADIUS ) {
                    this.points.splice(p,0,midPoint)
                    this.numClicked = 0;
                    this.selectedPoint = p;
                    this.isSelected = true;
                    break;
                }
            }

            lastPoint = point
            p += 1
        }

        return this.isSelected || this.building;
    }

    handleMouseUp(event) {

        /**
         * Since we're building a line, either add a point or, 
         * if the user click the last point, exit building mode
         */
        if( this.building ) {
            if( this.selectedPoint == this.points.length - 1){
                this.building = false;
            }
            else {
                this.points.push([event.offsetX, event.offsetY])

            } 
        }
        else if( this.selectedPoint !== null ) {
            /**
             * We're out of building more, and the user if holding SHIFT
             * so delete a point
             */
            if( event.shiftKey ){
                this.points.splice( this.selectedPoint, 1)
            }
        }
        this.selectedPoint = null;
        return this.isSelected;
    }

    handleMouseMove(event){
        if(this.building) {
            return false;
        }

        /**
         * User selected a point and we're not building, so translate
         * the point.
         */
        if(this.selectedPoint !== null ){
            this.pointMoved = true;
            this.points.set(this.selectedPoint,[event.offsetX, event.offsetY] )
        }

        return this.selectedPoint !== null;
    }

    handleDoubleClick(event){
        return false;
    }

    render( canvas ) {
        let lastpoint = null;

        /**
         * Find the Rectagle bounds of our points so we
         * can draw the selection box if necessary
         */
        let minMaxX = [Infinity, -Infinity]
        let minMaxY = [Infinity, -Infinity]

        let ctx = canvas.getContext("2d")
        for( let point of this.points ){
            minMaxX[0] = Math.min(minMaxX[0], point[0])
            minMaxX[1] = Math.max(minMaxX[1], point[0])

            minMaxY[0] = Math.min(minMaxY[0], point[1])
            minMaxY[1] = Math.max(minMaxY[1], point[1])

            // Draw the point
            ctx.beginPath()
            ctx.arc(point[0], point[1], LineTool.POINT_RADIUS, 0, 2*Math.PI);
            ctx.fill();
            
            if( lastpoint !== null ) {

                // Draw the lines between points
                ctx.beginPath()
                ctx.moveTo(lastpoint[0], lastpoint[1])
                ctx.lineTo( point[0], point[1]);
                ctx.stroke()

                // Draw the midpoint between consecutive points
                let lastfill = ctx.fillStyle;
                ctx.fillStyle = 'rgba(0, 0, 255, 0.4)';
                let midpoint = [(point[0]+lastpoint[0])/2,(point[1]+lastpoint[1])/2]
                ctx.beginPath()
                ctx.arc(midpoint[0], midpoint[1], LineTool.POINT_RADIUS, 0, 2*Math.PI);
                ctx.fill();
                ctx.fillStyle = lastfill;

            }

            lastpoint = point;
        }

        // Draw the selection box
        if( this.isSelected) {
            ctx.strokeRect(minMaxX[0] - LineTool.SELECTION_PADDING, 
                minMaxY[0] - LineTool.SELECTION_PADDING, 
                Math.abs(minMaxX[1]-minMaxX[0]) + 2*LineTool.SELECTION_PADDING, 
                Math.abs(minMaxY[1]-minMaxY[0]) + 2*LineTool.SELECTION_PADDING)
        }
    }
}