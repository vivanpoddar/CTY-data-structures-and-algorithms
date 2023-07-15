class Heap{

    constructor(comparator){
        this.data = []
        this.comparator = comparator;
    }

    peek() {
        if( this.data.length === 0  ){
            return null;
        }

        return this.data[0];
    }

    push(value){
        let heap = this
        function heapifyUp(idx){
            if( idx <= 0 ){
                return;
            }
            
            let parent = Math.floor(idx / 2)
            if( heap.comparator(heap.data[idx],heap.data[parent]) < 0 ){
                let tmp = heap.data[idx]
                heap.data[idx] = heap.data[parent]
                heap.data[parent] = tmp
                heapifyUp(parent)
            }
        }
        this.data.push(value);
        heapifyUp(this.data.length-1)
    }

    pop(){
        if( this.data.length === 0 ){
            return null;
        }

        let heap = this;
        function heapifyDown(idx){
            if( idx >= heap.data.length ){
                return;
            }

            let leftChild = idx*2+1
            let rightChild = idx*2+2
            let least = idx;

            if( leftChild < heap.data.length ) {
                if( heap.comparator(heap.data[least], heap.data[leftChild]) > 0 ){
                    least = leftChild
                }
            }
            if( rightChild < heap.data.length ) {
                if( heap.comparator(heap.data[least], heap.data[rightChild]) > 0 ){
                    least = rightChild
                }
            }

            if( idx !== least ){
                let tmp = heap.data[idx];
                heap.data[idx] = heap.data[least];
                heap.data[least] = tmp;
                heapifyDown(least)
            }
        }

        let rtn = this.data[0];
        this.data[0] = this.data[this.data.length-1]
        this.data.pop()
        heapifyDown(0)

        return rtn;
    }
}

class Huffman {

    static HuffNode = class {
        constructor(letter, freq){
            this.letter = letter;
            this.freq = freq;
            this.left = null;
            this.right = null;
        }
    }

    static LETTER_ENCODING_BITS = 8
    //static END_MESSAGE_CHAR = String.fromCharCode(3); // ASCII 3 is END_OF_TEXT

    /**
     * Compresses a text string into a byte array
     * @param {string} text text to compress
     * @returns the compress binary data
     */
    compress(text, outputTable = false){
        function createFreqTable(text){
            let table = new Map()
            for( let letter of text){
                if( table.has(letter) ){
                    table.set(letter, table.get(letter)+1)
                }
                else {
                    table.set(letter, 1)
                }
            }

            return table
        }
        function createHuffmanTree(freqs){

            let heap = new Heap(function(a,b){
                return a.freq - b.freq
            })

            // Put initial node into heap by lexigraphical order
            let sorter = new Heap(function(a,b){
                return a.letter.localeCompare(b.letter);
            })
            for( let [letter,freq] of freqs.entries() ){
                sorter.push( new Huffman.HuffNode(letter, freq) );
            }
            while( sorter.peek() !== null ){
                let value = sorter.pop();
                heap.push(value)
            }

            // Create Huffman Tree
            let tree = null;
            while(heap.peek() !== null ){
                let lc = heap.pop();
                let rc = heap.pop();
                
                if( rc !== null ){
                    let parent = new Huffman.HuffNode('*', lc.freq+rc.freq);
                    parent.left = lc;
                    parent.right = rc;
                    
                    heap.push(parent)
                }
                else {
                    tree = lc;
                }
            }
            return tree
        }
        function createHuffmanTable(huffRoot){
            function traverseTree(node, string ){
                if( node.left === null && node.right === null ){
                    table.set(node.letter, string)
                    return
                }
                traverseTree(node.left, string+"0")
                traverseTree(node.right, string+"1")
            }

            let table = new Map();
            traverseTree(huffRoot, "")
            return table;
        }
        function encodeTree(huffRoot){
            function preOrderHelper(node, str){
                // Encode the leaf
                if( node.left == null && node.right == null ){
                    str.push("1");

                    let letterBinary = node.letter.charCodeAt(0).toString(2).split("");
                    while( letterBinary.length < Huffman.LETTER_ENCODING_BITS){
                        letterBinary.unshift('0')
                    }

                    str.push(...letterBinary)
                    return str
                }
                // Encode Internal Node
                str.push("0")
                preOrderHelper(node.left, str)
                preOrderHelper(node.right, str)
                return str;
            }
            let str = preOrderHelper(huffRoot, [])
            return str
        }

        function encodeData(text, huffTable){
            let str = []
            for( let letter of text){
                str.push(...huffTable.get(letter).split(""))
            }
            return str
        }
                // Add END_OF_MESSAGE Marker
        //text += Huffman.END_MESSAGE_CHAR;

        let freqTable = createFreqTable(text)
        let huffTree = createHuffmanTree(freqTable)
        let huffTable = createHuffmanTable(huffTree)

        if( outputTable ){
            console.log("Huffman Dictionary:", huffTable)
        }

        // Actually compression
        let encodedTree = encodeTree(huffTree)
        let encodedMessage = encodeData(text, huffTable);
        encodedTree.push(...encodedMessage)

        let numBytes = Math.ceil(encodedTree.length / Huffman.LETTER_ENCODING_BITS)
        let byteData = new Uint8Array(numBytes)

        // Encode data into the byte array
        let i = 0
        for( i = 0; i < encodedTree.length; i++ ){
            let byteNum = Math.floor( i / Huffman.LETTER_ENCODING_BITS )
            let value = (encodedTree[i] == '1') ? 1 : 0;

            byteData[byteNum] = (byteData[byteNum] << 1) | value
        }

        // Push the last byte's data flush left
        while(i % Huffman.LETTER_ENCODING_BITS){
            byteData[byteData.length-1] = (byteData[byteData.length-1]<<1)
            i++;
        }


        return byteData;
    }

