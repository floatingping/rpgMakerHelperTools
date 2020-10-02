function loadSystemJson() {
    try {
        let isFoundSystemJson = -1;

        for (let i = 0; i < document.getElementById("jsons").files.length; i++) {
            if (document.getElementById("jsons")
                .files[i].name.toLowerCase() === "system.json") {
                isFoundSystemJson = i;
                break;
            }
        }

        if (isFoundSystemJson === -1) {
            alert(text.notFoundSystemJson);
            throw new Error();
        }

        let jsonFile = document.getElementById("jsons").files[isFoundSystemJson];
        let reader = new FileReader();
        reader.onload = myLoad;
        reader.readAsText(jsonFile);
    }
    catch {
        alert(text.loadFailed);
    }

    function myLoad(event) {
        try {
            myQuery.reset(JSON.parse(event.target.result));
            //should protected
            myCommonEventQuery.load();
            myMapQuery.load();
        }
        catch {
            alert(text.loadFailed);
        }
    };
}


function findId() {
    myQuery.getId(document.getElementById("txtFindId").value);
    myView.updateAll();
}
function findKeyword() {
    myQuery.search(document.getElementById("txtfindKeyword").value);
    myView.updateAll();
}


function querySwitch(switchId) {
    let desc = eventOfSwitch(switchId) + mapOfSwitch(switchId);
    if (desc === "") desc = `s[${switchId}] ${text.notFound}`;
    myView.rightAdd(desc);
}
function queryVariable(variableId) {
    let desc = eventOfVariable(variableId) + mapOfVariable(variableId);
    if (desc === "") desc = `s[${variableId}] ${text.notFound}`;
    myView.rightAdd(desc);
}

function mapOfSwitch(switchId) {
    let desc = "";
    myMapQuery.findSwitchId(switchId).forEach(found => {
        found.conditions.forEach(cond => {
            desc += `s[${cond.id}][${text.map}]\t${found.mapName}(${cond.eventX},${cond.eventY})\t${cond.eventName}\tpage:${cond.pageId + 1}, ${text.condition}\n`;
        })
        found.events.forEach(event => {
            desc += `s[${event.id}][${text.map}]\t${found.mapName}(${event.eventX},${event.eventY})\t${event.eventName}\tpage:${event.pageId + 1}, ${text.eventLine}:${descRowIds(event.rowIds)}\n`;
        })
    });
    return desc;
}
function mapOfVariable(variableId) {
    let desc = "";
    myMapQuery.findVariableId(variableId).forEach(found => {
        found.conditions.forEach(cond => {
            desc += `v[${cond.id}][${text.map}]\t${found.mapName}(${cond.eventX},${cond.eventY})\t${cond.eventName}\tpage:${cond.pageId + 1}, ${text.condition}\n`;
        })
        found.events.forEach(event => {
            desc += `v[${event.id}][${text.map}]\t${found.mapName}(${event.eventX},${event.eventY})\t${event.eventName}\tpage:${event.pageId + 1}, ${text.eventLine}:${descRowIds(event.rowIds)}\n`;
        })
    });
    return desc;
}

function eventOfSwitch(switchId) {
    let desc = "";
    myCommonEventQuery.findSwitchId(switchId).conditions.forEach(cond => {
        desc += `s[${cond.id}][${text.event}]\t${cond.eventId}:${cond.eventName}\t${text.condition}\n`;
    });
    myCommonEventQuery.findSwitchId(switchId).events.forEach(event => {
        desc += `s[${event.id}][${text.event}]\t${event.eventId}:${event.eventName}\t${text.eventLine}:${descRowIds(event.rowIds)}\n`;
    });
    return desc;
}
function eventOfVariable(variableId) {
    let desc = "";
    myCommonEventQuery.findVariableId(variableId).forEach(event => {
        desc += `v[${event.id}][${text.event}]\t${event.eventId}:${event.eventName}\t${text.eventLine}:${descRowIds(event.rowIds)}\n`;
    });
    return desc;
}

function descRowIds(rowIdAry) {
    let result = "";
    if (!rowIdAry) return result;
    rowIdAry.forEach(rowId => {
        result += `${rowId + 1},`;
    });
    if (result[result.length - 1] === ",") {
        result = result.substring(0, result.length - 1)
    }
    return result;
}


