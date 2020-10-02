class ImageBase {
    constructor(tilesetNamesIdx, name, startIdx, endIdx, unitLength) {
        this._tilesetNamesIdx = tilesetNamesIdx;
        this._name = name;
        this._startIdx = startIdx;
        this._endIdx = endIdx;
        this._unitLength = unitLength;
    }
    get imageIdx() {
        return this._tilesetNamesIdx;
    }
    get name() {
        return this._name;
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

    get rowCount() {
        return (this.endIdx - this.startIdx + 1) / this.unitLength / ImageBase._getColLength();
    }

    static _getColLength() {
        return 8;
    }
}

const ImageBaseData = {
    A1: new ImageBase(0, "A1", 2048, 2815, 48),
    A2: new ImageBase(1, "A2", 2816, 4351, 48),
    A3: new ImageBase(2, "A3", 4352, 5887, 48),
    A4: new ImageBase(3, "A4", 5888, 8191, 48),
    A5: new ImageBase(4, "A5", 1536, 1663, 1),
    B: new ImageBase(5, "B", 0, 255, 1),
    C: new ImageBase(6, "C", 256, 511, 1),
    D: new ImageBase(7, "D", 512, 767, 1),
    E: new ImageBase(8, "E", 768, 1023, 1),
    getColLength: () => { return ImageBase._getColLength(); },
    listAll() {
        return ["A1", "A2", "A3", "A4", "A5", "B", "C", "D", "E"];
    },
    getRPGMakerMZInitTileset() {
        const result = {
            flags: [16],
            mode: 1,
            name: "",
            note: "",
            tilesetNames: [
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                ""
            ]
        };
        return result;
    }
};

class myTilesets {
    constructor(tilesetsData) {
        this._tilesetsData = tilesetsData;
        this._usingIdx = null;
        this._undos = [];
    }

    get usingIdx() {
        return this._usingIdx;
    }

    get currentName() {
        return this._tilesetsData[this.usingIdx].name;
    }

    get currentMode() {
        return this._tilesetsData[this.usingIdx].mode;
    }

    get currentNote() {
        return this._tilesetsData[this.usingIdx].note;
    }

    getcurrentImageSource(imgName) {
        return this.getSpecImageSource(this.usingIdx, imgName);
    }

    getSpecImageSource(specificIdx, imgName) {
        return this._tilesetsData[specificIdx].tilesetNames[
            ImageBaseData[imgName].imageIdx
        ];
    }

    useIdx(idx) {
        if (!(idx > 0)) throw new Error("idx needs to be greater than 0");
        if (idx >= this._tilesetsData.length) throw new Error("idx is too much");
        this._usingIdx = idx;
    }

    updateCurrentName(newName) {
        let updatedIdx = this.usingIdx;
        let oldName = this.currentName;
        this._makeUndo(() => {
            this.useIdx(updatedIdx);
            this._tilesetsData[updatedIdx].name = oldName;
        });
        this._tilesetsData[updatedIdx].name = newName;
    }

    updateCurrentMode(newMode) {
        let updatedIdx = this.usingIdx;
        let oldMode = this.currentMode;
        this._makeUndo(() => {
            this.useIdx(updatedIdx);
            this._tilesetsData[updatedIdx].mode = oldMode;
        });
        this._tilesetsData[this.usingIdx].mode = newMode;
    }

    updateCurrentNote(newNote) {
        let updatedIdx = this.usingIdx;
        let oldNote = this.currentNote;
        this._makeUndo(() => {
            this.useIdx(updatedIdx);
            this._tilesetsData[updatedIdx].note = oldNote;
        });
        this._tilesetsData[updatedIdx].note = newNote;
    }

    updateCurrentImageSource(imgName, newSrcName) {
        let updatedIdx = this.usingIdx;
        let oldSrcName = this.getcurrentImageSource(imgName)
        this._makeUndo(() => {
            this.useIdx(updatedIdx);
            updateImageSource(this._tilesetsData[updatedIdx], imgName, oldSrcName);
        });
        updateImageSource(this._tilesetsData[updatedIdx], imgName, newSrcName);

        function updateImageSource(tilesetData, imgName, newName) {
            tilesetData.tilesetNames[
                ImageBaseData[imgName].imageIdx
            ] = newName;
        }
    }

    removeLastTileset() {
        this.useIdx(1);
        let removed = this._tilesetsData.pop();
        this._makeUndo(() => {
            this._tilesetsData.push(removed);
        });
    }

    importImageFrom(tilesets, imgName, tilesetIdFrom, tilesetIdTo) {
        if (!(tilesetIdFrom > 0) || !(tilesetIdTo > 0)) throw new Error("illegal copied idx");

        let from = tilesets._getImagesData(tilesetIdFrom);
        let to = this._getImagesData(tilesetIdTo);

        let undoImage = this._getImagesData(tilesetIdTo).getImage(imgName);
        this._makeUndo(() => {
            this._getImagesData(tilesetIdTo)
                .updateImage(imgName, undoImage);
        });

        to.updateImage(imgName, from.getImage(imgName));
    }


    _copyImageSetFromTo(fromTilesetId, fromImgName, fromRow, fromCol,
        toTilesetId, toImgName, toRow, toCol) {
        let from = this._getImagesData(fromTilesetId);
        let to = this._getImagesData(toTilesetId);

        let savedData = this._getImagesData(toTilesetId)
            .getImage(toImgName, toRow, toCol);
        to.updateImage(toImgName, from.getImage(fromImgName, fromRow, fromCol), toRow, toCol);
        return savedData;
    }
    copyImageSetFromTo(src, to) {
        let savedData = [];
        to.rowCol.forEach((v, k) => {
            savedData.push({
                row: v.row,
                col: v.col,
                data: this._copyImageSetFromTo(
                    src.usedIdx, src.imgName, src.rowCol[k].row, src.rowCol[k].col,
                    to.usedIdx, to.imgName, v.row, v.col)
            });
        });
        this._makeUndo(() => {
            savedData.forEach(saved => {
                this._getImagesData(to.usedIdx)
                    .updateImage(to.imgName, saved.data, saved.row, saved.col);
            });
        });
    }

    copyFrom(idx) {
        if (!(idx > 0)) throw new Error("illegal copied idx");
        this._makeUndo(() => {
            this._tilesetsData.pop();
        });
        this._tilesetsData.push(
            this._getCopiedTilesetImages(idx, "_copy")
        );
    }

    addANewTileset() {
        this._makeUndo(() => {
            this._tilesetsData.pop();
        });
        this._tilesetsData.push(
            this._makeANewTileset()
        );
    }

    importTilesetFrom(tilesets, fileName, idx) {
        if (!(idx > 0)) throw new Error("illegal copied idx");
        this._makeUndo(() => {
            this._tilesetsData.pop();
        });
        let imported = tilesets._getCopiedTilesetImages(idx, ` (${fileName} #${idx})`);
        imported.id = this._tilesetsData.length;
        this._tilesetsData.push(
            imported
        );
    }

    isSameWith(comparedTilesets) {
        if (this._tilesetsData.length != comparedTilesets._tilesetsData.length) throw new Error("bad length");
        if (comparedTilesets._tilesetsData[0] !== null) throw new Error("bad idx 0");

        for (let i = 1; i < this._tilesetsData.length; i++) {
            if (this._tilesetsData[i].id !== comparedTilesets._tilesetsData[i].id) {
                throw new Error(`[${i}]bad id:${this._tilesetsData[i].id}`);
            }
            if (this._tilesetsData[i].mode !== comparedTilesets._tilesetsData[i].mode) {
                throw new Error(`[${i}]bad mode:${this._tilesetsData[i].mode}`);
            }
            if (this._tilesetsData[i].name !== comparedTilesets._tilesetsData[i].name) {
                throw new Error(`[${i}]bad name:${this._tilesetsData[i].name}`);
            }
            if (this._tilesetsData[i].note !== comparedTilesets._tilesetsData[i].note) {
                throw new Error(`[${i}]bad note:${this._tilesetsData[i].note}`);
            }
            if (this._tilesetsData[i].tilesetNames.length !==
                comparedTilesets._tilesetsData[i].tilesetNames.length) {
                throw new Error(`[${i}]bad tilesetNames length`);
            }
            this._tilesetsData[i].tilesetNames.forEach((tilesetName, k) => {
                if (tilesetName !== comparedTilesets._tilesetsData[i].tilesetNames[k]) {
                    throw new Error(`[${i}]bad tilesetName:${k}`);
                }
            });
            if (this._tilesetsData[i].flags.length !==
                comparedTilesets._tilesetsData[i].flags.length) {
                throw new Error(`[${i}]bad flags length`);
            }
            this._tilesetsData[i].flags.forEach((flag, k) => {
                if (flag !== comparedTilesets._tilesetsData[i].flags[k]) {
                    throw new Error(`[${i}]bad flag:${k}`);
                }
            });
        }
        return true;
    }

    exportJson() {
        return JSON.stringify(this._tilesetsData);
    }

    exportJsonFile() {
        const el = document.createElement("a");
        el.setAttribute("href",
            `data:application/json;charset=utf-8,${encodeURIComponent(this.exportJson())}`);
        el.setAttribute("download", "Tilesets.json");
        el.style.display = "none";
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
    }

    getTilesetsList() {
        const result = [];
        this._tilesetsData.forEach(aTileset => {
            if (!aTileset) return;
            if (aTileset.id === 0) return;
            result.push({ id: aTileset.id, name: aTileset.name });
        })
        return result;
    }

    getUsingTilesetImagesName() {
        if (!this.usingIdx) return null;
        const result = [];
        ImageBaseData.listAll().forEach((imageName, k) => {
            result.push({
                name: imageName,
                usedImgTilesetFileName: this._tilesetsData[this.usingIdx].tilesetNames[k]
            });
        });
        return result;
    }

    get canUndo() {
        return this._undos.length > 0;
    }

    undo() {
        this._undos.pop()();
        if (this.usingIdx >= this._tilesetsData.length) {
            this.useIdx(this._tilesetsData.length - 1);
        }
    }

    _makeUndo(func) {
        this._undos.push(func);
    }


    _getImagesData(idx) {
        if (!idx > 0) throw new Error("tileData's idx must > 0");
        if (idx >= this._tilesetsData.length) throw new Error("tileData's idx is too much");
        return new ImageData(this._tilesetsData[idx].flags);
    }

    _getCopiedTilesetImages(idx, tailDesc) {
        const result = Object.assign({}, this._tilesetsData[idx]);
        result.name += tailDesc;
        result.id = this._tilesetsData.length;
        result.flags = this._tilesetsData[idx].flags.slice(0);
        result.tilesetNames = this._tilesetsData[idx].tilesetNames.slice(0);
        return result;
    }

    _makeANewTileset() {
        const result = Object.assign({}, ImageBaseData.getRPGMakerMZInitTileset());
        result.name = "a new tileset";
        result.id = this._tilesetsData.length;
        return result;
    }

}


class ImageData {
    constructor(imageArray) {
        this._imageArray = imageArray;
    }

    _getIndexs(imageData, row, col) {
        const result = {};
        result.startIdx = imageData.startIdx +
            getOrderNumber(row, col) * imageData.unitLength;
        result.endIdx = result.startIdx + imageData.unitLength - 1;

        if (result.endIdx > imageData.endIdx) throw new Error("row is too much");
        return result;

        function getOrderNumber(row, col) {
            return col + row * ImageBaseData.getColLength();
        }
    }

    _enrich(enrichedIdx) {
        for (let i = this._imageArray.length; i <= enrichedIdx; i++) {
            this._imageArray[i] = null;
        }
    }

    _getSpecificImage(imageBase, row, col) {
        if (!(this._imageArray.length >= imageBase.endIdx + 1)) {
            this._enrich(imageBase.endIdx);
        }

        if (isPickAllData()) {
            return this._imageArray.slice(imageBase.startIdx, imageBase.endIdx + 1);
        }

        if (col >= ImageBaseData.getColLength()) throw new Error("col=0~7");

        let image = this._getIndexs(imageBase, row, col);
        return this._imageArray.slice(image.startIdx, image.endIdx + 1);

        function isPickAllData() {
            return !(row >= 0) || !(col >= 0);
        }
    }

    _updateSpecificImage(imageBase, newImageDataArray, row, col) {
        if (this._imageArray.length < imageBase.endIdx + 1) {
            this._enrich(imageBase.endIdx);
        }

        if (isPickAllData()) {
            update(this._imageArray, newImageDataArray,
                imageBase.startIdx, imageBase.endIdx);
            return;
        }

        if (col >= ImageBaseData.getColLength()) throw new Error("col=0~7");

        let image = this._getIndexs(imageBase, row, col);
        update(this._imageArray, newImageDataArray, image.startIdx, image.endIdx);


        function update(srcImageArray, newImageDataArray,
            startIdx, endIdx) {
            let length = Math.min(newImageDataArray.length, endIdx - startIdx + 1);
            for (let i = 0; i < length; i++) {
                srcImageArray[startIdx + i] = newImageDataArray[i];
            }
        }

        function isPickAllData() {
            return !(row >= 0) || !(col >= 0);
        }
    }

    getImage(name, row, col) {
        return this._getSpecificImage(ImageBaseData[name], row, col)
    }
    updateImage(name, newImageDataArray, row, col) {
        this._updateSpecificImage(ImageBaseData[name], newImageDataArray, row, col)
    }
}