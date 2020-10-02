let xxx = null;
let loadFile;

function test() {
    let reader = new FileReader();
    reader.onload = myTest;
    reader.readAsText(loadFile);

    function myTest(event) {
        let originJson = event.target.result;

        generialTest();

        function generialTest() {
            testCopyTileset(4);
            testCopyTileset(3);
            testImportTile("myTest", 3);
            testImportTile("123abc", 2);
            testAddANewTileset();
            testRemoveLastTileset();
            testCopyImage("A1", 3, 1);
            testCopyImage("A2", 4, 1);
            testCopyImage("B", 5, 3);
            testCopyImage("A3", 2, 4);
            testCopyImage("A3", 2, 6);
            testCopyImage("C", 3, 5);
            testCopySets(
                2, "A2", [
                { row: 1, col: 4 }, { row: 1, col: 5 }, { row: 1, col: 6 },
                { row: 2, col: 4 }, { row: 2, col: 5 }, { row: 2, col: 6 },
                { row: 3, col: 4 }, { row: 3, col: 5 }, { row: 3, col: 6 }],
                3, "A2", [
                { row: 1, col: 4 }, { row: 1, col: 5 }, { row: 1, col: 6 },
                { row: 2, col: 4 }, { row: 2, col: 5 }, { row: 2, col: 6 },
                { row: 3, col: 4 }, { row: 3, col: 5 }, { row: 3, col: 6 }]
            );
            testCopySets(
                2, "A2", [
                { row: 1, col: 4 }, { row: 1, col: 5 }, { row: 1, col: 6 },
                { row: 2, col: 4 }, { row: 2, col: 5 }, { row: 2, col: 6 }],
                4, "A2", [
                { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 },
                { row: 3, col: 2 }, { row: 3, col: 3 }, { row: 3, col: 4 }]
            );
            testCopySets(
                1, "B", [
                { row: 1, col: 4 }, { row: 1, col: 5 }, { row: 1, col: 6 },
                { row: 2, col: 4 }, { row: 2, col: 5 }, { row: 2, col: 6 }],
                6, "B", [
                { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 },
                { row: 3, col: 2 }, { row: 3, col: 3 }, { row: 3, col: 4 }]
            );
            testCopySets(
                3, "C", [
                { row: 1, col: 4 }, { row: 1, col: 5 }, { row: 1, col: 6 },
                { row: 2, col: 4 }, { row: 2, col: 5 }, { row: 2, col: 6 }],
                1, "C", [
                { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 },
                { row: 3, col: 2 }, { row: 3, col: 3 }, { row: 3, col: 4 }]
            );
            testCopySets(
                5, "A3", [
                { row: 1, col: 4 }, { row: 1, col: 5 }, { row: 1, col: 6 },
                { row: 2, col: 4 }, { row: 2, col: 5 }, { row: 2, col: 6 }],
                2, "A3", [
                { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 },
                { row: 3, col: 2 }, { row: 3, col: 3 }, { row: 3, col: 4 }]
            );
        }

        function testCopyTileset(copiedIdx) {
            let newOne = new myTilesets(JSON.parse(originJson));
            newOne.copyFrom(copiedIdx);
            let test = new MyTest(originJson, newOne.exportJson());
            test.testCopyTileset(copiedIdx);

            testUndo(newOne);
        }

        function testImportTile(fileName, importedIdx) {
            let newOne = new myTilesets(JSON.parse(originJson));
            let imported = new myTilesets(JSON.parse(originJson));
            newOne.importTilesetFrom(imported, fileName, importedIdx);
            let test = new MyTest(originJson, newOne.exportJson());
            test.testImportTile(imported, fileName, importedIdx);

            testUndo(newOne);
        }
        function testAddANewTileset() {
            let newOne = new myTilesets(JSON.parse(originJson));
            newOne.addANewTileset();
            let test = new MyTest(originJson, newOne.exportJson());
            test.testAddANewTileset();

            testUndo(newOne);
        }
        function testRemoveLastTileset() {
            let newOne = new myTilesets(JSON.parse(originJson));
            newOne.removeLastTileset();
            let test = new MyTest(originJson, newOne.exportJson());
            test.testRemoveLastTileset();

            testUndo(newOne);
        }


        function testCopyImage(imageName, srcTilesetIdx, toTilesetIdx) {
            let newOne = new myTilesets(JSON.parse(originJson));
            newOne.importImageFrom(xxx, imageName, srcTilesetIdx, toTilesetIdx);
            let test = new MyTest(originJson, newOne.exportJson());
            test.testCopyImage(srcTilesetIdx, toTilesetIdx, ImageBaseData[imageName]);

            testUndo(newOne);
        }

        function testCopySets(fromIdx, fromImg, fromRowCol, toIdx, toImg, toRowCol) {
            let newOne = new myTilesets(JSON.parse(originJson));
            newOne.copyImageSetFromTo(
                {
                    usedIdx: fromIdx,
                    imgName: fromImg,
                    rowCol: fromRowCol
                },
                {
                    usedIdx: toIdx,
                    imgName: toImg,
                    rowCol: toRowCol
                }
            );
            let test = new MyTest(originJson, newOne.exportJson());
            test.testCopySets(
                fromIdx, fromImg, fromRowCol,
                toIdx, toImg, toRowCol);
            testUndo(newOne);
        }

        function testUndo(newOne) {
            newOne.undo();
            let testUndo = new MyTest(originJson, newOne.exportJson());
            testUndo.testUndo();
        }

    };
}


