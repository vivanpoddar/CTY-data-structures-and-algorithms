class LinkedList {
    static LinkedNode = class {
        constructor(data) {
            this.data = data;
            this.next = null;
        }
    }

    constructor(){class LinkedList {
    
        /**
         * Linked Lists are made of nodes
         */
        static LinkedNode = class {
            constructor(data) {
                this.data = data;
                this.next = null;
            }
        }
    
        constructor(){
            this.head = null;
            this.tail = null;
            this._length = 0;
        }
    
        /**
         * Allows for the setting of the length of the list.
         * Since we don't want it to change, return false
         */
        set length( l ){
            return false;
        }
    
    
        /**
         * Allows getting the length of the list
         */
        get length() {
            return this._length;
        }
    
        /**
         * 
         * @param {int} index index at which to get value (starting at zero) 
         * @returns the value at index, or null if index is invalid
         */
        get(index){
            if( index < 0 || index >= this._length) {
                return null;
            }
    
            let curr = this.head;
            for( let i = 0; i < index; i++ ){
                curr = curr.next;
            }
            return curr.data;
        }
    
        /**
         * 
         * @param {int} index index to change the value
         * @param {*} value the new value of to place in the node
         * @returns true if sucessful, false if an invalid index is given
         */
        set(index, value){
            if( index < 0 || index >= this._length) {
                return false;
            }
    
            let curr = this.head;
            for( let i = 0; i < index; i++ ){
                curr = curr.next;
            }
            curr.data = value;
            return true;
        }
    
        /**
         * Adds a value to end of the list
         * @param {*} value 
         */
        push(value){
            let node = new LinkedList.LinkedNode(value)
            
            if( this.tail == null ){
                this.head = this.tail = node;
            }
            else {
                this.tail.next = node;
                this.tail = node;
            }
            this._length ++;
        }
    
        /**
         * Deletes numToDelete items starting at index then 
         * inserts a value into the middle the list 
         * @param {int} index index to start at
         * @param {int} numToDelete number of elements to delete
         * @param {*} itemToAdd item to add (happens last)
         * @returns number of elements actually deleted
         */
        splice(index, numToDelete, itemToAdd) {
            if( index < 0 ){
                index = 0
            }
            if( index >= this.length ) {
                index = this.length -1;
            }
    
            let curr = this.head;
            for( let i = 0; i < index-1; i++ ){
                curr = curr.next;
            }
    
            let numDeleted = 0;
            let toDelete = curr.next;
            for( let i = 0; i < numToDelete && toDelete !== null; i++ ){
                curr.next = toDelete.next;
                toDelete.next = null;
                toDelete = curr.next;
                this._length--;
                numDeleted++;
            }
    
            if( itemToAdd ){
                let node = new LinkedList.LinkedNode(itemToAdd)
                if( curr.next == null ){
                    this.tail = node;
                }
                node.next = curr.next;
                curr.next = node;
                this._length++;
            }
    
            return numDeleted;
        }
    
        /**
         * Allows iteration through the list with a for/of loop
         * @returns an iterator object
         */
        [Symbol.iterator](){
            let curr = this.head;
    
            return {
                next: function() {
                    let data = null;
                    let am_done = (curr == null )
                    if( curr !== null ){
                        data = curr.data;
                        curr = curr.next;
                    }
    
                    return {
                        value: data, 
                        done: am_done
                    }
                }
            };
        }
    }
        this.head = null;
        this.tail = null;
        this._length = 0;
    }

    set length( l ){
        return false;
    }

    get length() {
        return this._length;
    }

    get(index){
        if( index < 0 || index >= this._length) {
            return null;
        }

        let curr = this.head;
        for( let i = 0; i < index; i++ ){
            curr = curr.next;
        }
        return curr.data;
    }

    set(index, value){
        if( index < 0 || index >= this._length) {
            return false;
        }

        let curr = this.head;
        for( let i = 0; i < index; i++ ){
            curr = curr.next;
        }
        curr.data = value;
        return true;
    }

    push(value){
        let node = new LinkedList.LinkedNode(value)
        
        if( this.tail == null ){
            this.head = this.tail = node;
        }
        else {
            this.tail.next = node;
            this.tail = node;
        }
        this._length ++;
    }

    splice(index, numToDelete, itemToAdd) {
        if( index < 0 ){
            index = 0
        }
        if( index >= this.length ) {
            index = this.length -1;
        }

        let curr = this.head;
        for( let i = 0; i < index-1; i++ ){
            curr = curr.next;
        }

        let numDeleted = 0;
        let toDelete = curr.next;
        for( let i = 0; i < numToDelete && toDelete !== null; i++ ){
            curr.next = toDelete.next;
            toDelete.next = null;
            toDelete = curr.next;
            this._length--;
            numDeleted++;
        }

        if( itemToAdd ){
            let node = new LinkedList.LinkedNode(itemToAdd)
            if( curr.next == null ){
                this.tail = node;
            }
            node.next = curr.next;
            curr.next = node;
            this._length++;
        }

        return numDeleted;
    }

    [Symbol.iterator](){
        let curr = this.head;

        return {
            next: function() {
                let data = null;
                let am_done = (curr == null )
                if( curr !== null ){
                    data = curr.data;
                    curr = curr.next;
                }

                return {
                    value: data, 
                    done: am_done
                }
            }
        };
    }
}