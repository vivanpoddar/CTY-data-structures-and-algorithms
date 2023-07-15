class Huffman {
    static Node = class {
        constructor(letter, freq) {
            this.letter = letter;
            this.freq = freq;
            this.left = null;
            this.right = null;
        }
    }

    static NUM_BITS=8
    /**
     * Compresses a text string into a byte array
     * @param {string} text text to compress
     * @returns the compress binary data
     */
    compress(text){
        let map = new Map();
        function createFrqTable(text){
            for(let i = 0; i < text.length; i++){
                if(map.has(text[i])){
                    map.set(text[i], map.get(text[i]) + 1)
                } else {
                    map.set(text[i], 1)
                }
            }

            return map;
        }

        function createHuffmanTree(freqs){
            let heap = new Heap(function(a,b) {
                return a.freq - b.freq;
            })

            let sorter = new Heap( function(a,b) {
                return a.letter.localeCompare(b.letter);
            })

            for(let [letter, freq] of freqs){
                sorter.push(new Huffman.Node(letter, freq))
            }

            while( sorter.peek() != null ){
                heap.push( sorter.pop() )
            }

            while(heap.peek() != null){
                let left = heap.pop()
                let right = heap.pop()

                if( right != null ) {
                    let parent = new Huffman.Node(null, left.freq + right.freq)
                    parent.left = left
                    parent.right = right
                    heap.push(parent)
                } else {
                    return left
                }
            }

            return null
        }

        function createHuffmanTable(huffRoot) {
            let huffTable = new Map();
          
            function traverse(node, binary) {
                if (node.letter !== null) {
                    huffTable.set(node.letter, binary);
                } else {
                    traverse(node.left, binary + '0');
                    traverse(node.right, binary + '1');
                }
            }
            traverse(huffRoot, '');
          
            return huffTable;
        }

        function encodeTree(huffRoot) {
            let str = '';
            
            function preOrder(node) {
                if(node.left == null & node.right == null) {
                    str+='1'
                    str += node.letter.charCodeAt(0).toString(2).padStart(8, '0')
                } else {
                    str+='0'
                    preOrder(node.left)
                    preOrder(node.right)
                }
            }
          
            preOrder(huffRoot);
            return str.split('');
        }

        function encodeData(text, huffTable) {
            let str = '';
            for(let i = 0; i < text.length; i++) {
                str += huffTable.get(text[i])
            }

            return str.split('')
        }



        let freqs = createFrqTable(text)
        let huffTree = createHuffmanTree(freqs)
        let huffTable = createHuffmanTable(huffTree)
        let encodedTree = encodeTree(huffTree)
        let encodedData = encodeData(text, huffTable)

        encodedTree.push(...encodedData)

        let length = Math.ceil(encodedTree.length/Huffman.NUM_BITS)
        let data = new Uint8Array(length)

        let i = 0
        for (i = 0; i < encodedTree.length; i++) {
            let value = 0
            let index = Math.floor(i/Huffman.NUM_BITS)
            if(encodedTree[i] == '1') {
                value = 1
            } else {
                value = 0
            }

            data[index] = (data[index] << 1) | value
        }
 
        while(i % Huffman.NUM_BITS) {
            data[data.length-1] = (data[data.length-1]<<1)
            i++;
        }

        return freqs;
    }

    /**
     * Decompresses a byte array into a string
     * @param {byte[]} binaryData data to decompress
     * @returns the decompressed text data
     */
    decompress(binaryData){
        function decodeTree(binaryData){
            let offset = 0
            let mask = 1 << (Huffman.NUM_BITS - 1)
            function preOrder() {
                let node = new Huffman.Node(null,null)
                let byte = Math.floor(offset/Huffman.NUM_BITS)
                let bit = mask>>>((offset%Huffman.NUM_BITS)-1)
                bit = binaryData[byte] & bit
                bit = bit >> (Huffman.NUM_BITS - offset%Huffman.NUM_BITS - 1)
                if(bit === 0) {
                    node.left = preOrder()
                    node.right = preOrder()
                } else {
                    node.letter = String.fromCharCode(binaryData[byte])
                }
            }

            preOrder()
        }
        function decodeData(huffTree, beginOffset, binaryData){
            
        }

        return decodeTree(binaryData)
    }
}

class Heap {
    constructor(comparator) {
        this.data = []
        this.comparator = comparator
    }

    push(value) {
     
        let heap = this
        function heapifyUp(indexNode) {
               if ( indexNode == 0 ){
                 return
               }

                let indexParent = Math.floor((indexNode-1)/2)
               
                if(heap.comparator(heap.data[indexNode], heap.data[indexParent]) < 0){
                    let temp = heap.data[indexNode]
                    heap.data[indexNode] = heap.data[indexParent]
                    heap.data[indexParent] = temp
                    heapifyUp(indexParent)
                }
            }

        this.data.push(value)
        heapifyUp(this.data.length-1)
    }

    pop() {
        if(this.data.length === 0) {
            return null
        }

        function heapifyDown(node) {
            let leftChild = 2 * node + 1;
            let rightChild = 2 * node + 2;
            let smallest = node;

            if (leftChild < heap.data.length && heap.comparator(heap.data[leftChild], heap.data[smallest]) < 0) {
                smallest = leftChild;
            }

            if (rightChild < heap.data.length && heap.comparator(heap.data[rightChild], heap.data[smallest]) < 0) {
                smallest = rightChild;
            }

            if (smallest !== node) {
                let temp = heap.data[node];
                heap.data[node] = heap.data[smallest];
                heap.data[smallest] = temp;
                heapifyDown(smallest);
            }
        }

        let heap = this
 
        // PROBLEM
        let poppedNode = this.data[0]
        let lastNode = this.data.pop()

        if(this.data.length > 0) {
            this.data[0] = lastNode
            heapifyDown(0)
        }

        return poppedNode
    }

    peek() {
        if(this.data.length === 0) {
            return null
        }
        return this.data[0]
    }
}

let heap = new Heap(function(a,b) {
    return a-b;
})
let huff = new Huffman()

heap.push('9')
heap.push('3')
heap.push('5')
heap.push('1')
heap.push('7')
heap.push('4')
heap.pop()

//console.log(huff.compress('hi'))
let binaryData = huff.compress('Shipping ship ship ships')
console.log(binaryData)
//10110 110