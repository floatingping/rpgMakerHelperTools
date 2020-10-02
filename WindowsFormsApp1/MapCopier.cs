using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace WindowsFormsApp1
{

    partial class MapCopier
    {
        public class Json
        {
            public Json(string jsonString)
            {
                _data = JObject.Parse(jsonString);
            }

            private readonly dynamic _data;

            public int Height => _data["height"];
            public int Width => _data["width"];

            public List<int> GetTilesData()
            {
                var result = new List<int> { };
                for (int i = 0; i < _data["data"].Count; i++)
                {
                    result.Add((int)_data["data"][i]);
                }
                return result;
            }

            public void Update(int idx, int val)
            {
                _data["data"][idx] = val;
            }

            public string Serialize()
            {
                return JsonConvert.SerializeObject(_data);
            }
        }

        public class MapInfo
        {
            public MapInfo(List<int> srcData, int mapWidth, int mapHeight)
            {
                _srcData = srcData;
                Width = mapWidth;
                Height = mapHeight;
            }
            private readonly List<int> _srcData;
            public int Width { get; }
            public int Height { get; }

            private int LayerLength => Width * Height;

            public int GetIndex(int idxlayer, int x, int y)
            {
                return idxlayer * LayerLength + y * Width + x;
            }

            public int GetValue(int idxLayer, int x, int y)
            {
                return _srcData[GetIndex(idxLayer, x, y)];
            }
        }

        public class PickedScope
        {
            public PickedScope(int mapWidth, int mapHeight, int x0, int y0, int x1, int y1)
            {
                if (mapWidth < 0 || mapHeight < 0
                    || x0 < 0 || y0 < 0
                    || x1 < 0 || y1 < 0)
                    throw new Exception("illegal map parameters");

                X0 = (x0 <= x1) ? x0 : x1;
                if (X0 >= mapWidth) throw new Exception("illegal map x parameters");
                X1 = (x0 + x1 - X0 >= mapWidth) ? mapWidth - 1 : x0 + x1 - X0;

                Y0 = (y0 <= y1) ? y0 : y1;
                if (Y0 >= mapHeight) throw new Exception("illegal map y parameters");
                Y1 = (y0 + y1 - Y0 >= mapHeight) ? mapHeight - 1 : y0 + y1 - Y0;
            }

            public int X0 { get; }
            public int Y0 { get; }
            public int X1 { get; }
            public int Y1 { get; }
            public int IncreasedWidth => X1 - X0;
            public int IncreasedHeight => Y1 - Y0;
        }
    }

    partial class MapCopier
    {
        public class CopiedTiles : MapInfo
        {
            public CopiedTiles(
                Json json,
                int layersCounts) : base(json.GetTilesData(), json.Width, json.Height)
            {
                _layersCounts = layersCounts;
            }

            private readonly int _layersCounts;
            private PickedScope _usedScope;
            private LayersUsedTilesValue _layersUsedTiles;


            private class LayersUsedTilesValue
            {
                public LayersUsedTilesValue(List<List<List<int>>> layersDataValue)
                {
                    _layerDatas = new List<UsedTilesValue> { };
                    for (int idxLayer = 0; idxLayer < layersDataValue.Count(); idxLayer++)
                    {
                        _layerDatas.Add(new UsedTilesValue(layersDataValue[idxLayer]));
                    }
                }
                private readonly List<UsedTilesValue> _layerDatas;
                public void UnUse(int idxLayer, int x, int y)
                {
                    _layerDatas[idxLayer].UnUse(x, y);
                }
                public void Use(int idxLayer, int x, int y)
                {
                    _layerDatas[idxLayer].Use(x, y);
                }

                public bool IsUsed(int idxLayer, int x, int y)
                {
                    return _layerDatas[idxLayer].IsUsed(x, y);
                }

                public void CopyLayerFrom(int idxLayerFrom, int idxLayerTo)
                {
                    var xy = _layerDatas[idxLayerFrom].GetData();
                    for (int y = 0; y < xy.Count(); y++)
                    {
                        for (int x = 0; x < xy[y].Count(); x++)
                        {
                            if(IsUsed(idxLayerFrom, x, y))
                            {
                                Use(idxLayerTo, x, y);
                            }
                            else
                            {
                                UnUse(idxLayerTo, x, y);
                            }
                        }
                    }
                }

                public void SetAllOnLayer(int idxLayer, bool val)
                {
                    _layerDatas[idxLayer].SetAll(val);
                }

                public List<List<List<int>>> GetData()
                {
                    return _layerDatas
                        .Select(layerData => layerData.GetData())
                        .ToList();
                }
                private class UsedTilesValue
                {
                    public UsedTilesValue(List<List<int>> data)
                    {
                        _data = new List<List<TileInfo>> { };
                        foreach (var yData in data)
                        {
                            var y = new List<TileInfo> { };
                            foreach (var xData in yData)
                            {
                                y.Add(new TileInfo()
                                {
                                    IsUsed = true,
                                    Value = xData
                                });
                            }
                            _data.Add(y);
                        }

                    }

                    private readonly List<List<TileInfo>> _data;
                    private readonly int _unUsedValue = -1;

                    public void UnUse(int x, int y)
                    {
                        _data[y][x].IsUsed = false;
                    }
                    public void Use(int x, int y)
                    {
                        _data[y][x].IsUsed = true;
                    }

                    public bool IsUsed(int x, int y)
                    {
                        return _data[y][x].IsUsed;
                    }

                    public void SetAll(bool val)
                    {
                        foreach (var yData in _data)
                        {
                            foreach (var x in yData)
                            {
                                x.IsUsed = val;
                            }
                        }
                    }

                    public List<List<int>> GetData()
                    {
                        return _data
                            .Select(yData => GetConvertedValue(yData))
                            .ToList();
                    }

                    private int GetConvertedValue(TileInfo tile)
                    {
                        return tile.IsUsed ? tile.Value : _unUsedValue;
                    }
                    private List<int> GetConvertedValue(List<TileInfo> tiles)
                    {
                        return tiles.Select(tile => GetConvertedValue(tile)).ToList();
                    }

                    private class TileInfo
                    {
                        public bool IsUsed { get; set; }
                        public int Value { get; set; }
                    }
                }
            }

            public bool HasCopiedData()
            {
                return _usedScope != null && _layersUsedTiles != null;
            }

            public void Reset(int x0, int y0, int x1, int y1)
            {
                _usedScope = new PickedScope(Width, Height,
                 x0, y0, x1, y1);

                _layersUsedTiles = new LayersUsedTilesValue(
                    GetUsedTilesValue(_layersCounts, _usedScope));
            }

            private List<List<List<int>>> GetUsedTilesValue(int layersCounts, PickedScope scope)
            {
                var result = new List<List<List<int>>> { };

                for (int ly = 0; ly < layersCounts; ly++)
                {
                    var layerData = new List<List<int>> { };
                    for (int h = 0; h <= scope.IncreasedHeight; h++)
                    {
                        var hData = new List<int> { };
                        for (int w = 0; w <= scope.IncreasedWidth; w++)
                        {
                            hData.Add(GetValue(ly, scope.X0 + w, scope.Y0 + h));
                        }
                        layerData.Add(hData);
                    }
                    result.Add(layerData);
                }
                return result;
            }

            public void UnUse(int idxLayer, int x, int y)
            {
                _layersUsedTiles.UnUse(idxLayer, x, y);
            }
            public void Use(int idxLayer, int x, int y)
            {
                _layersUsedTiles.Use(idxLayer, x, y);
            }

            public void CopyFromLayer(int idxLayerFrom, int idxLayerTo)
            {
                _layersUsedTiles.CopyLayerFrom(idxLayerFrom, idxLayerTo);
            }

            public void UseAllOnLayer(int idxLayer)
            {
                _layersUsedTiles.SetAllOnLayer(idxLayer, true);
            }
            public void UseNoneOnLayer(int idxLayer)
            {
                _layersUsedTiles.SetAllOnLayer(idxLayer, false);
            }

            public List<List<List<int>>> GetData()
            {
                return _layersUsedTiles.GetData();
            }
        }


        public class Updated : MapInfo
        {
            public Updated(Json json)
                : base(json.GetTilesData(), json.Width, json.Height)
            {
                _jsonData = json;
            }

            private readonly Json _jsonData;



            public string Update(List<List<List<int>>> from, int toX, int toY)
            {
                var scope = new PickedScope(
                    Width, Height, toX, toY,
                    toX + from[0][0].Count() - 1,
                    toY + from[0].Count() - 1);


                for (int ly = 0; ly < from.Count(); ly++)
                {
                    for (int y = 0; y < from[ly].Count(); y++)
                    {
                        for (int x = 0; x < from[ly][y].Count(); x++)
                        {
                            if (from[ly][y][x] != -1)
                            {
                                if (scope.X0 + x >= Width ||
                                    scope.Y0 + y >= Height) continue;

                                _jsonData.Update(
                                    GetIndex(ly,
                                    scope.X0 + x,
                                    scope.Y0 + y),
                                from[ly][y][x]);
                            }
                        }
                    }
                }
                return _jsonData.Serialize();
            }
        }

    }
}
