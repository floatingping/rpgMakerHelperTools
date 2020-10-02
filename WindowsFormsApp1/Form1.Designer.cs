namespace WindowsFormsApp1
{
    partial class Form1
    {
        /// <summary>
        /// 設計工具所需的變數。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清除任何使用中的資源。
        /// </summary>
        /// <param name="disposing">如果應該處置受控資源則為 true，否則為 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form 設計工具產生的程式碼

        /// <summary>
        /// 此為設計工具支援所需的方法 - 請勿使用程式碼編輯器修改
        /// 這個方法的內容。
        /// </summary>
        private void InitializeComponent()
        {
            this.TextBoxSrcBrowse = new System.Windows.Forms.TextBox();
            this.BtnSrcBrowse = new System.Windows.Forms.Button();
            this.TextBoxStartPosX = new System.Windows.Forms.TextBox();
            this.TextBoxStartPosY = new System.Windows.Forms.TextBox();
            this.TextBoxToPosX = new System.Windows.Forms.TextBox();
            this.TextBoxToPosY = new System.Windows.Forms.TextBox();
            this.TextBoxCopiedPosX = new System.Windows.Forms.TextBox();
            this.TextBoxCopiedPosY = new System.Windows.Forms.TextBox();
            this.BtnLoadSrc = new System.Windows.Forms.Button();
            this.BtnPaste = new System.Windows.Forms.Button();
            this.BtnUndo = new System.Windows.Forms.Button();
            this.BtnDestinationBrowse = new System.Windows.Forms.Button();
            this.TextBoxDestinationBrowse = new System.Windows.Forms.TextBox();
            this.BtnCopy = new System.Windows.Forms.Button();
            this.TextBoxCopyState = new System.Windows.Forms.TextBox();
            this.comboBox1 = new System.Windows.Forms.ComboBox();
            this.BtnPickAll = new System.Windows.Forms.Button();
            this.BtnPickNone = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.button1 = new System.Windows.Forms.Button();
            this.button2 = new System.Windows.Forms.Button();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.textBox2 = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.button3 = new System.Windows.Forms.Button();
            this.comboBox2 = new System.Windows.Forms.ComboBox();
            this.SuspendLayout();
            // 
            // TextBoxSrcBrowse
            // 
            this.TextBoxSrcBrowse.AllowDrop = true;
            this.TextBoxSrcBrowse.Location = new System.Drawing.Point(106, 12);
            this.TextBoxSrcBrowse.Name = "TextBoxSrcBrowse";
            this.TextBoxSrcBrowse.Size = new System.Drawing.Size(601, 22);
            this.TextBoxSrcBrowse.TabIndex = 1;
            this.TextBoxSrcBrowse.DragDrop += new System.Windows.Forms.DragEventHandler(this.MyDragDrop);
            this.TextBoxSrcBrowse.DragEnter += new System.Windows.Forms.DragEventHandler(this.MyDragEnter);
            // 
            // BtnSrcBrowse
            // 
            this.BtnSrcBrowse.Location = new System.Drawing.Point(12, 12);
            this.BtnSrcBrowse.Name = "BtnSrcBrowse";
            this.BtnSrcBrowse.Size = new System.Drawing.Size(75, 23);
            this.BtnSrcBrowse.TabIndex = 2;
            this.BtnSrcBrowse.Text = "Browse";
            this.BtnSrcBrowse.UseVisualStyleBackColor = true;
            this.BtnSrcBrowse.Click += new System.EventHandler(this.FileBrowse);
            // 
            // TextBoxStartPosX
            // 
            this.TextBoxStartPosX.Location = new System.Drawing.Point(12, 78);
            this.TextBoxStartPosX.Name = "TextBoxStartPosX";
            this.TextBoxStartPosX.Size = new System.Drawing.Size(100, 22);
            this.TextBoxStartPosX.TabIndex = 3;
            // 
            // TextBoxStartPosY
            // 
            this.TextBoxStartPosY.Location = new System.Drawing.Point(127, 78);
            this.TextBoxStartPosY.Name = "TextBoxStartPosY";
            this.TextBoxStartPosY.Size = new System.Drawing.Size(100, 22);
            this.TextBoxStartPosY.TabIndex = 4;
            // 
            // TextBoxToPosX
            // 
            this.TextBoxToPosX.Location = new System.Drawing.Point(12, 135);
            this.TextBoxToPosX.Name = "TextBoxToPosX";
            this.TextBoxToPosX.Size = new System.Drawing.Size(100, 22);
            this.TextBoxToPosX.TabIndex = 5;
            // 
            // TextBoxToPosY
            // 
            this.TextBoxToPosY.Location = new System.Drawing.Point(127, 135);
            this.TextBoxToPosY.Name = "TextBoxToPosY";
            this.TextBoxToPosY.Size = new System.Drawing.Size(100, 22);
            this.TextBoxToPosY.TabIndex = 6;
            // 
            // TextBoxCopiedPosX
            // 
            this.TextBoxCopiedPosX.Location = new System.Drawing.Point(389, 414);
            this.TextBoxCopiedPosX.Name = "TextBoxCopiedPosX";
            this.TextBoxCopiedPosX.Size = new System.Drawing.Size(100, 22);
            this.TextBoxCopiedPosX.TabIndex = 7;
            // 
            // TextBoxCopiedPosY
            // 
            this.TextBoxCopiedPosY.Location = new System.Drawing.Point(507, 414);
            this.TextBoxCopiedPosY.Name = "TextBoxCopiedPosY";
            this.TextBoxCopiedPosY.Size = new System.Drawing.Size(100, 22);
            this.TextBoxCopiedPosY.TabIndex = 8;
            // 
            // BtnLoadSrc
            // 
            this.BtnLoadSrc.Location = new System.Drawing.Point(713, 13);
            this.BtnLoadSrc.Name = "BtnLoadSrc";
            this.BtnLoadSrc.Size = new System.Drawing.Size(75, 22);
            this.BtnLoadSrc.TabIndex = 9;
            this.BtnLoadSrc.Text = "Load";
            this.BtnLoadSrc.UseVisualStyleBackColor = true;
            this.BtnLoadSrc.Click += new System.EventHandler(this.BtnLoadSrc_Click);
            // 
            // BtnPaste
            // 
            this.BtnPaste.Enabled = false;
            this.BtnPaste.Location = new System.Drawing.Point(620, 413);
            this.BtnPaste.Name = "BtnPaste";
            this.BtnPaste.Size = new System.Drawing.Size(75, 23);
            this.BtnPaste.TabIndex = 11;
            this.BtnPaste.Text = "Paste";
            this.BtnPaste.UseVisualStyleBackColor = true;
            this.BtnPaste.Click += new System.EventHandler(this.BtnPaste_Click);
            // 
            // BtnUndo
            // 
            this.BtnUndo.Enabled = false;
            this.BtnUndo.Location = new System.Drawing.Point(714, 413);
            this.BtnUndo.Name = "BtnUndo";
            this.BtnUndo.Size = new System.Drawing.Size(75, 23);
            this.BtnUndo.TabIndex = 12;
            this.BtnUndo.Text = "Undo";
            this.BtnUndo.UseVisualStyleBackColor = true;
            this.BtnUndo.Click += new System.EventHandler(this.BtnUndo_Click);
            // 
            // BtnDestinationBrowse
            // 
            this.BtnDestinationBrowse.Location = new System.Drawing.Point(251, 381);
            this.BtnDestinationBrowse.Name = "BtnDestinationBrowse";
            this.BtnDestinationBrowse.Size = new System.Drawing.Size(75, 23);
            this.BtnDestinationBrowse.TabIndex = 14;
            this.BtnDestinationBrowse.Text = "Browse";
            this.BtnDestinationBrowse.UseVisualStyleBackColor = true;
            this.BtnDestinationBrowse.Click += new System.EventHandler(this.FileBrowse);
            // 
            // TextBoxDestinationBrowse
            // 
            this.TextBoxDestinationBrowse.AllowDrop = true;
            this.TextBoxDestinationBrowse.Location = new System.Drawing.Point(332, 382);
            this.TextBoxDestinationBrowse.Name = "TextBoxDestinationBrowse";
            this.TextBoxDestinationBrowse.Size = new System.Drawing.Size(456, 22);
            this.TextBoxDestinationBrowse.TabIndex = 13;
            this.TextBoxDestinationBrowse.DragDrop += new System.Windows.Forms.DragEventHandler(this.MyDragDrop);
            this.TextBoxDestinationBrowse.DragEnter += new System.Windows.Forms.DragEventHandler(this.MyDragEnter);
            // 
            // BtnCopy
            // 
            this.BtnCopy.Enabled = false;
            this.BtnCopy.Location = new System.Drawing.Point(21, 168);
            this.BtnCopy.Name = "BtnCopy";
            this.BtnCopy.Size = new System.Drawing.Size(195, 53);
            this.BtnCopy.TabIndex = 15;
            this.BtnCopy.Text = "Copy\r\nAll Tiles On All Layers";
            this.BtnCopy.UseVisualStyleBackColor = true;
            this.BtnCopy.Click += new System.EventHandler(this.BtnCopy_Click);
            // 
            // TextBoxCopyState
            // 
            this.TextBoxCopyState.BackColor = System.Drawing.SystemColors.InactiveCaption;
            this.TextBoxCopyState.Location = new System.Drawing.Point(238, 41);
            this.TextBoxCopyState.Multiline = true;
            this.TextBoxCopyState.Name = "TextBoxCopyState";
            this.TextBoxCopyState.ReadOnly = true;
            this.TextBoxCopyState.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.TextBoxCopyState.Size = new System.Drawing.Size(550, 335);
            this.TextBoxCopyState.TabIndex = 16;
            // 
            // comboBox1
            // 
            this.comboBox1.Enabled = false;
            this.comboBox1.FormattingEnabled = true;
            this.comboBox1.Items.AddRange(new object[] {
            "Layer1",
            "Layer2",
            "Layer3",
            "Layer4"});
            this.comboBox1.Location = new System.Drawing.Point(21, 233);
            this.comboBox1.Name = "comboBox1";
            this.comboBox1.Size = new System.Drawing.Size(195, 20);
            this.comboBox1.TabIndex = 17;
            this.comboBox1.SelectedIndexChanged += new System.EventHandler(this.comboBox1_SelectedIndexChanged);
            // 
            // BtnPickAll
            // 
            this.BtnPickAll.Enabled = false;
            this.BtnPickAll.Location = new System.Drawing.Point(21, 264);
            this.BtnPickAll.Name = "BtnPickAll";
            this.BtnPickAll.Size = new System.Drawing.Size(195, 23);
            this.BtnPickAll.TabIndex = 18;
            this.BtnPickAll.Text = "PickAll";
            this.BtnPickAll.UseVisualStyleBackColor = true;
            this.BtnPickAll.Click += new System.EventHandler(this.BtnPickAll_Click);
            // 
            // BtnPickNone
            // 
            this.BtnPickNone.Enabled = false;
            this.BtnPickNone.Location = new System.Drawing.Point(21, 296);
            this.BtnPickNone.Name = "BtnPickNone";
            this.BtnPickNone.Size = new System.Drawing.Size(195, 23);
            this.BtnPickNone.TabIndex = 19;
            this.BtnPickNone.Text = "PickNone";
            this.BtnPickNone.UseVisualStyleBackColor = true;
            this.BtnPickNone.Click += new System.EventHandler(this.BtnPickNone_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(19, 58);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(93, 12);
            this.label1.TabIndex = 20;
            this.label1.Text = "ScopeStartPos(x,y)";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(19, 112);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(91, 12);
            this.label2.TabIndex = 21;
            this.label2.Text = "ScopeEndPos(x,y)";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(255, 421);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(125, 12);
            this.label3.TabIndex = 22;
            this.label3.Text = "Paste to map and pos(x,y)";
            // 
            // button1
            // 
            this.button1.Enabled = false;
            this.button1.Location = new System.Drawing.Point(23, 422);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(75, 23);
            this.button1.TabIndex = 23;
            this.button1.Text = "Use";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.BtnATileUse_Click);
            // 
            // button2
            // 
            this.button2.Enabled = false;
            this.button2.Location = new System.Drawing.Point(128, 423);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(75, 23);
            this.button2.TabIndex = 24;
            this.button2.Text = "UnUse";
            this.button2.UseVisualStyleBackColor = true;
            this.button2.Click += new System.EventHandler(this.BtnATileUnuse_Click);
            // 
            // textBox1
            // 
            this.textBox1.Enabled = false;
            this.textBox1.Location = new System.Drawing.Point(12, 396);
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(100, 22);
            this.textBox1.TabIndex = 25;
            // 
            // textBox2
            // 
            this.textBox2.Enabled = false;
            this.textBox2.Location = new System.Drawing.Point(118, 396);
            this.textBox2.Name = "textBox2";
            this.textBox2.Size = new System.Drawing.Size(100, 22);
            this.textBox2.TabIndex = 26;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(56, 379);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(141, 12);
            this.label4.TabIndex = 27;
            this.label4.Text = "Update One Tile(idxX, idxY)";
            // 
            // button3
            // 
            this.button3.Enabled = false;
            this.button3.Location = new System.Drawing.Point(31, 338);
            this.button3.Name = "button3";
            this.button3.Size = new System.Drawing.Size(75, 23);
            this.button3.TabIndex = 28;
            this.button3.Text = "Copy From";
            this.button3.UseVisualStyleBackColor = true;
            this.button3.Click += new System.EventHandler(this.BtnCopyFromALayer_Click);
            // 
            // comboBox2
            // 
            this.comboBox2.Enabled = false;
            this.comboBox2.FormattingEnabled = true;
            this.comboBox2.Items.AddRange(new object[] {
            "Layer1",
            "Layer2",
            "Layer3",
            "Layer4"});
            this.comboBox2.Location = new System.Drawing.Point(111, 339);
            this.comboBox2.Name = "comboBox2";
            this.comboBox2.Size = new System.Drawing.Size(97, 20);
            this.comboBox2.TabIndex = 29;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.comboBox2);
            this.Controls.Add(this.button3);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.textBox2);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.button2);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.BtnPickNone);
            this.Controls.Add(this.BtnPickAll);
            this.Controls.Add(this.comboBox1);
            this.Controls.Add(this.TextBoxCopyState);
            this.Controls.Add(this.BtnCopy);
            this.Controls.Add(this.BtnDestinationBrowse);
            this.Controls.Add(this.TextBoxDestinationBrowse);
            this.Controls.Add(this.BtnUndo);
            this.Controls.Add(this.BtnPaste);
            this.Controls.Add(this.BtnLoadSrc);
            this.Controls.Add(this.TextBoxCopiedPosY);
            this.Controls.Add(this.TextBoxCopiedPosX);
            this.Controls.Add(this.TextBoxToPosY);
            this.Controls.Add(this.TextBoxToPosX);
            this.Controls.Add(this.TextBoxStartPosY);
            this.Controls.Add(this.TextBoxStartPosX);
            this.Controls.Add(this.BtnSrcBrowse);
            this.Controls.Add(this.TextBoxSrcBrowse);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.TextBox TextBoxSrcBrowse;
        private System.Windows.Forms.Button BtnSrcBrowse;
        private System.Windows.Forms.TextBox TextBoxStartPosX;
        private System.Windows.Forms.TextBox TextBoxStartPosY;
        private System.Windows.Forms.TextBox TextBoxToPosX;
        private System.Windows.Forms.TextBox TextBoxToPosY;
        private System.Windows.Forms.TextBox TextBoxCopiedPosX;
        private System.Windows.Forms.TextBox TextBoxCopiedPosY;
        private System.Windows.Forms.Button BtnLoadSrc;
        private System.Windows.Forms.Button BtnPaste;
        private System.Windows.Forms.Button BtnUndo;
        private System.Windows.Forms.Button BtnDestinationBrowse;
        private System.Windows.Forms.TextBox TextBoxDestinationBrowse;
        private System.Windows.Forms.Button BtnCopy;
        private System.Windows.Forms.TextBox TextBoxCopyState;
        private System.Windows.Forms.ComboBox comboBox1;
        private System.Windows.Forms.Button BtnPickAll;
        private System.Windows.Forms.Button BtnPickNone;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Button button2;
        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.TextBox textBox2;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Button button3;
        private System.Windows.Forms.ComboBox comboBox2;
    }
}

