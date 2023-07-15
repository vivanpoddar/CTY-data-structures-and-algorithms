class Tool {
    handleMouseDown(event) {
        throw "handleMouseDown must be implemented"
    }

    handleMouseUp(event) {
        throw "handleMouseUp must be implemented"
    }

    handleMouseMove(event ){
        throw "ahndleMouseMove must be implemented"
    }

    handleDoubleClick(event ){
        throw "handleDoubleClick must be implemented"
    }

    render( canvas ){
        throw "render must be implemented"
    }

    toJSON() {
        throw "render must be implemented"
    }
}