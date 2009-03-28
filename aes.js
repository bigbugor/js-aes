var AES = {
  sbox: [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
         0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
         0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
         0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
         0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
         0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
         0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
         0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
         0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
         0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
         0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
         0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
         0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
         0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
         0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
         0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16],
  
  rcon: [[0x00, 0x00, 0x00, 0x00],
         [0x01, 0x00, 0x00, 0x00],
         [0x02, 0x00, 0x00, 0x00],
         [0x04, 0x00, 0x00, 0x00],
         [0x08, 0x00, 0x00, 0x00],
         [0x10, 0x00, 0x00, 0x00],
         [0x20, 0x00, 0x00, 0x00],
         [0x40, 0x00, 0x00, 0x00],
         [0x80, 0x00, 0x00, 0x00],
         [0x1b, 0x00, 0x00, 0x00],
         [0x36, 0x00, 0x00, 0x00]],
  
  cipher: function(input, w) {
    var nb     = 4;
    var nr     = w.length / nb - 1;
    var state  = [new Array(nb), new Array(nb), new Array(nb), new Array(nb)];
    var output = new Array(4 * nb);
    
    for (var i = 0; i < input.length; i++) {
      state[i % 4][Math.floor(i / 4)] = input[i];
    }
    
    state = this.addRoundKey(state, w, 0, nb);
    
    for (var round = 1; round < nr; round++) {
      state = this.subBytes(state, nb);
      state = this.shiftRows(state, nb);
      state = this.mixColumns(state, nb);
      state = this.addRoundKey(state, w, round, nb)
    }
    
    state = this.subBytes(state, nb);
    state = this.shiftRows(state, nb);
    state = this.addRoundKey(state, w, round, nb);
    
    for (var i = 0; i < output.length; i++) {
      output[i] = state[i % 4][Math.floor(i / 4)];
    }
    
    return output;
  },
  
  subBytes: function(state, nb) {
    for (var c = 0; c < nb; c++) {
      for (var r = 0; r < 4; r++) {
        state[r][c] = this.sbox[state[r][c]]
      }
    }
    
    return state;
  },
  
  shiftRows: function(state, nb) {
    var temp = new Array(nb);
    
    for (var r = 1; r < 4; r++) {
      for (var c = 0; c < nb; c++) {
        temp[c] = state[r][(c + r) % nb];
      }
      for (var c = 0; c < 4; c++) {
        state[r][c] = temp[c]
      }
    }
    
    return state;
  },
  
  mixColumns: function(state, nb) {
    for (var c = 0; c < nb; c++) {
      var a = new Array(4);
      var b = new Array(4);
      
      for (var r = 0; r < 4; r++) {
        a[r] = state[r][c];
        b[r] = state[r][c] & 0x80 ? state[r][c] << 1 ^ 0x11b : state[r][c] << 1;
      }
      
      state[0][c] = b[0] ^ a[3] ^ a[2] ^ b[1] ^ a[1];
      state[1][c] = b[1] ^ a[0] ^ a[3] ^ b[2] ^ a[2];
      state[2][c] = b[2] ^ a[1] ^ a[0] ^ b[3] ^ a[3];
      state[3][c] = b[3] ^ a[2] ^ a[1] ^ b[0] ^ a[0];
    }
    
    return state;
  },
  
  addRoundKey: function(state, w, round, nb) {
    for (var c = 0; c < nb; c++) {
      for (var r = 0; r < 4; r++) {
        state[r][c] ^= w[round * 4 + c][r];
      }
    }
    
    return state;
  },
  
  keyExpansion: function(key) {
    var nk   = key.length / 4;
    var nb   = 4;
    var nr   = nk + 6;
    var w    = new Array(nb * (nr + 1));
    var temp = new Array(4);
    
    for (var i = 0; i < nk; i++) {
      w[i] = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
    }
    
    for (var i = nk; i < w.length; i++) {
      w[i] = new Array(4);
      
      for(var j = 0; j < 4; j++) {
        temp[j] = w[i - 1][j];
      }
      
      if (i % nk == 0) {
        temp = this.subWord(this.rotWord(temp));
        
        for (var j = 0; j < 4; j++) {
          temp[j] ^= AES.rcon[i / nk][j]
        }
      }
      else if (nk > 6 && i % nk == 4) {
        temp = this.subWord(temp);
      }
      
      for (var j = 0; j < 4; j++) {
        w[i][j] = w[i - nk][j] ^ temp[j];
      }
    }
    
    return w;
  },
  
  rotWord: function(w) {
    var temp = w[0];
    
    for (var i = 0; i < 3; i++) {
      w[i] = w[i + 1];
    }
    
    w[3] = temp;
    
    return w;
  },
  
  subWord: function(w) {
    for (var i = 0; i < 4; i++) {
      w[i] = this.sbox[w[i]];
    }
    
    return w;
  },
  
  generateKey: function() {
    var key = new Array(16);
    
    for (var i = 0; i < 16; i++) {
      key[i] = Math.floor(Math.random() * 0xff);
    }
    
    return key;
  }
}

