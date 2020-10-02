using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace mvDepolyUnusedsChecker
{
    class Lib
    {
        public static void RecordError(string msg, string fliePath = "error.log")
        {
            if (File.Exists(fliePath))
            {
                File.ReadAllBytes(fliePath); //avoid virus report
            }
            using (StreamWriter file = new StreamWriter(fliePath, true))
            {
                file.WriteLine("[" + DateTime.Now.ToString() + "] " + msg);
            }
        }

        public class MyCheck
        {
            private readonly Dictionary<string, bool> _usedPictures = new Dictionary<string, bool> { };
            private readonly Dictionary<string, bool> _deployedPictures = new Dictionary<string, bool> { };
            private readonly Encoding _utf8WithoutBOM = new UTF8Encoding(false, true);


            public List<string> Diff
            {
                get
                {
                    var result = new List<string> { };
                    foreach (var usedPictureName in _usedPictures.Keys)
                    {
                        if (!_deployedPictures.ContainsKey(usedPictureName))
                        {
                            result.Add(usedPictureName);
                        }
                    }
                    return result;
                }
            }

            public void RecordDifference(string fliePath, string deployDirectoryPath, string diff = "diff.txt")
            {
                FindUsedPictures(fliePath);
                FindDepolyedPictures(deployDirectoryPath);

                using (StreamWriter file = new StreamWriter(diff, false))
                {
                    try
                    {
                        foreach (var usedPictureName in Diff)
                        {
                            file.WriteLine(usedPictureName);
                        }
                    }
                    catch (Exception ex)
                    {
                        RecordError(ex.Message);
                    }
                }
            }

            private void FindUsedPictures(string fliePath)
            {
                using (StreamReader file = new StreamReader(fliePath, _utf8WithoutBOM))
                {
                    while (!file.EndOfStream)
                    {
                        try
                        {
                            string k = file.ReadLine();
                            if (!string.IsNullOrEmpty(k))
                            {
                                _usedPictures.Add(k, true);
                            }

                        }
                        catch (Exception ex)
                        {
                            RecordError(ex.Message);
                        }

                    }

                }
            }

            private void FindDepolyedPictures(string directoryPath)
            {
                foreach (var picturePath in Directory.GetFiles(directoryPath))
                {
                    string fileName = Path.GetFileNameWithoutExtension(picturePath);
                    if (!_deployedPictures.ContainsKey(fileName))
                    {
                        _deployedPictures.Add(fileName, true);
                    }

                }
            }
        }

        public class MyRead
        {
            private readonly Dictionary<string, bool> _foundPictures = new Dictionary<string, bool> { };
            private readonly Encoding _utf8WithoutBOM = new UTF8Encoding(false, true);
            private void GetFiles(string directoryPath)
            {
                var filePaths = Directory.GetFiles(directoryPath);
                if (filePaths.Length > 0)
                {
                    foreach (var filePath in filePaths)
                    {
                        try
                        {
                            var find = new MyFind(File.ReadAllText(filePath, _utf8WithoutBOM
                            ).Trim(new char[] { ' ', '\r', '\n', '\t' }));
                            foreach (var k in find.Result.Keys)
                            {
                                if (!_foundPictures.ContainsKey(k))
                                {
                                    _foundPictures.Add(k, true);
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            RecordError("file[" + filePath + "]:" +ex.Message);
                        }

                    }
                }
            }

            public void Record(string directoryPath, string fliePath)
            {
                GetFiles(directoryPath);
                if (File.Exists(fliePath))
                {
                    File.ReadAllBytes(fliePath); //avoid virus report
                }
                RecordFile(fliePath);
            }

            private void RecordFile(string fliePath)
            {
                using (StreamWriter file = new StreamWriter(fliePath, false))
                {
                    try
                    {
                        foreach (var pictureName in _foundPictures.Keys)
                        {
                            file.WriteLine(pictureName);
                        }
                    }
                    catch (Exception ex)
                    {
                        RecordError(ex.Message);
                    }

                }
            }


        }





        private class MyFind
        {
            public MyFind(string str)
            {
                _foundString = str;
            }

            private readonly string _foundString;
            private readonly string _firstKeyWord = "{\"code\":231";
            private readonly string _secondKeyWord = "\"parameters\":[";
            private readonly string _thirdKeyWord = ",\"";
            private readonly Dictionary<string, bool> _foundPictures = new Dictionary<string, bool> { };

            public Dictionary<string, bool> Result
            {
                get
                {
                    FindShowPictureFunction(0);
                    return _foundPictures;
                }
            }

            private void FindShowPictureFunction(int idx)
            {
                int newIdx = _foundString.IndexOf(_firstKeyWord, idx);
                if (newIdx != -1)
                {
                    FindParametersStart(newIdx + _firstKeyWord.Length);
                }
            }
            private void FindParametersStart(int idx)
            {
                int newIdx = _foundString.IndexOf(_secondKeyWord, idx);
                if (newIdx != -1)
                {
                    FindPictureValue(newIdx + _secondKeyWord.Length);
                }
            }
            private void FindPictureValue(int idx)
            {
                int newIdx = _foundString.IndexOf(_thirdKeyWord, idx);
                if (newIdx != -1)
                {
                    int valStartIdx = newIdx + _thirdKeyWord.Length;
                    int valEndIdx = _foundString.IndexOf("\"", valStartIdx) - 1;
                    string val = _foundString.Substring(valStartIdx, valEndIdx - valStartIdx + 1);
                    if (!_foundPictures.ContainsKey(val))
                    {
                        _foundPictures.Add(val, true);
                    }
                    FindShowPictureFunction(valEndIdx + 1 + 1);
                }
            }

        }


    }
}
