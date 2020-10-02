
const myrectangle = {
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,
    isDrawing: false,
    rt: document.getElementById("myrectangle"),
    draw: function () {
        if (Math.abs(this.x1 - this.x0) < 5) {
            myrectangle.rt.hidden = false;
            return;
        }
        if (Math.abs(this.y1 - this.y0) < 5) {
            myrectangle.rt.hidden = false;
            return;
        }
        if (this.x1 >= this.x0) {
            this.rt.style.left = `${this.x0}px`;
            let w = this.x1 - this.x0 < 2 ? 0 : this.x1 - this.x0 - 2
            this.rt.style.width = `${w}px`;
        } else {
            this.rt.style.left = `${this.x1 + 2}px`;
            this.rt.style.width = `${this.x0 - this.x1 - 4}px`;
        }
        if (this.y1 >= this.y0) {
            this.rt.style.top = `${this.y0}px`;
            let h = this.y1 - this.y0 < 1 ? 0 : this.y1 - this.y0 - 2
            this.rt.style.height = `${h}px`;
        } else {
            this.rt.style.top = `${this.y1 + 2}px`;
            this.rt.style.height = `${this.y0 - this.y1 - 4}px`;
        }
    },
    clear: function () {
        this.rt.style.width = `0px`;
        this.rt.style.height = `0px`;
        this.rt.hidden = true;
    }
};


document.onpointerup = function (e) {
    myrectangle.isDrawing = false;
    myrectangle.clear();
};

