(function () {
  "use strict";

  var STORAGE_KEY = "healthlog_v1";
  var GOAL_KEY = "healthlog_goal_v1";

  // kcal per 100g
  var FOOD_DB = {
    "白米": 168, "玄米ご飯": 165, "食パン": 264, "ロールパン": 316,
    "うどん(ゆで)": 105, "そば(ゆで)": 132, "スパゲッティ(ゆで)": 150,
    "ラーメン(ゆで麺)": 149, "中華麺(蒸し)": 162, "もち": 235,
    "オートミール": 380, "コーンフレーク": 381,
    "鶏むね肉(皮なし)": 116, "鶏むね肉(皮つき)": 145, "鶏もも肉(皮なし)": 127,
    "鶏もも肉(皮つき)": 200, "鶏ささみ": 105, "鶏ひき肉": 171,
    "豚バラ肉": 386, "豚ロース肉": 263, "豚ヒレ肉": 118, "豚ひき肉": 209,
    "牛バラ肉": 371, "牛もも肉": 182, "牛ひき肉": 224,
    "ベーコン": 400, "ウインナー": 321, "ハム": 118,
    "鮭": 133, "サバ": 202, "マグロ赤身": 125, "マグロトロ": 344,
    "アジ": 121, "サンマ": 287, "エビ": 82, "イカ": 76,
    "ツナ缶(油漬け)": 265, "ツナ缶(水煮)": 71,
    "卵": 151, "卵白": 47, "卵黄": 336,
    "牛乳": 67, "ヨーグルト(無糖)": 62, "チーズ": 339,
    "納豆": 200, "豆腐(絹)": 56, "豆腐(木綿)": 72, "豆乳": 46,
    "キャベツ": 23, "レタス": 12, "トマト": 20, "きゅうり": 14,
    "にんじん": 39, "じゃがいも": 76, "さつまいも": 134, "玉ねぎ": 37,
    "ほうれん草": 20, "ブロッコリー": 33, "なす": 22, "ピーマン": 22,
    "もやし": 14, "大根": 18,
    "バナナ": 86, "りんご": 57, "みかん": 49, "ぶどう": 59,
    "いちご": 34, "キウイ": 51,
    "サラダ油": 921, "マヨネーズ": 703, "バター": 745,
    "醤油": 71, "味噌": 192, "砂糖": 384, "ケチャップ": 119,
    "カレールウ": 511, "インスタントラーメン(乾麺)": 448,
    "ポテトチップス": 554, "チョコレート": 550, "アイスクリーム": 180,
    "唐揚げ": 290, "天ぷら(えび)": 233, "オムレツ": 150, "味噌汁": 40
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
      var initialComputed = Math.round((initialMatch * Number(grams)) / 100);
      row.dataset.manualKcal = initialComputed === Number(kcal) ? "false" : "true";
    } else {
      row.dataset.manualKcal = "true";
    }

    function updateHint() {
      var match = FOOD_DB[nameInput.value.trim()];
      if (match != null) {
        hintEl.textContent = nameInput.value.trim() + "：" + match + "kcal/100g";
        hintEl.style.display = "block";
      } else {
        hintEl.textContent = "";
        hintEl.style.display = "none";
      }
    }

    function recalc() {
      updateHint();
      var match = FOOD_DB[nameInput.value.trim()];
      if (match == null || row.dataset.manualKcal === "true") return;
      var g = Number(gramsInput.value);
      if (gramsInput.value === "" || isNaN(g)) return;
      kcalInput.value = Math.round((match * g) / 100);
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
        nameSpan.textContent = n;
        var kcalSpan = document.createElement("span");
        kcalSpan.className = "suggest-kcal";
        kcalSpan.textContent = FOOD_DB[n] + "kcal/100g";
        item.appendChild(nameSpan);
        item.appendChild(kcalSpan);
        item.addEventListener("mousedown", function (e) {
          e.preventDefault();
          nameInput.value = n;
          row.dataset.manualKcal = "false";
          renderSuggestions();
          recalc();
          gramsInput.focus();
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
