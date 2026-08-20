/* ==========================================================================
   Kexin Rewards — front end
   All real data lives in data/rewards.xlsx; this file just draws it.
   Icons come from icons.js (svgIcon / iconMarkup / ICON_CHOICES).
   ========================================================================== */

(function () {
  "use strict";

  var state = {
    user: null,
    settings: {},
    tasks: [],
    allTasks: [],
    records: [],
    summary: { available: 0, pending: 0, pendingCount: 0 },
    today: "",
    view: "home",
    filter: "All"
  };

  var $ = function (id) { return document.getElementById(id); };
  var elLogin = $("login-screen");
  var elApp = $("app-screen");
  var elContent = $("app-content");
  var elNav = $("bottom-nav");
  var elOverlay = $("overlay");
  var elSheet = $("sheet");
  var elToast = $("toast");
  var toastTimer = null;

  var AVATARS = {
    "Kexin": "/static/img/kexin.jpg",
    "Dad": "/static/img/dad.jpg",
    "Mom": "/static/img/mom.jpg"
  };

  /* ----------------------------------------------------------------- gate

     Each person has their own address, which pre-fills the login name. The
     password is always required, and the server checks the role on every
     action.
         /            everyone
         /kexin       Kexin
         /parents     Dad & Mom
         /dad  /mom   that parent
  ------------------------------------------------------------------------ */

  var GATE = (function () {
    var raw = (document.body.getAttribute("data-gate") || "").toLowerCase();
    if (!raw || raw === "all") {
      raw = (window.location.hash || "").replace(/^#/, "").toLowerCase();
    }
    if (!raw) {
      var match = /[?&]who=([^&]+)/i.exec(window.location.search);
      if (match) raw = decodeURIComponent(match[1]).toLowerCase();
    }
    if (raw === "kexin" || raw === "child" || raw === "kid") return "child";
    if (raw === "parents" || raw === "parent" ||
        raw === "babamama" || raw === "mamababa") return "parents";
    if (raw === "dad" || raw === "papa" || raw === "baba") return "dad";
    if (raw === "mom" || raw === "mum" || raw === "mama") return "mom";
    return "all";
  })();

  function prefillName() {
    if (GATE === "child") return "kexin";
    if (GATE === "dad") return "daddy";
    if (GATE === "mom") return "mommy";
    return "";
  }

  function links() {
    var origin = window.location.origin;
    if (!origin || origin === "null") {
      var base = window.location.href.split("#")[0].split("?")[0];
      return { kexin: base + "#kexin", parents: base + "#parents" };
    }
    return { kexin: origin + "/kexin", parents: origin + "/parents" };
  }

  /* ---------------------------------------------------------------- utils */

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function fmt(n) { return Number(n || 0).toLocaleString("en-US"); }

  function parseDate(str) {
    var bits = String(str || "").slice(0, 10).split("-");
    if (bits.length !== 3) return new Date();
    return new Date(Number(bits[0]), Number(bits[1]) - 1, Number(bits[2]));
  }

  function isoOf(d) {
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

  function longDate(str) {
    var d = parseDate(str);
    return MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function yesterdayIso() {
    var d = parseDate(state.today);
    d.setDate(d.getDate() - 1);
    return isoOf(d);
  }

  function dayLabel(str) {
    if (str === state.today) return "Today";
    if (str === yesterdayIso()) return "Yesterday";
    var d = parseDate(str);
    return d.getDate() + " " + MONTHS[d.getMonth()].slice(0, 3) + " " + d.getFullYear();
  }

  function shortWhen(str) {
    if (str === state.today) return "Today";
    if (str === yesterdayIso()) return "Yesterday";
    var d = parseDate(str);
    return d.getDate() + " " + MONTHS[d.getMonth()].slice(0, 3);
  }

  function toast(message, isWarning) {
    elToast.textContent = message;
    elToast.className = "toast" + (isWarning ? " warn" : "");
    elToast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { elToast.hidden = true; }, 3200);
  }

  function isParent() { return !!state.user && state.user.role !== "Applicant"; }

  function greetingFor(user) { return user.greeting || ("Hi " + user.name); }

  function avatar(user, className) {
    var photo = AVATARS[user.name];
    var inner = photo
      ? '<img src="' + esc(photo) + '" alt="" />'
      : svgIcon("person");
    return '<span class="' + className + '">' + inner + "</span>";
  }

  function taskIcon(taskId) {
    var found = state.allTasks.filter(function (t) { return t.taskId === taskId; })[0];
    return found ? found.icon : null;
  }

  function recordIcon(record, size) {
    if (record.taskType === "Custom") return svgIcon("star", size);
    return iconMarkup(taskIcon(record.taskId) || "star", size);
  }

  /* ------------------------------------------------------------------ api */

  function api(path, options) {
    var opts = options || {};
    var init = { method: opts.method || "GET", headers: {} };
    if (opts.body) {
      init.headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(opts.body);
    }
    return fetch(path, init).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok || data.ok === false) {
          var err = new Error(data.error || "Something went wrong. Please try again.");
          err.status = res.status;
          throw err;
        }
        return data;
      });
    });
  }

  function refresh() {
    return api("/api/state?includeInactive=1").then(function (data) {
      state.settings = data.settings || {};
      state.allTasks = data.allTasks || [];
      state.tasks = state.allTasks.filter(function (t) { return t.status === "Active"; });
      state.records = data.records || [];
      state.summary = data.summary || state.summary;
      state.today = data.today;
      if (data.me) state.user = data.me;
      return data;
    });
  }

  /* ---------------------------------------------------------------- login */

  function loginError(message) {
    var box = $("login-error");
    if (!box) return;
    if (!message) { box.hidden = true; box.textContent = ""; return; }
    box.textContent = message;
    box.hidden = false;
  }

  function showLogin(message) {
    state.user = null;
    document.body.classList.remove("child-mode", "parent-mode");
    closeSheet();
    elApp.hidden = true;
    elLogin.hidden = false;

    var nameBox = $("lg-name");
    var passBox = $("lg-pass");
    if (passBox) passBox.value = "";
    if (nameBox && !nameBox.value) nameBox.value = prefillName();

    var sub = $("login-sub");
    if (sub) {
      sub.textContent = GATE === "child" ? "Hi Kexin, please log in"
        : (GATE === "parents" ? "Dad & Mom, please log in" : "Please log in");
    }

    loginError(message || "");
    window.scrollTo(0, 0);
    if (nameBox && !nameBox.value) nameBox.focus();
    else if (passBox) passBox.focus();
  }

  function enterApp() {
    elLogin.hidden = true;
    elApp.hidden = false;
    document.body.classList.toggle("child-mode", !isParent());
    document.body.classList.toggle("parent-mode", isParent());
    state.view = "home";
    state.filter = "All";
    render();
    window.scrollTo(0, 0);
  }

  $("login-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var name = $("lg-name").value.trim();
    var pass = $("lg-pass").value;
    if (!name || !pass) { loginError("Please fill in both boxes."); return; }

    var button = $("lg-go");
    button.disabled = true;
    loginError("");
    api("/api/login", { method: "POST", body: { loginName: name, password: pass } })
      .then(function (data) {
        state.user = data.user;
        return refresh();
      })
      .then(function () { button.disabled = false; enterApp(); })
      .catch(function (err) {
        button.disabled = false;
        $("lg-pass").value = "";
        loginError(err.message);
      });
  });

  function logout() {
    api("/api/logout", { method: "POST" })
      .catch(function () { /* log out locally anyway */ })
      .then(function () {
        var nameBox = $("lg-name");
        if (nameBox) nameBox.value = "";
        showLogin("");
      });
  }

  /* ------------------------------------------------------------------- nav */

  var NAV_CHILD = [["home", "home", "Home"], ["history", "history", "Activity"],
    ["me", "person", "Me"]];
  var NAV_PARENT = [["home", "home", "Home"], ["approve", "approve", "Approve"],
    ["history", "history", "Activity"], ["me", "person", "Me"]];

  function renderNav() {
    var items = isParent() ? NAV_PARENT : NAV_CHILD;
    var count = state.summary.pendingCount || 0;
    elNav.innerHTML = items.map(function (item) {
      var active = state.view === item[0] ||
        (item[0] === "me" && state.view === "manage");
      var dot = (item[0] === "approve" && count) ? '<span class="dot"></span>' : "";
      return '<button data-view="' + item[0] + '" class="' + (active ? "on" : "") + '">' +
        dot + svgIcon(item[1]) + "<span>" + item[2] + "</span></button>";
    }).join("");
    Array.prototype.forEach.call(elNav.querySelectorAll("button"), function (btn) {
      btn.addEventListener("click", function () { go(btn.dataset.view); });
    });
  }

  function go(view) {
    state.view = view;
    render();
    window.scrollTo(0, 0);
  }

  /* ----------------------------------------------------------------- views */

  function render() {
    if (!state.user) { showLogin(); return; }
    renderNav();
    var html;
    if (isParent()) {
      if (state.view === "approve") html = viewApprove();
      else if (state.view === "history") html = viewHistory(true);
      else if (state.view === "me") html = viewMe();
      else if (state.view === "manage") html = viewManage();
      else html = viewParentHome();
    } else {
      if (state.view === "history") html = viewHistory(false);
      else if (state.view === "me") html = viewMe();
      else html = viewChildHome();
    }
    elContent.innerHTML = html;
    wire();
  }

  function topBar() {
    return '<div class="top">' + avatar(state.user, "who") +
      '<span class="hi">' + esc(greetingFor(state.user)) + "</span></div>";
  }

  function viewChildHome() {
    var s = state.summary;
    var note = s.pending > 0
      ? '<span class="note wait">' + svgIcon("clock", "ic-sm") +
        fmt(s.pending) + " points waiting for approval</span>"
      : '<span class="note done">' + svgIcon("check", "ic-sm") +
        "Everything is checked</span>";

    var cards = state.tasks.map(function (t) {
      return '<button class="act" data-task="' + esc(t.taskId) + '">' +
        '<span class="ai">' + iconMarkup(t.icon, "ic-lg") + "</span>" +
        '<span class="an">' + esc(t.name) + "</span>" +
        '<span class="ap">+' + fmt(t.points) + "</span></button>";
    }).join("");

    cards += '<button class="act add" data-custom="1">' +
      '<span class="ai">' + svgIcon("plus") + "</span>" +
      '<span class="an">Add something else</span>' +
      '<span class="ch">' + svgIcon("chevron", "ic-sm") + "</span></button>";

    var recent = state.records.slice(0, 3);
    var lately = recent.length
      ? '<h3 class="hd sp">Lately</h3><ul class="rows">' +
        recent.map(rowHtml).join("") + "</ul>" +
        '<button class="linkish" data-go="history">See everything you have done</button>'
      : "";

    return topBar() +
      '<section class="balance">' +
      '<span class="cap">You have earned</span>' +
      '<span class="num">' + fmt(s.available) + "</span>" +
      '<span class="sub">points</span>' + note + "</section>" +
      '<h3 class="hd">What did you do today?</h3>' +
      '<div class="grid">' + cards + "</div>" + lately;
  }

  function viewParentHome() {
    var s = state.summary;
    var applicant = state.settings.ApplicantName || "Kexin";

    var block = s.pendingCount > 0
      ? '<button class="pending" data-go="approve">' +
        '<span class="pi">' + svgIcon("bell") + "</span>" +
        '<span class="pt"><strong>' + s.pendingCount + " waiting for approval</strong>" +
        "<small>" + fmt(s.pending) + " points to check</small></span>" +
        '<span class="ch">' + svgIcon("chevron", "ic-sm") + "</span></button>"
      : '<div class="pending calm">' +
        '<span class="pi">' + svgIcon("checkCircle") + "</span>" +
        '<span class="pt"><strong>All caught up</strong>' +
        "<small>Nothing waiting for approval</small></span></div>";

    var todays = state.records.filter(function (r) { return r.date === state.today; });
    var todayHtml = todays.length
      ? '<h3 class="hd sp">' + esc(applicant) + ' today</h3><ul class="rows">' +
        todays.map(rowHtml).join("") + "</ul>"
      : "";

    return topBar() +
      '<section class="balance">' +
      '<span class="cap">' + esc(applicant) + " has</span>" +
      '<span class="num">' + fmt(s.available) + "</span>" +
      '<span class="sub">points</span></section>' +
      block +
      '<div class="stats">' +
      '<div class="stat ok"><b>' + fmt(s.available) + "</b><span>Approved</span></div>" +
      '<div class="stat wait"><b>' + fmt(s.pending) + "</b><span>Waiting</span></div></div>" +
      todayHtml;
  }

  function viewApprove() {
    var applicant = state.settings.ApplicantName || "Kexin";
    var pending = state.records.filter(function (r) { return r.status === "Pending"; });

    if (!pending.length) {
      return '<div class="page-head"><h2>Approve</h2><p>Requests from ' +
        esc(applicant) + " arrive here.</p></div>" +
        '<div class="empty">' + svgIcon("checkCircle") +
        "<p>All done. Nothing is waiting for you.</p></div>";
    }

    return '<div class="page-head"><h2>Approve</h2><p>' + pending.length +
      " request" + (pending.length > 1 ? "s" : "") +
      " waiting — one of you is enough.</p></div>" +
      pending.map(function (r) {
        var custom = r.taskType === "Custom";
        return '<article class="req">' +
          '<span class="rq-who">' + esc(applicant) + " completed</span>" +
          '<div class="rq-top"><span class="ri">' + recordIcon(r, "ic-lg") + "</span>" +
          '<span class="rq-name">' + esc(r.name) + "</span></div>" +
          '<div class="rq-meta"><span class="rq-pts">+' + fmt(r.points) + "</span>" +
          '<span class="rq-when">' + esc(shortWhen(r.date)) + "</span>" +
          (custom ? '<span class="tag">Asked for</span>' : "") + "</div>" +
          '<div class="rq-acts">' +
          '<button class="btn line warn" data-review="reject" data-id="' +
          esc(r.recordId) + '">Reject</button>' +
          '<button class="btn solid" data-review="approve" data-id="' +
          esc(r.recordId) + '">Approve</button>' +
          "</div></article>";
      }).join("");
  }

  function rowHtml(r) {
    var label = r.status === "Approved" ? "Approved"
      : (r.status === "Pending" ? "Waiting for approval" : "Not approved");
    var tone = r.status === "Approved" ? "ok"
      : (r.status === "Pending" ? "pending" : "rejected");
    return '<li class="row"><span class="ri">' + recordIcon(r) + "</span>" +
      '<span class="rm"><span class="rn">' + esc(r.name) + "</span>" +
      '<span class="rs ' + tone + '"><i class="dot"></i>' + label + "</span></span>" +
      '<span class="rp">+' + fmt(r.points) + "</span></li>";
  }

  function viewHistory(parentView) {
    var rows = state.records.filter(function (r) {
      return state.filter === "All" || r.status === state.filter;
    });

    var body;
    if (!rows.length) {
      body = '<div class="empty">' + svgIcon("history") + "<p>Nothing here yet.</p></div>";
    } else {
      var html = "";
      var last = null;
      var open = false;
      rows.forEach(function (r) {
        if (r.date !== last) {
          if (open) html += "</ul>";
          html += '<div class="day' + (last === null ? " first" : "") + '">' +
            esc(dayLabel(r.date)) + '</div><ul class="rows">';
          last = r.date;
          open = true;
        }
        html += rowHtml(r);
      });
      if (open) html += "</ul>";
      body = html;
    }

    var head = parentView
      ? '<div class="page-head"><h2>Activity</h2><p>Everything ' +
        esc(state.settings.ApplicantName || "Kexin") + " has recorded.</p></div>"
      : '<div class="page-head"><h2>My activities</h2>' +
        "<p>Everything you have done. Nice work.</p></div>";

    return head + '<div class="filters">' +
      ["All", "Approved", "Pending"].map(function (f) {
        return '<button data-filter="' + f + '" class="' +
          (state.filter === f ? "on" : "") + '">' + f + "</button>";
      }).join("") + "</div>" + body;
  }

  function viewMe() {
    var u = state.user;
    var s = state.summary;
    var child = !isParent();

    var stats = child
      ? '<div class="stats" style="margin:0 0 26px">' +
        '<div class="stat ok"><b>' + fmt(s.available) + "</b><span>Available</span></div>" +
        '<div class="stat wait"><b>' + fmt(s.pending) + "</b><span>Waiting</span></div></div>"
      : "";

    var rows = "";
    if (isParent() && u.isMainAccount) {
      rows += menuRow("sliders", "Manage activities", "", 'data-go="manage"');
    }
    if (isParent()) {
      rows += menuRow("link", "Family links", "Kexin's entrance and yours", 'data-links="1"');
    }
    rows += menuRow("refresh", "Reload from Excel", "", 'data-refresh="1"');

    return '<div class="profile">' + avatar(u, "pface") +
      "<h2>" + esc(u.name) + "</h2><p>" +
      (child ? "Applicant" : (u.isMainAccount ? "Approver · Main account" : "Approver")) +
      "</p></div>" + stats +
      '<nav class="menu">' + rows + "</nav>" +
      '<dl class="facts">' +
      fact("Signs in as", u.loginName) +
      fact("Points are called", state.settings.CurrencyName || "Points") +
      fact("Activities recorded", String(state.records.length)) +
      fact("Data file", "data/rewards.xlsx") +
      "</dl>" +
      '<button class="btn line" data-logout="1">' + svgIcon("logout", "ic-sm") +
      "Log out</button>";
  }

  function menuRow(icon, title, sub, attrs) {
    return '<button class="mrow" ' + attrs + ">" +
      '<span class="mi">' + svgIcon(icon) + "</span>" +
      '<span class="mt">' + esc(title) +
      (sub ? "<small>" + esc(sub) + "</small>" : "") + "</span>" +
      '<span class="ch">' + svgIcon("chevron", "ic-sm") + "</span></button>";
  }

  function fact(label, value) {
    return '<div class="fact"><dt>' + esc(label) + "</dt><dd>" +
      esc(value) + "</dd></div>";
  }

  function viewManage() {
    var actives = state.allTasks.filter(function (t) { return t.status === "Active"; });
    var offs = state.allTasks.filter(function (t) { return t.status !== "Active"; });

    function line(t, index, total) {
      var arrows = t.status === "Active"
        ? '<span class="arrows">' +
          '<button data-move="up" data-id="' + esc(t.taskId) + '"' +
          (index === 0 ? " disabled" : "") + ">" + svgIcon("up") + "</button>" +
          '<button data-move="down" data-id="' + esc(t.taskId) + '"' +
          (index === total - 1 ? " disabled" : "") + ">" + svgIcon("down") + "</button></span>"
        : "";
      return '<div class="mg' + (t.status === "Active" ? "" : " off") + '">' +
        '<span class="ri">' + iconMarkup(t.icon) + "</span>" +
        '<span class="mm"><strong>' + esc(t.name) + "</strong><span>" +
        fmt(t.points) + " points</span></span>" + arrows +
        '<button class="btn-sm" data-edit="' + esc(t.taskId) + '">Edit</button></div>';
    }

    var offHtml = offs.length
      ? '<h3 class="hd sp">Switched off</h3>' +
        offs.map(function (t) { return line(t, 0, 1); }).join("")
      : "";

    return '<div class="page-head"><h2>Manage activities</h2>' +
      "<p>Names, points and order. Nothing is ever deleted.</p></div>" +
      actives.map(function (t, i) { return line(t, i, actives.length); }).join("") +
      '<button class="btn line" data-newtask="1" style="margin-top:14px">' +
      svgIcon("plus", "ic-sm") + "Add an activity</button>" +
      offHtml +
      '<button class="btn quiet" data-go="me" style="margin-top:14px">Back</button>';
  }

  /* --------------------------------------------------------------- wiring */

  function each(selector, fn) {
    Array.prototype.forEach.call(elContent.querySelectorAll(selector), fn);
  }

  function wire() {
    each("[data-task]", function (el) {
      el.addEventListener("click", function () { sheetPreset(el.dataset.task); });
    });
    each("[data-custom]", function (el) {
      el.addEventListener("click", function () { sheetCustom(); });
    });
    each("[data-go]", function (el) {
      el.addEventListener("click", function () { go(el.dataset.go); });
    });
    each("[data-filter]", function (el) {
      el.addEventListener("click", function () {
        state.filter = el.dataset.filter;
        render();
      });
    });
    each("[data-review]", function (el) {
      el.addEventListener("click", function () {
        review(el.dataset.id, el.dataset.review, el);
      });
    });
    each("[data-logout]", function (el) { el.addEventListener("click", logout); });
    each("[data-links]", function (el) { el.addEventListener("click", sheetLinks); });
    each("[data-refresh]", function (el) {
      el.addEventListener("click", function () {
        refresh().then(function () {
          render();
          toast("Reloaded from Excel");
        }).catch(handleError);
      });
    });
    each("[data-edit]", function (el) {
      el.addEventListener("click", function () { sheetEditTask(el.dataset.edit); });
    });
    each("[data-newtask]", function (el) {
      el.addEventListener("click", function () { sheetEditTask(null); });
    });
    each("[data-move]", function (el) {
      el.addEventListener("click", function () { moveTask(el.dataset.id, el.dataset.move); });
    });
  }

  function handleError(err) {
    if (err && err.status === 401) { showLogin("Please log in again."); return; }
    toast(err && err.message ? err.message : "Something went wrong.", true);
  }

  /* -------------------------------------------------------------- sheets */

  function openSheet(html) {
    elSheet.innerHTML = '<div class="grabber"></div>' + html;
    elOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeSheet() {
    elOverlay.hidden = true;
    elSheet.innerHTML = "";
    document.body.style.overflow = "";
  }

  elOverlay.addEventListener("click", function (event) {
    if (event.target === elOverlay) closeSheet();
  });

  function sheetPreset(taskId) {
    var task = state.tasks.filter(function (t) { return t.taskId === taskId; })[0];
    if (!task) return;

    openSheet('<div class="sh">' +
      '<div class="shi">' + iconMarkup(task.icon, "ic-xl") + "</div>" +
      "<h3>Nicely done</h3>" +
      '<div class="shname">' + esc(task.name) + "</div>" +
      '<span class="shpts">+' + fmt(task.points) + "</span></div>" +
      '<div class="field"><label for="s-date">When did you do it?</label>' +
      '<input type="date" id="s-date" value="' + esc(state.today) +
      '" max="' + esc(state.today) + '" />' +
      '<div class="hint">Today is ' + esc(longDate(state.today)) + "</div></div>" +
      '<button class="btn solid" id="s-send">Send for approval</button>' +
      '<button class="btn quiet" id="s-cancel">Not now</button>');

    $("s-cancel").addEventListener("click", closeSheet);
    $("s-send").addEventListener("click", function () {
      var btn = this;
      btn.disabled = true;
      submit({ taskId: task.taskId, date: $("s-date").value })
        .then(function (data) { sheetDone(data.record); })
        .catch(function (err) { btn.disabled = false; handleError(err); });
    });
  }

  function sheetCustom(prefill) {
    var pre = prefill || { name: "", points: "", date: state.today };
    openSheet('<div class="sh tight">' +
      '<div class="shi">' + svgIcon("star", "ic-xl") + "</div>" +
      "<h3>What did you do?</h3>" +
      '<p class="shsub">Tell Dad &amp; Mom about something special.</p></div>' +
      '<div class="field"><label for="c-name">What did you do?</label>' +
      '<input type="text" id="c-name" maxlength="120" placeholder="Got 100 marks on my test" value="' +
      esc(pre.name) + '" /></div>' +
      '<div class="field"><label for="c-points">How many points are you asking for?</label>' +
      '<input type="number" id="c-points" min="1" max="100000" inputmode="numeric" placeholder="1000" value="' +
      esc(pre.points) + '" /></div>' +
      '<div class="field"><label for="c-date">When was it?</label>' +
      '<input type="date" id="c-date" value="' + esc(pre.date || state.today) +
      '" max="' + esc(state.today) + '" /></div>' +
      '<button class="btn solid" id="c-next">Check my request</button>' +
      '<button class="btn quiet" id="c-cancel">Cancel</button>');

    $("c-cancel").addEventListener("click", closeSheet);
    $("c-next").addEventListener("click", function () {
      var name = $("c-name").value.trim();
      var points = parseInt($("c-points").value, 10);
      if (!name) { toast("Please tell us what you did.", true); return; }
      if (!points || points < 1) { toast("Please enter how many points.", true); return; }
      sheetCustomConfirm({
        name: name, points: points, date: $("c-date").value || state.today
      });
    });
  }

  function sheetCustomConfirm(req) {
    openSheet('<div class="sh">' +
      '<div class="shi">' + svgIcon("star", "ic-xl") + "</div>" +
      "<h3>Your request</h3>" +
      '<div class="shname">' + esc(req.name) + "</div>" +
      '<span class="shpts">+' + fmt(req.points) + "</span>" +
      '<p class="shsub">' + esc(longDate(req.date)) + "</p></div>" +
      '<button class="btn solid" id="cc-send">Send for approval</button>' +
      '<button class="btn quiet" id="cc-back">Change something</button>');

    $("cc-back").addEventListener("click", function () { sheetCustom(req); });
    $("cc-send").addEventListener("click", function () {
      var btn = this;
      btn.disabled = true;
      submit({ name: req.name, points: req.points, date: req.date })
        .then(function (data) { sheetDone(data.record); })
        .catch(function (err) { btn.disabled = false; handleError(err); });
    });
  }

  function submit(payload) {
    return api("/api/records", { method: "POST", body: payload })
      .then(function (data) { return refresh().then(function () { return data; }); });
  }

  function sheetDone(record) {
    openSheet('<div class="sh">' +
      '<div class="shi">' + svgIcon("sparkle", "ic-xl") + "</div>" +
      "<h3>Sent</h3>" +
      '<span class="shpts">+' + fmt(record.points) + "</span>" +
      '<p class="shsub">Dad &amp; Mom will take a look.<br />' +
      "These points are waiting for approval.</p></div>" +
      '<button class="btn solid" id="d-ok">Done</button>');
    $("d-ok").addEventListener("click", function () { closeSheet(); render(); });
  }

  function sheetLinks() {
    var l = links();
    var local = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
    openSheet('<div class="sh tight">' +
      '<div class="shi">' + svgIcon("link", "ic-xl") + "</div>" +
      "<h3>Family links</h3>" +
      '<p class="shsub">Each address opens the login page with that name filled in.</p></div>' +
      linkBox("Kexin", "Her own screens — no approving.", l.kexin, "lk-a") +
      linkBox("Dad &amp; Mom", "Approving and settings.", l.parents, "lk-b") +
      (local
        ? '<p class="note-p">These say ' + esc(window.location.hostname) +
          ", which only works on this computer. For a phone, use the " +
          "192.168… address the Terminal printed instead.</p>"
        : "") +
      '<button class="btn quiet" id="lk-close" style="margin-top:14px">Done</button>');

    $("lk-close").addEventListener("click", closeSheet);
    wireCopy("lk-a", l.kexin);
    wireCopy("lk-b", l.parents);
  }

  function linkBox(who, what, url, id) {
    return '<div class="linkbox"><div class="lw">' + who + "</div>" +
      '<div class="lx">' + what + "</div>" +
      '<div class="lu">' + esc(url) + "</div>" +
      '<button class="btn-sm" id="' + id + '">Copy link</button></div>';
  }

  function wireCopy(id, text) {
    var btn = $(id);
    if (!btn) return;
    btn.addEventListener("click", function () {
      var done = function () {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = "Copy link"; }, 1800);
      };
      var fallback = function () {
        var box = document.createElement("textarea");
        box.value = text;
        box.setAttribute("readonly", "");
        box.style.position = "fixed";
        box.style.opacity = "0";
        document.body.appendChild(box);
        box.select();
        try { document.execCommand("copy"); done(); }
        catch (e) { toast("Please copy the link by hand.", true); }
        document.body.removeChild(box);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
    });
  }

  function sheetEditTask(taskId) {
    var task = taskId
      ? state.allTasks.filter(function (t) { return t.taskId === taskId; })[0]
      : { taskId: "", name: "", points: "", icon: "star", status: "Active" };
    if (!task) return;

    var picker = ICON_CHOICES.map(function (key) {
      return '<button type="button" data-icon="' + key + '" class="' +
        (key === task.icon ? "on" : "") + '">' + svgIcon(key) + "</button>";
    }).join("");

    var toggle = taskId
      ? '<button class="btn line" id="t-toggle">' +
        (task.status === "Active" ? "Switch this activity off" : "Switch it back on") +
        "</button>"
      : "";

    openSheet('<div class="sh tight">' +
      '<div class="shi">' + iconMarkup(task.icon, "ic-xl") + "</div>" +
      "<h3>" + (taskId ? "Edit activity" : "New activity") + "</h3></div>" +
      '<div class="field"><label for="t-name">Name</label>' +
      '<input type="text" id="t-name" maxlength="60" value="' + esc(task.name) +
      '" placeholder="Piano Practice" /></div>' +
      '<div class="field"><label for="t-points">Points</label>' +
      '<input type="number" id="t-points" min="1" inputmode="numeric" value="' +
      esc(task.points) + '" placeholder="100" /></div>' +
      '<div class="field"><label>Icon</label>' +
      '<div class="picker" id="t-icons">' + picker + "</div></div>" +
      '<button class="btn solid" id="t-save">Save</button>' + toggle +
      '<button class="btn quiet" id="t-cancel">Cancel</button>');

    var chosen = task.icon || "star";
    Array.prototype.forEach.call(elSheet.querySelectorAll("#t-icons button"), function (btn) {
      btn.addEventListener("click", function () {
        chosen = btn.dataset.icon;
        Array.prototype.forEach.call(elSheet.querySelectorAll("#t-icons button"),
          function (b) { b.classList.remove("on"); });
        btn.classList.add("on");
      });
    });

    $("t-cancel").addEventListener("click", closeSheet);

    $("t-save").addEventListener("click", function () {
      var name = $("t-name").value.trim();
      var points = parseInt($("t-points").value, 10);
      if (!name) { toast("Please enter a name.", true); return; }
      if (!points || points < 1) { toast("Points must be more than zero.", true); return; }
      var btn = this;
      btn.disabled = true;
      var url = taskId ? "/api/tasks/" + encodeURIComponent(taskId) : "/api/tasks";
      api(url, { method: "POST", body: { name: name, points: points, icon: chosen } })
        .then(refresh)
        .then(function () { closeSheet(); render(); toast("Saved to Excel"); })
        .catch(function (err) { btn.disabled = false; handleError(err); });
    });

    if (taskId) {
      $("t-toggle").addEventListener("click", function () {
        var next = task.status === "Active" ? "Inactive" : "Active";
        var btn = this;
        btn.disabled = true;
        api("/api/tasks/" + encodeURIComponent(taskId),
          { method: "POST", body: { status: next } })
          .then(refresh)
          .then(function () {
            closeSheet();
            render();
            toast(next === "Active" ? "Switched back on" : "Switched off");
          })
          .catch(function (err) { btn.disabled = false; handleError(err); });
      });
    }
  }

  /* -------------------------------------------------------------- actions */

  function review(recordId, decision, buttonEl) {
    var card = buttonEl.closest(".req");
    if (card) {
      Array.prototype.forEach.call(card.querySelectorAll("button"), function (b) {
        b.disabled = true;
      });
    }
    api("/api/records/" + encodeURIComponent(recordId) + "/review",
      { method: "POST", body: { decision: decision } })
      .then(function (data) {
        return refresh().then(function () {
          if (data.alreadyReviewed) {
            toast("Already " + data.status.toLowerCase() + " by " +
              (data.reviewedBy || "someone"));
          } else {
            toast(decision === "approve" ? "Approved — points added" : "Rejected");
          }
          render();
        });
      })
      .catch(function (err) {
        if (card) {
          Array.prototype.forEach.call(card.querySelectorAll("button"), function (b) {
            b.disabled = false;
          });
        }
        handleError(err);
      });
  }

  function moveTask(taskId, direction) {
    var actives = state.allTasks.filter(function (t) { return t.status === "Active"; });
    var ids = actives.map(function (t) { return t.taskId; });
    var i = ids.indexOf(taskId);
    var j = direction === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= ids.length) return;
    ids[i] = ids[j];
    ids[j] = taskId;

    api("/api/tasks/reorder", { method: "POST", body: { order: ids } })
      .then(refresh).then(render).catch(handleError);
  }

  /* ------------------------------------------------------------- start up */

  api("/api/me").then(function (data) {
    if (data.user) {
      state.user = data.user;
      return refresh().then(enterApp);
    }
    showLogin();
  }).catch(function () { showLogin(); });

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && state.user) {
      refresh().then(render).catch(function () { /* stay quiet */ });
    }
  });
})();
