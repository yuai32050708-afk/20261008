// ==============================
// p5.js 響應式選擇題測驗系統
// ==============================

// 宣告原始題目資料。
const originalQuestions = [
  {
    // 設定第一題題目。
    question: "下列哪一個函式可以建立 p5.js 畫布？",

    // 設定第一題選項。
    options: [
      "createCanvas()",
      "makeCanvas()",
      "newCanvas()",
      "canvasCreate()"
    ],

    // 設定正確答案索引值。
    answer: 0
  },
  {
    // 設定第二題題目。
    question: "下列哪一個函式會在 p5.js 程式開始時執行一次？",

    // 設定第二題選項。
    options: [
      "loop()",
      "setup()",
      "start()",
      "begin()"
    ],

    // 設定正確答案索引值。
    answer: 1
  },
  {
    // 設定第三題題目。
    question: "下列哪一個函式會持續重複執行，用來繪圖或製作動畫？",

    // 設定第三題選項。
    options: [
      "repeat()",
      "animation()",
      "draw()",
      "update()"
    ],

    // 設定正確答案索引值。
    answer: 2
  },
  {
    // 設定第四題題目。
    question: "下列哪一個函式可以設定畫布背景顏色？",

    // 設定第四題選項。
    options: [
      "background()",
      "colorBackground()",
      "bgColor()",
      "setBackground()"
    ],

    // 設定正確答案索引值。
    answer: 0
  },
  {
    // 設定第五題題目。
    question: "下列哪一個函式可以畫出橢圓形或圓形？",

    // 設定第五題選項。
    options: [
      "circle()",
      "round()",
      "ellipse()",
      "drawCircle()"
    ],

    // 設定正確答案索引值。
    answer: 2
  }
];

// 宣告目前使用中的題目陣列。
let quizQuestions = [];

// 宣告目前題目索引值。
let currentQuestion = 0;

// 宣告答對題數。
let correctCount = 0;

// 宣告使用者選取的選項索引值。
let selectedOption = -1;

// 宣告目前題目是否已回答。
let hasAnswered = false;

// 宣告是否顯示結果頁。
let showResult = false;

// 宣告測驗是否已經完成初始化。
let quizInitialized = false;

// 宣告 p5.js 畫布物件。
let quizCanvas;

// 宣告響應式版面資料。
let layout = {};

// 設定中文字型。
const chineseFont =
  "Noto Sans TC, Microsoft JhengHei, PingFang TC, Arial, sans-serif";

// 設定畫面顏色。
const COLORS = {
  // 設定頁面背景色。
  background: "#f7f7fb",

  // 設定主要文字色。
  mainText: "#273043",

  // 設定次要文字色。
  secondaryText: "#667085",

  // 設定一般選項色。
  option: "#ffffff",

  // 設定滑鼠移入選項色。
  optionHover: "#eef4ff",

  // 設定正確選項色。
  correct: "#caffbf",

  // 設定錯誤選項色。
  wrong: "#ffadad",

  // 設定按鈕色。
  button: "#6c63ff",

  // 設定按鈕滑入色。
  buttonHover: "#554ddb",

  // 設定按鈕文字色。
  buttonText: "#ffffff"
};

// p5.js 初始化函式。
function setup() {
  // 建立符合視窗大小的畫布。
  quizCanvas = createCanvas(windowWidth, windowHeight);

  // 設定畫布像素密度，避免部分裝置顯示異常。
  pixelDensity(1);

  // 設定中文字型。
  textFont(chineseFont);

  // 設定文字水平置中與垂直置中。
  textAlign(CENTER, CENTER);

  // 設定矩形使用中心點作為繪製基準。
  rectMode(CENTER);

  // 移除圖形外框。
  noStroke();

  // 安全設定畫布的觸控樣式。
  if (
    quizCanvas &&
    quizCanvas.elt &&
    quizCanvas.elt.style
  ) {
    // 禁止瀏覽器對畫布執行預設觸控滑動。
    quizCanvas.elt.style.touchAction = "none";

    // 禁止選取畫布內容。
    quizCanvas.elt.style.userSelect = "none";
  }

  // 計算響應式版面。
  calculateLayout();

  // 初始化測驗資料。
  resetQuiz();
}

