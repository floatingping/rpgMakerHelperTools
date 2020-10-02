
class MyTest {
    constructor(srcJson, newJson) {
        this._origin = JSON.parse(srcJson);
        this._newOne = JSON.parse(newJson);
    }

    testCopyTileset(copiedIdx) {
        if (this._newOne.length !== this._origin.length + 1) throw new Error("bad length");

        this._newOne.forEach((newTileset, k) => {
            if (k !== this._newOne.length - 1) {
                this._isPropsExpected(this._origin[k], newTileset);
                if (this._origin[k] === null) return;
                this._isFlagsSame(this._origin[k].flags, newTileset.flags, k);
                return;
            }
            this._isPropsExpected(this._origin[copiedIdx], newTileset,
                {
                    id: this._newOne.length - 1,
                    name: `${this._origin[copiedIdx].name}_copy`
                }
            );
            this._isFlagsSame(
                this._origin[copiedIdx].flags,
                this._newOne[this._newOne.length - 1].flags, k);
        });
        console.log("copy a tileset ok");
    }

    testCopyImage(tilesetSrcIdx, tilesetToIdx, imageBase) {
        if (this._newOne.length !== this._origin.length) throw new Error("bad length");

        this._newOne.forEach((newTileset, k) => {
            this._isPropsExpected(this._origin[k], newTileset);

            if (this._origin[k] === null) return;

            if (k !== tilesetToIdx) {
                this._isFlagsSame(this._origin[k].flags, newTileset.flags, k);
                return;
            }

            this._isFlagExpected(
                this._origin[tilesetToIdx].flags,
                this._origin[tilesetSrcIdx].flags,
                this._newOne[tilesetToIdx].flags,
                k, imageBase);
        });
        console.log("copy an image ok");
    }

    testImportTile(imported, fileName, importedIdx) {
        if (this._newOne.length !== this._origin.length + 1) throw new Error("bad length");

        this._newOne.forEach((newTileset, k) => {
            if (k === this._origin.length) return;
            this._isPropsExpected(this._origin[k], newTileset);

            if (this._origin[k] === null) return;

            this._isFlagsSame(this._origin[k].flags, newTileset.flags, k);
        });

        this._isPropsExpected(
            imported._tilesetsData[importedIdx],
            this._newOne[this._newOne.length - 1],
            {
                id: this._newOne.length - 1,
                name: `${imported._tilesetsData[importedIdx].name} (${fileName} #${importedIdx})`
            }
        );
        this._isFlagsSame(
            this._newOne[this._newOne.length - 1].flags,
            imported._tilesetsData[importedIdx].flags,
            this._newOne.length - 1);

        console.log("import an image ok");
    }

    testAddANewTileset() {
        if (this._newOne.length !== this._origin.length + 1) throw new Error("bad length");

        this._newOne.forEach((newTileset, k) => {
            if (k === this._newOne.length - 1) return;

            this._isPropsExpected(this._origin[k], newTileset);
            if (this._origin[k] === null) return;

            this._isFlagsSame(this._origin[k].flags, newTileset.flags, k);
        });

        if (this._newOne[this._newOne.length - 1].id !== this._newOne.length - 1) throw new Error("bad id");
        if (this._newOne[this._newOne.length - 1].mode !== 1) throw new Error("bad mode");
        if (this._newOne[this._newOne.length - 1].name !== "a new tileset") throw new Error("bad name");
        if (this._newOne[this._newOne.length - 1].note !== "") throw new Error("bad note");
        if (this._newOne[this._newOne.length - 1].tilesetNames.length !== 9) throw new Error("bad tilesetNames length");
        this._newOne[this._newOne.length - 1].tilesetNames.forEach((name, k) => {
            if (name !== "") throw new Error(`bad [${k}] tilesetName`);
        });
        if (this._newOne[this._newOne.length - 1].flags.length !== 1) throw new Error("bad flags length");
        if (this._newOne[this._newOne.length - 1].flags[0] !== 16) throw new Error("bad flags");
        console.log("test add a new tileset ok");
    }
    testRemoveLastTileset(){
        if (this._newOne.length !== this._origin.length - 1) throw new Error("bad length");

        this._newOne.forEach((newTileset, k) => {

            this._isPropsExpected(this._origin[k], newTileset);
            if (this._origin[k] === null) return;

            this._isFlagsSame(this._origin[k].flags, newTileset.flags, k);
        });
        console.log("test remove last tileset ok");
    }