AES.Base64 = {
  characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  
  encode: function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    
    for (var i = 0; i < input.length;) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 0x3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 0xf) << 2) | (chr3 >> 6);
      enc4 = chr3 & 0x3f;
      
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } 
      else if (isNaN(chr3)) {
        enc4 = 64;
      }
      
      output = output + this.characters.charAt(enc1) +
                        this.characters.charAt(enc2) +
                        this.characters.charAt(enc3) +
                        this.characters.charAt(enc4);
    }
    
    return output;
  },
  
  decode: function (input) {
    var output = "";
    var chr1, chr2, chr3, dec1, dec2, dec3, dec4;
    
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    
    for (var i = 0; i < input.length;) {
      dec1 = this.characters.indexOf(input.charAt(i++));
      dec2 = this.characters.indexOf(input.charAt(i++));
      dec3 = this.characters.indexOf(input.charAt(i++));
      dec4 = this.characters.indexOf(input.charAt(i++));
      
      chr1 = (dec1 << 2) | (dec2 >> 4);
      chr2 = ((dec2 & 0xf) << 4) | (dec3 >> 2);
      chr3 = ((dec3 & 0x3) << 6) | dec4;
      
      output = output + String.fromCharCode(chr1);
      
      if (dec3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (dec4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    
    return output;
  }
}

AES.Counter = function() {
  var time = Math.floor((new Date()).getTime() / 1000);
  
  this.array = new Array(16);
  
  for (var i = 0; i < 4; i++) {
    this.array[i] = (time >>> i * 8) & 0xff;
  }
  for (var i = 4; i < 8; i++) {
    this.array[i] = Math.floor(Math.random() * 0x100);
  }
  for (var i = 8; i < 16; i++) {
    this.array[i] = 0;
  }
  
  this.increment = function() {
    for (var i = 15; i >= 8; i--) {
      if (this.array[i] == 0xff) {
        this.array[i] = 0;
      } 
      else {
        this.array[i]++;
        break;
      }
    }
  
    return this;
  }
}

AES.Crypto = function(key) {
  var blockSize = 16;
  
  this.key         = key;
  this.keySchedule = AES.keyExpansion(key);
  this.counter     = new AES.Counter();
  
  this.setCounter = function(array) {
    for (var i = 0; i < 16; i++) {
      this.counter.array[i] = array[i];
    }
    
    return this;
  }
  
  this.getCounter = function() {
    return this.counter.array
  }
  
  this.run = function(input) {
    var blockCount = Math.ceil(input.length / blockSize);
    var output     = new Array(input.length);
    
    for (var block = 0; block < blockCount; block++) {
      
      var counterBlock = AES.cipher(this.counter.array, this.keySchedule);
      var byteCount    = block + 1 == blockCount ? (input.length - 1) % blockSize + 1 : blockSize;
      
      for(var c = 0; c < byteCount; c++) {
        var offset = block * blockSize;
        
        output[offset + c] = String.fromCharCode(counterBlock[c] ^ input.charCodeAt(offset + c));
      }
      
      this.counter.increment();
    }
    
    return output.join('');
  }
  
  this.encrypt = function(text) {
    return AES.Base64.encode(this.run(text));
  }
  
  this.decrypt = function(text) {    
    return this.run(AES.Base64.decode(text));
  }
}