// p5.js 主要繪圖函式。
function draw() {
  // 繪製背景色。
  background(COLORS.background);

  // 確認測驗資料已正確初始化。
  if (ensureQuizReady() === false) {
    // 顯示初始化錯誤訊息。
    drawQuizUnavailable();

    // 停止本次繪圖。
    return;
  }

  // 判斷是否顯示結果頁。
  if (showResult === true) {
    // 繪製結果頁面。
    drawResultPage();
  } else {
    // 繪製答題頁面。
    drawQuizPage();
  }
}

// 判斷題目資料是否有效。
function isValidQuestion(questionData) {
  // 檢查題目是否為有效物件。
  if (!questionData || typeof questionData !== "object") {
    // 回傳無效。
    return false;
  }

  // 檢查題目文字是否存在。
  if (typeof questionData.question !== "string") {
    // 回傳無效。
    return false;
  }

  // 檢查選項是否為陣列。
  if (!Array.isArray(questionData.options)) {
    // 回傳無效。
    return false;
  }

  // 檢查是否剛好有四個選項。
  if (questionData.options.length !== 4) {
    // 回傳無效。
    return false;
  }

  // 檢查正確答案索引值是否為數字。
  if (typeof questionData.answer !== "number") {
    // 回傳無效。
    return false;
  }

  // 檢查正確答案索引值是否在有效範圍內。
  if (
    questionData.answer < 0 ||
    questionData.answer >= questionData.options.length
  ) {
    // 回傳無效。
    return false;
  }

  // 所有資料檢查通過。
  return true;
}

// 確認測驗資料已準備完成。
function ensureQuizReady() {
  // 檢查題目陣列是否有效。
  if (!Array.isArray(quizQuestions)) {
    // 回傳無效。
    return false;
  }

  // 檢查題目數量是否正確。
  if (quizQuestions.length !== originalQuestions.length) {
    // 回傳無效。
    return false;
  }

  // 檢查目前題目索引值是否有效。
  if (
    currentQuestion < 0 ||
    currentQuestion >= quizQuestions.length
  ) {
    // 回傳無效。
    return false;
  }

  // 檢查目前題目資料是否有效。
  if (
    isValidQuestion(quizQuestions[currentQuestion]) === false
  ) {
    // 回傳無效。
    return false;
  }

  // 設定測驗初始化完成。
  quizInitialized = true;

  // 回傳有效。
  return true;
}

// 顯示測驗資料錯誤訊息。
function drawQuizUnavailable() {
  // 設定主要文字顏色。
  fill(COLORS.mainText);

  // 設定錯誤訊息文字大小。
  textSize(20);

  // 顯示錯誤訊息。
  text(
    "測驗資料初始化中，請稍候再試。",
    width / 2,
    height / 2,
    width - 40,
    80
  );
}