const myView = {
    updateAll: function () {
        this.renderSwitch();
        this.renderVariable();
    },
    renderSwitch: function () {
        let div = "";
        myQuery.getSwitchs().forEach(v => {
            div += this.getRow(v, "querySwitch")
        })
        document.getElementById("domainSwitch").innerHTML = div;
    },
    renderVariable: function () {
        let div = "";
        myQuery.getVariables().forEach(v => {
            div += this.getRow(v, "queryVariable")
        })
        document.getElementById("domainVariable").innerHTML = div;
    },

    getRow: function (v, funcName) {
        return `<div class="row"><div class="rowId">${v.id}</div><input type="text" value="${v.name}" class="rowName"><button onclick="${funcName}(${v.id})">${text.search}</button></div>`;
    },

    rightAdd: function (desc) {
        let textArea = document.createElement("TEXTAREA");
        textArea.rows = 5;
        textArea.cols = 100;
        textArea.appendChild(document.createTextNode(desc));
        document.getElementById("rightDomain").prepend(textArea);
    }
}



const mvCode = {
    isSwitchUsedSet: function (switchId, item) {
        return isUsedSwitch(item) && this._isIdInItemScope(switchId, item);

        function isUsedSwitch(item) {
            return item.code === 121;
        }
    },
    isVariableUsedSet: function (variableId, item) {
        return isUsedVariable(item) && this._isIdInItemScope(variableId, item);

        function isUsedVariable(item) {
            return item.code === 122;
        }
    },
    _isIdInItemScope: function (id, item) {
        if (id === item.parameters[0]) return true;
        if (id > item.parameters[0] && id <= item.parameters[1]) return true;
        return false;
    },
    isSwitchUsedIf: function (switchId, item) {
        return item.code === 111 && item.parameters[0] === 0 && item.parameters[1] === switchId;
    },
    isVariableUsedIf: function (variableId, item) {
        return item.code === 111 && item.parameters[0] === 1 && isMatch();

        function isMatch() {
            return isCompareWith() || isComparedBy();
        }
        function isCompareWith() {
            return item.parameters[1] === variableId;
        }
        function isComparedBy() {
            return item.parameters[2] === 1 && item.parameters[3] === variableId;
        }
    }
}

class MyVar {
    constructor(id, name) {
        this._id = id;
        this._name = name;
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
}

class MyMap {
    constructor(aMap, mapNum) {
        this._aMap = aMap;
        this._mapNum = mapNum;
    }

    get mapNum() {
        return this._mapNum;
    }

    findSwitch(switchId) {
        return {
            conditions: this._findSwitchUsedEventConditions(switchId),
            events: this._findSwitchUsedEvent(switchId)
        };
    }
    findVariable(variableId) {
        return {
            conditions: this._findVariableUsedEventConditions(variableId),
            events: this._findVariableUsedEvent(variableId)
        };
    }

    _findSwitchUsedEvent(switchId) {
        const result = [];
        this._aMap.events.forEach(event => {
            if (!event) return;
            event.pages.forEach((page, pageId) => {
                let foundItemIds = [];
                page.list.forEach((item, itemId) => {
                    if (mvCode.isSwitchUsedSet(switchId, item)) {
                        foundItemIds.push(itemId);
                    }
                    if (mvCode.isSwitchUsedIf(switchId, item)) {
                        foundItemIds.push(itemId);
                    }
                });
                if (foundItemIds.length === 0) return;
                result.push({
                    id: switchId,
                    eventName: event.name,
                    eventX: event.x,
                    eventY: event.y,
                    pageId: pageId,
                    rowIds: foundItemIds
                });
            });
        });
        return result;
    }
    _findVariableUsedEvent(variableId) {
        const result = [];
        this._aMap.events.forEach(event => {
            if (!event) return;
            event.pages.forEach((page, pageId) => {
                let foundItemIds = [];
                page.list.forEach((item, itemId) => {
                    if (mvCode.isVariableUsedSet(variableId, item)) {
                        foundItemIds.push(itemId);
                    }
                    if (mvCode.isVariableUsedIf(variableId, item)) {
                        foundItemIds.push(itemId);
                    }
                });
                if (foundItemIds.length === 0) return;
                result.push({
                    id: variableId,
                    eventName: event.name,
                    eventX: event.x,
                    eventY: event.y,
                    pageId: pageId,
                    rowIds: foundItemIds
                });
            });
        });
        return result;
    }

