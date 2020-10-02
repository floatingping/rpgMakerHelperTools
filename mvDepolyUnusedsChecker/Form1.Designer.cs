namespace mvDepolyUnusedsChecker
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
            this.BtnSrc = new System.Windows.Forms.Button();
            this.BtnDeploy = new System.Windows.Forms.Button();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.textBox2 = new System.Windows.Forms.TextBox();
            this.textBox3 = new System.Windows.Forms.TextBox();
            this.button1 = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // BtnSrc
            // 
            this.BtnSrc.Location = new System.Drawing.Point(13, 13);
            this.BtnSrc.Name = "BtnSrc";
            this.BtnSrc.Size = new System.Drawing.Size(135, 23);
            this.BtnSrc.TabIndex = 0;
            this.BtnSrc.Text = "source data folder";
            this.BtnSrc.UseVisualStyleBackColor = true;
            this.BtnSrc.Click += new System.EventHandler(this.BtnSrc_Click);
            // 
            // BtnDeploy
            // 
            this.BtnDeploy.Location = new System.Drawing.Point(13, 50);
            this.BtnDeploy.Name = "BtnDeploy";
            this.BtnDeploy.Size = new System.Drawing.Size(135, 23);
            this.BtnDeploy.TabIndex = 1;
            this.BtnDeploy.Text = "deploy pictures folder";
            this.BtnDeploy.UseVisualStyleBackColor = true;
            this.BtnDeploy.Click += new System.EventHandler(this.BtnDeploy_Click);
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(176, 15);
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(502, 22);
            this.textBox1.TabIndex = 2;
            this.textBox1.Text = "C:\\Users\\fping\\Documents\\Games\\Project2\\data";
            // 
            // textBox2
            // 
            this.textBox2.Location = new System.Drawing.Point(176, 52);
            this.textBox2.Name = "textBox2";
            this.textBox2.Size = new System.Drawing.Size(502, 22);
            this.textBox2.TabIndex = 3;
            this.textBox2.Text = "C:\\Users\\fping\\Documents\\Output\\Project1\\www\\img\\pictures";
            // 
            // textBox3
            // 
            this.textBox3.BackColor = System.Drawing.SystemColors.ActiveCaption;
            this.textBox3.Location = new System.Drawing.Point(13, 80);
            this.textBox3.Multiline = true;
            this.textBox3.Name = "textBox3";
            this.textBox3.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.textBox3.Size = new System.Drawing.Size(775, 358);
            this.textBox3.TabIndex = 4;
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(684, 15);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(104, 58);
            this.button1.TabIndex = 5;
            this.button1.Text = "Get Difference";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.textBox3);
            this.Controls.Add(this.textBox2);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.BtnDeploy);
            this.Controls.Add(this.BtnSrc);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button BtnSrc;
        private System.Windows.Forms.Button BtnDeploy;
        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.TextBox textBox2;
        private System.Windows.Forms.TextBox textBox3;
        private System.Windows.Forms.Button button1;
    }
}