function loadMainJson(errMsg) {
    try {
        loadFile = document.getElementById("mainJson").files[0];
        let jsonFile = document.getElementById("mainJson").files[0];
        document.getElementById("mainJson").value = "";
        let reader = new FileReader();
        reader.onload = myLoad;
        reader.readAsText(jsonFile);
    }
    catch {
        alert(errMsg);
    }

    function myLoad(event) {
        try {
            xxx = new myTilesets(JSON.parse(event.target.result));
            xxx.useIdx(1);
            document.getElementById("btnExport").disabled = false;
            document.getElementById("btnImportTilesetJson").disabled = false;
            document.getElementById("btnAddANewTileset").disabled = false;
            document.getElementById("btnCopyATileset").disabled = false;
            document.getElementById("btnRemoveLastTileset").disabled = false;

            document.getElementById("chkExpandAll").checked = true;
            ImageBaseData.listAll().forEach(imgName => {
                document.getElementById(`is${imgName}Show`).checked = true;
                updateViewShowImage(imgName);
            });

            updateViewAll();
        }
        catch {
            alert(errMsg);
        }
    };
}

function comparedJson() {
    let jsonFile = document.getElementById("comparedJson").files[0];
    let reader = new FileReader();
    reader.onload = myLoad;
    reader.readAsText(jsonFile);

    function myLoad(event) {
        console.log(xxx.isSameWith(new myTilesets(JSON.parse(event.target.result))));
    };
}

