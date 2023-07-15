class BST {
    static BSTNode = class {
        constructor(data){
            this.data = data;
            this.left = null;
            this.right = null;
        }
    }

    constructor(comparator){
        this.root = null;
        this.comparator = comparator;
    }

    insert(value) {
        // if(value instanceof BST.BSTNode) {
        //     value = value.data
        // }

        let node = this.root;

        if(node == null) {
            this.root = new BST.BSTNode(value)
            return this.root;
        }

        while(true) {
            if(this.comparator(value, node.data)<=0) {
                if(node.left == null) {
                    node.left = new BST.BSTNode(value)
                    return node.left;
                }
                node = node.left
            } else {
                if(node.right == null) {
                    node.right = new BST.BSTNode(value)
                    return node.right;
                }
                node = node.right
            }
        }
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
                let rmlParent = node;
                let rml = node.left;
                while( rml.right != null ){
                    rmlParent = rml;
                    rml = rml.right;
                }

                let rtn = node.data;
                node.data = lmr.data;
                removeNode(lmr, lmrParent);
                return rtn;
            }
        }

        let parent = null;
        let curr = this.root;

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

        return null;
    }

    inOrder() {
        function inOrderHelper(curr, list){
            if(curr != null) {
                inOrderHelper(curr.left, list)
                list.push(curr.data)
                inOrderHelper(curr.right, list)
            }
            return list
        }
        return inOrderHelper(this.root, [])
    }
}

let bst = new BST(function(a, b) {
    return a-b
});
bst.insert(3)
bst.insert(4)
bst.insert(5)
bst.remove(5)

console.log(bst.inOrder())