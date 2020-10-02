

const fs = require("fs");
class ImageBase {
    constructor(startIdx, endIdx, unitLength) {
        this._startIdx = startIdx;
        this._endIdx = endIdx;
        this._unitLength = unitLength;
    }

    get startIdx() {
        return this._startIdx;
    }
    get endIdx() {
        return this._endIdx;
    }
    get unitLength() {
        return this._unitLength;
    }
}

const ImageBaseData = {
    A1: new ImageBase(2048, 2815, 48),
    A2: new ImageBase(2816, 4351, 48),
    A3: new ImageBase(4352, 5887, 48),
    A4: new ImageBase(5888, 8191, 48),
    A5: new ImageBase(1536, 1663, 1),
    B: new ImageBase(0, 255, 1),
    C: new ImageBase(256, 511, 1),
    D: new ImageBase(512, 767, 1),
    E: new ImageBase(768, 1023, 1),
    getRowLength: () => { return 8; },
    listAll() {
        return ["A1", "A2", "A3", "A4", "A5", "B", "C", "D", "E"];
    }
};
class MyTest {
    constructor() {
    }

    async run() {
        await this._init();
        try {
            this._testCopyTileset(2);
            this._testCopyImage(3, 1, ImageBaseData.A1);
            this._testCopyImage(4, 1, ImageBaseData.A2);
            this._testCopyImage(5, 3, ImageBaseData.B);
            this._testCopyImage(2, 4, ImageBaseData.A3);
        }
        catch (e) {
            console.log(e);
        }

    }

    async _init() {
        this._origin = await this._readFile("../data/Tilesets.json")
        this._newOne = await this._readFile("../Tilesets.json")
    }


    _readFile(filepath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filepath, (err, data) => {
                if (err) reject(err);
                resolve(JSON.parse(data));
            });
        });
    }


    _testCopyTileset(copiedIdx) {
        if(this._newOne[this._newOne.length - 1].id !== this._newOne.length - 1)
            throw new Error(`bad id`);

        if(
            this._newOne[this._newOne.length - 1].mode !== this._origin[copiedIdx].mode
            || this._newOne[this._newOne.length - 1].name !== this._origin[copiedIdx].name
            || this._newOne[this._newOne.length - 1].note !== this._origin[copiedIdx].note)
            throw new Error(`bad props`);
        
        this._newOne[this._newOne.length - 1].tilesetNames.forEach((imageName, k) => {
            if (imageName !== this._origin[copiedIdx].tilesetNames[k])
                throw new Error(`bad tilesetNames:${k}`);
        });
        this._newOne[this._newOne.length - 1].flags.forEach((v, k) => {
            if (v !== this._origin[copiedIdx].flags[k])
                throw new Error(`bad flags:${k}`);
        });
    }

    _testCopyImage(tilesetSrcIdx, tilesetToIdx, imageBase) {
        for (let i = imageBase.startIdx; i <= imageBase.endIdx; i++) {
            if (this._origin[tilesetSrcIdx].flags[i] !== this._newOne[tilesetToIdx].flags[i])
                throw new Error(`${tilesetSrcIdx} to ${tilesetToIdx} bad flags:${i}`);
        }
    }

};




const myTest = new MyTest();
myTest.run();



