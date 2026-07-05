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
    "味噌汁": { kcal: 40, serving: 180, label: "お椀1杯" }
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
  var memoInput = document.getElementById("memoInput");
  var mealList = document.getElementById("mealList");
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

  function addMealRow(name, grams, kcal) {
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
    });
    nameInput.addEventListener("focus", renderSuggestions);
    nameInput.addEventListener("blur", function () {
      setTimeout(function () { suggestList.style.display = "none"; }, 150);
    });

    gramsInput.addEventListener("input", recalc);
    kcalInput.addEventListener("input", function () { row.dataset.manualKcal = "true"; });

    row.querySelector(".entry-remove").addEventListener("click", function () {
      wrapperEl.remove();
    });

    updateHint();
    mealList.appendChild(frag);
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

  document.getElementById("addMealBtn").addEventListener("click", function () { addMealRow(); });
  document.getElementById("addExerciseBtn").addEventListener("click", function () { addExerciseRow(); });

  function clearForm() {
    weightInput.value = "";
    bodyFatInput.value = "";
    sleepHoursInput.value = "";
    sleepQualityInput.value = "";
    memoInput.value = "";
    mealList.innerHTML = "";
    exerciseList.innerHTML = "";
    selectedCondition = null;
    Array.from(conditionPicker.children).forEach(function (b) { b.classList.remove("selected"); });
  }

  function loadEntryIntoForm(dateStr) {
    clearForm();
    var entry = data[dateStr];
    if (!entry) return;
    weightInput.value = entry.weight != null ? entry.weight : "";
    bodyFatInput.value = entry.bodyFat != null ? entry.bodyFat : "";
    sleepHoursInput.value = entry.sleepHours != null ? entry.sleepHours : "";
    sleepQualityInput.value = entry.sleepQuality != null ? entry.sleepQuality : "";
    memoInput.value = entry.memo || "";
    (entry.meals || []).forEach(function (m) { addMealRow(m.name, m.grams, m.calories); });
    (entry.exercises || []).forEach(function (ex) { addExerciseRow(ex.name, ex.minutes, ex.calories); });
    if (entry.condition != null) {
      selectedCondition = entry.condition;
      Array.from(conditionPicker.children).forEach(function (b) {
        b.classList.toggle("selected", Number(b.getAttribute("data-value")) === entry.condition);
      });
    }
  }

  function collectMeals() {
    return Array.from(mealList.querySelectorAll(".entry-row")).map(function (row) {
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
    return parts.join(" / ") || "記録あり";
  }

  function sumCalories(meals) {
    return (meals || []).reduce(function (sum, m) { return sum + (Number(m.calories) || 0); }, 0);
  }
  function sumExerciseCalories(exercises) {
    return (exercises || []).reduce(function (sum, ex) { return sum + (Number(ex.calories) || 0); }, 0);
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
    condition: { label: "体調", unit: "", get: function (e) { return e.condition; } }
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
