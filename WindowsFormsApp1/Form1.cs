using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace WindowsFormsApp1
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            //TextBoxSrcBrowse.Text = @"C:\Users\fping\Documents\RMMZ\Project1\data\Map003.json";
            //TextBoxStartPosX.Text = "2";
            //TextBoxStartPosY.Text = "3";
            //TextBoxToPosX.Text = "4";
            //TextBoxToPosY.Text = "5";

            //TextBoxDestinationBrowse.Text = @"C:\Users\fping\Documents\RMMZ\Project1\data\Map003.json";
            //TextBoxCopiedPosX.Text = "9";
            //TextBoxCopiedPosY.Text = "7";
        }

        private MapCopier.CopiedTiles _copyFrom;
        private readonly Stack<Undos> _undos = new Stack<Undos>();

        

        private void BtnLoadSrc_Click(object sender, EventArgs e)
        {
            try
            {
                MapCopier.Json json = new MapCopier.Json(
                File.ReadAllText(TextBoxSrcBrowse.Text));

                _copyFrom = new MapCopier.CopiedTiles(json, 4);


                BtnLoadSrc.Text = "ReLoad";
                BtnCopy.Enabled = true;
            }
            catch (Exception ex)
            {
                ShowError(ex.Message);
            }
            UpdateViews();
        }

        private void BtnCopy_Click(object sender, EventArgs e)
        {
            try
            {
                _copyFrom.Reset(
                    Convert.ToInt32(TextBoxStartPosX.Text),
                    Convert.ToInt32(TextBoxStartPosY.Text),
                    Convert.ToInt32(TextBoxToPosX.Text),
                    Convert.ToInt32(TextBoxToPosY.Text)
                );

                comboBox1.SelectedIndex = 0;
                comboBox1.Enabled = true;
                BtnPickAll.Enabled = true;
                BtnPickNone.Enabled = true;

                button1.Enabled = true;
                button2.Enabled = true;
                button3.Enabled = true;
                textBox1.Enabled = true;
                textBox2.Enabled = true;
                comboBox2.Enabled = true;
            }
            catch (Exception ex)
            {
                ShowError(ex.Message);
            }
            UpdateViews();
        }




        private void BtnPaste_Click(object sender, EventArgs e)
        {
            try
            {
                MapCopier.Json json = new MapCopier.Json(
                File.ReadAllText(TextBoxDestinationBrowse.Text));

                var updated = new MapCopier.Updated(json);
                string savedData = json.Serialize();

                File.WriteAllText(TextBoxDestinationBrowse.Text,
                    updated.Update(
                        _copyFrom.GetData(),
                        Convert.ToInt32(TextBoxCopiedPosX.Text),
                        Convert.ToInt32(TextBoxCopiedPosY.Text))
                );

                PushUndo(new Undos(TextBoxDestinationBrowse.Text, savedData));
            }
            catch (Exception ex)
            {
                ShowError(ex.Message);
            }
            UpdateViews();
        }

        private void BtnUndo_Click(object sender, EventArgs e)
        {
            try
            {
                RunUndo();
            }
            catch (Exception ex)
            {
                ShowError(ex.Message);
            }
            UpdateViews();
        }

        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            try
            {
                ShowLayerStatus(GetLayerIdx());
                UpdateViews();
            }
            catch (Exception ex)
            {
                ShowError(ex.Message);
            }
        }

        private void BtnPickAll_Click(object sender, EventArgs e)
        {
            try
            {
                _copyFrom.UseAllOnLayer(GetLayerIdx());
                UpdateViews();
            }
            catch (Exception ex)
            {
                ShowError(ex.Message);
            }
        }

        private void BtnPickNone_Click(object sender, EventArgs e)
        {
            try
            {
                _copyFrom.UseNoneOnLayer(GetLayerIdx());
                UpdateViews();
            }
            catch (Exception ex)
            {
                ShowError(ex.Message);
            }
        }

        private void BtnCopyFromALayer_Click(object sender, EventArgs e)
        {
            try
            {
                if (comboBox2.SelectedItem == null) return;

                _copyFrom.CopyFromLayer(
                    GetLayerIdx(comboBox2.SelectedItem.ToString())
                    , GetLayerIdx());
                UpdateViews();
            }
            catch (Exception ex)
            {
                ShowError(ex.Message);
            }
        }

        private void BtnATileUse_Click(object sender, EventArgs e)
        {
            try
            {
                _copyFrom.Use(
                    GetLayerIdx(),
                    Convert.ToInt32(textBox1.Text),
                    Convert.ToInt32(textBox2.Text));
                UpdateViews();
            }
            catch (Exception ex)
            {
                ShowError(ex.Message);
            }
            
        }

        private void BtnATileUnuse_Click(object sender, EventArgs e)
        {
            try
            {
                _copyFrom.UnUse(
                    GetLayerIdx(),
                    Convert.ToInt32(textBox1.Text),
                    Convert.ToInt32(textBox2.Text));
                UpdateViews();
            }
            catch (Exception ex)
            {
                ShowError(ex.Message);
            }
        }


        private void UpdateViews()
        {
            BtnPaste.Enabled = _copyFrom.HasCopiedData();
            BtnUndo.Enabled = _undos.Count() != 0;
            ShowLayerStatus(GetLayerIdx());
        }



        private void FileBrowse(object sender, EventArgs e)
        {
            try
            {
                OpenFileDialog dialog = new OpenFileDialog();
                dialog.Filter = "(*.json)|*.json";
                if (dialog.ShowDialog() == DialogResult.OK)
                {
                    if (sender == BtnSrcBrowse) TextBoxSrcBrowse.Text = dialog.FileName;
                    if (sender == BtnDestinationBrowse) TextBoxDestinationBrowse.Text = dialog.FileName;
                }
            }
            catch (Exception ex)
            {
                ShowError(ex.Message);
            }
        }
        private void MyDragEnter(object sender, DragEventArgs e)
        {
            try
            {
                if (e.Data.GetDataPresent(DataFormats.FileDrop))
                {
                    e.Effect = DragDropEffects.All;
                }
                else
                {
                    e.Effect = DragDropEffects.None;
                }
            }
            catch (Exception ex)
            {
                ShowError(ex.Message);
            }
        }

        private void MyDragDrop(object sender, DragEventArgs e)
        {
            try
            {
                string[] filepaths = (string[])e.Data.GetData(DataFormats.FileDrop);
                if (filepaths.Length == 0) return;

                if (sender == TextBoxSrcBrowse) TextBoxSrcBrowse.Text = filepaths[0];
                if (sender == TextBoxDestinationBrowse) TextBoxDestinationBrowse.Text = filepaths[0];
            }
            catch (Exception ex)
            {
                ShowError(ex.Message);
            }
        }





        private class Undos
        {
            public Undos(string filePath, string fileContent)
            {
                FilePath = filePath;
                FileContent = fileContent;
            }
            public string FilePath { get; }
            public string FileContent { get; }
        }

        private void PushUndo(Undos undo)
        {
            _undos.Push(undo);
        }
        private void RunUndo()
        {
            var pop = _undos.Pop();
            File.WriteAllText(pop.FilePath, pop.FileContent);
        }

        
        private void ShowError(string info)
        {
            MessageBox.Show(info, "error",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
        }

        

        private void ShowLayerStatus(int layerIdx)
        {
            TextBoxCopyState.Text = $"Layer[{layerIdx+1}]:\r\n";
            if (!_copyFrom.HasCopiedData()) return;

            for(int i=0; i< _copyFrom.GetData()[layerIdx][0].Count(); i++)
            {
                TextBoxCopyState.Text += $" {i}";
            }
            TextBoxCopyState.Text += "\r\n";

            int row = 0;
            foreach (var yData in _copyFrom.GetData()[layerIdx])
            {
                TextBoxCopyState.Text += $"{row} ";
                foreach (var x in yData)
                {
                    if (x == -1)
                    {
                        TextBoxCopyState.Text += "X ";
                    }
                    else
                    {
                        TextBoxCopyState.Text += "O ";
                    }
                }
                TextBoxCopyState.Text += "\r\n";
                row++;
            }

            TextBoxCopyState.Text += "After checking the lay's tiles status, you can directly paste.";
        }

        private int GetLayerIdx()
        {
            if (comboBox1.SelectedItem == null) return 0;

            return GetLayerIdx(comboBox1.SelectedItem.ToString());
        }

        private int GetLayerIdx(string desc)
        {
            switch (desc)
            {
                case "Layer1": return 0;
                case "Layer2": return 1;
                case "Layer3": return 2;
                case "Layer4": return 3;
                default: return 0;
            }
        }


    }
}
