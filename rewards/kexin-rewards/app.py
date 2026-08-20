"""
Kexin Rewards
=============
A tiny family reward-points app for one child.

Everything is stored in a normal Excel workbook (data/rewards.xlsx) so that
parents can open it, read it, and edit it by hand. There is no database.

Run with:  python app.py
"""

import os
import re
import secrets
import shutil
import tempfile
import time
from datetime import datetime, date, timedelta

from flask import Flask, jsonify, render_template, request, session
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

# ---------------------------------------------------------------------------
# Paths / constants
# ---------------------------------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
EXCEL_PATH = os.path.join(DATA_DIR, "rewards.xlsx")
SECRET_PATH = os.path.join(DATA_DIR, "secret.key")

SHEET_USERS = "Users"
SHEET_TASKS = "Tasks"
SHEET_RECORDS = "Records"
SHEET_SETTINGS = "Settings"

HEADERS = {
    SHEET_USERS: ["UserID", "Name", "Role", "IsMainAccount", "Status",
                  "LoginName", "Password", "Greeting"],
    SHEET_TASKS: ["TaskID", "TaskName", "Points", "Icon", "Status", "SortOrder"],
    SHEET_RECORDS: [
        "RecordID",
        "Applicant",
        "Date",
        "TaskType",
        "TaskID",
        "TaskName",
        "Points",
        "Status",
        "SubmittedAt",
        "ReviewedBy",
        "ReviewedAt",
        "Note",
    ],
    SHEET_SETTINGS: ["Setting", "Value"],
}

COLUMN_WIDTHS = {
    SHEET_USERS: [10, 16, 14, 16, 10, 16, 16, 24],
    SHEET_TASKS: [10, 26, 10, 14, 10, 12],
    SHEET_RECORDS: [10, 14, 14, 12, 10, 30, 10, 12, 20, 14, 20, 30],
    SHEET_SETTINGS: [20, 30],
}

# Login names and passwords live in the Users sheet so parents can change
# them in Excel whenever they like.
SEED_USERS = [
    ["001", "Kexin", "Applicant", "No", "Active", "kexin", "kexin",
     "My Dear Kexin~"],
    ["002", "Dad", "Approver", "Yes", "Active", "daddy", "handsome",
     "Hello Handsome~"],
    ["003", "Mom", "Approver", "No", "Active", "mommy", "alex",
     "Hi Dear"],
]

# Used when an older workbook is opened that has no login columns yet.
DEFAULT_LOGINS = {
    "kexin": ("kexin", "kexin"),
    "dad": ("daddy", "handsome"),
    "mom": ("mommy", "alex"),
}

# The hello each person sees at the top of their home screen.
DEFAULT_GREETINGS = {
    "kexin": "My Dear Kexin~",
    "dad": "Hello Handsome~",
    "mom": "Hi Dear",
}

SEED_TASKS = [
    ["T001", "Piano Practice", 100, "piano", "Active", 1],
    ["T002", "Cello Practice", 500, "cello", "Active", 2],
    ["T003", "House Chores", 500, "housework", "Active", 3],
    ["T004", "Shower for Claire", 500, "shower", "Active", 4],
]

SEED_SETTINGS = [
    ["AppName", "Kexin Rewards"],
    ["CurrencyName", "Points"],
    ["ApplicantName", "Kexin"],
]

# Kexin's real history, as recorded by Dad up to 20 Aug 2026.
# RecordID, Applicant, Date, TaskType, TaskID, TaskName, Points, Status,
# SubmittedAt, ReviewedBy, ReviewedAt, Note
_HISTORY = [
    ("2026-08-04", "T002"), ("2026-08-04", "T003"),
    ("2026-08-05", "T002"),
    ("2026-08-06", "T002"), ("2026-08-06", "T001"),
    ("2026-08-07", "T002"), ("2026-08-07", "T002"), ("2026-08-07", "T001"),
    ("2026-08-08", "T001"),
    ("2026-08-09", "T003"),
    ("2026-08-10", "T002"), ("2026-08-10", "T003"),
    ("2026-08-11", "T004"),
    ("2026-08-14", "T003"),
    ("2026-08-15", "T002"),
    ("2026-08-16", "T002"),
    ("2026-08-18", "T002"), ("2026-08-18", "T003"),
    ("2026-08-19", "T001"),
    ("2026-08-20", "T001"),
]


