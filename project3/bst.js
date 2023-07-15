class BST{
    /**
     * The node within our BST
     */
    static BSTNode = class {
        constructor(data){
            this.data = data;
            this.left = null;
            this.right = null;
        }
    }

    /**
     * Creates a BST with a comparing function
     * @param {function} comparator algorithm used to order two elements in the tree 
     */
    constructor(comparator){
        this.root = null;
        this.comparator = comparator;
    }

    /**
     * Places data into the BST in the correct location
     * @param {*} value the data to insert into the tree 
     * @returns true if insertion works, false otherwise
     */
    insert(value){
        let node = new BST.BSTNode(value);

        // If the tree is empty
        let curr = this.root;
        if( curr === null ){
            this.root = node;
        }
        else {
            while( curr !== null ) {
                // Find the correct location 
                if(this.comparator(node.data, curr.data) <= 0 ){
                    if( curr.left === null ){
                        curr.left = node;
                        return true;
                    }
                    curr = curr.left;
                }
                else {
                    if( curr.right === null ){
                        curr.right = node;
                        return true;
                    }
                    curr = curr.right;
                }
            }
        }
        return false;
    }


    remove( value ){
        let tree = this;

        function removeNode(node, parent){
            if( node.left == null || node.right == null ){
                let newChild = node.left;
                if( newChild === null ){
                    newChild = node.right;
                }
                
                if( parent === null ){
                    tree.root = newChild;
                }
                else {
                    if( node == parent.left ){
                        parent.left = newChild;
                    }
                    else {
                        parent.right = newChild;
                    }
                }

                node.left = node.right = null;
                return node.data;
            }
            else {
                // Two Children -- Find Left Most Right
                let lmrParent = node;
                let lmr = node.left;
                while( lmr.right != null ){
                    lmrParent = lmr;
                    lmr = lmr.right;
                }

                let rtn = node.data;
                node.data = lmr.data;
                removeNode(lmr, lmrParent);
                return rtn;
            }
        }

        let parent = null;
        let curr = this.root;

        // Find the node to remove and the parent
        while( curr !== null ){
            let cmp = this.comparator(value, curr.data);
            if(  cmp < 0 ){
                parent = curr;
                curr = curr.left;
            }
            else if ( cmp > 0 ){
                parent = curr;
                curr = curr.right;
            }
            else {
                return removeNode(curr, parent);
            }
        }

        // Node not found
        return null;
    }

    /**
     * Traverse the tree in an inOrder fashion
     * @returns an array with the node data
     */
    inOrder(){

        /**
         * Recursive helper to move through the tree
         * @param {BSTNode} curr the node being acted upon
         * @param {array} list the current data of the tree 
         * @returns the data of the sub-tree in inOrder 
         */
        function inOrderHelper(curr, list){
            if( curr === null ){
                return list;
            }
            inOrderHelper(curr.left, list);
            list.push(curr.data);
            inOrderHelper(curr.right, list);
            return list;
        }
        return inOrderHelper(this.root, [] );
    }
}