    _findSwitchUsedEventConditions(switchId) {
        const result = [];
        this._aMap.events.forEach(event => {
            if (!event) return;
            event.pages.forEach((page, pageId) => {
                if (this._isPageUseConditionSwitch(page, switchId)) {
                    result.push({
                        id: switchId,
                        eventName: event.name,
                        eventX: event.x,
                        eventY: event.y,
                        pageId: pageId
                    });
                }
            });
        });
        return result;
    }
    _findVariableUsedEventConditions(variableId) {
        const result = [];
        this._aMap.events.forEach(event => {
            if (!event) return;
            event.pages.forEach((page, pageId) => {
                if (this._isPageUseConditionVariable(page, variableId)) {
                    result.push({
                        id: variableId,
                        eventName: event.name,
                        eventX: event.x,
                        eventY: event.y,
                        pageId: pageId
                    });
                }
            });
        });
        return result;
    }
    _isPageUseConditionSwitch(page, switchId) {
        return (page.conditions.switch1Valid === true && page.conditions.switch1Id === switchId)
            || (page.conditions.switch2Valid === true && page.conditions.switch2Id === switchId);
    }
    _isPageUseConditionVariable(page, variableId) {
        return page.conditions.variableValid === true && page.conditions.variableId === variableId;
    }
}



class MyCommonEvent {
    constructor(aEvents) {
        this._aEvents = aEvents;
    }
    findSwitch(switchId) {
        return {
            conditions: this._findSwitchConditions(switchId),
            events: this._findSwitch(switchId)
        };
    }
    findVariable(variableId) {
        return this._findVariable(variableId);
    }

    _findSwitchConditions(switchId) {
        const result = [];
        this._aEvents.forEach((event, eventId) => {
            if (!event) return;
            if (event.switchId === switchId && event.trigger > 0) {
                result.push({
                    id: switchId,
                    eventId: eventId,
                    eventName: event.name
                });
            }
        });
        return result;
    }