def _seed_records():
    by_id = {task[0]: task for task in SEED_TASKS}
    rows = []
    for index, (when, task_id) in enumerate(_HISTORY, start=1):
        task = by_id[task_id]
        rows.append([
            "R%03d" % index, "Kexin", when, "Preset", task_id, task[1], task[2],
            "Approved", when, "Dad", when, "",
        ])
    return rows


SEED_RECORDS = _seed_records()

# Icon keys -> emoji. Unknown keys fall back to a friendly star.
ICON_EMOJI = {
    "piano": "\U0001F3B9",       # keyboard
    "violin": "\U0001F3BB",      # violin
    "cello": "\U0001F3BB",       # (no cello emoji exists - violin is closest)
    "shower": "\U0001F6BF",      # shower
    "housework": "\U0001F3E0",   # house
    "helping": "\U0001F49B",     # yellow heart
    "reading": "\U0001F4D8",     # book
    "study": "✏️",     # pencil
    "sport": "⚽",           # ball
    "art": "\U0001F3A8",         # palette
    "star": "⭐",            # star
    "custom": "⭐",
    "sleep": "\U0001F31B",
    "teeth": "\U0001FAA5",
    "pet": "\U0001F436",
    "tidy": "\U0001F9F9",
}
DEFAULT_ICON = "star"

STATUS_PENDING = "Pending"
STATUS_APPROVED = "Approved"
STATUS_REJECTED = "Rejected"

app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False


def _load_secret():
    """A stable key so everyone stays logged in when the app restarts."""
    os.makedirs(DATA_DIR, exist_ok=True)
    if os.path.exists(SECRET_PATH):
        try:
            with open(SECRET_PATH, "r", encoding="utf-8") as handle:
                saved = handle.read().strip()
            if saved:
                return saved
        except OSError:
            pass
    fresh = secrets.token_hex(32)
    try:
        with open(SECRET_PATH, "w", encoding="utf-8") as handle:
            handle.write(fresh)
    except OSError:
        pass  # falls back to a per-run key; everyone just logs in again
    return fresh


app.secret_key = _load_secret()
app.permanent_session_lifetime = timedelta(days=90)


# ---------------------------------------------------------------------------
# Small errors we can show nicely in the UI
# ---------------------------------------------------------------------------

class ExcelLockedError(Exception):
    """Raised when rewards.xlsx cannot be written (usually open in Excel)."""


class AppError(Exception):
    def __init__(self, message, status=400):
        super().__init__(message)
        self.message = message
        self.status = status


# ---------------------------------------------------------------------------
# Workbook creation
# ---------------------------------------------------------------------------

HEADER_FILL = PatternFill("solid", fgColor="FFF0D9")
HEADER_FONT = Font(bold=True, color="6B4E16")


def _write_sheet(ws, headers, rows, widths):
    ws.append(headers)
    for cell in ws[1]:
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = Alignment(vertical="center")
    for row in rows:
        ws.append(row)
    for idx, width in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(idx)].width = width
    ws.freeze_panes = "A2"


def create_workbook():
    """Create data/rewards.xlsx with all sheets and friendly demo data."""
    os.makedirs(DATA_DIR, exist_ok=True)
    wb = Workbook()

    ws = wb.active
    ws.title = SHEET_USERS
    _write_sheet(ws, HEADERS[SHEET_USERS], SEED_USERS, COLUMN_WIDTHS[SHEET_USERS])

    _write_sheet(wb.create_sheet(SHEET_TASKS), HEADERS[SHEET_TASKS],
                 SEED_TASKS, COLUMN_WIDTHS[SHEET_TASKS])
    _write_sheet(wb.create_sheet(SHEET_RECORDS), HEADERS[SHEET_RECORDS],
                 SEED_RECORDS, COLUMN_WIDTHS[SHEET_RECORDS])
    _write_sheet(wb.create_sheet(SHEET_SETTINGS), HEADERS[SHEET_SETTINGS],
                 SEED_SETTINGS, COLUMN_WIDTHS[SHEET_SETTINGS])

    _save(wb)
    return wb