function importTilesets(msg, errMsg) {
    try {
        if (!isLoaded()) return;
        let jsonFile = document.getElementById("importTilesetJson").files[0];
        document.getElementById("importTilesetJson").value = "";
        let reader = new FileReader();
        reader.onload = myImport(jsonFile.name);
        reader.readAsText(jsonFile);
    }
    catch {
        alert(errMsg);
    }

    function myImport(fileName) {
        return (event) => {
            try {
                let imported = new myTilesets(JSON.parse(event.target.result));
                convertInput(prompt(msg)).forEach(idx => {
                    xxx.importTilesetFrom(imported, fileName, Number(idx));
                });
                updateViewStatus();
            }
            catch {
                alert(errMsg);
            }
        };
    }

    function convertInput(inputStr) {
        const result = [];
        inputStr.split(",").forEach(desc => {
            if (desc.indexOf("-") > -1) {
                let n1 = Number(desc.split("-")[0]);
                let n2 = Number(desc.split("-")[1]);

                if (n2 >= n1) {
                    for (let i = n1; i <= n2; i++) {
                        result.push(i);
                    }
                } else {
                    for (let i = n1; i >= n2; i--) {
                        result.push(i);
                    }
                }
            } else {
                result.push(Number(desc));
            }
        });
        return result;
    }

    function convertInputBySort(inputStr) {
        const result = [];
        let record = {};
        inputStr.split(",").forEach(desc => {
            if (desc.indexOf("-") > -1) {
                let n1 = Number(desc.split("-")[0]);
                let n2 = Number(desc.split("-")[1]);
                let bottom = Math.min(n1, n2);
                let top = Math.max(n1, n2);
                for (let i = bottom; i <= top; i++) {
                    if (!record[i]) {
                        record[i] = true;
                    }
                }
            } else {
                if (!record[Number(desc)]) {
                    record[Number(desc)] = true;
                }
            }
        });

        Object.keys(record).forEach(k => {
            result.push(k);
        });
        return result.sort();
    }
}



function importImage(imgName, isImport, errMsg) {
    try {
        if (!isLoaded()) return;

        if (!isImport) {
            myimportImage(xxx);
            updateImageSrc(xxx);
            updateViewAll();
            return;
        }

        let jsonFile = document.getElementById(`importedImage${imgName}`).files[0];
        document.getElementById(`importedImage${imgName}`).value = "";
        let reader = new FileReader();
        reader.onload = myImport;
        reader.readAsText(jsonFile);
    }
    catch {
        alert(errMsg);
    }

    function myimportImage(tilesetsSrc) {
        xxx.importImageFrom(
            tilesetsSrc,
            imgName,
            Number(document.getElementById(`importImageIdx${imgName}`).value),
            xxx.usingIdx
        );
    }

    function updateImageSrc(tilesetsSrc) {
        if (!document.getElementById(`isImportImageIncludeImg${imgName}`).checked) return;
        xxx.updateCurrentImageSource(imgName, tilesetsSrc.getSpecImageSource(
            Number(document.getElementById(`importImageIdx${imgName}`).value),
            imgName
        ));
    }

    function myImport(event) {
        try {
            let imported = new myTilesets(JSON.parse(event.target.result));
            myimportImage(imported);
            updateImageSrc(imported);

            updateViewAll();
        }
        catch {
            alert(errMsg);
        }
    }
}

function addANewTileset() {
    try {
        if (!isLoaded()) return;
        xxx.addANewTileset();
        updateViewStatus();
    }
    catch (e) {
        alert(e);
    }
}

function removeLastTileset() {
    try {
        if (!isLoaded()) return;
        xxx.removeLastTileset();
        updateViewStatus();
    }
    catch (e) {
        alert(e);
    }
}

function updateCurrentTilesetName() {
    try {
        if (!isLoaded()) return;
        xxx.updateCurrentName(document.getElementById("selectingName").value);
        updateViewStatus();
    }
    catch (e) {
        alert(e);
    }
}

function updateCurrentTilesetNote() {
    try {
        if (!isLoaded()) return;
        xxx.updateCurrentNote(document.getElementById("selectingNote").value);
        updateViewStatus();
    }
    catch (e) {
        alert(e);
    }
}

function updateCurrentTilesetMode() {
    try {
        if (!isLoaded()) return;
        xxx.updateCurrentMode(
            Number(
                document.getElementById("selectingMode").value
            )
        );
        updateViewStatus();
    }
    catch (e) {
        alert(e);
    }
}



function updateImageNameDesc(imgName) {
    try {
        if (!isLoaded()) return;
        xxx.updateCurrentImageSource(imgName,
            document.getElementById(`imgName${imgName}`).value);
        updateViewAll();
    }
    catch (e) {
        alert(e);
    }
}

