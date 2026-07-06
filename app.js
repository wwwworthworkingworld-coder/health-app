(function () {
  "use strict";

  var STORAGE_KEY = "healthlog_v1";
  var GOAL_KEY = "healthlog_goal_v1";

  // kcal: 100gあたりのカロリー / serving: 一般的な1食分の目安グラム / label: その目安の内容
  var FOOD_DB = {
    "白米": { kcal: 168, serving: 150, label: "茶碗1杯" },
    "玄米ご飯": { kcal: 165, serving: 150, label: "茶碗1杯" },
    "食パン": { kcal: 264, serving: 60, label: "6枚切り1枚" },
    "ロールパン": { kcal: 316, serving: 30, label: "1個" },
    "うどん(ゆで)": { kcal: 105, serving: 250, label: "1玉" },
    "そば(ゆで)": { kcal: 132, serving: 170, label: "1人前" },
    "スパゲッティ(ゆで)": { kcal: 150, serving: 240, label: "1人前" },
    "ラーメン(ゆで麺)": { kcal: 149, serving: 230, label: "1玉" },
    "中華麺(蒸し)": { kcal: 162, serving: 150, label: "1玉" },
    "もち": { kcal: 235, serving: 50, label: "1個" },
    "オートミール": { kcal: 380, serving: 30, label: "1食分(乾)" },
    "コーンフレーク": { kcal: 381, serving: 40, label: "1食分" },
    "鶏むね肉(皮なし)": { kcal: 116, serving: 100, label: "1食分" },
    "鶏むね肉(皮つき)": { kcal: 145, serving: 100, label: "1食分" },
    "鶏もも肉(皮なし)": { kcal: 127, serving: 100, label: "1食分" },
    "鶏もも肉(皮つき)": { kcal: 200, serving: 100, label: "1食分" },
    "鶏ささみ": { kcal: 105, serving: 50, label: "1本" },
    "鶏ひき肉": { kcal: 171, serving: 100, label: "1食分" },
    "豚バラ肉": { kcal: 386, serving: 100, label: "1食分" },
    "豚ロース肉": { kcal: 263, serving: 100, label: "1食分" },
    "豚ヒレ肉": { kcal: 118, serving: 100, label: "1食分" },
    "豚ひき肉": { kcal: 209, serving: 100, label: "1食分" },
    "牛バラ肉": { kcal: 371, serving: 100, label: "1食分" },
    "牛もも肉": { kcal: 182, serving: 100, label: "1食分" },
    "牛ひき肉": { kcal: 224, serving: 100, label: "1食分" },
    "ベーコン": { kcal: 400, serving: 20, label: "1枚" },
    "ウインナー": { kcal: 321, serving: 20, label: "1本" },
    "ハム": { kcal: 118, serving: 20, label: "1枚" },
    "鮭": { kcal: 133, serving: 80, label: "1切れ" },
    "サバ": { kcal: 202, serving: 80, label: "1切れ" },
    "マグロ赤身": { kcal: 125, serving: 80, label: "刺身5切れ" },
    "マグロトロ": { kcal: 344, serving: 80, label: "刺身5切れ" },
    "アジ": { kcal: 121, serving: 100, label: "1尾(可食部)" },
    "サンマ": { kcal: 287, serving: 100, label: "1尾(可食部)" },
    "エビ": { kcal: 82, serving: 15, label: "1尾" },
    "イカ": { kcal: 76, serving: 100, label: "1杯(可食部)" },
    "ツナ缶(油漬け)": { kcal: 265, serving: 70, label: "1缶" },
    "ツナ缶(水煮)": { kcal: 71, serving: 70, label: "1缶" },
    "卵": { kcal: 151, serving: 50, label: "1個" },
    "卵白": { kcal: 47, serving: 33, label: "1個分" },
    "卵黄": { kcal: 336, serving: 17, label: "1個分" },
    "牛乳": { kcal: 67, serving: 200, label: "コップ1杯" },
    "ヨーグルト(無糖)": { kcal: 62, serving: 100, label: "1個" },
    "チーズ": { kcal: 339, serving: 18, label: "スライス1枚" },
    "納豆": { kcal: 200, serving: 45, label: "1パック" },
    "豆腐(絹)": { kcal: 56, serving: 150, label: "1/2丁" },
    "豆腐(木綿)": { kcal: 72, serving: 150, label: "1/2丁" },
    "豆乳": { kcal: 46, serving: 200, label: "コップ1杯" },
    "キャベツ": { kcal: 23, serving: 50, label: "付け合わせ1皿" },
    "レタス": { kcal: 12, serving: 30, label: "葉2〜3枚" },
    "トマト": { kcal: 20, serving: 150, label: "1個" },
    "きゅうり": { kcal: 14, serving: 100, label: "1本" },
    "にんじん": { kcal: 39, serving: 50, label: "1/3本" },
    "じゃがいも": { kcal: 76, serving: 100, label: "1個" },
    "さつまいも": { kcal: 134, serving: 150, label: "1本" },
    "玉ねぎ": { kcal: 37, serving: 100, label: "中1/2個" },
    "ほうれん草": { kcal: 20, serving: 80, label: "1束の半分" },
    "ブロッコリー": { kcal: 33, serving: 80, label: "1/4株" },
    "なす": { kcal: 22, serving: 80, label: "1本" },
    "ピーマン": { kcal: 22, serving: 30, label: "1個" },
    "もやし": { kcal: 14, serving: 50, label: "1/4袋" },
    "大根": { kcal: 18, serving: 100, label: "輪切り2切れ" },
    "バナナ": { kcal: 86, serving: 100, label: "1本" },
    "りんご": { kcal: 57, serving: 250, label: "1個" },
    "みかん": { kcal: 49, serving: 100, label: "1個" },
    "ぶどう": { kcal: 59, serving: 100, label: "1房の一部" },
    "いちご": { kcal: 34, serving: 75, label: "5粒" },
    "キウイ": { kcal: 51, serving: 100, label: "1個" },
    "サラダ油": { kcal: 921, serving: 10, label: "大さじ1弱" },
    "マヨネーズ": { kcal: 703, serving: 12, label: "大さじ1" },
    "バター": { kcal: 745, serving: 10, label: "大さじ1弱" },
    "醤油": { kcal: 71, serving: 15, label: "大さじ1" },
    "味噌": { kcal: 192, serving: 18, label: "大さじ1" },
    "砂糖": { kcal: 384, serving: 9, label: "大さじ1" },
    "ケチャップ": { kcal: 119, serving: 15, label: "大さじ1" },
    "カレールウ": { kcal: 511, serving: 20, label: "1皿分" },
    "インスタントラーメン(乾麺)": { kcal: 448, serving: 85, label: "1食" },
    "ポテトチップス": { kcal: 554, serving: 60, label: "小袋1袋" },
    "チョコレート": { kcal: 550, serving: 50, label: "1/2枚" },
    "アイスクリーム": { kcal: 180, serving: 100, label: "カップ1個" },
    "唐揚げ": { kcal: 290, serving: 100, label: "3〜4個" },
    "天ぷら(えび)": { kcal: 233, serving: 60, label: "2尾" },
    "オムレツ": { kcal: 150, serving: 120, label: "卵2個分" },
    "味噌汁": { kcal: 40, serving: 180, label: "お椀1杯" },
    "牛丼": { kcal: 144, serving: 450, label: "並盛1杯" },
    "親子丼": { kcal: 140, serving: 500, label: "1杯" },
    "カツ丼": { kcal: 164, serving: 550, label: "1杯" },
    "天丼": { kcal: 156, serving: 480, label: "1杯" },
    "うな丼": { kcal: 175, serving: 400, label: "1杯" },
    "中華丼": { kcal: 120, serving: 500, label: "1杯" },
    "麻婆丼": { kcal: 150, serving: 500, label: "1杯" },
    "醤油ラーメン": { kcal: 120, serving: 500, label: "1杯" },
    "豚骨ラーメン": { kcal: 130, serving: 500, label: "1杯" },
    "味噌ラーメン": { kcal: 127, serving: 550, label: "1杯" },
    "つけ麺": { kcal: 144, serving: 450, label: "1人前" },
    "焼きそば": { kcal: 157, serving: 350, label: "1人前" },
    "かけうどん": { kcal: 70, serving: 500, label: "1杯" },
    "きつねうどん": { kcal: 80, serving: 500, label: "1杯" },
    "天ぷらうどん": { kcal: 91, serving: 550, label: "1杯" },
    "カレーライス": { kcal: 167, serving: 450, label: "1皿" },
    "カツカレー": { kcal: 190, serving: 500, label: "1皿" },
    "オムライス": { kcal: 186, serving: 350, label: "1皿" },
    "チャーハン": { kcal: 186, serving: 350, label: "1皿" },
    "おにぎり": { kcal: 180, serving: 100, label: "1個" },
    "生姜焼き定食": { kcal: 175, serving: 400, label: "1人前" },
    "から揚げ定食": { kcal: 178, serving: 450, label: "1人前" },
    "とんかつ定食": { kcal: 189, serving: 450, label: "1人前" },
    "ハンバーグ定食": { kcal: 188, serving: 400, label: "1人前" },
    "刺身定食": { kcal: 150, serving: 400, label: "1人前" },
    "焼き魚定食": { kcal: 138, serving: 400, label: "1人前" },
    "天ぷら定食": { kcal: 175, serving: 400, label: "1人前" },
    "麻婆豆腐定食": { kcal: 163, serving: 400, label: "1人前" },
    "エビチリ定食": { kcal: 150, serving: 400, label: "1人前" },
    "回鍋肉定食": { kcal: 175, serving: 400, label: "1人前" },
    "お好み焼き": { kcal: 183, serving: 300, label: "1枚" },
    "たこ焼き": { kcal: 175, serving: 200, label: "8個" },
    "餃子": { kcal: 200, serving: 150, label: "6個" },
    "ハンバーガー": { kcal: 217, serving: 230, label: "1個" },
    "チーズバーガー": { kcal: 220, serving: 250, label: "1個" },
    "サンドイッチ": { kcal: 200, serving: 200, label: "1食分" },
    "フライドポテト": { kcal: 300, serving: 150, label: "Mサイズ" },
    "ピザ": { kcal: 250, serving: 100, label: "1切れ" },
    "グラタン": { kcal: 150, serving: 300, label: "1皿" },
    "ビーフシチュー": { kcal: 117, serving: 300, label: "1皿" },
    "ビーフステーキ": { kcal: 267, serving: 150, label: "150g" },
    "コロッケ": { kcal: 188, serving: 80, label: "1個" },
    "エビフライ": { kcal: 200, serving: 50, label: "1尾" },
    "すき焼き": { kcal: 150, serving: 400, label: "1人前" },
    "しゃぶしゃぶ": { kcal: 113, serving: 400, label: "1人前" }
  };
  var FOOD_NAMES = Object.keys(FOOD_DB);

  // ---------- storage helpers ----------
  function loadAll() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.error("failed to load data", e);
      return {};
    }
  }

  function saveAll(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function loadGoal() {
    try {
      var raw = localStorage.getItem(GOAL_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveGoal(goal) {
    localStorage.setItem(GOAL_KEY, JSON.stringify(goal));
  }

  function todayStr() {
    var d = new Date();
    return formatDate(d);
  }

  function formatDate(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function formatDateLabel(dateStr) {
    var parts = dateStr.split("-");
    return parts[1] + "/" + parts[2];
  }

  var data = loadAll();
  var currentDate = todayStr();

  // ---------- tab navigation ----------
  var tabButtons = document.querySelectorAll(".nav-btn");
  var tabs = document.querySelectorAll(".tab");
  var pageTitle = document.getElementById("pageTitle");
  var titles = {
    "tab-record": "今日の記録",
    "tab-history": "履歴",
    "tab-graph": "グラフ",
    "tab-advice": "アドバイス",
    "tab-settings": "設定"
  };

  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-tab");
      tabButtons.forEach(function (b) { b.classList.toggle("active", b === btn); });
      tabs.forEach(function (t) { t.classList.toggle("active", t.id === target); });
      pageTitle.textContent = titles[target];
      if (target === "tab-history") renderHistory();
      if (target === "tab-graph") renderChart();
      if (target === "tab-advice") renderAdvice();
      if (target === "tab-settings") {
        var g = loadGoal();
        document.getElementById("targetWeightInput").value = g.targetWeight != null ? g.targetWeight : "";
      }
    });
  });

  document.getElementById("todayDate").textContent = todayStr();

  // ---------- record form ----------
  var recordDate = document.getElementById("recordDate");
  var weightInput = document.getElementById("weightInput");
  var bodyFatInput = document.getElementById("bodyFatInput");
  var sleepHoursInput = document.getElementById("sleepHoursInput");
  var sleepQualityInput = document.getElementById("sleepQualityInput");
  var stepsInput = document.getElementById("stepsInput");
  var memoInput = document.getElementById("memoInput");
  var MEAL_TYPES = ["breakfast", "lunch", "dinner"];
  var mealListEls = {
    breakfast: document.getElementById("mealList-breakfast"),
    lunch: document.getElementById("mealList-lunch"),
    dinner: document.getElementById("mealList-dinner")
  };
  var exerciseList = document.getElementById("exerciseList");
  var conditionPicker = document.getElementById("conditionPicker");
  var selectedCondition = null;

  recordDate.value = currentDate;

  recordDate.addEventListener("change", function () {
    currentDate = recordDate.value || todayStr();
    loadEntryIntoForm(currentDate);
  });

  conditionPicker.addEventListener("click", function (e) {
    var btn = e.target.closest(".mood-btn");
    if (!btn) return;
    selectedCondition = Number(btn.getAttribute("data-value"));
    Array.from(conditionPicker.children).forEach(function (b) {
      b.classList.toggle("selected", b === btn);
    });
  });

  function mealRowTemplate() {
    return document.getElementById("mealRowTemplate").content.cloneNode(true);
  }
  function exerciseRowTemplate() {
    return document.getElementById("exerciseRowTemplate").content.cloneNode(true);
  }

  function updateMealSubtotal(listEl) {
    var subtotalEl = document.getElementById("mealSubtotal-" + listEl.dataset.mealType);
    var rows = listEl.querySelectorAll(".entry-row");
    if (rows.length === 0) { subtotalEl.textContent = ""; return; }
    var total = Array.from(rows).reduce(function (sum, row) {
      return sum + (Number(row.querySelector(".entry-num").value) || 0);
    }, 0);
    subtotalEl.innerHTML = "小計：<b>" + total + "kcal</b>";
  }

  function addMealRow(listEl, name, grams, kcal) {
    var frag = mealRowTemplate();
    var wrapperEl = frag.querySelector(".meal-entry");
    var row = frag.querySelector(".entry-row");
    var nameInput = row.querySelector(".entry-name");
    var gramsInput = row.querySelector(".entry-num-small");
    var kcalInput = row.querySelector(".entry-num");
    var suggestList = row.querySelector(".suggest-list");
    var hintEl = wrapperEl.querySelector(".food-hint");

    nameInput.value = name || "";
    gramsInput.value = grams != null ? grams : "";
    kcalInput.value = kcal != null ? kcal : "";

    var initialMatch = FOOD_DB[(name || "").trim()];
    if (initialMatch != null && grams != null && kcal != null) {
      var initialComputed = Math.round((initialMatch.kcal * Number(grams)) / 100);
      row.dataset.manualKcal = initialComputed === Number(kcal) ? "false" : "true";
    } else {
      row.dataset.manualKcal = "true";
    }

    function updateHint() {
      var match = FOOD_DB[nameInput.value.trim()];
      if (match == null) {
        hintEl.textContent = "";
        hintEl.style.display = "none";
        return;
      }
      var g = Number(gramsInput.value);
      if (gramsInput.value !== "" && !isNaN(g)) {
        hintEl.textContent = nameInput.value.trim() + "：" + g + "gで" + Math.round((match.kcal * g) / 100) + "kcal（100gあたり" + match.kcal + "kcal）";
      } else {
        hintEl.textContent = nameInput.value.trim() + "：100gあたり" + match.kcal + "kcal（目安 " + match.label + " " + match.serving + "g）";
      }
      hintEl.style.display = "block";
    }

    function recalc() {
      var match = FOOD_DB[nameInput.value.trim()];
      if (match != null && gramsInput.value === "") {
        gramsInput.value = match.serving;
      }
      updateHint();
      if (match == null || row.dataset.manualKcal === "true") return;
      var g = Number(gramsInput.value);
      if (gramsInput.value === "" || isNaN(g)) return;
      kcalInput.value = Math.round((match.kcal * g) / 100);
    }

    function renderSuggestions() {
      var q = nameInput.value.trim();
      suggestList.innerHTML = "";
      if (!q) { suggestList.style.display = "none"; return; }
      var matches = FOOD_NAMES.filter(function (n) { return n.indexOf(q) !== -1; }).slice(0, 8);
      if (matches.length === 0) { suggestList.style.display = "none"; return; }
      matches.forEach(function (n) {
        var item = document.createElement("div");
        item.className = "suggest-item";
        var nameSpan = document.createElement("span");
        nameSpan.className = "suggest-name";
        nameSpan.textContent = n;
        var kcalSpan = document.createElement("span");
        kcalSpan.className = "suggest-kcal";
        kcalSpan.textContent = FOOD_DB[n].label + " " + FOOD_DB[n].serving + "g目安";
        item.appendChild(nameSpan);
        item.appendChild(kcalSpan);
        item.addEventListener("mousedown", function (e) {
          e.preventDefault();
          nameInput.value = n;
          row.dataset.manualKcal = "false";
          gramsInput.value = FOOD_DB[n].serving;
          renderSuggestions();
          recalc();
          updateMealSubtotal(listEl);
          gramsInput.focus();
          gramsInput.select();
        });
        suggestList.appendChild(item);
      });
      suggestList.style.display = "block";
    }

    nameInput.addEventListener("input", function () {
      row.dataset.manualKcal = "false";
      renderSuggestions();
      recalc();
      updateMealSubtotal(listEl);
    });
    nameInput.addEventListener("focus", renderSuggestions);
    nameInput.addEventListener("blur", function () {
      setTimeout(function () { suggestList.style.display = "none"; }, 150);
    });

    gramsInput.addEventListener("input", function () {
      recalc();
      updateMealSubtotal(listEl);
    });
    kcalInput.addEventListener("input", function () {
      row.dataset.manualKcal = "true";
      updateMealSubtotal(listEl);
    });

    row.querySelector(".entry-remove").addEventListener("click", function () {
      wrapperEl.remove();
      updateMealSubtotal(listEl);
    });

    updateHint();
    listEl.appendChild(frag);
    updateMealSubtotal(listEl);
  }

  function addExerciseRow(name, minutes, kcal) {
    var frag = exerciseRowTemplate();
    var row = frag.querySelector(".entry-row");
    row.querySelector(".entry-name").value = name || "";
    row.querySelector(".entry-num-small").value = minutes != null ? minutes : "";
    row.querySelector(".entry-num").value = kcal != null ? kcal : "";
    row.querySelector(".entry-remove").addEventListener("click", function () {
      row.remove();
    });
    exerciseList.appendChild(row);
  }

  document.querySelectorAll(".btn-small[data-meal-type]").forEach(function (btn) {
    btn.addEventListener("click", function () { addMealRow(mealListEls[btn.getAttribute("data-meal-type")]); });
  });
  document.getElementById("addExerciseBtn").addEventListener("click", function () { addExerciseRow(); });

  function clearForm() {
    weightInput.value = "";
    bodyFatInput.value = "";
    sleepHoursInput.value = "";
    sleepQualityInput.value = "";
    memoInput.value = "";
    MEAL_TYPES.forEach(function (t) {
      mealListEls[t].innerHTML = "";
      document.getElementById("mealSubtotal-" + t).textContent = "";
    });
    exerciseList.innerHTML = "";
    selectedCondition = null;
    Array.from(conditionPicker.children).forEach(function (b) { b.classList.remove("selected"); });
    stopStepMeasurement();
    stepCount = 0;
    stepsInput.value = "";
    updateStepDisplay();
  }

  // ---------- step counter ----------
  var stepCount = 0;
  var isMeasuringSteps = false;
  var stepGravityEstimate = 9.8;
  var stepLastTs = 0;
  var stepWasAbove = false;
  var STEP_THRESHOLD = 1.2;
  var STEP_MIN_INTERVAL = 300;

  var stepStartBtn = document.getElementById("stepStartBtn");
  var stepStopBtn = document.getElementById("stepStopBtn");
  var stepResetBtn = document.getElementById("stepResetBtn");
  var stepStatus = document.getElementById("stepStatus");
  var stepCountDisplay = document.getElementById("stepCountDisplay");

  function updateStepDisplay() {
    stepCountDisplay.textContent = stepCount;
  }

  function handleDeviceMotion(e) {
    var acc = e.accelerationIncludingGravity;
    if (!acc || acc.x == null) return;
    var mag = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
    stepGravityEstimate = stepGravityEstimate * 0.9 + mag * 0.1;
    var delta = mag - stepGravityEstimate;
    var now = Date.now();
    if (delta > STEP_THRESHOLD && !stepWasAbove && (now - stepLastTs) > STEP_MIN_INTERVAL) {
      stepCount++;
      stepLastTs = now;
      stepWasAbove = true;
      stepsInput.value = stepCount;
      updateStepDisplay();
    } else if (delta < STEP_THRESHOLD * 0.5) {
      stepWasAbove = false;
    }
  }

  function startStepMeasurement() {
    if (typeof DeviceMotionEvent === "undefined") {
      stepStatus.textContent = "この端末・ブラウザではモーションセンサーが使えません。歩数は手動で入力してください。";
      return;
    }
    function begin() {
      isMeasuringSteps = true;
      stepGravityEstimate = 9.8;
      stepWasAbove = false;
      window.addEventListener("devicemotion", handleDeviceMotion);
      stepStartBtn.disabled = true;
      stepStopBtn.disabled = false;
      stepStatus.textContent = "計測中…スマホを持ったまま歩いてください（アプリを開いている間のみ有効です）";
    }
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission().then(function (result) {
        if (result === "granted") {
          begin();
        } else {
          stepStatus.textContent = "モーションセンサーの利用が許可されませんでした。設定を確認するか、歩数を手動で入力してください。";
        }
      }).catch(function () {
        stepStatus.textContent = "モーションセンサーの許可を取得できませんでした。歩数は手動で入力してください。";
      });
    } else {
      begin();
    }
  }

  function stopStepMeasurement() {
    if (!isMeasuringSteps) return;
    window.removeEventListener("devicemotion", handleDeviceMotion);
    isMeasuringSteps = false;
    stepStartBtn.disabled = false;
    stepStopBtn.disabled = true;
    stepStatus.textContent = "計測を停止しました";
  }

  stepStartBtn.addEventListener("click", startStepMeasurement);
  stepStopBtn.addEventListener("click", stopStepMeasurement);
  stepResetBtn.addEventListener("click", function () {
    stepCount = 0;
    stepsInput.value = "";
    updateStepDisplay();
  });
  stepsInput.addEventListener("input", function () {
    stepCount = stepsInput.value === "" ? 0 : Number(stepsInput.value);
    updateStepDisplay();
  });

  function normalizeMeals(meals) {
    if (Array.isArray(meals)) return { breakfast: meals, lunch: [], dinner: [] };
    meals = meals || {};
    return { breakfast: meals.breakfast || [], lunch: meals.lunch || [], dinner: meals.dinner || [] };
  }

  function loadEntryIntoForm(dateStr) {
    clearForm();
    var entry = data[dateStr];
    if (!entry) return;
    weightInput.value = entry.weight != null ? entry.weight : "";
    bodyFatInput.value = entry.bodyFat != null ? entry.bodyFat : "";
    sleepHoursInput.value = entry.sleepHours != null ? entry.sleepHours : "";
    sleepQualityInput.value = entry.sleepQuality != null ? entry.sleepQuality : "";
    if (entry.steps != null) {
      stepsInput.value = entry.steps;
      stepCount = Number(entry.steps);
      updateStepDisplay();
    }
    memoInput.value = entry.memo || "";
    var meals = normalizeMeals(entry.meals);
    MEAL_TYPES.forEach(function (t) {
      meals[t].forEach(function (m) { addMealRow(mealListEls[t], m.name, m.grams, m.calories); });
    });
    (entry.exercises || []).forEach(function (ex) { addExerciseRow(ex.name, ex.minutes, ex.calories); });
    if (entry.condition != null) {
      selectedCondition = entry.condition;
      Array.from(conditionPicker.children).forEach(function (b) {
        b.classList.toggle("selected", Number(b.getAttribute("data-value")) === entry.condition);
      });
    }
  }

  function collectMealsFrom(listEl) {
    return Array.from(listEl.querySelectorAll(".entry-row")).map(function (row) {
      var name = row.querySelector(".entry-name").value.trim();
      var grams = row.querySelector(".entry-num-small").value;
      var cal = row.querySelector(".entry-num").value;
      return {
        name: name,
        grams: grams === "" ? null : Number(grams),
        calories: cal === "" ? null : Number(cal)
      };
    }).filter(function (m) { return m.name || m.calories != null || m.grams != null; });
  }

  function collectMeals() {
    var result = {};
    MEAL_TYPES.forEach(function (t) { result[t] = collectMealsFrom(mealListEls[t]); });
    return result;
  }

  function collectExercises() {
    return Array.from(exerciseList.querySelectorAll(".entry-row")).map(function (row) {
      var name = row.querySelector(".entry-name").value.trim();
      var minutes = row.querySelector(".entry-num-small").value;
      var cal = row.querySelector(".entry-num").value;
      return {
        name: name,
        minutes: minutes === "" ? null : Number(minutes),
        calories: cal === "" ? null : Number(cal)
      };
    }).filter(function (ex) { return ex.name || ex.minutes != null || ex.calories != null; });
  }

  document.getElementById("saveBtn").addEventListener("click", function () {
    var dateStr = recordDate.value || todayStr();
    var entry = {
      weight: weightInput.value === "" ? null : Number(weightInput.value),
      bodyFat: bodyFatInput.value === "" ? null : Number(bodyFatInput.value),
      sleepHours: sleepHoursInput.value === "" ? null : Number(sleepHoursInput.value),
      sleepQuality: sleepQualityInput.value === "" ? null : Number(sleepQualityInput.value),
      steps: stepsInput.value === "" ? null : Number(stepsInput.value),
      condition: selectedCondition,
      memo: memoInput.value,
      meals: collectMeals(),
      exercises: collectExercises()
    };
    data[dateStr] = entry;
    saveAll(data);
    var status = document.getElementById("saveStatus");
    status.textContent = dateStr + " の記録を保存しました";
    setTimeout(function () { status.textContent = ""; }, 2500);
  });

  loadEntryIntoForm(currentDate);

  // ---------- history ----------
  function entrySummary(entry) {
    var parts = [];
    if (entry.weight != null) parts.push("体重 " + entry.weight + "kg");
    var calIn = sumCalories(entry.meals);
    if (calIn) parts.push("摂取 " + calIn + "kcal");
    var calOut = sumExerciseCalories(entry.exercises);
    if (calOut) parts.push("消費 " + calOut + "kcal");
    if (entry.sleepHours != null) parts.push("睡眠 " + entry.sleepHours + "h");
    if (entry.steps != null) parts.push(entry.steps + "歩");
    return parts.join(" / ") || "記録あり";
  }

  function sumCalories(meals) {
    var norm = normalizeMeals(meals);
    return norm.breakfast.concat(norm.lunch, norm.dinner).reduce(function (sum, m) {
      return sum + (Number(m.calories) || 0);
    }, 0);
  }
  function sumExerciseCalories(exercises) {
    return (exercises || []).reduce(function (sum, ex) { return sum + (Number(ex.calories) || 0); }, 0);
  }

  // ---------- advice ----------
  function average(arr) {
    return arr.length ? arr.reduce(function (a, b) { return a + b; }, 0) / arr.length : null;
  }

  function dateNDaysAgo(n) {
    var d = new Date();
    d.setDate(d.getDate() - n);
    return formatDate(d);
  }

  function computeWindowStats(dates) {
    var weights = [], calIn = [], calOut = [], sleep = [], cond = [], steps = [];
    var loggedDays = 0;
    dates.forEach(function (d) {
      var e = data[d];
      if (!e) return;
      loggedDays++;
      if (e.weight != null) weights.push(Number(e.weight));
      var ci = sumCalories(e.meals);
      if (ci > 0) calIn.push(ci);
      calOut.push(sumExerciseCalories(e.exercises));
      if (e.sleepHours != null) sleep.push(Number(e.sleepHours));
      if (e.condition != null) cond.push(Number(e.condition));
      if (e.steps != null) steps.push(Number(e.steps));
    });
    return {
      loggedDays: loggedDays,
      weight: average(weights),
      calIn: average(calIn),
      calOut: average(calOut),
      sleep: average(sleep),
      condition: average(cond),
      steps: average(steps)
    };
  }

  function trendArrow(diff, threshold) {
    if (diff == null) return "";
    if (diff > threshold) return " ↑";
    if (diff < -threshold) return " ↓";
    return " →";
  }

  function buildAdvice(recent, prev, goal) {
    var advice = [];
    if (recent.loggedDays === 0) {
      advice.push("直近7日間の記録がありません。まずは今日の記録をつけてみましょう。");
      return advice;
    }

    if (recent.weight != null) {
      var diff = prev.weight != null ? recent.weight - prev.weight : null;
      if (goal && goal.targetWeight != null) {
        var toGoal = recent.weight - Number(goal.targetWeight);
        if (Math.abs(toGoal) < 0.3) {
          advice.push("体重は目標の" + goal.targetWeight + "kgにほぼ到達しています。この調子を維持しましょう。");
        } else if (toGoal > 0) {
          if (diff != null && diff < -0.05) {
            var weeks = Math.abs(diff) > 0.01 ? Math.ceil(toGoal / Math.abs(diff)) : null;
            advice.push("体重は先週から" + diff.toFixed(1) + "kg減少し、目標に向けて順調です。" + (weeks ? "このペースが続けば目標まであと約" + weeks + "週間の見込みです。" : ""));
          } else if (diff != null && diff > 0.05) {
            advice.push("体重が先週から+" + diff.toFixed(1) + "kg増加しています。目標(" + goal.targetWeight + "kg)まであと" + toGoal.toFixed(1) + "kgです。食事量や間食を見直してみましょう。");
          } else {
            advice.push("体重はほぼ横ばいです。目標(" + goal.targetWeight + "kg)まであと" + toGoal.toFixed(1) + "kgです。");
          }
        } else {
          advice.push("体重はすでに目標(" + goal.targetWeight + "kg)を下回っています。健康的な範囲を保てているか確認しましょう。");
        }
      } else if (diff != null && Math.abs(diff) >= 0.3) {
        advice.push("体重が先週から" + (diff > 0 ? "+" : "") + diff.toFixed(1) + "kg" + (diff > 0 ? "増加" : "減少") + "しています。");
      }
    } else {
      advice.push("体重の記録がありません。継続して記録すると変化が把握しやすくなります。");
    }

    if (recent.calIn != null && recent.weight != null) {
      var maintenanceGuess = Math.round(recent.weight * 30);
      if (recent.calIn > maintenanceGuess + 200) {
        advice.push("直近の平均摂取カロリーは" + Math.round(recent.calIn) + "kcalで、目安（体重×30kcal ≈ " + maintenanceGuess + "kcal）よりやや多めです。主食や間食の量を見直すと良いかもしれません。");
      } else if (recent.calIn < maintenanceGuess - 300) {
        advice.push("直近の平均摂取カロリーは" + Math.round(recent.calIn) + "kcalで、目安よりかなり少なめです。極端な食事制限になっていないか確認しましょう。");
      }
    }

    if (recent.calOut != null && recent.calOut < 50 && recent.loggedDays >= 3) {
      advice.push("運動による消費カロリーの記録が少なめです。軽いウォーキングなど、無理のない範囲で体を動かす習慣を取り入れてみましょう。");
    }

    if (recent.sleep != null) {
      if (recent.sleep < 6) {
        advice.push("睡眠時間が平均" + recent.sleep.toFixed(1) + "時間とやや少なめです。可能であれば7時間以上を目指しましょう。");
      } else if (recent.sleep >= 7) {
        advice.push("睡眠時間は平均" + recent.sleep.toFixed(1) + "時間としっかり確保できています。");
      }
    }

    if (recent.condition != null) {
      if (recent.condition <= 2.5) {
        advice.push("体調が優れない日が多いようです（平均スコア" + recent.condition.toFixed(1) + "/5）。無理をせず休息を優先し、不調が続く場合は医療機関への相談も検討してください。");
      } else if (recent.condition >= 4) {
        advice.push("体調は良好な日が多いようです。この調子を維持しましょう。");
      }
    }

    if (recent.steps != null) {
      if (recent.steps < 5000) {
        advice.push("平均歩数は" + Math.round(recent.steps) + "歩とやや少なめです。一般的な目安の8,000〜10,000歩に近づけるよう、通勤や買い物での徒歩を増やしてみましょう。");
      } else if (recent.steps >= 8000) {
        advice.push("平均歩数は" + Math.round(recent.steps) + "歩としっかり歩けています。この調子を維持しましょう。");
      }
    }

    if (advice.length === 0) {
      advice.push("記録の範囲では特に大きな変化は見られません。引き続き記録を続けましょう。");
    }
    return advice;
  }

  function statusBlock(label, value) {
    return '<div class="status-block"><div class="status-label">' + label + '</div><div class="status-value">' + value + '</div></div>';
  }

  function renderAdvice() {
    var recentDates = [];
    for (var i = 6; i >= 0; i--) recentDates.push(dateNDaysAgo(i));
    var prevDates = [];
    for (var j = 13; j >= 7; j--) prevDates.push(dateNDaysAgo(j));

    var recent = computeWindowStats(recentDates);
    var prev = computeWindowStats(prevDates);
    var goal = loadGoal();

    var statusGrid = document.getElementById("statusGrid");
    var statusEmpty = document.getElementById("statusEmpty");
    if (recent.loggedDays === 0) {
      statusGrid.innerHTML = "";
      statusEmpty.style.display = "block";
    } else {
      statusEmpty.style.display = "none";
      statusGrid.innerHTML =
        statusBlock("体重", recent.weight != null ? recent.weight.toFixed(1) + "kg" + trendArrow(prev.weight != null ? recent.weight - prev.weight : null, 0.2) : "-") +
        statusBlock("摂取カロリー", recent.calIn != null ? Math.round(recent.calIn) + "kcal" : "-") +
        statusBlock("消費カロリー", recent.calOut != null ? Math.round(recent.calOut) + "kcal" : "-") +
        statusBlock("睡眠時間", recent.sleep != null ? recent.sleep.toFixed(1) + "h" : "-") +
        statusBlock("体調", recent.condition != null ? recent.condition.toFixed(1) + "/5" : "-") +
        statusBlock("歩数", recent.steps != null ? Math.round(recent.steps) + "歩" : "-");
    }

    var adviceList = document.getElementById("adviceList");
    var advice = buildAdvice(recent, prev, goal);
    adviceList.innerHTML = advice.map(function (a) { return "<li>" + a + "</li>"; }).join("");
  }

  function renderHistory() {
    var list = document.getElementById("historyList");
    var emptyMsg = document.getElementById("historyEmpty");
    var dates = Object.keys(data).sort().reverse();
    list.innerHTML = "";
    emptyMsg.style.display = dates.length ? "none" : "block";
    dates.forEach(function (dateStr) {
      var entry = data[dateStr];
      var item = document.createElement("div");
      item.className = "history-item";
      item.innerHTML =
        '<div class="history-head">' +
          '<div>' +
            '<div class="history-date">' + dateStr + '</div>' +
            '<div class="history-summary">' + escapeHtml(entrySummary(entry)) + '</div>' +
          '</div>' +
          '<div class="history-actions">' +
            '<button type="button" class="edit-btn">編集</button>' +
            '<button type="button" class="del-btn">削除</button>' +
          '</div>' +
        '</div>';
      item.querySelector(".edit-btn").addEventListener("click", function () {
        recordDate.value = dateStr;
        currentDate = dateStr;
        loadEntryIntoForm(dateStr);
        document.querySelector('.nav-btn[data-tab="tab-record"]').click();
      });
      item.querySelector(".del-btn").addEventListener("click", function () {
        if (confirm(dateStr + " の記録を削除しますか？")) {
          delete data[dateStr];
          saveAll(data);
          renderHistory();
        }
      });
      list.appendChild(item);
    });
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------- graph ----------
  var metricSelect = document.getElementById("metricSelect");
  var rangeSelect = document.getElementById("rangeSelect");
  metricSelect.addEventListener("change", renderChart);
  rangeSelect.addEventListener("change", renderChart);

  var metricConfig = {
    weight: { label: "体重", unit: "kg", get: function (e) { return e.weight; } },
    bodyFat: { label: "体脂肪率", unit: "%", get: function (e) { return e.bodyFat; } },
    caloriesIn: { label: "摂取カロリー", unit: "kcal", get: function (e) { var v = sumCalories(e.meals); return v || null; } },
    caloriesOut: { label: "消費カロリー", unit: "kcal", get: function (e) { var v = sumExerciseCalories(e.exercises); return v || null; } },
    sleepHours: { label: "睡眠時間", unit: "h", get: function (e) { return e.sleepHours; } },
    condition: { label: "体調", unit: "", get: function (e) { return e.condition; } },
    steps: { label: "歩数", unit: "歩", get: function (e) { return e.steps; } }
  };

  function renderChart() {
    var metricKey = metricSelect.value;
    var rangeDays = Number(rangeSelect.value);
    var config = metricConfig[metricKey];
    var dates = Object.keys(data).sort();

    if (rangeDays > 0) {
      var cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - rangeDays);
      dates = dates.filter(function (d) { return new Date(d) >= cutoff; });
    }

    var points = [];
    dates.forEach(function (d) {
      var v = config.get(data[d]);
      if (v != null && !isNaN(v)) points.push({ date: d, value: Number(v) });
    });

    var canvas = document.getElementById("chartCanvas");
    var emptyMsg = document.getElementById("chartEmpty");
    var statsBox = document.getElementById("chartStats");

    if (points.length === 0) {
      emptyMsg.style.display = "block";
      canvas.style.display = "none";
      statsBox.innerHTML = "";
      return;
    }
    emptyMsg.style.display = "none";
    canvas.style.display = "block";

    drawLineChart(canvas, points, config);

    var values = points.map(function (p) { return p.value; });
    var latest = values[values.length - 1];
    var avg = values.reduce(function (a, b) { return a + b; }, 0) / values.length;
    var min = Math.min.apply(null, values);
    var max = Math.max.apply(null, values);
    statsBox.innerHTML =
      statBlock("最新", latest, config.unit) +
      statBlock("平均", avg.toFixed(1), config.unit) +
      statBlock("最小", min, config.unit) +
      statBlock("最大", max, config.unit);
  }

  function statBlock(label, value, unit) {
    return '<div>' + label + '<b>' + value + unit + '</b></div>';
  }

  function drawLineChart(canvas, points, config) {
    var ctx = canvas.getContext("2d");
    var dpr = window.devicePixelRatio || 1;
    var cssWidth = canvas.parentElement.clientWidth - 28; // padding inside card
    var cssHeight = 260;
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = cssWidth + "px";
    canvas.style.height = cssHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    var padding = { top: 16, right: 12, bottom: 26, left: 40 };
    var chartW = cssWidth - padding.left - padding.right;
    var chartH = cssHeight - padding.top - padding.bottom;

    var values = points.map(function (p) { return p.value; });
    var minV = Math.min.apply(null, values);
    var maxV = Math.max.apply(null, values);
    if (minV === maxV) { minV -= 1; maxV += 1; }
    var rangeV = maxV - minV;
    minV -= rangeV * 0.1;
    maxV += rangeV * 0.1;
    rangeV = maxV - minV;

    function xAt(i) {
      if (points.length === 1) return padding.left + chartW / 2;
      return padding.left + (chartW * i) / (points.length - 1);
    }
    function yAt(v) {
      return padding.top + chartH - ((v - minV) / rangeV) * chartH;
    }

    // grid lines + y labels
    ctx.strokeStyle = "#e3e6e4";
    ctx.fillStyle = "#767b78";
    ctx.font = "11px sans-serif";
    ctx.lineWidth = 1;
    var gridCount = 4;
    for (var g = 0; g <= gridCount; g++) {
      var v = minV + (rangeV * g) / gridCount;
      var y = yAt(v);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(cssWidth - padding.right, y);
      ctx.stroke();
      ctx.fillText(v.toFixed(1), 2, y + 3);
    }

    // x labels (first, middle, last)
    var labelIdxs = points.length > 1 ? [0, Math.floor((points.length - 1) / 2), points.length - 1] : [0];
    labelIdxs.forEach(function (i) {
      var x = xAt(i);
      ctx.fillText(formatDateLabel(points[i].date), Math.min(Math.max(x - 14, padding.left), cssWidth - 40), cssHeight - 6);
    });

    // line
    ctx.strokeStyle = "#2f8f6e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    points.forEach(function (p, i) {
      var x = xAt(i), y = yAt(p.value);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // points
    ctx.fillStyle = "#2f8f6e";
    points.forEach(function (p, i) {
      var x = xAt(i), y = yAt(p.value);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // goal line for weight
    if (config.label === "体重") {
      var goal = loadGoal();
      if (goal.targetWeight != null) {
        var gy = yAt(Number(goal.targetWeight));
        if (gy >= padding.top && gy <= padding.top + chartH) {
          ctx.strokeStyle = "#d9534f";
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(padding.left, gy);
          ctx.lineTo(cssWidth - padding.right, gy);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = "#d9534f";
          ctx.fillText("目標 " + goal.targetWeight, cssWidth - padding.right - 50, gy - 4);
        }
      }
    }
  }

  window.addEventListener("resize", function () {
    if (document.getElementById("tab-graph").classList.contains("active")) renderChart();
  });

  // ---------- settings ----------
  document.getElementById("saveGoalBtn").addEventListener("click", function () {
    var v = document.getElementById("targetWeightInput").value;
    saveGoal({ targetWeight: v === "" ? null : Number(v) });
    alert("目標を保存しました");
  });

  document.getElementById("exportBtn").addEventListener("click", function () {
    var payload = { entries: data, goal: loadGoal(), exportedAt: new Date().toISOString() };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "healthlog-backup-" + todayStr() + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  document.getElementById("importFile").addEventListener("change", function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var payload = JSON.parse(reader.result);
        if (!payload.entries) throw new Error("invalid format");
        if (!confirm("現在のデータに上書き・統合します。よろしいですか？")) return;
        data = Object.assign({}, data, payload.entries);
        saveAll(data);
        if (payload.goal) saveGoal(payload.goal);
        alert("インポートが完了しました");
        loadEntryIntoForm(currentDate);
      } catch (err) {
        alert("読み込みに失敗しました: " + err.message);
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  });

  document.getElementById("clearAllBtn").addEventListener("click", function () {
    if (confirm("本当にすべてのデータを削除しますか？この操作は取り消せません。")) {
      if (confirm("最終確認：全記録を完全に削除します。よろしいですか？")) {
        data = {};
        saveAll(data);
        localStorage.removeItem(GOAL_KEY);
        clearForm();
        alert("削除しました");
      }
    }
  });

  // ---------- service worker ----------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("service-worker.js").catch(function (err) {
        console.warn("service worker registration failed", err);
      });
    });
  }
})();