def ensure_workbook():
    if not os.path.exists(EXCEL_PATH):
        create_workbook()


def _open_workbook():
    """Open the workbook, repairing / creating it if needed."""
    ensure_workbook()
    try:
        wb = load_workbook(EXCEL_PATH)
    except Exception as exc:  # corrupt or unreadable file
        raise AppError(
            "We could not read data/rewards.xlsx. Please close it in Excel and "
            "try again, or rename the file so a fresh one can be created. "
            "(%s)" % exc,
            status=500,
        )

    # Make sure every expected sheet exists (a parent may have deleted one).
    changed = False
    seeds = {
        SHEET_USERS: SEED_USERS,
        SHEET_TASKS: SEED_TASKS,
        SHEET_RECORDS: [],
        SHEET_SETTINGS: SEED_SETTINGS,
    }
    for name, headers in HEADERS.items():
        if name not in wb.sheetnames:
            _write_sheet(wb.create_sheet(name), headers, seeds[name],
                         COLUMN_WIDTHS[name])
            changed = True
    if changed:
        _save(wb)

    # Older workbooks were created before logins existed - top them up.
    _migrate_users(wb)
    return wb


def _migrate_users(wb):
    """Add LoginName / Password to the Users sheet if they are missing."""
    ws = wb[SHEET_USERS]
    headers = [str(_clean(cell.value)) for cell in ws[1]]

    changed = False
    for wanted in ("LoginName", "Password", "Greeting"):
        if wanted not in headers:
            headers.append(wanted)
            ws.cell(row=1, column=len(headers)).value = wanted
            cell = ws.cell(row=1, column=len(headers))
            cell.fill = HEADER_FILL
            cell.font = HEADER_FONT
            ws.column_dimensions[get_column_letter(len(headers))].width = 16
            changed = True

    name_col = headers.index("Name") + 1 if "Name" in headers else 2
    login_col = headers.index("LoginName") + 1
    pass_col = headers.index("Password") + 1
    greet_col = headers.index("Greeting") + 1

    for row in range(2, ws.max_row + 1):
        who = str(_clean(ws.cell(row=row, column=name_col).value)).strip()
        if not who:
            continue
        default = DEFAULT_LOGINS.get(who.lower(), (who.lower(), who.lower()))
        if _clean(ws.cell(row=row, column=login_col).value) == "":
            ws.cell(row=row, column=login_col).value = default[0]
            changed = True
        if _clean(ws.cell(row=row, column=pass_col).value) == "":
            ws.cell(row=row, column=pass_col).value = default[1]
            changed = True
        if _clean(ws.cell(row=row, column=greet_col).value) == "":
            ws.cell(row=row, column=greet_col).value = DEFAULT_GREETINGS.get(
                who.lower(), "Hi " + who)
            changed = True

    if changed:
        try:
            _save(wb)
        except ExcelLockedError:
            # Excel is open right now: this run uses the values we just set in
            # memory and the file gets topped up next time.
            pass
    return changed


def _save(wb):
    """Save safely: write to a temp file first, then replace the real one."""
    os.makedirs(DATA_DIR, exist_ok=True)
    try:
        fd, tmp_path = tempfile.mkstemp(suffix=".xlsx", dir=DATA_DIR)
        os.close(fd)
    except OSError as exc:
        raise ExcelLockedError(
            "We could not write into the data folder (%s). Please close "
            "rewards.xlsx in Excel and check the folder is not read-only." % exc
        )
    try:
        wb.save(tmp_path)
        shutil.move(tmp_path, EXCEL_PATH)
    except PermissionError:
        _cleanup(tmp_path)
        raise ExcelLockedError(
            "rewards.xlsx looks like it is open in Excel. Please close the file "
            "and try again — nothing was lost."
        )
    except OSError as exc:
        _cleanup(tmp_path)
        raise ExcelLockedError(
            "We could not save data/rewards.xlsx (%s). Please close the file in "
            "Excel and try again." % exc
        )