    testCopySets(fromIdx, fromImg, fromRowCol,
        toIdx, toImg, toRowCol) {
        if (this._newOne.length !== this._origin.length) throw new Error("bad length");
        if (fromRowCol.length !== toRowCol.length) throw new Error("bad length");

        this._newOne.forEach((newTileset, k) => {
            this._isPropsExpected(this._origin[k], newTileset);

            if (this._origin[k] === null) return;

            if (k !== toIdx) {
                this._isFlagsSame(this._origin[k].flags, newTileset.flags, k);
                return;
            }

            for (let i = 0; i < this._origin[k].flags.length; i++) {
                if (!isInScope(i, countScope())) {
                    if (this._origin[k].flags[i] === undefined) continue;
                    if (this._newOne[k].flags[i] !== this._origin[k].flags[i])
                        throw new Error(`bad flag:${i}`);
                }
            }
        });
        toRowCol.forEach((rowCol, k) => {
            let toIdxs = calculateIdxs(toImg, rowCol.row, rowCol.col);
            let fromIdxs = calculateIdxs(fromImg, fromRowCol[k].row, fromRowCol[k].col);
            for (let i = 0; i < toIdxs.length; i++) {
                if (this._newOne[toIdx].flags[toIdxs.startIdx + i] !== this._origin[fromIdx].flags[fromIdxs.startIdx + i])
                    throw new Error(`bad flag:${toIdxs.startIdx + i} from ${fromIdxs.startIdx + i}`);
            }
        });
        console.log("copy sets ok");



        function calculateIdxs(imgName, row, col) {
            let result = {};
            result.startIdx = ImageBaseData[imgName].startIdx + (row * 8 + col) * ImageBaseData[imgName].unitLength;
            result.endIdx = result.startIdx + ImageBaseData[imgName].unitLength - 1;
            result.length = ImageBaseData[imgName].unitLength;
            return result;
        }

        function countScope() {
            const result = [];
            toRowCol.forEach(rowCol => {
                result.push(calculateIdxs(toImg, rowCol.row, rowCol.col));
            });
            return result;
        }
        function isInScope(idx, scope) {
            for (let i = 0; i < scope.length; i++) {
                if (idx >= scope[i].startIdx
                    && idx <= scope[i].endIdx)
                    return true;
            }
            return false;
        }
    }



    testUndo() {
        if (this._newOne.length !== this._origin.length) throw new Error("bad length");

        this._newOne.forEach((newTileset, k) => {
            this._isPropsExpected(this._origin[k], newTileset);
            if (this._origin[k] === null) return;
            this._isFlagsSame(this._origin[k].flags, newTileset.flags, k);
        });
        console.log("test undo ok");
    }


    _isPropsExpected(srcTileset, newTileset, expect) {
        if (srcTileset === null) {
            if (srcTileset !== newTileset) {
                throw new Error(`[${srcTileset.id}]bad tileset`);
            }
            return;
        }

        if (newTileset.id !== srcTileset.id) {
            if (!expect || newTileset.id !== expect.id) {
                throw new Error(`[${srcTileset.id}]bad id:${srcTileset.id}`);
            }
        }

        if (newTileset.mode !== srcTileset.mode) throw new Error(`[${srcTileset.id}]bad mode:${srcTileset.mode}, ${newTileset.mode}`);

        if (newTileset.name !== srcTileset.name) {
            if (!expect || newTileset.name !== expect.name) {
                throw new Error(`[${srcTileset.id}]bad name:${srcTileset.name}, ${newTileset.name}`);
            }
        }
        if (newTileset.note !== srcTileset.note) throw new Error(`[${srcTileset.id}]bad note:${srcTileset.note}, ${newTileset.note}`);

        srcTileset.tilesetNames.forEach((imageName, k) => {
            if (imageName !== newTileset.tilesetNames[k]) throw new Error(`[${srcTileset.id}]bad imageName id:${k}`);
        })
    }

    _isFlagsSame(srcFalgArray, newFalgArray, checkedId) {
        if (srcFalgArray.length !== newFalgArray.length)
            throw new Error(`[${checkedId}]bad length:`);

        newFalgArray.forEach((flag, k) => {
            if (flag !== srcFalgArray[k])
                throw new Error(`[${checkedId}]bad flag:${k}`);
        })
    }

    _isFlagExpected(originFalgArray, copiedSrcArray, newFalgArray,
        checkedId, imageBase) {
        if (originFalgArray.length !== newFalgArray.length) {
            if (newFalgArray.length !== imageBase.endIdx + 1) {
                throw new Error(`[${checkedId}]bad length:`);
            }
        }


        for (let i = 0; i < newFalgArray.length; i++) {
            if (i >= imageBase.startIdx && i <= imageBase.endIdx) {
                if (newFalgArray[i] !== copiedSrcArray[i])
                    throw new Error(`[${checkedId}]not same flag:${i}`);
            }
            else {
                if (originFalgArray[i] === undefined) continue;
                if (newFalgArray[i] !== originFalgArray[i])
                    throw new Error(`[${checkedId}]bad flag:${i}`);
            }
        }
    }

};