    _findSwitch(switchId) {
        const result = [];
        this._aEvents.forEach((event, eventId) => {
            if (!event) return;
            let foundRows = [];
            event.list.forEach((v, k) => {
                if (mvCode.isSwitchUsedSet(switchId, v)) {
                    foundRows.push(k);
                }
                if (mvCode.isSwitchUsedIf(switchId, v)) {
                    foundRows.push(k);
                }
            });
            if (foundRows.length === 0) return;
            result.push({
                id: switchId,
                eventId: eventId,
                eventName: event.name,
                rowIds: foundRows
            });
        });
        return result;
    }
    _findVariable(variableId) {
        const result = [];
        this._aEvents.forEach((event, eventId) => {
            if (!event) return;
            let foundRows = [];
            event.list.forEach((v, k) => {
                if (mvCode.isVariableUsedSet(variableId, v)) {
                    foundRows.push(k);
                }
                if (mvCode.isVariableUsedIf(variableId, v)) {
                    foundRows.push(k);
                }
            });
            if (foundRows.length === 0) return;
            result.push({
                id: variableId,
                eventId: eventId,
                eventName: event.name,
                rowIds: foundRows
            });
        });
        return result;
    }
}



const myQuery = {
    _data: {
        switches: [],
        variables: []
    },
    _queried: {
        switches: [],
        variables: []
    },
    getSwitchs: function () {
        return this._queried.switches;
    },
    getVariables: function () {
        return this._queried.variables;
    },
    reset: function (jsonData) {
        this._data.switches = jsonData.switches;
        this._data.variables = jsonData.variables;
        this._queried.switches = [];
        this._queried.variables = [];
    },
    getId: function (id) {
        if (this._getById(this._data.switches, id)) {
            this._queried.switches.unshift(this._getById(this._data.switches, id));
        }
        if (this._getById(this._data.variables, id)) {
            this._queried.variables.unshift(this._getById(this._data.variables, id));
        }
    },
    search: function (q) {
        this._queried.switches = this._findVals(this._data.switches, q).concat(this._queried.switches);
        this._queried.variables = this._findVals(this._data.variables, q).concat(this._queried.variables);
    },
    _isNumber: function (x) {
        return !isNaN(Number(x));
    },
    _findVals: function (ary, q) {
        const result = [];
        ary.forEach((v, k) => {
            if (v.indexOf(q) !== -1) result.push(new MyVar(k, v));
        });
        return result;
    },
    _getById: function (ary, id) {
        if (!this._isNumber(id)) return null;
        if (!ary[Number(id)]) return null;
        return new MyVar(Number(id), ary[Number(id)]);
    }
};


const myMapQuery = {
    _data: {
        loadedMaps: [],
        foundMaps: [],
        mapInfos: []
    },
    load: function () {
        this._data.loadedMaps = [];
        this._data.foundMaps = [];
        let mapInfoFileId = -1;
        for (let i = 0; i < document.getElementById("jsons").files.length; i++) {
            let fileName = document.getElementById("jsons").files[i].name.toLowerCase();
            if (fileName.substring(0, 3) === "map"
                && !isNaN(Number(fileName.substring(3, 6)))) {
                this._data.foundMaps.push({
                    fileId: i,
                    mapNum: Number(fileName.substring(3, 6))
                });
            }
            if (fileName === "mapinfos.json") {
                mapInfoFileId = i;
            }
        }
        this.loadMapInfos(mapInfoFileId);
    },
    loadMapInfos: function (mapInfoFileId) {
        if (mapInfoFileId === -1) {
            this.loadMaps();
            return;
        }
        let reader = new FileReader();
        reader.onload = function (event) {
            myMapQuery._data.mapInfos = (JSON.parse(event.target.result));
            myMapQuery.loadMaps();
        }
        reader.readAsText(document.getElementById("jsons").files[mapInfoFileId]);
    },
    loadMaps: function () {
        if (this._data.loadedMaps.length >= this._data.foundMaps.length) {
            return;
        }
        let reader = new FileReader();
        reader.onload = function (event) {
            myMapQuery._data.loadedMaps.push(new MyMap(JSON.parse(event.target.result), myMapQuery._data.foundMaps[myMapQuery._data.loadedMaps.length].mapNum));
            myMapQuery.loadMaps();
        }
        reader.readAsText(document.getElementById("jsons").files[this._data.foundMaps[this._data.loadedMaps.length].fileId]);
    },
    findSwitchId: function (switchId) {
        const result = [];
        this._data.loadedMaps.forEach((map) => {
            if (map.findSwitch(switchId).conditions.length > 0 ||
                map.findSwitch(switchId).events.length > 0) {
                result.push(map.findSwitch(switchId));
                if (this._data.mapInfos) {
                    result[result.length - 1].mapName = this._data.mapInfos[map.mapNum].name;
                }

            }
        });
        return result;
    },
    findVariableId: function (variableId) {
        const result = [];
        this._data.loadedMaps.forEach((map) => {
            if (map.findVariable(variableId).conditions.length > 0 ||
                map.findVariable(variableId).events.length > 0) {
                result.push(map.findVariable(variableId));
                if (this._data.mapInfos) {
                    result[result.length - 1].mapName = this._data.mapInfos[map.mapNum].name;
                }
            }
        });
        return result;
    }
}


const myCommonEventQuery = {
    _data: {
        events: {}
    },
    load: function () {
        let commonEventsFileId = -1;
        for (let i = 0; i < document.getElementById("jsons").files.length; i++) {
            if (document.getElementById("jsons")
                .files[i].name.toLowerCase() === "commonevents.json") {
                commonEventsFileId = i;
                break;
            }
        }
        if (commonEventsFileId === -1) {
            this._data.events = new MyCommonEvent([]);
            return;
        }

        let reader = new FileReader();
        reader.onload = function (event) {
            myCommonEventQuery._data.events = new MyCommonEvent(JSON.parse(event.target.result));
        }
        reader.readAsText(document.getElementById("jsons").files[commonEventsFileId]);
    },
    findSwitchId: function (switchId) {
        return this._data.events.findSwitch(switchId);
    },
    findVariableId: function (variableId) {
        return this._data.events.findVariable(variableId);
    }
}