// 計算響應式版面。
function calculateLayout() {
  // 取得目前畫布寬度。
  const currentWidth = width;

  // 取得目前畫布高度。
  const currentHeight = height;

  // 判斷是否為小螢幕。
  const isSmallScreen = currentWidth < 600;

  // 判斷是否為非常小的螢幕。
  const isVerySmallScreen = currentWidth < 400;

  // 判斷目前是否為橫向畫面。
  const isLandscape = currentWidth > currentHeight;

  // 判斷目前是否為低高度畫面。
  const isLowHeight = currentHeight < 520;

  // 設定畫面左右邊距。
  const sideMargin = isVerySmallScreen
    ? 14
    : isSmallScreen
      ? 20
      : 40;

  // 計算內容最大寬度。
  const contentWidth = min(
    currentWidth - sideMargin * 2,
    900
  );

  // 設定標題文字大小。
  const titleSize = isVerySmallScreen
    ? 21
    : isSmallScreen
      ? 25
      : min(36, currentWidth * 0.055);

  // 設定題目文字大小。
  const questionSize = isVerySmallScreen
    ? 16
    : isSmallScreen
      ? 19
      : min(28, currentWidth * 0.042);

  // 設定選項文字大小。
  const optionSize = isVerySmallScreen
    ? 13
    : isSmallScreen
      ? 15
      : min(21, currentWidth * 0.032);

  // 設定選項預設高度。
  const preferredOptionHeight = isVerySmallScreen
    ? 46
    : isSmallScreen
      ? 54
      : 70;

  // 設定選項預設間距。
  const preferredOptionGap = isVerySmallScreen
    ? 6
    : isSmallScreen
      ? 8
      : 16;

  // 設定按鈕高度。
  const buttonHeight = isSmallScreen ? 48 : 64;

  // 設定底部邊距。
  const bottomMargin = isSmallScreen ? 12 : 18;

  // 設定底部按鈕保留區域。
  const bottomButtonArea =
    buttonHeight + bottomMargin + 18;

  // 設定畫面上方區域高度。
  const topArea =
    isLandscape && isSmallScreen ? 105 : 168;

  // 設定提示訊息區域高度。
  const messageArea =
    isLandscape && isSmallScreen ? 30 : 55;

  // 計算可提供給選項的高度。
  const availableOptionHeight = max(
    150,
    currentHeight -
      topArea -
      bottomButtonArea -
      messageArea
  );

  // 設定選項高度。
  let optionHeight = preferredOptionHeight;

  // 設定選項間距。
  let optionGap = preferredOptionGap;

  // 計算選項總高度。
  let totalOptionHeight =
    optionHeight * 4 + optionGap * 3;

  // 當選項總高度超出可用空間時縮小。
  if (totalOptionHeight > availableOptionHeight) {
    // 重新計算選項間距。
    optionGap = constrain(
      availableOptionHeight * 0.025,
      4,
      preferredOptionGap
    );

    // 重新計算選項高度。
    optionHeight =
      (availableOptionHeight - optionGap * 3) / 4;

    // 限制選項最小與最大高度。
    optionHeight = constrain(
      optionHeight,
      36,
      preferredOptionHeight
    );

    // 重新計算選項總高度。
    totalOptionHeight =
      optionHeight * 4 + optionGap * 3;
  }

  // 橫向低高度畫面進一步縮小。
  if (isLandscape === true && isLowHeight === true) {
    // 限制選項高度。
    optionHeight = min(optionHeight, 45);

    // 限制選項間距。
    optionGap = min(optionGap, 6);

    // 重新計算選項總高度。
    totalOptionHeight =
      optionHeight * 4 + optionGap * 3;
  }

  // 計算題目文字位置。
  const questionY =
    isLandscape && isSmallScreen
      ? 66
      : isSmallScreen
        ? 170
        : 210;

  // 計算選項第一個按鈕位置。
  const optionStartY =
    questionY +
    (isLandscape && isSmallScreen ? 42 : 66) +
    optionHeight / 2;

  // 計算下一題按鈕位置。
  const nextButtonY =
    currentHeight -
    buttonHeight / 2 -
    bottomMargin;

  // 計算重新測驗按鈕位置。
  const restartButtonY = min(
    currentHeight * 0.70,
    currentHeight -
      buttonHeight / 2 -
      bottomMargin
  );

  // 儲存響應式版面資料。
  layout = {
    // 儲存內容寬度。
    contentWidth: contentWidth,

    // 儲存標題文字大小。
    titleSize: titleSize,

    // 儲存題目文字大小。
    questionSize: questionSize,

    // 儲存選項文字大小。
    optionSize: optionSize,

    // 儲存選項高度。
    optionHeight: optionHeight,

    // 儲存選項間距。
    optionGap: optionGap,

    // 儲存選項水平位置。
    optionX: currentWidth / 2,

    // 儲存選項起始位置。
    optionStartY: optionStartY,

    // 儲存題目文字位置。
    questionY: questionY,

    // 儲存手機判斷結果。
    isSmallScreen: isSmallScreen,

    // 儲存橫向判斷結果。
    isLandscape: isLandscape,

    // 儲存下一題按鈕資料。
    nextButton: {
      // 設定按鈕水平位置。
      x: currentWidth / 2,

      // 設定按鈕垂直位置。
      y: nextButtonY,

      // 設定按鈕寬度。
      width: min(
        contentWidth,
        isSmallScreen ? 260 : 280
      ),

      // 設定按鈕高度。
      height: buttonHeight
    },

    // 儲存重新測驗按鈕資料。
    restartButton: {
      // 設定按鈕水平位置。
      x: currentWidth / 2,

      // 設定按鈕垂直位置。
      y: restartButtonY,

      // 設定按鈕寬度。
      width: min(
        contentWidth,
        isSmallScreen ? 280 : 300
      ),

      // 設定按鈕高度。
      height: buttonHeight
    }
  };
}

