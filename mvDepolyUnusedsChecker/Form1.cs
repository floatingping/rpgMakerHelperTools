using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace mvDepolyUnusedsChecker
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            
        }

        private void BtnSrc_Click(object sender, EventArgs e)
        {
            FolderBrowserDialog path = new FolderBrowserDialog();
            path.ShowDialog();
            textBox1.Text = path.SelectedPath;
        }

        private void BtnDeploy_Click(object sender, EventArgs e)
        {
            FolderBrowserDialog path = new FolderBrowserDialog();
            path.ShowDialog();
            textBox2.Text = path.SelectedPath;
        }

        private void button1_Click(object sender, EventArgs e)
        {
            textBox3.Text = "";
            string title = Text;
            Text += " (converting...)";

            BtnSrc.Enabled = false;
            BtnDeploy.Enabled = false;
            button1.Enabled = false;

            try
            {
                string tempUsedRecordFileName = "pictures.txt";
                var read = new Lib.MyRead();
                read.Record(textBox1.Text, tempUsedRecordFileName);
                var check = new Lib.MyCheck();
                check.RecordDifference(tempUsedRecordFileName,
                    textBox2.Text);
                foreach(var el in check.Diff)
                {
                    textBox3.Text += el + "\r\n";
                }


                MessageBox.Show("finish!");
            }
            catch(Exception ex)
            {
                MessageBox.Show(ex.Message, "error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }

            Text = title;
            BtnSrc.Enabled = true;
            BtnDeploy.Enabled = true;
            button1.Enabled = true;
        }
    }
}
