class DrawingSpace{
    constructor(canvas){
        this.name = 'Untitled';
        this.canvas = canvas;
        this.shapes = [];
        this.selectedShape = null;
    }

    setName(name){
        if(!name || name === '' ){
            return false;
        }

        this.name = name;
    }

    handleMouseDown(event, selectedTool){
        let handled = false;

        if( this.selectedShape !== null ){
            handled = this.selectedShape.handleMouseDown(event);
        }

        if( !handled ) {
            for( let shape of this.shapes ){
                handled = shape.handleMouseDown(event);
                if( handled ) {
                    this.selectedShape = shape;
                    break;
                }
            }

            if( handled == false ){
                if(this.selectedShape != null ){
                    this.selectedShape = null;
                }
                else {
                    this.selectedShape = new selectedTool();
                    this.shapes.push(this.selectedShape)
                    handled = this.selectedShape.handleMouseDown(event);
                }
            }
        }

        this.render();
    }

    handleMouseMove(event, selectedTool){
        if( this.selectedShape !== null ){
            this.selectedShape.handleMouseMove(event);
            this.render();
        }
    }

    handleMouseUp(event, selectedTool) {
        if( this.selectedShape !== null ){
            this.selectedShape.handleMouseUp(event);
            this.render();
        }
    }

    handleDoubleClick(event, selectedTool){
        if( this.selectedShape !== null ){
            this.selectedShape.handleDoubleClick(event);
            this.render();
        }
    }

    render() {
        let ctx = this.canvas.getContext('2d')
        ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
        for( let shape of this.shapes ){
            shape.render(canvas);
        }
    }

    toJSON() {
        let rtn = {
            type: 'drawingspace',
            data:{
                name: this.name,
                shapes: []
            }
        }

        for( let shape of this.shapes){
            rtn.data.shapes.push(shape.toJSON())
        }
        return rtn;
    }

    static fromJSON(json, canvas){
        if( !json.type || json.type !== 'drawingspace'){
            return null;
        }

        let rtn = new DrawingSpace(canvas)
        rtn.setName( json.data.name )
        for( let shape of json.data.shapes ){
            if( shape.type == 'linetool' ){
                rtn.shapes.push(LineTool.fromJSON(shape))
            }
        }
        return rtn;
    }

}