// 使用 Fisher-Yates 演算法打亂題目。
function shuffleQuestions() {
  // 從最後一題開始往前處理。
  for (
    let index = quizQuestions.length - 1;
    index > 0;
    index--
  ) {
    // 取得隨機索引值。
    const randomIndex = floor(random(index + 1));

    // 暫存目前題目。
    const temporaryQuestion = quizQuestions[index];

    // 交換題目位置。
    quizQuestions[index] = quizQuestions[randomIndex];

    // 放回暫存題目。
    quizQuestions[randomIndex] = temporaryQuestion;
  }
}

// 重新初始化測驗。
function resetQuiz() {
  // 複製原始題目資料。
  quizQuestions = originalQuestions.map((question) => {
    // 回傳複製後的題目物件。
    return {
      // 複製題目文字。
      question: question.question,

      // 複製選項陣列。
      options: [...question.options],

      // 複製正確答案索引。
      answer: question.answer
    };
  });

  // 將題目順序隨機排列。
  shuffleQuestions();

  // 回到第一題。
  currentQuestion = 0;

  // 將答對題數歸零。
  correctCount = 0;

  // 清除使用者選項。
  selectedOption = -1;

  // 設定尚未回答。
  hasAnswered = false;

  // 顯示答題頁。
  showResult = false;

  // 設定測驗初始化完成。
  quizInitialized = true;
}

// 繪製答題頁面。
function drawQuizPage() {
  // 取得目前題目。
  const questionData = quizQuestions[currentQuestion];

  // 再次確認題目有效。
  if (isValidQuestion(questionData) === false) {
    // 顯示錯誤訊息。
    drawQuizUnavailable();

    // 停止繪製。
    return;
  }

  // 設定標題文字顏色。
  fill(COLORS.mainText);

  // 設定標題文字大小。
  textSize(layout.titleSize);

  // 顯示標題。
  text(
    "p5.js 程式設計基礎測驗",
    width / 2,
    34
  );

  // 設定次要文字顏色。
  fill(COLORS.secondaryText);

  // 設定題數文字大小。
  textSize(layout.isSmallScreen ? 13 : 18);

  // 顯示目前題數。
  text(
    `第 ${currentQuestion + 1} 題 ／ 共 ${quizQuestions.length} 題`,
    width / 2,
    72
  );

  // 設定答對題數文字大小。
  textSize(layout.isSmallScreen ? 12 : 16);

  // 顯示答對題數。
  text(
    `目前答對：${correctCount} 題`,
    width / 2,
    96
  );

  // 設定題目文字顏色。
  fill(COLORS.mainText);

  // 設定題目文字大小。
  textSize(layout.questionSize);

  // 顯示題目並自動換行。
  text(
    questionData.question,
    width / 2,
    layout.questionY,
    layout.contentWidth,
    layout.isLandscape &&
      layout.isSmallScreen
      ? 52
      : 84
  );

  // 逐一繪製四個選項。
  for (
    let optionIndex = 0;
    optionIndex < questionData.options.length;
    optionIndex++
  ) {
    // 取得選項位置資料。
    const bounds = getOptionBounds(optionIndex);

    // 設定水平位移。
    let horizontalOffset = 0;

    // 設定垂直位移。
    let verticalOffset = 0;

    // 答題後才啟用動畫。
    if (hasAnswered === true) {
      // 正確選項上下跳動。
      if (optionIndex === questionData.answer) {
        verticalOffset =
          sin(frameCount * 0.12) * 7;
      }

      // 錯誤選項左右移動。
      if (
        optionIndex === selectedOption &&
        selectedOption !== questionData.answer
      ) {
        horizontalOffset =
          sin(frameCount * 0.18) * 9;
      }
    }

    // 計算實際繪製水平位置。
    const drawX = bounds.x + horizontalOffset;

    // 計算實際繪製垂直位置。
    const drawY = bounds.y + verticalOffset;

    // 取得選項背景顏色。
    const optionColor =
      getOptionColor(optionIndex);

    // 繪製選項按鈕。
    drawOptionButton(
      drawX,
      drawY,
      bounds.width,
      bounds.height,
      optionColor,
      questionData.options[optionIndex],
      optionIndex
    );
  }

  // 答題後顯示提示訊息。
  if (hasAnswered === true) {
    // 繪製答題提示。
    drawAnswerMessage(questionData);
  }

  // 繪製下一題按鈕。
  drawNextButton();
}