    /**
     * Decompresses a byte array into a string
     * @param {byte[]} binaryData data to decompress
     * @returns the decompressed text data
     */
    decompress(binaryData){
        const bitMask = (1 << (Huffman.LETTER_ENCODING_BITS - 1))
        function decodeTree(binaryData, offset){
            let node = new Huffman.HuffNode(null, 0)
            let byteNum = Math.floor(offset / Huffman.LETTER_ENCODING_BITS)
            let bitOffset = offset % Huffman.LETTER_ENCODING_BITS;

            // 1 is left, 0 is internal node
            let leafOrNot = binaryData[byteNum] & (bitMask>>bitOffset)
            offset += 1
            if( leafOrNot ){
                
                let letter = 0;
                // In a left get letter out
                for( let i = offset; i < offset + Huffman.LETTER_ENCODING_BITS; i++ ){
                    byteNum = Math.floor(i / Huffman.LETTER_ENCODING_BITS)
                    bitOffset = i % Huffman.LETTER_ENCODING_BITS;

                    let bit = binaryData[byteNum] & (bitMask >> bitOffset)
                    bit = bit >> (Huffman.LETTER_ENCODING_BITS - bitOffset - 1) 
                    letter = (letter << 1) | bit
                }
                node.letter = String.fromCharCode(letter)
                return [node, offset + Huffman.LETTER_ENCODING_BITS]
            }
            
            [node.left, offset] = decodeTree(binaryData, offset);
            [node.right, offset] = decodeTree(binaryData, offset);
            return [node, offset]
        }
        function decodeData(huffRoot, beginOffset, binaryData){
            let curr = huffRoot
            let message = []

            let maxOffset = binaryData.length * Huffman.LETTER_ENCODING_BITS;
            while( beginOffset < maxOffset ){
                let byteNum = Math.floor(beginOffset / Huffman.LETTER_ENCODING_BITS)
                let bitOffset = beginOffset % Huffman.LETTER_ENCODING_BITS;

                let bit = binaryData[byteNum] & (bitMask >> bitOffset)
                if( bit ) {
                    curr = curr.right
                }
                else{
                    curr = curr.left;
                }

                if( curr.letter != null ){
                    if( curr.letter == Huffman.END_MESSAGE_CHAR){
                        break;
                    }
                    message.push(curr.letter)
                    curr = huffRoot;
                }
                beginOffset += 1
            }

            return message.join("")
        }

        let [huffTree,offset] = decodeTree(binaryData, 0);
        let text = decodeData(huffTree, offset, binaryData); 
        return text
    }
}

let test = new Huffman()
let compressed = test.compress("Shipping ships ship ships", true)
console.log(compressed)
console.log("COMPRESSED:", compressed.length, compressed)
//let decompressed = test.decompress(compressed)
//console.log("DECOMPRESSED:", decompressed.length, decompressed)
//console.log("Compression (%):", (1 - compressed.length/decompressed.length) * 100)