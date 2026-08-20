# Kexin Rewards 🌟

A tiny family reward-points app for Kexin.

Kexin records what she did → Dad or Mom approves it → she earns points.

Everything is stored in one ordinary Excel file, so parents can also open it
and edit it by hand.

---

## How to start it

1. **Install Python**
   Download it from <https://www.python.org/downloads/> (any version 3.9 or newer).
   On Windows, tick **"Add Python to PATH"** during install.

2. **Open a Terminal in this folder**
   - Mac: right-click the `kexin-rewards` folder → *New Terminal at Folder*
   - Windows: open the folder, click the address bar, type `cmd`, press Enter

3. **Install the two things it needs** (only the first time)

   ```
   pip install -r requirements.txt
   ```

   If `pip` is not found, try `pip3` or `python3 -m pip` instead.

4. **Start the app**

   ```
   python app.py
   ```

   (If `python` is not found, try `python3`.)

5. **Open the address it prints**

   ```
   http://127.0.0.1:5000
   ```

6. **To stop the app**, go back to the Terminal and press `Ctrl + C`.

---

## Using it on your phone

While the app is running on your computer, both devices need to be on the
**same Wi-Fi**. The terminal also prints a `http://192.168.x.x:5000` style
address — open that one on the phone.

Tip: in Safari or Chrome on the phone, use *Share → Add to Home Screen* so it
opens like a real app.

---

## Logging in

Everyone has their own login name and password:

| Who | Login name | Password | Can do |
| --- | --- | --- | --- |
| **Kexin** | `kexin` | `kexin` | Record activities, see her points and history |
| **Dad** (main account) | `daddy` | `handsome` | Approve / reject, **Manage Activities** |
| **Mom** | `mommy` | `alex` | Approve / reject |

Only **one** parent needs to approve a request.

You stay logged in on that phone or computer until you tap **Me → Log out**, so
nobody has to type the password every day.

### This is checked on the server, not just hidden in the app

Kexin's login simply **cannot** approve anything. It is not a matter of the
Approve tab being hidden from her — the app checks who you are on every single
action, so even if she typed the parents' address by hand, or poked at the
app's addresses directly, approving, rejecting and editing the activities are
all refused. She also cannot record an activity under somebody else's name.

### Each person's own link

Give everyone their own address and the login page opens with their name already
filled in. Replace `192.168.1.20` with whatever address the Terminal printed.

| Give this to | Link |
| --- | --- |
| **Kexin** | `http://192.168.1.20:5000/kexin` |
| **Dad & Mom** | `http://192.168.1.20:5000/parents` |
| *(or one each)* | `…/dad` and `…/mom` |

Log in as a parent and open **Me → Family Links** — it shows both links with a
**Copy link** button, ready to send by message.

Tip: open the link once on the phone and log in, then use *Share → Add to Home
Screen*. It stays logged in and opens straight onto the right screen.

### Greetings and photos

Each person's home screen opens with their own hello next to their photo:

| Who | Greeting |
| --- | --- |
| Kexin | *My Dear Kexin~* |
| Dad | *Hello Handsome~* |
| Mom | *Hi Dear* |

The wording lives in the `Greeting` column of the **Users** sheet — change it in
Excel and it changes in the app. The photos are the three files in
`static/img/`; drop in a different square-ish `kexin.jpg`, `dad.jpg` or
`mom.jpg` to swap somebody's picture.

### Changing a password

Open `data/rewards.xlsx`, go to the **Users** sheet, and type a new value in the
`LoginName` or `Password` column. Save, and the new one works immediately.

Because the passwords sit in the spreadsheet in plain text, treat them as a
friendly lock between family members — not as something to reuse anywhere else.

---

## The Excel file is the database

Everything lives in:

```
data/rewards.xlsx
```

It is created automatically the first time you run the app, already filled in
with Kexin's history up to **20 August 2026** — 20 activities, **8,000 points**.

### Sheets

| Sheet | What it holds |
| --- | --- |
| `Users` | Kexin, Dad, Mom — logins, passwords and their greetings |
| `Tasks` | The preset activities and their points |
| `Records` | Every submitted activity — the main history |
| `Settings` | App name, what points are called, applicant name |

### Editing by hand

You can open `data/rewards.xlsx` in Excel / Numbers / Google Sheets and change
things directly. For example, change Piano Practice from `100` to `150` in the
`Tasks` sheet, save, then refresh the website — it will use 150.

You can also fix a mistake in the `Records` sheet: change a `Status` from
`Pending` to `Approved`, correct a `Points` number, or fix a date.

A few simple rules:

- **Keep the header row exactly as it is** (row 1 of each sheet).
- `Status` in `Records` must be `Pending`, `Approved` or `Rejected`.
- `Status` in `Tasks` must be `Active` or `Inactive`.
- Dates are written as `2026-08-20`.
- Only **Approved** rows count towards Kexin's available points.
- Don't delete a task that has history — set its `Status` to `Inactive` instead.
- `Icon` in `Tasks` is an icon name, not a picture: `piano`, `cello`, `housework`,
  `shower`, `helping`, `reading`, `study`, `sport`, `art`, `tidy`, `teeth`, `pet`,
  `sleep`, `star`. An unknown name simply shows a star. (Easier: use **Manage
  activities → Edit** in the app and pick the icon there.)

**Important:** close the Excel file before using the website to submit or
approve something. Excel locks the file while it is open, so the app will show
a friendly "please close the file" message instead of saving. Nothing is lost —
just close Excel and tap the button again.

---

## Project files

```
kexin-rewards/
├── app.py              the whole server (Flask + openpyxl)
├── requirements.txt    the two libraries it needs
├── README.md           this file
├── data/
│   ├── rewards.xlsx    all the data (auto-created)
│   └── secret.key      keeps everyone logged in across restarts — leave it alone
├── templates/
│   └── index.html      the single page
└── static/
    ├── css/style.css   the look and feel
    ├── img/            the three family photos — swap them freely
    └── js/
        ├── icons.js    the line icons, all hand-drawn SVG
        └── app.js      the screens and buttons
```

---

## Starting over

Close the app, delete `data/rewards.xlsx`, and start the app again — a fresh
workbook is created with the history up to 20 Aug 2026 (8,000 points) and the
four activities. **Rename the old file instead of deleting it** if you want to
keep whatever it holds.
