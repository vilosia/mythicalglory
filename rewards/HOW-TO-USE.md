# Kexin Rewards — how to use it 🌟

There are two versions in this folder. Both look and work the same.

| | What it is | When to use it |
| --- | --- | --- |
| **`kexin-rewards.html`** | One single file. Just double-click it. | Quick everyday use on one device — no installing, no Terminal |
| **`kexin-rewards/`** (folder) | The Python / Flask version | One shared set of points across everyone's phones, automatic `rewards.xlsx`, and a login Kexin genuinely cannot get around |

---

## The simple version — `kexin-rewards.html`

1. **Double-click `kexin-rewards.html`.** It opens in your browser. That's it.
2. Log in (see the table below).
3. Kexin taps an activity → **Send for Approval**.
4. Dad or Mom taps **Approve**. The points are added straight away.

### Logins

| Who | Login name | Password |
| --- | --- | --- |
| **Kexin** | `kexin` | `kexin` |
| **Dad** (main account) | `daddy` | `handsome` |
| **Mom** | `mommy` | `alex` |

You stay logged in on that device until you tap **Me → Log out** — no typing the
password every day. Kexin's login has no Approve tab and no settings.

Everyone's home screen opens with their own hello — *My Dear Kexin~*,
*Hello Handsome~*, *Hi Dear* — next to their photo. The photos are baked into
the file; the greetings live in the `Greeting` column of the `Users` sheet, so
you can change them the same way as a password.

To change a password: **Export to Excel**, edit the `LoginName` / `Password`
column in the **Users** sheet, save, then **Import from Excel**.

> ⚠️ **Worth knowing:** in this single-file version the password check happens
> inside the browser, so it is a polite lock rather than a real one — anyone who
> knows how to open the browser's developer tools could get around it. If you
> want it properly enforced, use the Python version below: there the server
> checks who you are on every action, and Kexin's login simply cannot approve
> anything.

### Separate entrances for Kexin and for you

Add a `#` ending to the file's address and the login page opens with the right
name already filled in — same file, same points, different door:

| Give this to | Ending |
| --- | --- |
| **Kexin** | `kexin-rewards.html#kexin` |
| **Dad & Mom** | `kexin-rewards.html#parents` |
| *(or one each)* | `#dad` and `#mom` |

Log in as a parent and open **Me → Family Links** — it shows both links with a
**Copy link** button. Bookmark yours, and on a phone use *Share → Add to Home
Screen* so it opens like a real app on the right screen.

### Where is the data?

Inside the browser you opened it in. It stays there when you close the tab or
restart the computer — but it belongs to **that one browser on that one
computer**.

### Reading and editing the data in Excel

Log in as **Dad** or **Mom** → **Me → Excel Backup**:

- **Export to Excel** — downloads `rewards.xlsx` with all four sheets
  (Users, Tasks, Records, Settings). Open it in Excel or Numbers and read it
  like any normal spreadsheet.
- **Import from Excel** — take that file, change whatever you like (points, a
  wrong status, a date, add a row by hand), save it, then import it back. The
  app replaces its data with what is in the file.
- **Start Over** — back to the four activities and Kexin's history up to
  20 Aug 2026 (8,000 points).

Do keep the four sheet names and their header rows exactly as they are.
`Status` in `Records` must be `Pending`, `Approved` or `Rejected`.
Only **Approved** rows count towards Kexin's points.

> **Please export now and then.** It is your backup. If you clear your
> browsing data, or use a different browser, the points are gone otherwise.

### Using it on the phone

- **Easiest:** put `kexin-rewards.html` in iCloud Drive / Google Drive and open
  it from the Files app. In Safari or Chrome, use *Share → Add to Home Screen*
  and it behaves like a real app.
- Remember that each device keeps its own points, because the data lives in the
  browser. If Kexin records something on her iPad, Dad's phone will not see it.
  To share one set of points across devices, use the Python version below.

---

## The shared version — the `kexin-rewards` folder

This one runs a tiny server on your computer, so every phone on your Wi-Fi sees
the same points, and it writes into `data/rewards.xlsx` automatically — no
export or import needed.

1. Open a Terminal in the `kexin-rewards` folder
2. `pip install -r requirements.txt` (only the first time)
3. `python app.py`
4. Open the address it prints — and the `192.168.x.x` one on your phone

Here the two entrances are proper web addresses:

- Kexin: `http://192.168.x.x:5000/kexin`
- Dad & Mom: `http://192.168.x.x:5000/parents`

Full details are in `kexin-rewards/README.md`.

---

## Which one should we use?

- Only one device, want zero setup → **`kexin-rewards.html`**
- Kexin and both parents each on their own phone, and you want the approval
  rules properly enforced → the **Python version**
