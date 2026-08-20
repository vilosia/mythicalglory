/* ==========================================================================
   Line icons — small hand-drawn SVGs, all 24x24, all stroked in currentColor.
   No emoji anywhere in the interface.
   ========================================================================== */

var ICON_PATHS = {

  /* --- activities ------------------------------------------------------- */

  // a little keyboard
  piano: '<rect x="3" y="7.5" width="18" height="9.5" rx="1.6"/>' +
    '<path d="M9 7.5v9.5M15 7.5v9.5"/>' +
    '<path d="M6.6 7.5v4.2M12 7.5v4.2M17.4 7.5v4.2"/>',

  // a pair of beamed notes, for music practice
  cello: '<path d="M9.5 17.1V6.3l7.9-2v10.3"/>' +
    '<ellipse cx="7.1" cy="17.4" rx="2.5" ry="2" transform="rotate(-18 7.1 17.4)"/>' +
    '<ellipse cx="15" cy="14.6" rx="2.5" ry="2" transform="rotate(-18 15 14.6)"/>',

  // house with a door
  housework: '<path d="M3.6 11.2 12 4.6l8.4 6.6"/>' +
    '<path d="M5.9 10.3v9.1h12.2v-9.1"/>' +
    '<path d="M10.2 19.4v-4.6h3.6v4.6"/>',

  // shower head with falling water
  shower: '<path d="M12 2.8v3.9"/>' +
    '<path d="M5.9 11.4a6.1 6.1 0 0 1 12.2 0z"/>' +
    '<path d="M8.6 14.6v1.7M12 15.4v1.7M15.4 14.6v1.7' +
    'M10.3 18.6v1.7M13.7 18.6v1.7"/>',

  star: '<path d="M12 3.6l2.6 5.5 5.9.8-4.3 4.2 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.9l5.9-.8z"/>',

  heart: '<path d="M12 20s-7.2-4.3-7.2-9.2A4 4 0 0 1 12 8.2a4 4 0 0 1 7.2 2.6C19.2 15.7 12 20 12 20z"/>',
  helping: '<path d="M12 20s-7.2-4.3-7.2-9.2A4 4 0 0 1 12 8.2a4 4 0 0 1 7.2 2.6C19.2 15.7 12 20 12 20z"/>',

  // open book
  reading: '<path d="M12 6.7C10.4 5.2 8.2 4.6 4.8 4.6v12.6c3.4 0 5.6.6 7.2 2.1 1.6-1.5 3.8-2.1 7.2-2.1V4.6c-3.4 0-5.6.6-7.2 2.1z"/>' +
    '<path d="M12 6.7v12.6"/>',

  // pencil
  study: '<path d="M16.2 3.9l3.9 3.9-10.6 10.6-4.9 1 1-4.9z"/><path d="M14.3 5.8l3.9 3.9"/>',

  // ball
  sport: '<circle cx="12" cy="12" r="8.4"/><path d="M12 3.6c2.4 2.2 3.6 5 3.6 8.4s-1.2 6.2-3.6 8.4"/>' +
    '<path d="M12 3.6c-2.4 2.2-3.6 5-3.6 8.4s1.2 6.2 3.6 8.4"/><path d="M4 9.6h16M4 14.4h16"/>',

  // palette
  art: '<path d="M12 3.7c-4.6 0-8.3 3.5-8.3 7.9 0 4.3 3.2 6.6 5.6 6.6 1.5 0 2-.9 2-1.9 0-1.6 1.2-2.5 2.8-2.5h2.4c2.2 0 3.8-1.5 3.8-3.6 0-3.7-3.7-6.5-8.3-6.5z"/>' +
    '<circle cx="8.4" cy="10.2" r="1.1"/><circle cx="12" cy="8.2" r="1.1"/><circle cx="15.6" cy="10.4" r="1.1"/>',

  // broom
  tidy: '<path d="M14.6 3.6l-6.2 8.1"/><path d="M6 10.2l5.4 4.1"/>' +
    '<path d="M11.4 14.3 6.8 20.4h10.9l-2.5-7.6z"/><path d="M10.4 16.6l-.8 3.8M13.4 15.6l.4 4.8"/>',

  // tooth
  teeth: '<path d="M8.2 3.9c-2 0-3.4 1.6-3.4 3.9 0 2 .6 3 1 5 .4 1.8.3 5.1 1.7 5.1 1.2 0 1.4-2.6 1.9-4.3.3-1 .8-1.6 1.6-1.6s1.3.6 1.6 1.6c.5 1.7.7 4.3 1.9 4.3 1.4 0 1.3-3.3 1.7-5.1.4-2 1-3 1-5 0-2.3-1.4-3.9-3.4-3.9-1.5 0-2 .7-2.8.7s-1.3-.7-2.8-.7z"/>',

  // paw
  pet: '<ellipse cx="7.2" cy="10.4" rx="1.7" ry="2.2"/><ellipse cx="16.8" cy="10.4" rx="1.7" ry="2.2"/>' +
    '<ellipse cx="10.3" cy="6.6" rx="1.6" ry="2.1"/><ellipse cx="13.7" cy="6.6" rx="1.6" ry="2.1"/>' +
    '<path d="M12 13.4c2.6 0 4.4 1.7 4.4 3.6s-1.6 2.6-4.4 2.6-4.4-.7-4.4-2.6 1.8-3.6 4.4-3.6z"/>',

  // crescent moon
  sleep: '<path d="M19.4 14.6A8 8 0 0 1 9.4 4.6a8.4 8.4 0 1 0 10 10z"/>',

  /* --- navigation & interface ------------------------------------------- */

  home: '<path d="M3.8 11.2 12 4.7l8.2 6.5"/><path d="M6 10.4v9h12v-9"/>',

  history: '<path d="M12 6.7C10.4 5.2 8.2 4.6 4.8 4.6v12.6c3.4 0 5.6.6 7.2 2.1 1.6-1.5 3.8-2.1 7.2-2.1V4.6c-3.4 0-5.6.6-7.2 2.1z"/>' +
    '<path d="M12 6.7v12.6"/>',

  person: '<circle cx="12" cy="8.4" r="3.6"/><path d="M5.4 20c.6-3.6 3.3-5.6 6.6-5.6s6 2 6.6 5.6"/>',

  approve: '<path d="M4.6 12.6l4.6 4.4 10.2-10.4"/>',
  check: '<path d="M4.6 12.6l4.6 4.4 10.2-10.4"/>',

  checkCircle: '<circle cx="12" cy="12" r="8.4"/><path d="M8.2 12.3l2.7 2.6 5-5.2"/>',

  clock: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.4V12l3.2 2"/>',

  bell: '<path d="M6.6 10.2a5.4 5.4 0 0 1 10.8 0c0 3.5.9 5 1.7 5.9H4.9c.8-.9 1.7-2.4 1.7-5.9z"/>' +
    '<path d="M10.2 19.2a2 2 0 0 0 3.6 0"/>',

  plus: '<path d="M12 5.4v13.2M5.4 12h13.2"/>',
  close: '<path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6"/>',

  chevron: '<path d="M9.4 5.6l6.6 6.4-6.6 6.4"/>',
  up: '<path d="M6 14.4l6-6 6 6"/>',
  down: '<path d="M6 9.6l6 6 6-6"/>',

  refresh: '<path d="M19.6 12a7.6 7.6 0 1 1-2.4-5.5"/><path d="M19.9 4.9v4h-4"/>',

  link: '<path d="M10.2 13.8a3.6 3.6 0 0 1 0-5.1l2.6-2.6a3.6 3.6 0 0 1 5.1 5.1l-1.3 1.3"/>' +
    '<path d="M13.8 10.2a3.6 3.6 0 0 1 0 5.1l-2.6 2.6a3.6 3.6 0 0 1-5.1-5.1l1.3-1.3"/>',

  sliders: '<path d="M4.4 8h8.2M17.2 8h2.4M4.4 16h2.4M11.2 16h8.4"/>' +
    '<circle cx="15" cy="8" r="2.2"/><circle cx="9" cy="16" r="2.2"/>',

  sheet: '<rect x="4.4" y="3.9" width="15.2" height="16.2" rx="2"/>' +
    '<path d="M4.4 9.3h15.2M4.4 14.7h15.2M12 9.3v10.8"/>',

  download: '<path d="M12 4.4v9.8"/><path d="M8.4 10.8L12 14.4l3.6-3.6"/>' +
    '<path d="M5 16.6v1.4a1.6 1.6 0 0 0 1.6 1.6h10.8a1.6 1.6 0 0 0 1.6-1.6v-1.4"/>',

  upload: '<path d="M12 14.6V4.8"/><path d="M8.4 8.4L12 4.8l3.6 3.6"/>' +
    '<path d="M5 16.6v1.4a1.6 1.6 0 0 0 1.6 1.6h10.8a1.6 1.6 0 0 0 1.6-1.6v-1.4"/>',

  logout: '<path d="M14.4 7.2V5.4a1.6 1.6 0 0 0-1.6-1.6H6.4A1.6 1.6 0 0 0 4.8 5.4v13.2a1.6 1.6 0 0 0 1.6 1.6h6.4a1.6 1.6 0 0 0 1.6-1.6v-1.8"/>' +
    '<path d="M9.6 12h9.6"/><path d="M16.2 8.9L19.4 12l-3.2 3.1"/>',

  // a small four-point sparkle, for the happy moments
  sparkle: '<path d="M12 3.6l1.7 4.9 4.9 1.7-4.9 1.7L12 16.8l-1.7-4.9-4.9-1.7 4.9-1.7z"/>' +
    '<path d="M18.4 15.6l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z"/>',

  alert: '<path d="M12 4.6 20.4 19H3.6z"/><path d="M12 9.6v4.2M12 16.4v.1"/>',

  smile: '<circle cx="12" cy="12" r="8.4"/><path d="M8.8 14.2a4 4 0 0 0 6.4 0"/>' +
    '<path d="M9.4 9.8v.1M14.6 9.8v.1"/>',

  lock: '<rect x="5" y="10.6" width="14" height="9" rx="2"/>' +
    '<path d="M8.4 10.6V8.2a3.6 3.6 0 0 1 7.2 0v2.4"/>'
};

// Which icons a parent can choose from when editing an activity.
var ICON_CHOICES = ["piano", "cello", "housework", "shower", "helping",
  "reading", "study", "sport", "art", "tidy", "teeth", "pet", "sleep", "star"];

function svgIcon(name, className) {
  var path = ICON_PATHS[name];
  if (!path) return "";
  return '<svg class="ic' + (className ? " " + className : "") +
    '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + path + "</svg>";
}

// The Icon column in Excel holds a key like `piano`. A parent may also have
// pasted an emoji straight in — if so, just show what they typed.
function iconMarkup(key, className) {
  var clean = String(key == null ? "" : key).trim();
  if (ICON_PATHS[clean]) return svgIcon(clean, className);
  if (clean === "violin") return svgIcon("cello", className);
  if (clean && /[^\x00-\x7F]/.test(clean)) {
    return '<span class="ic-emoji">' + clean + "</span>";
  }
  return svgIcon("star", className);
}
