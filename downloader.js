const {
  QMainWindow,
  QWidget,
  QLabel,
  FlexLayout,
  QPushButton,
  QLineEdit,
  QPlainTextEdit,
  QMessageBox,
  ButtonRole,
} = require("@nodegui/nodegui");
const fs = require("fs");
const ytdl = require("ytdl-core");

const win = new QMainWindow();
win.setWindowTitle("Downloader");
win.setFixedSize(230, 500);

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const title = new QLabel();
title.setObjectName("title");
title.setText("yt downloader");

const editor = new QPlainTextEdit();
editor.setInlineStyle(`
    border: 1px solid green;
    flex: 1;
    min-width: 200;
    height:17px;
`);

const instruction = new QLabel();
instruction.setObjectName("instrukcja");
instruction.setText("Past your video url below");

const dir = "./downloads";

const msgFailed = new QMessageBox();
msgFailed.setText("incorrect url");
msgFailed.setWindowTitle("Error");
const accept = new QPushButton();
accept.setText("ok");
msgFailed.addButton(accept, ButtonRole.AcceptRole);

const msgWork = new QMessageBox();
msgWork.setText("video downloaded");
msgWork.setWindowTitle("info");
const ok = new QPushButton();
ok.setText("ok");
msgWork.addButton(accept, ButtonRole.AcceptRole);

const buttonMp4 = new QPushButton();
buttonMp4.setText("Download mp4");
buttonMp4.addEventListener("clicked", () => {
  let url = editor.toPlainText();
  if (fs.existsSync(dir)) {
    console.log("Directory exists!");
    console.log(url);
    downloadMp4(url);
  } else {
    console.log("Directory not found.");
    fs.mkdir(dir, (err) => {
      if (err) {
        throw err;
      }
      console.log("Directory is created.");
      downloadMp4(url);
    });
  }
});
buttonMp4.setInlineStyle(`background-color: "blue"; align-items:
"flex-end"; padding: 30px;`);

//webm
const buttonWebm = new QPushButton();
buttonWebm.setText("Download webm");
buttonWebm.addEventListener("clicked", () => {
  let url = editor.toPlainText();
  if (fs.existsSync(dir)) {
    console.log("Directory exists!");
    console.log(url);
    downloadWebm(url);
  } else {
    console.log("Directory not found.");
    fs.mkdir(dir, (err) => {
      if (err) {
        throw err;
      }
      console.log("Directory is created.");
      downloadWebm(url);
    });
  }
});
buttonWebm.setInlineStyle(`background-color: #4A442d; align-items:
"flex-end"; padding: 30px;`);
function downloadMp4(url) {
  if (ytdl.validateURL(url) === true) {
    ytdl.getInfo(url).then((info) => {
      console.log("title:", info.videoDetails.title);
      let parseInfo = info.videoDetails.title.replace(`/`, "");
      ytdl(url, { format: "mp4" }).pipe(
        fs.createWriteStream(`./downloads/${parseInfo}.mp4`)
      );
      msgWork.exec();
    });
  } else {
    msgFailed.exec();
  }
}

function downloadWebm(url) {
  if (ytdl.validateURL(url) === true) {
    ytdl.getInfo(url).then((info) => {
      console.log("title:", info.videoDetails.title);
      let parseInfo = info.videoDetails.title.replace(`/`, "");
      ytdl(url, { format: "webm" }).pipe(
        fs.createWriteStream(`./downloads/${parseInfo}.webm`)
      );
      msgWork.exec();
    });
  } else {
    msgFailed.exec();
  }
}
rootLayout.addWidget(title);
rootLayout.addWidget(instruction);
rootLayout.addWidget(editor);
rootLayout.addWidget(buttonMp4);
rootLayout.addWidget(buttonWebm);
win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
     *{
        padding: 0px;
     }
     #myroot{
        background-color: #CAF7E2;
     }
     #title{     
        flex: 1;
        qproperty-alignment: 'AlignHCenter';
        font-size: 26px;
        font-weight: bold;
        color:#386150;
     }
     #instrukcja{
        flex: 1;
        qproperty-alignment: 'AlignHCenter';
        font-size: 12px;
        font-weight: bold;
        color:#386150;
     }

    `
);
win.show();

global.win = win;