const myRender = {
    init: function () {
        this._imageBlocksInit();
        ImageBaseData.listAll().forEach(imgName => {
            this._renderAImage(imgName);
        });
    },

    _imageBlocksInit: function () {
        let added = "";
        ImageBaseData.listAll().forEach(imgName => {
            added += `<div id="divImage${imgName}" class="divImage" >
            <div class="imageTitle">
                ${imgName}<input type="text" id="imgName${imgName}" onchange="updateImageNameDesc('${imgName}')" size="25">
                <button onclick="document.getElementById('pngOfImage${imgName}').click()">..</button>
                <div>
                    <button onclick="importImage('${imgName}', false, 'copy image failed.')">copy from</button>
                    <br>
                    <button onclick="document.getElementById('importedImage${imgName}').click()">import from</button>
                    <input id="importedImage${imgName}" type="file" accept=".json" hidden
                        onchange="importImage('${imgName}', true, 'import image failed.')">
                </div>
                <div>
                    <input id="importImageIdx${imgName}" type="text" placeholder="index" size="10">
                    <input id="isImportImageIncludeImg${imgName}" type="checkbox">with image
                </div>
            </div>
            <input id="pngOfImage${imgName}" type="file" accept=".png" hidden onchange="loadImageNameDesc('${imgName}', 'load ${imgName} failed.')">
            <div id="imageBlock${imgName}" class="imageBlock"></div>
        </div>`;
        });
        document.getElementById(`imageBlocks`).innerHTML = added;
    },

    _renderAImage: function (imgName) {
        let imagesets = document.getElementById(`imageBlock${imgName}`);
        imagesets.onpointerdown = function (e) {
            paras = e.target.id.split("_");
            mySelecter.start(paras[0], paras[1], paras[2]);
            myrectangle.x0 = e.clientX;
            myrectangle.y0 = e.clientY;
            myrectangle.isDrawing = true;
        };
        imagesets.onpointermove = function (e) {
            if (!myrectangle.isDrawing) return;
            myrectangle.x1 = e.clientX;
            myrectangle.y1 = e.clientY;
            myrectangle.draw();
        };
        imagesets.onpointerup = function (e) {
            paras = e.target.id.split("_");
            mySelecter.end(paras[0], paras[1], paras[2]);
            myrectangle.isDrawing = false;
            myrectangle.clear();
            window.getSelection().empty();
        };
        imagesets.innerHTML = "";
        for (let row = 0; row < ImageBaseData[imgName].rowCount; row++) {
            for (let col = 0; col < ImageBaseData.getColLength(); col++) {
                imagesets.innerHTML += `<div class="imageSet" id="${imgName}_${row}_${col}"></div>`;
            }
        }

        if (imgName === "A1") {
            this._renderA1();
        } else {
            this._setImageLocations(imgName);
        }
    },

    _renderA1: function () {

        setLocation(0, 0, "", 0, 0);

        setLocation(0, 4, "", 384, 0);
        setLocation(0, 6, "", 384, 144);
        setLocation(1, 0, "", 0, 288);
        setLocation(1, 2, "", 0, 432);
        setLocation(1, 4, "", 384, 288);
        setLocation(1, 6, "", 384, 432);

        insertLeftRightDiv(0, 5, 672, 0, 744, 0);
        insertLeftRightDiv(0, 7, 672, 144, 744, 144);
        insertLeftRightDiv(1, 1, 288, 288, 360, 288);
        insertLeftRightDiv(1, 3, 288, 432, 360, 432);
        insertLeftRightDiv(1, 5, 672, 288, 744, 288);
        insertLeftRightDiv(1, 7, 672, 432, 744, 432);

        const pos = {
            A: { x: 48, y: 96 },
            B: { x: 24, y: 96 },
            C: { x: 48, y: 72 },
            D: { x: 24, y: 72 }
        };
        insertABCDDiv(0, 1, pos, 0, 144);
        insertABCDDiv(0, 2, pos, 288, 0);
        insertABCDDiv(0, 3, pos, 288, 144);

        function setLocation(row, col, prop, x, y) {
            document.getElementById(`A1_${row}_${col}${prop}`).style.backgroundPositionX = `-${x}px`;
            document.getElementById(`A1_${row}_${col}${prop}`).style.backgroundPositionY = `-${y}px`;
        }
        function insertLeftRightDiv(row, col, xL, yL, xR, yR) {
            document.getElementById(`A1_${row}_${col}`).innerHTML =
                `<div class="imageSetA1Double" id="A1_${row}_${col}_L"></div>`
                + `<div class="imageSetA1Double" id="A1_${row}_${col}_R"></div>`;
            setLocation(row, col, "_L", xL, yL);
            setLocation(row, col, "_R", xR, yR);
        }
        function insertABCDDiv(row, col, pos, xIMG, yIMG) {
            document.getElementById(`A1_${row}_${col}`).innerHTML =
                `<div class="imageSetA1Quadrant" id="A1_${row}_${col}_A"></div>`
                + `<div class="imageSetA1Quadrant" id="A1_${row}_${col}_B"></div>`
                + `<div class="imageSetA1Quadrant" id="A1_${row}_${col}_C"></div>`
                + `<div class="imageSetA1Quadrant" id="A1_${row}_${col}_D"></div>`
                + `<img id="A1_${row}_${col}_IMG"></img>`;
            setLocation(row, col, "_A", pos.A.x, pos.A.y);
            setLocation(row, col, "_B", pos.B.x, pos.B.y);
            setLocation(row, col, "_C", pos.C.x, pos.C.y);
            setLocation(row, col, "_D", pos.D.x, pos.D.y);
            setLocation(row, col, "_IMG", xIMG, yIMG);
        }
    },

    _setImageLocations: function (imgName) {
        let locs = this._getRenderLocations(imgName, 1);
        for (let row = 0; row < ImageBaseData[imgName].rowCount; row++) {
            for (let col = 0; col < ImageBaseData.getColLength(); col++) {
                let aSet = document.getElementById(`${imgName}_${row}_${col}`);
                aSet.style.backgroundPositionX = `-${locs[row][col].x}px`;
                aSet.style.backgroundPositionY = `-${locs[row][col].y}px`;
            }
        }
    },

    _getRenderLocations: function (imgName, type) {
        switch (imgName) {
            case "A1": return getA1Locations(type);
            case "A2": return getA2Locations(type);
            case "A3": return getA3Locations(type);
            case "A4": return getA4Locations(type);
            case "A5": return getA5Locations(type);
            case "B": return getBCDELocations(type);
            case "C": return getBCDELocations(type);
            case "D": return getBCDELocations(type);
            case "E": return getBCDELocations(type);
            default: throw new Error("bad imgName");
        }



        function getA1Locations(type) {
            switch (type) {
                case 0: return WorldLocations();
                case 1: return AreaLocations();
                default: throw new Error("bad type");
            }
            function WorldLocations() {
                return AreaLocations();
            }
            function AreaLocations() {
                return [
                    [{ x: 0, y: 0 }, { x: 336, y: 0 }, { x: 384, y: 0 }, { x: 720, y: 0 }, { x: 0, y: 144 }, { x: 336, y: 144 }, { x: 384, y: 144 }, { x: 720, y: 144 }],
                    [{ x: 0, y: 288 }, { x: 336, y: 288 }, { x: 384, y: 288 }, { x: 720, y: 288 }, { x: 0, y: 432 }, { x: 336, y: 432 }, { x: 384, y: 432 }, { x: 720, y: 432 }]
                ];
            }
        }

        function getA2Locations(type) {
            switch (type) {
                case 0: return WorldLocations();
                case 1: return AreaLocations();
                default: throw new Error("bad type");
            }

            function WorldLocations() {
                return AreaLocations();
            }
            function AreaLocations() {
                return [
                    [{ x: 0, y: 0 }, { x: 96, y: 0 }, { x: 192, y: 0 }, { x: 288, y: 0 }, { x: 384, y: 0 }, { x: 480, y: 0 }, { x: 576, y: 0 }, { x: 672, y: 0 }],
                    [{ x: 0, y: 144 }, { x: 96, y: 144 }, { x: 192, y: 144 }, { x: 288, y: 144 }, { x: 384, y: 144 }, { x: 480, y: 144 }, { x: 576, y: 144 }, { x: 672, y: 144 }],
                    [{ x: 0, y: 288 }, { x: 96, y: 288 }, { x: 192, y: 288 }, { x: 288, y: 288 }, { x: 384, y: 288 }, { x: 480, y: 288 }, { x: 576, y: 288 }, { x: 672, y: 288 }],
                    [{ x: 0, y: 432 }, { x: 96, y: 432 }, { x: 192, y: 432 }, { x: 288, y: 432 }, { x: 384, y: 432 }, { x: 480, y: 432 }, { x: 576, y: 432 }, { x: 672, y: 432 }]
                ];
            }
        }

        function getA3Locations(type) {
            switch (type) {
                case 0: return WorldLocations();
                case 1: return AreaLocations();
                default: throw new Error("bad type");
            }

            function WorldLocations() {
                return AreaLocations();
            }
            function AreaLocations() {
                return [
                    [{ x: 0, y: 0 }, { x: 96, y: 0 }, { x: 192, y: 0 }, { x: 288, y: 0 }, { x: 384, y: 0 }, { x: 480, y: 0 }, { x: 576, y: 0 }, { x: 672, y: 0 }],
                    [{ x: 0, y: 96 }, { x: 96, y: 96 }, { x: 192, y: 96 }, { x: 288, y: 96 }, { x: 384, y: 96 }, { x: 480, y: 96 }, { x: 576, y: 96 }, { x: 672, y: 96 }],
                    [{ x: 0, y: 192 }, { x: 96, y: 192 }, { x: 192, y: 192 }, { x: 288, y: 192 }, { x: 384, y: 192 }, { x: 480, y: 192 }, { x: 576, y: 192 }, { x: 672, y: 192 }],
                    [{ x: 0, y: 288 }, { x: 96, y: 288 }, { x: 192, y: 288 }, { x: 288, y: 288 }, { x: 384, y: 288 }, { x: 480, y: 288 }, { x: 576, y: 288 }, { x: 672, y: 288 }]
                ];
            }
        }

        function getA4Locations(type) {
            switch (type) {
                case 0: return WorldLocations();
                case 1: return AreaLocations();
                default: throw new Error("bad type");
            }

            function WorldLocations() {
                return AreaLocations();
            }
            function AreaLocations() {
                return [
                    [{ x: 0, y: 0 }, { x: 96, y: 0 }, { x: 192, y: 0 }, { x: 288, y: 0 }, { x: 384, y: 0 }, { x: 480, y: 0 }, { x: 576, y: 0 }, { x: 672, y: 0 }],
                    [{ x: 0, y: 144 }, { x: 96, y: 144 }, { x: 192, y: 144 }, { x: 288, y: 144 }, { x: 384, y: 144 }, { x: 480, y: 144 }, { x: 576, y: 144 }, { x: 672, y: 144 }],
                    [{ x: 0, y: 240 }, { x: 96, y: 240 }, { x: 192, y: 240 }, { x: 288, y: 240 }, { x: 384, y: 240 }, { x: 480, y: 240 }, { x: 576, y: 240 }, { x: 672, y: 240 }],
                    [{ x: 0, y: 384 }, { x: 96, y: 384 }, { x: 192, y: 384 }, { x: 288, y: 384 }, { x: 384, y: 384 }, { x: 480, y: 384 }, { x: 576, y: 384 }, { x: 672, y: 384 }],
                    [{ x: 0, y: 480 }, { x: 96, y: 480 }, { x: 192, y: 480 }, { x: 288, y: 480 }, { x: 384, y: 480 }, { x: 480, y: 480 }, { x: 576, y: 480 }, { x: 672, y: 480 }],
                    [{ x: 0, y: 624 }, { x: 96, y: 624 }, { x: 192, y: 624 }, { x: 288, y: 624 }, { x: 384, y: 624 }, { x: 480, y: 624 }, { x: 576, y: 624 }, { x: 672, y: 624 }]
                ];
            }
        }

        function getA5Locations(type) {
            switch (type) {
                case 0: return WorldLocations();
                case 1: return AreaLocations();
                default: throw new Error("bad type");
            }

            function WorldLocations() {
                return AreaLocations();
            }
            function AreaLocations() {
                return [
                    [{ x: 0, y: 0 }, { x: 48, y: 0 }, { x: 96, y: 0 }, { x: 144, y: 0 }, { x: 192, y: 0 }, { x: 240, y: 0 }, { x: 288, y: 0 }, { x: 336, y: 0 }],
                    [{ x: 0, y: 48 }, { x: 48, y: 48 }, { x: 96, y: 48 }, { x: 144, y: 48 }, { x: 192, y: 48 }, { x: 240, y: 48 }, { x: 288, y: 48 }, { x: 336, y: 48 }],
                    [{ x: 0, y: 96 }, { x: 48, y: 96 }, { x: 96, y: 96 }, { x: 144, y: 96 }, { x: 192, y: 96 }, { x: 240, y: 96 }, { x: 288, y: 96 }, { x: 336, y: 96 }],
                    [{ x: 0, y: 144 }, { x: 48, y: 144 }, { x: 96, y: 144 }, { x: 144, y: 144 }, { x: 192, y: 144 }, { x: 240, y: 144 }, { x: 288, y: 144 }, { x: 336, y: 144 }],
                    [{ x: 0, y: 192 }, { x: 48, y: 192 }, { x: 96, y: 192 }, { x: 144, y: 192 }, { x: 192, y: 192 }, { x: 240, y: 192 }, { x: 288, y: 192 }, { x: 336, y: 192 }],
                    [{ x: 0, y: 240 }, { x: 48, y: 240 }, { x: 96, y: 240 }, { x: 144, y: 240 }, { x: 192, y: 240 }, { x: 240, y: 240 }, { x: 288, y: 240 }, { x: 336, y: 240 }],
                    [{ x: 0, y: 288 }, { x: 48, y: 288 }, { x: 96, y: 288 }, { x: 144, y: 288 }, { x: 192, y: 288 }, { x: 240, y: 288 }, { x: 288, y: 288 }, { x: 336, y: 288 }],
                    [{ x: 0, y: 336 }, { x: 48, y: 336 }, { x: 96, y: 336 }, { x: 144, y: 336 }, { x: 192, y: 336 }, { x: 240, y: 336 }, { x: 288, y: 336 }, { x: 336, y: 336 }],
                    [{ x: 0, y: 384 }, { x: 48, y: 384 }, { x: 96, y: 384 }, { x: 144, y: 384 }, { x: 192, y: 384 }, { x: 240, y: 384 }, { x: 288, y: 384 }, { x: 336, y: 384 }],
                    [{ x: 0, y: 432 }, { x: 48, y: 432 }, { x: 96, y: 432 }, { x: 144, y: 432 }, { x: 192, y: 432 }, { x: 240, y: 432 }, { x: 288, y: 432 }, { x: 336, y: 432 }],
                    [{ x: 0, y: 480 }, { x: 48, y: 480 }, { x: 96, y: 480 }, { x: 144, y: 480 }, { x: 192, y: 480 }, { x: 240, y: 480 }, { x: 288, y: 480 }, { x: 336, y: 480 }],
                    [{ x: 0, y: 528 }, { x: 48, y: 528 }, { x: 96, y: 528 }, { x: 144, y: 528 }, { x: 192, y: 528 }, { x: 240, y: 528 }, { x: 288, y: 528 }, { x: 336, y: 528 }],
                    [{ x: 0, y: 576 }, { x: 48, y: 576 }, { x: 96, y: 576 }, { x: 144, y: 576 }, { x: 192, y: 576 }, { x: 240, y: 576 }, { x: 288, y: 576 }, { x: 336, y: 576 }],
                    [{ x: 0, y: 624 }, { x: 48, y: 624 }, { x: 96, y: 624 }, { x: 144, y: 624 }, { x: 192, y: 624 }, { x: 240, y: 624 }, { x: 288, y: 624 }, { x: 336, y: 624 }],
                    [{ x: 0, y: 672 }, { x: 48, y: 672 }, { x: 96, y: 672 }, { x: 144, y: 672 }, { x: 192, y: 672 }, { x: 240, y: 672 }, { x: 288, y: 672 }, { x: 336, y: 672 }],
                    [{ x: 0, y: 720 }, { x: 48, y: 720 }, { x: 96, y: 720 }, { x: 144, y: 720 }, { x: 192, y: 720 }, { x: 240, y: 720 }, { x: 288, y: 720 }, { x: 336, y: 720 }],
                    [{ x: 0, y: 768 }, { x: 48, y: 768 }, { x: 96, y: 768 }, { x: 144, y: 768 }, { x: 192, y: 768 }, { x: 240, y: 768 }, { x: 288, y: 768 }, { x: 336, y: 768 }]
                ];

            }
        }
        function getBCDELocations(type) {
            switch (type) {
                case 0: return WorldLocations();
                case 1: return AreaLocations();
                default: throw new Error("bad type");
            }

            function WorldLocations() {
                return AreaLocations();
            }
            function AreaLocations() {
                return [
                    [{ x: 0, y: 0 }, { x: 48, y: 0 }, { x: 96, y: 0 }, { x: 144, y: 0 }, { x: 192, y: 0 }, { x: 240, y: 0 }, { x: 288, y: 0 }, { x: 336, y: 0 }],
                    [{ x: 0, y: 48 }, { x: 48, y: 48 }, { x: 96, y: 48 }, { x: 144, y: 48 }, { x: 192, y: 48 }, { x: 240, y: 48 }, { x: 288, y: 48 }, { x: 336, y: 48 }],
                    [{ x: 0, y: 96 }, { x: 48, y: 96 }, { x: 96, y: 96 }, { x: 144, y: 96 }, { x: 192, y: 96 }, { x: 240, y: 96 }, { x: 288, y: 96 }, { x: 336, y: 96 }],
                    [{ x: 0, y: 144 }, { x: 48, y: 144 }, { x: 96, y: 144 }, { x: 144, y: 144 }, { x: 192, y: 144 }, { x: 240, y: 144 }, { x: 288, y: 144 }, { x: 336, y: 144 }],
                    [{ x: 0, y: 192 }, { x: 48, y: 192 }, { x: 96, y: 192 }, { x: 144, y: 192 }, { x: 192, y: 192 }, { x: 240, y: 192 }, { x: 288, y: 192 }, { x: 336, y: 192 }],
                    [{ x: 0, y: 240 }, { x: 48, y: 240 }, { x: 96, y: 240 }, { x: 144, y: 240 }, { x: 192, y: 240 }, { x: 240, y: 240 }, { x: 288, y: 240 }, { x: 336, y: 240 }],
                    [{ x: 0, y: 288 }, { x: 48, y: 288 }, { x: 96, y: 288 }, { x: 144, y: 288 }, { x: 192, y: 288 }, { x: 240, y: 288 }, { x: 288, y: 288 }, { x: 336, y: 288 }],
                    [{ x: 0, y: 336 }, { x: 48, y: 336 }, { x: 96, y: 336 }, { x: 144, y: 336 }, { x: 192, y: 336 }, { x: 240, y: 336 }, { x: 288, y: 336 }, { x: 336, y: 336 }],
                    [{ x: 0, y: 384 }, { x: 48, y: 384 }, { x: 96, y: 384 }, { x: 144, y: 384 }, { x: 192, y: 384 }, { x: 240, y: 384 }, { x: 288, y: 384 }, { x: 336, y: 384 }],
                    [{ x: 0, y: 432 }, { x: 48, y: 432 }, { x: 96, y: 432 }, { x: 144, y: 432 }, { x: 192, y: 432 }, { x: 240, y: 432 }, { x: 288, y: 432 }, { x: 336, y: 432 }],
                    [{ x: 0, y: 480 }, { x: 48, y: 480 }, { x: 96, y: 480 }, { x: 144, y: 480 }, { x: 192, y: 480 }, { x: 240, y: 480 }, { x: 288, y: 480 }, { x: 336, y: 480 }],
                    [{ x: 0, y: 528 }, { x: 48, y: 528 }, { x: 96, y: 528 }, { x: 144, y: 528 }, { x: 192, y: 528 }, { x: 240, y: 528 }, { x: 288, y: 528 }, { x: 336, y: 528 }],
                    [{ x: 0, y: 576 }, { x: 48, y: 576 }, { x: 96, y: 576 }, { x: 144, y: 576 }, { x: 192, y: 576 }, { x: 240, y: 576 }, { x: 288, y: 576 }, { x: 336, y: 576 }],
                    [{ x: 0, y: 624 }, { x: 48, y: 624 }, { x: 96, y: 624 }, { x: 144, y: 624 }, { x: 192, y: 624 }, { x: 240, y: 624 }, { x: 288, y: 624 }, { x: 336, y: 624 }],
                    [{ x: 0, y: 672 }, { x: 48, y: 672 }, { x: 96, y: 672 }, { x: 144, y: 672 }, { x: 192, y: 672 }, { x: 240, y: 672 }, { x: 288, y: 672 }, { x: 336, y: 672 }],
                    [{ x: 0, y: 720 }, { x: 48, y: 720 }, { x: 96, y: 720 }, { x: 144, y: 720 }, { x: 192, y: 720 }, { x: 240, y: 720 }, { x: 288, y: 720 }, { x: 336, y: 720 }],
                    [{ x: 384, y: 0 }, { x: 432, y: 0 }, { x: 480, y: 0 }, { x: 528, y: 0 }, { x: 576, y: 0 }, { x: 624, y: 0 }, { x: 672, y: 0 }, { x: 720, y: 0 }],
                    [{ x: 384, y: 48 }, { x: 432, y: 48 }, { x: 480, y: 48 }, { x: 528, y: 48 }, { x: 576, y: 48 }, { x: 624, y: 48 }, { x: 672, y: 48 }, { x: 720, y: 48 }],
                    [{ x: 384, y: 96 }, { x: 432, y: 96 }, { x: 480, y: 96 }, { x: 528, y: 96 }, { x: 576, y: 96 }, { x: 624, y: 96 }, { x: 672, y: 96 }, { x: 720, y: 96 }],
                    [{ x: 384, y: 144 }, { x: 432, y: 144 }, { x: 480, y: 144 }, { x: 528, y: 144 }, { x: 576, y: 144 }, { x: 624, y: 144 }, { x: 672, y: 144 }, { x: 720, y: 144 }],
                    [{ x: 384, y: 192 }, { x: 432, y: 192 }, { x: 480, y: 192 }, { x: 528, y: 192 }, { x: 576, y: 192 }, { x: 624, y: 192 }, { x: 672, y: 192 }, { x: 720, y: 192 }],
                    [{ x: 384, y: 240 }, { x: 432, y: 240 }, { x: 480, y: 240 }, { x: 528, y: 240 }, { x: 576, y: 240 }, { x: 624, y: 240 }, { x: 672, y: 240 }, { x: 720, y: 240 }],
                    [{ x: 384, y: 288 }, { x: 432, y: 288 }, { x: 480, y: 288 }, { x: 528, y: 288 }, { x: 576, y: 288 }, { x: 624, y: 288 }, { x: 672, y: 288 }, { x: 720, y: 288 }],
                    [{ x: 384, y: 336 }, { x: 432, y: 336 }, { x: 480, y: 336 }, { x: 528, y: 336 }, { x: 576, y: 336 }, { x: 624, y: 336 }, { x: 672, y: 336 }, { x: 720, y: 336 }],
                    [{ x: 384, y: 384 }, { x: 432, y: 384 }, { x: 480, y: 384 }, { x: 528, y: 384 }, { x: 576, y: 384 }, { x: 624, y: 384 }, { x: 672, y: 384 }, { x: 720, y: 384 }],
                    [{ x: 384, y: 432 }, { x: 432, y: 432 }, { x: 480, y: 432 }, { x: 528, y: 432 }, { x: 576, y: 432 }, { x: 624, y: 432 }, { x: 672, y: 432 }, { x: 720, y: 432 }],
                    [{ x: 384, y: 480 }, { x: 432, y: 480 }, { x: 480, y: 480 }, { x: 528, y: 480 }, { x: 576, y: 480 }, { x: 624, y: 480 }, { x: 672, y: 480 }, { x: 720, y: 480 }],
                    [{ x: 384, y: 528 }, { x: 432, y: 528 }, { x: 480, y: 528 }, { x: 528, y: 528 }, { x: 576, y: 528 }, { x: 624, y: 528 }, { x: 672, y: 528 }, { x: 720, y: 528 }],
                    [{ x: 384, y: 576 }, { x: 432, y: 576 }, { x: 480, y: 576 }, { x: 528, y: 576 }, { x: 576, y: 576 }, { x: 624, y: 576 }, { x: 672, y: 576 }, { x: 720, y: 576 }],
                    [{ x: 384, y: 624 }, { x: 432, y: 624 }, { x: 480, y: 624 }, { x: 528, y: 624 }, { x: 576, y: 624 }, { x: 624, y: 624 }, { x: 672, y: 624 }, { x: 720, y: 624 }],
                    [{ x: 384, y: 672 }, { x: 432, y: 672 }, { x: 480, y: 672 }, { x: 528, y: 672 }, { x: 576, y: 672 }, { x: 624, y: 672 }, { x: 672, y: 672 }, { x: 720, y: 672 }],
                    [{ x: 384, y: 720 }, { x: 432, y: 720 }, { x: 480, y: 720 }, { x: 528, y: 720 }, { x: 576, y: 720 }, { x: 624, y: 720 }, { x: 672, y: 720 }, { x: 720, y: 720 }]
                ];

            }
        }


    },

    update: function () {
        ImageBaseData.listAll().forEach(imgName => {
            for (let row = 0; row < ImageBaseData[imgName].rowCount; row++) {
                for (let col = 0; col < ImageBaseData.getColLength(); col++) {
                    if (!xxx) return;

                    getIdDesc(imgName, row, col).forEach(idName => {
                        document.getElementById(idName)
                            .style.backgroundImage
                            = (!xxx.getcurrentImageSource(imgName))
                                ? `url('')`
                                : `url('img/tilesets/${xxx.getcurrentImageSource(imgName)}.png')`;
                    });
                }
            }
        });



        function getIdDesc(imgName, row, col) {
            const desc = `${imgName}_${row}_${col}`;
            switch (desc) {
                case "A1_0_5":
                case "A1_0_7":
                case "A1_1_1":
                case "A1_1_3":
                case "A1_1_5":
                case "A1_1_7": return getLR(desc);
                case "A1_0_1":
                case "A1_0_2":
                case "A1_0_3": return getABCD(desc);
                default: return [desc];
            }
        }

        function getLR(desc) {
            return [`${desc}_L`, `${desc}_R`];
        }
        function getABCD(desc) {
            return [`${desc}_A`, `${desc}_B`, `${desc}_C`, `${desc}_D`, `${desc}_IMG`];
        }

    }
};