// 取得指定選項的位置。
function getOptionBounds(optionIndex) {
  // 計算選項垂直位置。
  const optionY =
    layout.optionStartY +
    optionIndex *
      (layout.optionHeight + layout.optionGap);

  // 回傳選項按鈕資料。
  return {
    // 設定水平位置。
    x: layout.optionX,

    // 設定垂直位置。
    y: optionY,

    // 設定寬度。
    width: layout.contentWidth,

    // 設定高度。
    height: layout.optionHeight
  };
}

// 取得選項背景顏色。
function getOptionColor(optionIndex) {
  // 取得目前題目資料。
  const questionData =
    quizQuestions[currentQuestion];

  // 尚未作答時顯示滑鼠移入效果。
  if (hasAnswered === false) {
    // 判斷滑鼠是否位於選項內。
    if (isMouseOverOption(optionIndex)) {
      // 回傳滑入顏色。
      return COLORS.optionHover;
    }

    // 回傳一般顏色。
    return COLORS.option;
  }

  // 正確答案使用淡綠色。
  if (optionIndex === questionData.answer) {
    // 回傳正確顏色。
    return COLORS.correct;
  }

  // 使用者選錯的選項使用淡紅色。
  if (
    optionIndex === selectedOption &&
    selectedOption !== questionData.answer
  ) {
    // 回傳錯誤顏色。
    return COLORS.wrong;
  }

  // 其他選項使用白色。
  return COLORS.option;
}

// 繪製單一選項按鈕。
function drawOptionButton(
  x,
  y,
  buttonWidth,
  buttonHeight,
  buttonColor,
  label,
  index
) {
  // 設定選項背景色。
  fill(buttonColor);

  // 計算圓角大小。
  const radius = min(14, buttonHeight * 0.25);

  // 繪製圓角矩形。
  rect(
    x,
    y,
    buttonWidth,
    buttonHeight,
    radius
  );

  // 設定文字顏色。
  fill(COLORS.mainText);

  // 設定響應式文字大小。
  textSize(layout.optionSize);

  // 設定文字內距。
  const textPadding =
    layout.isSmallScreen ? 10 : 16;

  // 建立選項標籤。
  const optionLabel =
    `${String.fromCharCode(65 + index)}. ${label}`;

  // 讓文字在按鈕中自動換行。
  text(
    optionLabel,
    x,
    y,
    buttonWidth - textPadding * 2,
    buttonHeight - 6
  );
}

// 繪製答題結果提示。
function drawAnswerMessage(questionData) {
  // 宣告提示文字。
  let message = "";

  // 判斷使用者是否答對。
  if (selectedOption === questionData.answer) {
    // 設定答對訊息。
    message = "答對了！繼續挑戰下一題吧。";
  } else {
    // 設定答錯訊息。
    message =
      `答錯了！正確答案是：${String.fromCharCode(
        65 + questionData.answer
      )}. ${questionData.options[questionData.answer]}`;
  }

  // 設定提示文字顏色。
  fill(COLORS.mainText);

  // 設定提示文字大小。
  textSize(layout.isSmallScreen ? 12 : 17);

  // 計算提示文字位置。
  const messageY =
    layout.nextButton.y -
    layout.nextButton.height / 2 -
    (layout.isSmallScreen ? 20 : 28);

  // 顯示提示訊息。
  text(
    message,
    width / 2,
    messageY,
    layout.contentWidth,
    layout.isSmallScreen ? 32 : 48
  );
}