def _cleanup(path):
    try:
        if os.path.exists(path):
            os.remove(path)
    except OSError:
        pass


# ---------------------------------------------------------------------------
# Reading helpers
# ---------------------------------------------------------------------------

def _clean(value):
    """Turn a raw cell value into a plain, human-friendly Python value."""
    if value is None:
        return ""
    if isinstance(value, datetime):
        if value.hour or value.minute or value.second:
            return value.strftime("%Y-%m-%d %H:%M")
        return value.strftime("%Y-%m-%d")
    if isinstance(value, date):
        return value.strftime("%Y-%m-%d")
    if isinstance(value, float) and value.is_integer():
        return int(value)
    if isinstance(value, str):
        return value.strip()
    return value


def read_rows(wb, sheet_name):
    """Read a worksheet as a list of dicts keyed by the header row."""
    if sheet_name not in wb.sheetnames:
        return []
    ws = wb[sheet_name]
    rows = ws.iter_rows(values_only=True)
    try:
        header_row = next(rows)
    except StopIteration:
        return []

    headers = [str(_clean(h)) for h in header_row]
    out = []
    for excel_row_index, raw in enumerate(rows, start=2):
        values = [_clean(v) for v in raw]
        if all(v == "" for v in values):
            continue  # blank spacer row
        item = {}
        for i, key in enumerate(headers):
            if not key:
                continue
            item[key] = values[i] if i < len(values) else ""
        item["_row"] = excel_row_index
        out.append(item)
    return out


def to_int(value, default=0):
    try:
        if isinstance(value, str):
            value = value.replace(",", "").strip()
            if value == "":
                return default
        return int(round(float(value)))
    except (TypeError, ValueError):
        return default