myRender.init();
expandAll();

const mySelecter = {
    picked: {
        usedIdx: null,
        imgName: null,
        rowCol: []
    },
    copied: {
        usedIdx: null,
        imgName: null,
        rowCol: []
    },
    startData: {},
    endData: {},
    start: function (imgName, rowDesc, colDesc) {
        this.clearView();
        this.startData.imgName = imgName;
        this.startData.row = Number(rowDesc);
        this.startData.col = Number(colDesc);
    },
    end: function (imgName, rowDesc, colDesc) {
        this.endData.imgName = imgName;
        this.endData.row = Number(rowDesc);
        this.endData.col = Number(colDesc);
        this._calculatePicked();
        updateViewLineColor();
    },
    _calculatePicked: function () {
        if (!xxx) return;
        if (this.startData.imgName !== this.endData.imgName) return;
        this.picked.usedIdx = xxx.usingIdx;
        this.picked.imgName = this.startData.imgName;
        this.picked.rowCol = this._calculateSelect(
            this.startData.row, this.endData.row,
            this.startData.col, this.endData.col
        );
    },
    _calculateSelect: function (row0, row1, col0, col1) {
        const result = [];
        for (let r = Math.min(row0, row1); r <= Math.max(row0, row1); r++) {
            for (let c = Math.min(col0, col1); c <= Math.max(col0, col1); c++) {
                result.push({ row: r, col: c });
            }
        }
        return result;
    },
    copy: function () {
        if (this.picked.rowCol.length == 0) {
            alert("no selected");
            return;
        }
        this.copied.usedIdx = this.picked.usedIdx
        this.copied.imgName = this.picked.imgName
        this.copied.rowCol = this.picked.rowCol.slice(0);
    },
    _getLength: function (rowCol) {
        if (rowCol.length === 0) return 0;
        return {
            rowLength: rowCol[rowCol.length - 1].row - rowCol[0].row + 1,
            colLength: rowCol[rowCol.length - 1].col - rowCol[0].col + 1
        };
    },
    paste: function (callback) {
        if (this.copied.imgName !== this.startData.imgName) {
            alert("imgName need to be same");
            return;
        }
        const copiedLength = this._getLength(this.copied.rowCol);
        const pastedRowEnd = Math.min(
            this.startData.row + copiedLength.rowLength - 1,
            ImageBaseData[this.startData.imgName].rowCount - 1);
        const pastedColEnd = Math.min(
            this.startData.col + copiedLength.colLength - 1,
            ImageBaseData.getColLength() - 1);

        this.clearView();
        this.end(
            this.startData.imgName,
            pastedRowEnd, pastedColEnd);

        const pastedLength = this._getLength(this.picked.rowCol);
        const copiedRowEnd =
            this.copied.rowCol[0].row + pastedLength.rowLength - 1;
        const copiedColEnd =
            this.copied.rowCol[0].col + pastedLength.colLength - 1;
        callback(
            {
                usedIdx: this.copied.usedIdx,
                imgName: this.copied.imgName,
                rowCol: this._calculateSelect(
                    this.copied.rowCol[0].row, copiedRowEnd,
                    this.copied.rowCol[0].col, copiedColEnd)
            },
            {
                usedIdx: this.picked.usedIdx,
                imgName: this.picked.imgName,
                rowCol: this.picked.rowCol.slice(0)
            }
        );
    },
    clearView: function () {
        if (!this.picked.usedIdx) return;
        this.picked.rowCol.forEach(el => {
            document.getElementById(`${this.picked.imgName}_${el.row}_${el.col}`)
                .classList.remove("selectedImgageSet");
        });
    },
    updateView: function () {
        this.picked.rowCol.forEach(el => {
            document.getElementById(`${this.picked.imgName}_${el.row}_${el.col}`)
                .classList.add("selectedImgageSet");
        });
    },
    resetView: function () {
        if (!xxx) return;
        if (this.picked.usedIdx !== xxx.usingIdx) {
            this.clearView();
        }
        else {
            this.updateView();
        }
    }
}

function copyImageSetFromTo() {
    mySelecter.paste((src, to) => {
        xxx.copyImageSetFromTo(src, to);
    });
    updateViewStatus();
}