// 繪製下一題按鈕。
function drawNextButton() {
  // 取得下一題按鈕資料。
  const button = layout.nextButton;

  // 判斷滑鼠是否位於按鈕內。
  if (isMouseOverNextButton()) {
    // 使用滑入顏色。
    fill(COLORS.buttonHover);
  } else {
    // 使用一般顏色。
    fill(COLORS.button);
  }

  // 繪製按鈕。
  rect(
    button.x,
    button.y,
    button.width,
    button.height,
    16
  );

  // 設定按鈕文字顏色。
  fill(COLORS.buttonText);

  // 設定按鈕文字大小。
  textSize(layout.isSmallScreen ? 16 : 20);

  // 判斷是否為最後一題。
  if (
    currentQuestion ===
    quizQuestions.length - 1
  ) {
    // 顯示查看結果。
    text(
      "查看測驗結果",
      button.x,
      button.y
    );
  } else {
    // 顯示下一題。
    text(
      "下一題",
      button.x,
      button.y
    );
  }
}

// 繪製測驗結果頁。
function drawResultPage() {
  // 設定標題顏色。
  fill(COLORS.mainText);

  // 設定標題文字大小。
  textSize(layout.isSmallScreen ? 30 : 42);

  // 顯示完成標題。
  text(
    "測驗完成！",
    width / 2,
    height * 0.20
  );

  // 設定成績文字大小。
  textSize(layout.isSmallScreen ? 23 : 34);

  // 顯示答對題數。
  text(
    `你答對了 ${correctCount} ／ ${quizQuestions.length} 題`,
    width / 2,
    height * 0.35,
    layout.contentWidth,
    60
  );

  // 計算正確率。
  const scorePercentage = round(
    correctCount /
      quizQuestions.length *
      100
  );

  // 設定正確率文字大小。
  textSize(layout.isSmallScreen ? 18 : 24);

  // 顯示正確率。
  text(
    `正確率：${scorePercentage}%`,
    width / 2,
    height * 0.45
  );

  // 宣告鼓勵訊息。
  let encouragement = "";

  // 依照分數設定鼓勵文字。
  if (scorePercentage === 100) {
    // 設定滿分訊息。
    encouragement =
      "太棒了！你已經熟悉 p5.js 基礎指令！";
  } else if (scorePercentage >= 60) {
    // 設定中等成績訊息。
    encouragement =
      "表現不錯！再多練習就會更熟悉！";
  } else {
    // 設定加油訊息。
    encouragement =
      "繼續加油，多練習幾次會越來越進步！";
  }

  // 設定鼓勵文字大小。
  textSize(layout.isSmallScreen ? 14 : 20);

  // 顯示鼓勵文字並自動換行。
  text(
    encouragement,
    width / 2,
    height * 0.54,
    layout.contentWidth,
    64
  );

  // 繪製重新測驗按鈕。
  drawRestartButton();
}

// 繪製重新測驗按鈕。
function drawRestartButton() {
  // 取得重新測驗按鈕資料。
  const button = layout.restartButton;

  // 判斷滑鼠是否位於按鈕內。
  if (isMouseOverRestartButton()) {
    // 使用滑入顏色。
    fill(COLORS.buttonHover);
  } else {
    // 使用一般顏色。
    fill(COLORS.button);
  }

  // 繪製重新測驗按鈕。
  rect(
    button.x,
    button.y,
    button.width,
    button.height,
    16
  );

  // 設定文字顏色。
  fill(COLORS.buttonText);

  // 設定文字大小。
  textSize(layout.isSmallScreen ? 16 : 20);

  // 顯示按鈕文字。
  text(
    "重新測驗",
    button.x,
    button.y
  );
}