def to_date_str(value, default=None):
    """Normalise anything date-ish into YYYY-MM-DD."""
    if value in (None, ""):
        return default or date.today().strftime("%Y-%m-%d")
    if isinstance(value, datetime):
        return value.strftime("%Y-%m-%d")
    if isinstance(value, date):
        return value.strftime("%Y-%m-%d")
    text = str(value).strip()
    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%d/%m/%Y", "%d-%m-%Y", "%d %b %Y",
                "%d %B %Y", "%Y-%m-%d %H:%M", "%Y-%m-%d %H:%M:%S"):
        try:
            return datetime.strptime(text[:19], fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return default or date.today().strftime("%Y-%m-%d")


def now_stamp():
    return datetime.now().strftime("%Y-%m-%d %H:%M")


def next_id(existing, prefix, width=3):
    """Generate the next sequential id, e.g. R007 / T005."""
    biggest = 0
    pattern = re.compile(r"^%s(\d+)$" % re.escape(prefix), re.IGNORECASE)
    for value in existing:
        match = pattern.match(str(value).strip())
        if match:
            biggest = max(biggest, int(match.group(1)))
    return "%s%s" % (prefix, str(biggest + 1).zfill(width))


def icon_emoji(icon_key):
    key = str(icon_key or "").strip().lower()
    if key in ICON_EMOJI:
        return ICON_EMOJI[key]
    # A parent may have typed an emoji straight into the Icon column.
    if key and not key.isascii():
        return str(icon_key).strip()
    return ICON_EMOJI[DEFAULT_ICON]


# ---------------------------------------------------------------------------
# Domain shaping
# ---------------------------------------------------------------------------

def get_settings(wb):
    settings = {}
    for row in read_rows(wb, SHEET_SETTINGS):
        key = str(row.get("Setting", "")).strip()
        if key:
            settings[key] = row.get("Value", "")
    settings.setdefault("AppName", "Kexin Rewards")
    settings.setdefault("CurrencyName", "Points")
    settings.setdefault("ApplicantName", "Kexin")
    return settings


def get_users(wb):
    users = []
    for row in read_rows(wb, SHEET_USERS):
        name = str(row.get("Name", "")).strip()
        if not name:
            continue
        if str(row.get("Status", "Active")).strip().lower() == "inactive":
            continue
        default = DEFAULT_LOGINS.get(name.lower(), (name.lower(), name.lower()))
        users.append({
            "userId": str(row.get("UserID", "")).strip(),
            "name": name,
            "role": str(row.get("Role", "")).strip() or "Approver",
            "isMainAccount": str(row.get("IsMainAccount", "No")).strip().lower()
            in ("yes", "y", "true", "1"),
            "loginName": str(row.get("LoginName", "")).strip() or default[0],
            "password": str(row.get("Password", "")).strip() or default[1],
            "greeting": str(row.get("Greeting", "")).strip() or
            DEFAULT_GREETINGS.get(name.lower(), "Hi " + name),
        })
    return users


def public_user(user):
    """What the browser is allowed to know - never the password."""
    if not user:
        return None
    return {
        "name": user["name"],
        "role": user["role"],
        "isMainAccount": user["isMainAccount"],
        "loginName": user["loginName"],
        "greeting": user["greeting"],
    }


def get_tasks(wb, include_inactive=False):
    tasks = []
    for row in read_rows(wb, SHEET_TASKS):
        task_id = str(row.get("TaskID", "")).strip()
        name = str(row.get("TaskName", "")).strip()
        if not task_id or not name:
            continue
        status = str(row.get("Status", "Active")).strip().title() or "Active"
        if status != "Active" and not include_inactive:
            continue
        icon_key = str(row.get("Icon", "")).strip() or DEFAULT_ICON
        tasks.append({
            "taskId": task_id,
            "name": name,
            "points": to_int(row.get("Points"), 0),
            "icon": icon_key,
            "emoji": icon_emoji(icon_key),
            "status": status,
            "sortOrder": to_int(row.get("SortOrder"), 999),
        })
    tasks.sort(key=lambda t: (t["sortOrder"], t["taskId"]))
    return tasks


def get_records(wb, task_lookup=None):
    task_lookup = task_lookup or {}
    records = []
    for row in read_rows(wb, SHEET_RECORDS):
        record_id = str(row.get("RecordID", "")).strip()
        name = str(row.get("TaskName", "")).strip()
        if not record_id and not name:
            continue
        status = str(row.get("Status", STATUS_PENDING)).strip().title()
        if status not in (STATUS_PENDING, STATUS_APPROVED, STATUS_REJECTED):
            status = STATUS_PENDING
        task_id = str(row.get("TaskID", "")).strip()
        task_type = str(row.get("TaskType", "")).strip().title() or (
            "Preset" if task_id else "Custom")
        icon_key = task_lookup.get(task_id, {}).get("icon") if task_id else None
        records.append({
            "recordId": record_id,
            "applicant": str(row.get("Applicant", "")).strip(),
            "date": to_date_str(row.get("Date")),
            "taskType": task_type,
            "taskId": task_id,
            "name": name,
            "points": to_int(row.get("Points"), 0),
            "status": status,
            "submittedAt": str(row.get("SubmittedAt", "")).strip(),
            "reviewedBy": str(row.get("ReviewedBy", "")).strip(),
            "reviewedAt": str(row.get("ReviewedAt", "")).strip(),
            "note": str(row.get("Note", "")).strip(),
            "emoji": icon_emoji(icon_key) if icon_key else ICON_EMOJI["star"],
        })
    records.sort(key=lambda r: (r["date"], r["submittedAt"], r["recordId"]),
                 reverse=True)
    return records


def build_state(include_inactive_tasks=False):
    wb = _open_workbook()
    settings = get_settings(wb)
    users = get_users(wb)
    all_tasks = get_tasks(wb, include_inactive=True)
    lookup = {t["taskId"]: t for t in all_tasks}
    records = get_records(wb, lookup)

    approved = sum(r["points"] for r in records if r["status"] == STATUS_APPROVED)
    pending_records = [r for r in records if r["status"] == STATUS_PENDING]
    pending = sum(r["points"] for r in pending_records)

    tasks = all_tasks if include_inactive_tasks else [
        t for t in all_tasks if t["status"] == "Active"]

    return {
        "settings": settings,
        "users": [public_user(u) for u in users],
        "tasks": tasks,
        "allTasks": all_tasks,
        "records": records,
        "summary": {
            "available": approved,
            "pending": pending,
            "pendingCount": len(pending_records),
            "lifetime": approved,
        },
        "today": date.today().strftime("%Y-%m-%d"),
    }


# ---------------------------------------------------------------------------
# Who is logged in
#
# The browser only ever sends a signed session cookie - never a role. Every
# endpoint below looks the role up again from the Users sheet, so Kexin cannot
# approve her own requests even if she pokes at the addresses by hand.
# ---------------------------------------------------------------------------

def current_user(wb=None):
    name = session.get("user")
    if not name:
        return None
    book = wb or _open_workbook()
    for user in get_users(book):
        if user["name"] == name:
            return user
    return None


def require_login(wb=None):
    user = current_user(wb)
    if not user:
        raise AppError("Please log in first.", status=401)
    return user


def require_applicant(wb=None):
    user = require_login(wb)
    if user["role"].lower() != "applicant":
        raise AppError("Only Kexin can send activities for approval.", status=403)
    return user


def require_approver(wb=None):
    user = require_login(wb)
    if user["role"].lower() == "applicant":
        raise AppError("Only Dad or Mom can approve or reject requests.", status=403)
    return user


def require_main_account(wb=None):
    user = require_login(wb)
    if user["role"].lower() == "applicant" or not user["isMainAccount"]:
        raise AppError("Only the main account can manage the activities.", status=403)
    return user


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.errorhandler(ExcelLockedError)
def handle_locked(err):
    return jsonify({"ok": False, "error": str(err), "code": "excel_locked"}), 423


@app.errorhandler(AppError)
def handle_app_error(err):
    return jsonify({"ok": False, "error": err.message}), err.status


@app.route("/")
def index():
    """Everyone: shows all three profiles. Handy for testing."""
    ensure_workbook()
    return render_template("index.html", gate="all")


# Separate entrances, so each person can be sent their own link.
#   /kexin    -> goes straight into Kexin's screens
#   /parents  -> Dad & Mom only (they pick which one they are)
#   /dad /mom -> straight into that parent's screens
@app.route("/kexin")
def index_kexin():
    ensure_workbook()
    return render_template("index.html", gate="kexin")


@app.route("/parents")
def index_parents():
    ensure_workbook()
    return render_template("index.html", gate="parents")


@app.route("/dad")
def index_dad():
    ensure_workbook()
    return render_template("index.html", gate="dad")


@app.route("/mom")
def index_mom():
    ensure_workbook()
    return render_template("index.html", gate="mom")


@app.route("/api/login", methods=["POST"])
def api_login():
    payload = request.get_json(silent=True) or {}
    login_name = str(payload.get("loginName") or "").strip().lower()
    password = str(payload.get("password") or "").strip()

    if not login_name or not password:
        raise AppError("Please fill in both boxes.", status=400)

    wb = _open_workbook()
    for user in get_users(wb):
        if user["loginName"].lower() == login_name and user["password"] == password:
            session.clear()
            session.permanent = True
            session["user"] = user["name"]
            return jsonify({"ok": True, "user": public_user(user)})

    time.sleep(0.5)  # a small pause, so guessing is no fun
    raise AppError("That login name and password do not match. Please try again.",
                   status=401)


@app.route("/api/logout", methods=["POST"])
def api_logout():
    session.clear()
    return jsonify({"ok": True})


@app.route("/api/me")
def api_me():
    return jsonify({"ok": True, "user": public_user(current_user())})


@app.route("/api/state")
def api_state():
    wb = _open_workbook()
    user = require_login(wb)
    include_inactive = request.args.get("includeInactive") in ("1", "true", "yes")
    state = build_state(include_inactive_tasks=include_inactive)
    state["ok"] = True
    state["me"] = public_user(user)
    return jsonify(state)


@app.route("/api/records", methods=["POST"])
def api_create_record():
    payload = request.get_json(silent=True) or {}

    wb = _open_workbook()
    me = require_applicant(wb)          # the browser cannot claim to be someone else

    task_id = str(payload.get("taskId") or "").strip()
    raw_name = str(payload.get("name") or "").strip()
    note = str(payload.get("note") or "").strip()
    record_date = to_date_str(payload.get("date"))
    applicant = me["name"]

    tasks = {t["taskId"]: t for t in get_tasks(wb, include_inactive=True)}

    if task_id:
        task = tasks.get(task_id)
        if not task:
            raise AppError("We could not find that activity. Please refresh.")
        if task["status"] != "Active":
            raise AppError("That activity is not available right now.")
        task_type = "Preset"
        name = task["name"]
        points = task["points"]          # preset points cannot be changed
    else:
        task_type = "Custom"
        name = raw_name
        if not name:
            raise AppError("Please tell us what you did.")
        if len(name) > 120:
            name = name[:120]
        points = to_int(payload.get("points"), -1)
        if points <= 0:
            raise AppError("Please enter how many points you are asking for.")
        if points > 1000000:
            raise AppError("That is a very big number — please try a smaller one.")

    ws = wb[SHEET_RECORDS]
    existing_ids = [row.get("RecordID") for row in read_rows(wb, SHEET_RECORDS)]
    record_id = next_id(existing_ids, "R")

    ws.append([
        record_id, applicant, record_date, task_type, task_id, name, points,
        STATUS_PENDING, now_stamp(), "", "", note,
    ])
    _save(wb)

    return jsonify({
        "ok": True,
        "record": {
            "recordId": record_id,
            "name": name,
            "points": points,
            "date": record_date,
            "status": STATUS_PENDING,
        },
    })


@app.route("/api/records/<record_id>/review", methods=["POST"])
def api_review_record(record_id):
    payload = request.get_json(silent=True) or {}
    decision = str(payload.get("decision") or "").strip().lower()
    note = str(payload.get("note") or "").strip()

    wb = _open_workbook()
    me = require_approver(wb)           # <- Kexin's session is refused here
    reviewer = me["name"]

    if decision not in ("approve", "reject"):
        raise AppError("Please choose Approve or Reject.")

    headers = HEADERS[SHEET_RECORDS]
    col = {name: headers.index(name) + 1 for name in headers}
    ws = wb[SHEET_RECORDS]

    target = None
    for row in read_rows(wb, SHEET_RECORDS):
        if str(row.get("RecordID", "")).strip() == record_id:
            target = row
            break
    if target is None:
        raise AppError("That request no longer exists. Please refresh.", status=404)

    current = str(target.get("Status", "")).strip().title()
    if current in (STATUS_APPROVED, STATUS_REJECTED):
        # Someone (or the other parent) already handled it - only one is needed.
        return jsonify({
            "ok": True,
            "alreadyReviewed": True,
            "status": current,
            "reviewedBy": str(target.get("ReviewedBy", "")).strip(),
        })

    new_status = STATUS_APPROVED if decision == "approve" else STATUS_REJECTED
    row_index = target["_row"]
    ws.cell(row=row_index, column=col["Status"]).value = new_status
    ws.cell(row=row_index, column=col["ReviewedBy"]).value = reviewer
    ws.cell(row=row_index, column=col["ReviewedAt"]).value = now_stamp()
    if note:
        ws.cell(row=row_index, column=col["Note"]).value = note
    _save(wb)

    return jsonify({"ok": True, "status": new_status, "reviewedBy": reviewer})


# --- Dad only: manage preset activities -----------------------------------

@app.route("/api/tasks", methods=["POST"])
def api_create_task():
    payload = request.get_json(silent=True) or {}
    wb = _open_workbook()
    require_main_account(wb)

    name = str(payload.get("name") or "").strip()
    if not name:
        raise AppError("Please give the activity a name.")
    points = to_int(payload.get("points"), -1)
    if points <= 0:
        raise AppError("Points must be a number greater than zero.")
    icon = str(payload.get("icon") or DEFAULT_ICON).strip() or DEFAULT_ICON

    existing = read_rows(wb, SHEET_TASKS)
    task_id = next_id([r.get("TaskID") for r in existing], "T")
    sort_order = max([to_int(r.get("SortOrder"), 0) for r in existing] or [0]) + 1

    wb[SHEET_TASKS].append([task_id, name, points, icon, "Active", sort_order])
    _save(wb)
    return jsonify({"ok": True, "taskId": task_id})


@app.route("/api/tasks/<task_id>", methods=["POST"])
def api_update_task(task_id):
    payload = request.get_json(silent=True) or {}
    wb = _open_workbook()
    require_main_account(wb)

    headers = HEADERS[SHEET_TASKS]
    col = {name: headers.index(name) + 1 for name in headers}
    ws = wb[SHEET_TASKS]

    target = None
    for row in read_rows(wb, SHEET_TASKS):
        if str(row.get("TaskID", "")).strip() == task_id:
            target = row
            break
    if target is None:
        raise AppError("That activity no longer exists.", status=404)

    row_index = target["_row"]

    if "name" in payload:
        name = str(payload.get("name") or "").strip()
        if not name:
            raise AppError("Please give the activity a name.")
        ws.cell(row=row_index, column=col["TaskName"]).value = name

    if "points" in payload:
        points = to_int(payload.get("points"), -1)
        if points <= 0:
            raise AppError("Points must be a number greater than zero.")
        ws.cell(row=row_index, column=col["Points"]).value = points

    if "icon" in payload:
        icon = str(payload.get("icon") or DEFAULT_ICON).strip() or DEFAULT_ICON
        ws.cell(row=row_index, column=col["Icon"]).value = icon

    if "status" in payload:
        status = str(payload.get("status") or "").strip().title()
        if status not in ("Active", "Inactive"):
            raise AppError("Status must be Active or Inactive.")
        # Tasks are never deleted - we only switch them off.
        ws.cell(row=row_index, column=col["Status"]).value = status

    _save(wb)
    return jsonify({"ok": True})


@app.route("/api/tasks/reorder", methods=["POST"])
def api_reorder_tasks():
    payload = request.get_json(silent=True) or {}
    wb = _open_workbook()
    require_main_account(wb)
    order = payload.get("order") or []
    if not isinstance(order, list) or not order:
        raise AppError("Nothing to reorder.")

    headers = HEADERS[SHEET_TASKS]
    col = {name: headers.index(name) + 1 for name in headers}
    ws = wb[SHEET_TASKS]
    rows = {str(r.get("TaskID", "")).strip(): r["_row"]
            for r in read_rows(wb, SHEET_TASKS)}

    position = 1
    for task_id in order:
        row_index = rows.get(str(task_id).strip())
        if row_index:
            ws.cell(row=row_index, column=col["SortOrder"]).value = position
            position += 1
    _save(wb)
    return jsonify({"ok": True})


@app.route("/api/health")
def api_health():
    return jsonify({"ok": True, "excel": EXCEL_PATH,
                    "exists": os.path.exists(EXCEL_PATH)})


# ---------------------------------------------------------------------------

def main():
    ensure_workbook()
    port = int(os.environ.get("PORT", "5000"))
    print("\n  Kexin Rewards is starting up!")
    print("  Data file: %s" % EXCEL_PATH)
    print("  Open this address on your phone or computer:")
    print("    http://127.0.0.1:%d\n" % port)
    app.run(host="0.0.0.0", port=port, debug=False)


if __name__ == "__main__":
    main()