function loadImageNameDesc(imgName, errMsg) {
    try {
        if (!isLoaded()) return;
        document.getElementById(`imgName${imgName}`).value =
            document.getElementById(`pngOfImage${imgName}`).files[0].name.split(".")[0];
        updateImageNameDesc(imgName);
    }
    catch {
        alert(errMsg);
    }
}


function copyCurrentTileset() {
    try {
        if (!isLoaded()) return;
        xxx.copyFrom(xxx.usingIdx);
        updateViewStatus();
    }
    catch (e) {
        alert(e);
    }
}


function runExport() {
    try {
        if (!isLoaded()) return;
        xxx.exportJsonFile();
    }
    catch (e) {
        alert(e);
    }
}


function runUndo() {
    try {
        if (!isLoaded()) return;
        xxx.undo();
        updateViewAll();
    } catch (e) {
        alert(e);
    }
}

function expandAll() {
    ImageBaseData.listAll().forEach(imgName => {
        document.getElementById(`is${imgName}Show`).checked =
            document.getElementById("chkExpandAll").checked;
        updateViewShowImage(imgName);
    });
}


////////////////////////////////////////////////////////////////




function isLoaded() {
    if (!xxx) {
        alert("load first~~");
        return false;
    }
    return true;
}

function updateViewAll() {
    updateViewStatus();
    updateViewImageNameDesc();
    myRender.update();
    updateViewLineColor();
}


function updateViewImageNameDesc() {
    ImageBaseData.listAll().forEach(imgName => {
        document.getElementById(`imgName${imgName}`).value =
            xxx.getcurrentImageSource(imgName);
    });
}

function updateViewShowImage(imgName) {
    document.getElementById(`divImage${imgName}`).style.display =
        document.getElementById(`is${imgName}Show`).checked
            ? "inline-block"
            : "none";
}

function updateViewStatus() {
    if (!xxx) return;

    updateViewUndo();
    updateViewName();
    updateViewMode();
    updateViewNote();

    updateViewTilesetsList();


    function updateViewName() {
        document.getElementById("selectingName").value = xxx.currentName;
    }

    function updateViewMode() {
        document.getElementById("selectingMode").value = xxx.currentMode;
    }

    function updateViewNote() {
        document.getElementById("selectingNote").value = xxx.currentNote;
    }
}




function updateViewUndo() {
    document.getElementById("btnUndo").disabled = !xxx.canUndo;
}

function updateViewTilesetsList() {
    document.getElementById("tilesetsList").innerHTML = makeTilesetsList();

    function makeTilesetsList() {
        let result = "";
        xxx.getTilesetsList().forEach(tileset => {
            result += (`<li ${selectedDesc(tileset.id)} ${addOnClick(tileset.id)}>[${tileset.id}] ${tileset.name}</li>`);
        })
        return result;

        function selectedDesc(id) {
            return xxx.usingIdx === id ? `class="selected"` : "";
        }
        function addOnClick(id) {
            return `onclick="xxx.useIdx(${id});updateViewAll();"`;
        }
    }
}

document.getElementById("colorSelect").value = "#FFC0CB";
function updateViewLineColor() {
    document.querySelectorAll(".imageSet").forEach(el => {
        el.style.color = document.getElementById("colorLine").value;
    });


    mySelecter.resetView();  //clear old selected css
    document.querySelectorAll(".selectedImgageSet").forEach(el => {
        el.style.color = document.getElementById("colorSelect").value;
    });
    updateViewLineWidth();
}

function updateViewLineWidth() {
    let lineWidth = Number(document.getElementById("lineWidth").value);
    document.querySelectorAll(".imageBlock").forEach(el => {
        el.style.maxWidth = `${((lineWidth + 2) * 2 + 48) * 8}px`;
    });
    document.querySelectorAll(".imageSet").forEach(el => {
        el.style.borderWidth = `${lineWidth}px`;
    });
    document.querySelectorAll(".selectedImgageSet").forEach(el => {
        el.style.borderWidth = `${lineWidth + 2}px`;
    });
}