// 判斷滑鼠是否位於選項範圍內。
function isMouseOverOption(optionIndex) {
  // 確認題目資料存在。
  if (ensureQuizReady() === false) {
    // 回傳無效。
    return false;
  }

  // 取得選項位置。
  const bounds = getOptionBounds(optionIndex);

  // 宣告水平動畫位移。
  let horizontalOffset = 0;

  // 宣告垂直動畫位移。
  let verticalOffset = 0;

  // 取得目前題目。
  const questionData =
    quizQuestions[currentQuestion];

  // 答題後同步計算動畫位置。
  if (hasAnswered === true) {
    // 正確選項上下移動。
    if (optionIndex === questionData.answer) {
      verticalOffset =
        sin(frameCount * 0.12) * 7;
    }

    // 錯誤選項左右移動。
    if (
      optionIndex === selectedOption &&
      selectedOption !== questionData.answer
    ) {
      horizontalOffset =
        sin(frameCount * 0.18) * 9;
    }
  }

  // 計算滑鼠水平距離。
  const distanceX = abs(
    mouseX - bounds.x - horizontalOffset
  );

  // 計算滑鼠垂直距離。
  const distanceY = abs(
    mouseY - bounds.y - verticalOffset
  );

  // 回傳滑鼠是否位於選項內。
  return (
    distanceX <= bounds.width / 2 &&
    distanceY <= bounds.height / 2
  );
}

// 判斷滑鼠是否位於下一題按鈕內。
function isMouseOverNextButton() {
  // 取得下一題按鈕資料。
  const button = layout.nextButton;

  // 計算滑鼠水平距離。
  const distanceX = abs(mouseX - button.x);

  // 計算滑鼠垂直距離。
  const distanceY = abs(mouseY - button.y);

  // 回傳滑鼠是否位於按鈕內。
  return (
    distanceX <= button.width / 2 &&
    distanceY <= button.height / 2
  );
}

// 判斷滑鼠是否位於重新測驗按鈕內。
function isMouseOverRestartButton() {
  // 取得重新測驗按鈕資料。
  const button = layout.restartButton;

  // 計算滑鼠水平距離。
  const distanceX = abs(mouseX - button.x);

  // 計算滑鼠垂直距離。
  const distanceY = abs(mouseY - button.y);

  // 回傳滑鼠是否位於按鈕內。
  return (
    distanceX <= button.width / 2 &&
    distanceY <= button.height / 2
  );
}

// 處理滑鼠按下事件。
function mousePressed() {
  // 確認測驗資料已初始化。
  if (ensureQuizReady() === false) {
    // 不處理無效的測驗資料。
    return false;
  }

  // 如果正在顯示結果頁。
  if (showResult === true) {
    // 判斷是否按下重新測驗。
    if (isMouseOverRestartButton()) {
      // 重新初始化並隨機排列題目。
      resetQuiz();
    }

    // 停止後續處理。
    return false;
  }

  // 取得目前題目資料。
  const questionData =
    quizQuestions[currentQuestion];

  // 確認目前題目有效。
  if (isValidQuestion(questionData) === false) {
    // 停止處理。
    return false;
  }

  // 尚未回答時處理選項點擊。
  if (hasAnswered === false) {
    // 逐一檢查所有選項。
    for (
      let optionIndex = 0;
      optionIndex < questionData.options.length;
      optionIndex++
    ) {
      // 判斷是否點擊選項。
      if (isMouseOverOption(optionIndex)) {
        // 記錄使用者選取的選項。
        selectedOption = optionIndex;

        // 設定目前題目已回答。
        hasAnswered = true;

        // 判斷使用者是否答對。
        if (
          selectedOption === questionData.answer
        ) {
          // 增加答對題數。
          correctCount++;
        }

        // 停止處理。
        return false;
      }
    }
  }

  // 判斷是否按下下一題按鈕。
  if (
    hasAnswered === true &&
    isMouseOverNextButton()
  ) {
    // 判斷是否為最後一題。
    if (
      currentQuestion ===
      quizQuestions.length - 1
    ) {
      // 顯示結果頁。
      showResult = true;
    } else {
      // 前往下一題。
      currentQuestion++;

      // 清除回答狀態。
      hasAnswered = false;

      // 清除選項狀態。
      selectedOption = -1;
    }
  }

  // 阻止瀏覽器預設觸控行為。
  return false;
}

// 處理觸控開始事件。
function touchStarted() {
  // 呼叫滑鼠事件處理觸控點擊。
  mousePressed();

  // 阻止瀏覽器預設觸控行為。
  return false;
}

// 當瀏覽器視窗尺寸改變時執行。
function windowResized() {
  // 重新調整畫布大小。
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算響應式版面。
  calculateLayout();
}