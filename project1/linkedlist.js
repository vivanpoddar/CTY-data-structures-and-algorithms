class LinkedList {
    constructor() {
        this.size = 0;
        this.head = null;
        this.tail = null;
    }

    
    push(value) {
        let node = new Node(value);

        if( this.tail == null ) {
            this.head = this.tail = node;
        }
        else{
            this.tail.next = node;
            this.tail = node;
        }

        this.size++;
    }

    shift(value) {
        let node = new Node(value)

        node.next = this.head
        this.head = node

        if(node.next == null) {
            this.tail = node
        }

        this.size++;
    }

    insert(index, value) {

        if( index < 0 ){
            return this.shift(value);
        }

        if( index >= this.size){
            return this.push(value);
        }

        let node = new Node(value)
        let currentNode = this.head
        for(var i=0; i<index-1; i++) {
            currentNode = currentNode.next
        }

        node.next = currentNode.next
        currentNode.next = node
        this.size++;
    }   

    replace(index, value) {
        let node = new Node(value)
        let currentNode = this.head
        let prev;
        let nextNode = currentNode.next

        if(index = 1) {
            node.next = nextNode
            this.head = node
            return
        }
        
        
        for(var i=0; i<index-1; i++) {           
            if(i==index-2) {
                prev = currentNode
            }
            currentNode = currentNode.next
        }
        node.next = currentNode.next
        currentNode.next = null;
        prev.next = node
    }

    removeAtIndex(index, numToRemove) {
        if( index < 0 || index >= this.size ) {
            return false;
        }
        if(numToRemove+index > this.size) numToRemove = this.size-index
        if( index == 0 ) {
            this.head = this.head.next;
            this.size--;
            return false;
        }

        let currentNode = this.head
        for(let i=0; i<index-1; i++) {
            currentNode = currentNode.next
        } 
        let startSplice = currentNode
        currentNode = this.head
        for(let i=0; i<index+numToRemove; i++) {
            currentNode = currentNode.next
        }
        let endSplice = currentNode

        startSplice.next = endSplice
        this.size-=(numToRemove);
    }

    splice(index, numToRemove, ...values) {
        if( index < 0 || index >= this.size ) {
            return false;
        }
    
      
        // Move to the node before the splice
        this.removeAtIndex(index, numToRemove)
        // Delete the nodes in the splice
        
        // Add the new nodes
        for(let i=0; i<values.length; i++) {
            this.insert(index+i, values[i])
        }
        
    }
}

class Node {
    constructor(val) {
        this.val = val
        this.next = null
    }
}


