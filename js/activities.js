/*
   Trailhead DOM Lab: CSIS 1280 Module 9 (The DOM), the ideas of the "Bean Jar Challenge: Web Edition" tutorial.
   Every activity is a small Trailhead Coffee Roasters page. The HTML and CSS are given; students write script.js.

   Each activity:
     id, module, topic, edit ('js'), title, story, steps[], practise[], art
     starter / solution  { html, css, js }: solution html/css null = the given files
     checks[]  { text, pts, test(c), explain, fix }
     quiz[]    two multiple-choice questions on the DOM ideas behind the activity
   Interaction checks (c.click, c.type, c.call) change the page and run in order on the same page, so each one
   works out what to expect from the page as it is, and they come last.
   Full guide: references/authoring-activities.md in the code-lab-builder skill.
*/

/* ---- the given page: Trailhead header, a <main>, and script.js linked at the end of <body> ---- */
const PAGE = (title, main, headerRight = '') => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Trailhead Coffee Roasters</h1>${headerRight ? '\n    ' + headerRight : ''}
  </header>
  <main>
${main}
  </main>
  <script src="script.js"></script>
</body>
</html>
`;

const BASE_CSS = `/* Trailhead Coffee Roasters: this file is given. You do not need to change it. */
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #fbf7f1;
  color: #2b2b2b;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #3b261a;
  color: #f4f1ec;
}

header h1 {
  margin: 0;
  font-size: 20px;
}

main {
  max-width: 520px;
  margin: 0 auto;
  padding: 16px 20px 28px;
  text-align: center;
}

h2 {
  color: #3b261a;
}

button {
  padding: 9px 18px;
  font-size: 16px;
  color: #ffffff;
  background-color: #96603a;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #7a4a2a;
}

button:disabled {
  background-color: #c9b8a6;
  cursor: not-allowed;
}

button.secondary {
  background-color: #3b261a;
}

input {
  width: 110px;
  padding: 8px;
  font-size: 17px;
  border: 2px solid #c9b8a6;
  border-radius: 6px;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 12px 0;
}
`;

/* the message colours used by several pages */
const MESSAGE_CSS = `
/* The message changes colour when JavaScript adds one of these classes */
#message {
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  border-radius: 6px;
}

.info { color: #3b261a; background-color: #f4f1ec; }
.too-many { color: #ffffff; background-color: #c0392b; }
.too-few { color: #ffffff; background-color: #2f6db5; }
.win { color: #ffffff; background-color: #00796b; }
.lose { color: #ffffff; background-color: #5f5f5f; }
`;

/* ---- small helpers for the checks ---- */
const tidy = s => String(s == null ? '' : s).toLowerCase().replace(/[\s.!,:;'’"“”()|-]+/g, ' ').trim();   // loose text match
const same = (a, b) => tidy(a) === tidy(b);
const q2 = s => '“' + s + '”';
const noErr = c => c.errors.length ? 'error: ' + c.errors[0] : 'no errors';
const classesOf = (c, sel) => { const e = c.q(sel); return e ? [...e.classList] : []; };
const classStr = (c, sel) => { const k = classesOf(c, sel); return k.length ? 'class="' + k.join(' ') + '"' : 'no class'; };
const srcOf = (c, sel) => { const e = c.q(sel); return e ? (e.getAttribute('src') || '') : ''; };
/* turn the controls back on, type a value, click: so one check does not depend on another */
const tryValue = (c, input, button, value) => {
  const i = c.q(input), b = c.q(button);
  if (!i || !b) return false;
  i.disabled = false; b.disabled = false;
  c.type(input, value); c.click(button); return true;
};
/* run the student's code with a fixed clock: new Date() gives this moment until realDate(c) */
const fakeDate = (c, y, mo, d, h, mi, s) => {
  const W = c.win, R = W.__realDate || W.Date; W.__realDate = R;
  const F = function (...a) { return a.length ? new R(...a) : new R(y, mo, d, h, mi, s); };
  F.prototype = R.prototype; F.now = () => new R(y, mo, d, h, mi, s).getTime();
  W.Date = F;
};
const realDate = c => { if (c.win.__realDate) c.win.Date = c.win.__realDate; };

const ACTIVITIES = [

/* ================================================================ 1. getElementById + textContent */
{
  id: 1, module: 'Stage 2', topic: 'Find and change text', edit: 'js', art: 'img/maple.png',
  title: 'Write on the Specials Board',
  story: 'Every morning a barista types the daily special on the café screen. Your script will do it instead. The HTML has empty spots with **ids**; JavaScript asks the DOM for each element by its id and changes the text inside it. The file `index.html` never changes: only the live page (the DOM) does.',
  steps: [
    { text: 'Ask the DOM for the element with the id `special`, keep it in a constant, and change its text. `getElementById` takes the id **without** a `#`:', code: 'const specialText = document.getElementById("special");\nspecialText.textContent = "Maple Latte";' },
    'In the same way, find `#price` and set its text to `$5.25`.',
    'Find `#barista` and set its text to `Today\'s barista: Sam`.',
    { text: '`#note` needs a **bold** word, so it gets HTML, not plain text. Find it, then use `innerHTML` (only for HTML you wrote yourself):', code: 'noteText.innerHTML = "Ask for <strong>oat milk</strong> at no extra cost.";' },
    'Change the browser tab\'s title: `document.title = "Maple Latte | Trailhead";`',
    'On a real page, open **Elements** in DevTools (F12): the new text is in the DOM, while `index.html` is unchanged.'
  ],
  practise: ['document', 'getElementById', 'textContent', 'innerHTML', 'document.title'],
  starter: {
    html: PAGE('Specials Board', `    <p class="label">Today's special</p>
    <h2 id="special">...</h2>
    <p id="price" class="price">...</p>
    <p id="barista">...</p>
    <p id="note" class="note">...</p>`),
    css: BASE_CSS + `
.label {
  margin-bottom: 0;
  color: #96603a;
  text-transform: uppercase;
  letter-spacing: 2px;
}

#special {
  font-size: 34px;
  margin: 6px 0;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #00796b;
}

.note {
  padding: 10px;
  background-color: #f4f1ec;
  border-radius: 6px;
}
`,
    js: `// Activity 1: Write on the Specials Board
// Find each element by its id, then change its text.

// 1. #special: Maple Latte


// 2. #price: $5.25


// 3. #barista: Today's barista: Sam


// 4. #note (use innerHTML): Ask for <strong>oat milk</strong> at no extra cost.


// 5. the tab title: Maple Latte | Trailhead

`
  },
  solution: {
    html: null, css: null,
    js: `// Activity 1: Write on the Specials Board
// Find each element by its id, then change its text.

// 1. #special: Maple Latte
const specialText = document.getElementById("special");
specialText.textContent = "Maple Latte";

// 2. #price: $5.25
const priceText = document.getElementById("price");
priceText.textContent = "$5.25";

// 3. #barista: Today's barista: Sam
const baristaText = document.getElementById("barista");
baristaText.textContent = "Today's barista: Sam";

// 4. #note (use innerHTML): Ask for <strong>oat milk</strong> at no extra cost.
const noteText = document.getElementById("note");
noteText.innerHTML = "Ask for <strong>oat milk</strong> at no extra cost.";

// 5. the tab title: Maple Latte | Trailhead
document.title = "Maple Latte | Trailhead";
`
  },
  checks: [
    { text: 'The script runs with no errors and changes the page', pts: 1,
      test: c => c.ok(!c.errors.length && c.text('#special') !== '...', c.errors.length ? noErr(c) : '#special shows ' + q2(c.text('#special'))),
      explain: 'If `getElementById` gets an id that is not on the page, it gives back `null`, and `null.textContent = …` stops the script with **Cannot set properties of null**. Check the spelling: ids are case-sensitive.',
      fix: 'const specialText = document.getElementById("special");' },
    { text: '`#special` says **Maple Latte**', pts: 2,
      test: c => c.ok(same(c.text('#special'), 'Maple Latte'), '#special shows ' + q2(c.text('#special'))),
      explain: '`document.getElementById("special")` gives you the element object from the DOM. Setting its `textContent` replaces the text inside it, and the browser redraws the page at once.',
      fix: 'const specialText = document.getElementById("special");\nspecialText.textContent = "Maple Latte";' },
    { text: '`#price` says **$5.25**', pts: 1,
      test: c => c.ok(c.text('#price').replace(/\s/g, '') === '$5.25', '#price shows ' + q2(c.text('#price'))),
      explain: 'Each element you change needs its own `getElementById`. Keeping it in a `const` lets you use it again later.',
      fix: 'const priceText = document.getElementById("price");\npriceText.textContent = "$5.25";' },
    { text: '`#barista` says **Today\'s barista: Sam**', pts: 1,
      test: c => c.ok(same(c.text('#barista'), "Today's barista: Sam"), '#barista shows ' + q2(c.text('#barista'))),
      explain: 'A string in double quotes can hold an apostrophe: `"Today\'s barista: Sam"`.',
      fix: 'const baristaText = document.getElementById("barista");\nbaristaText.textContent = "Today\'s barista: Sam";' },
    { text: '`#note` shows the sentence with **oat milk** in a real `<strong>` element', pts: 2,
      test: c => { const s = c.q('#note strong');
        return c.ok(!!s && same(s.textContent, 'oat milk') && same(c.text('#note'), 'Ask for oat milk at no extra cost'),
          s ? '<strong> says ' + q2(s.textContent) + ', #note says ' + q2(c.text('#note')) : '#note shows ' + q2(c.text('#note')) + ' (no <strong> element inside)'); },
      explain: '`textContent` treats everything as plain text, so the tags would show on screen as `<strong>`. `innerHTML` reads the string as HTML and builds new elements in the DOM. Use it only with HTML you wrote yourself, never with what a user typed.',
      fix: 'const noteText = document.getElementById("note");\nnoteText.innerHTML = "Ask for <strong>oat milk</strong> at no extra cost.";' },
    { text: 'The tab title is **Maple Latte | Trailhead**', pts: 1,
      test: c => c.ok(same(c.doc.title, 'Maple Latte | Trailhead'), 'document.title is ' + q2(c.doc.title)),
      explain: '`document` is the whole page. Some of its properties are shortcuts, such as `document.title` (the `<title>` in the head).',
      fix: 'document.title = "Maple Latte | Trailhead";' }
  ],
  tips: [
    c => (c.code.js.match(/\.innerHTML\s*=/g) || []).length > 1 ? 'Use `textContent` for plain text and keep `innerHTML` for the one place that needs HTML (the note). `textContent` is safer and faster.' : null
  ],
  quiz: [
    { q: 'What is the **DOM**?',
      options: ['The `index.html` file saved on your computer', 'The live tree of objects the browser builds from the HTML, which JavaScript can read and change', 'A list of CSS rules', 'A JavaScript library you must download'],
      answer: 1, explain: 'The browser reads the HTML once and builds the DOM (Document Object Model) in memory: one object (node) for every element. The page you see is drawn from the DOM, not from the file.' },
    { q: 'Your script sets `specialText.textContent = "Maple Latte"`. What happens to `index.html` on disk?',
      options: ['Nothing: only the DOM in memory changes', 'The file is saved with the new text', 'The file is deleted and rebuilt', 'The browser asks before saving the file'],
      answer: 0, explain: 'JavaScript changes the DOM, not the file. Reload the page and the script runs again from the original HTML.' }
  ]
},

/* ================================================================ 2. querySelector / querySelectorAll */
{
  id: 2, module: 'Stage 2', topic: 'querySelector and querySelectorAll', edit: 'js', art: 'img/cappuccino.png',
  title: 'Count the Menu',
  story: 'The menu changes every week, and nobody wants to count the drinks by hand. `querySelector` finds the **first** element that matches a CSS selector, and `querySelectorAll` finds **all** of them. Your script reads the menu from the page and writes the numbers.',
  steps: [
    { text: 'Find the **first** item in the `.menu` list with a CSS selector, and write its text into `#firstItem`:', code: 'const first = document.querySelector(".menu li");\nconst firstText = document.getElementById("firstItem");\nfirstText.textContent = first.textContent;' },
    { text: 'Write a function `countMenu()`. Inside it, find **all** the menu items and write how many there are (`.length`) into `#itemCount`:', code: 'function countMenu() {\n  const items = document.querySelectorAll(".menu li");\n  document.getElementById("itemCount").textContent = items.length;\n}' },
    'Inside `countMenu()`, also count the items with the class `new` (selector `".menu .new"`) and write the number into `#newCount`.',
    'Inside `countMenu()`, set the text of `#menuTitle` to `Our Menu (6 drinks)`, using `items.length` in a template literal (do not type the 6).',
    'Call `countMenu();` at the end of the script. If a drink is added to the menu later, calling `countMenu()` again must show the new numbers.'
  ],
  practise: ['querySelector', 'querySelectorAll', '.length', 'CSS selectors in JS'],
  starter: {
    html: PAGE('Menu', `    <h2 id="menuTitle">Our Menu</h2>
    <p>First on the menu: <strong id="firstItem">?</strong></p>
    <ul class="menu">
      <li>Espresso</li>
      <li>Cappuccino</li>
      <li class="new">Maple Latte</li>
      <li>Chai Latte</li>
      <li class="new">Cold Brew Tonic</li>
      <li>Pour Over</li>
    </ul>
    <p class="counts">Drinks: <span id="itemCount">0</span> · New this week: <span id="newCount">0</span></p>`),
    css: BASE_CSS + `
.menu {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.menu li {
  padding: 6px 14px;
  background-color: #f4f1ec;
  border: 1px solid #c9b8a6;
  border-radius: 16px;
}

.menu .new {
  color: #ffffff;
  background-color: #00796b;
  border-color: #00796b;
}

.counts {
  font-size: 18px;
}
`,
    js: `// Activity 2: Count the Menu

// 1. the first .menu li: write its text into #firstItem


// 2-4. countMenu(): count all items (#itemCount), the .new items (#newCount),
//      and set #menuTitle to "Our Menu (6 drinks)" using items.length


// 5. call countMenu()

`
  },
  solution: {
    html: null, css: null,
    js: `// Activity 2: Count the Menu

// 1. the first .menu li: write its text into #firstItem
const first = document.querySelector(".menu li");
const firstText = document.getElementById("firstItem");
firstText.textContent = first.textContent;

// 2-4. countMenu(): count all items (#itemCount), the .new items (#newCount),
//      and set #menuTitle to "Our Menu (6 drinks)" using items.length
function countMenu() {
  const items = document.querySelectorAll(".menu li");
  const newItems = document.querySelectorAll(".menu .new");
  document.getElementById("itemCount").textContent = items.length;
  document.getElementById("newCount").textContent = newItems.length;
  document.getElementById("menuTitle").textContent = \`Our Menu (\${items.length} drinks)\`;
}

// 5. call countMenu()
countMenu();
`
  },
  checks: [
    { text: 'The script runs with no errors and has a function `countMenu()`', pts: 1,
      test: c => c.ok(!c.errors.length && c.fn('countMenu'), c.errors.length ? noErr(c) : c.fn('countMenu') ? 'countMenu() found' : 'no function named countMenu'),
      explain: 'A function declaration (`function countMenu() { … }`) can be called again whenever the menu changes.',
      fix: 'function countMenu() {\n  const items = document.querySelectorAll(".menu li");\n  …\n}' },
    { text: '`#firstItem` shows **Espresso** (the first menu item)', pts: 2,
      test: c => c.ok(same(c.text('#firstItem'), 'Espresso'), '#firstItem shows ' + q2(c.text('#firstItem'))),
      explain: '`querySelector` takes any CSS selector and gives back the **first** match. `".menu li"` means: an `li` inside the element with the class `menu`.',
      fix: 'const first = document.querySelector(".menu li");\ndocument.getElementById("firstItem").textContent = first.textContent;' },
    { text: '`#itemCount` shows **6**', pts: 2,
      test: c => c.ok(c.text('#itemCount') === '6', '#itemCount shows ' + q2(c.text('#itemCount'))),
      explain: '`querySelectorAll` gives back a **NodeList** of every match. Like an array, it has a `.length`.',
      fix: 'const items = document.querySelectorAll(".menu li");\ndocument.getElementById("itemCount").textContent = items.length;' },
    { text: '`#newCount` shows **2**', pts: 1,
      test: c => c.ok(c.text('#newCount') === '2', '#newCount shows ' + q2(c.text('#newCount'))),
      explain: 'A class selector starts with a dot in CSS and in `querySelectorAll`: `".menu .new"`. (`getElementById` is the one that takes a bare id.)',
      fix: 'const newItems = document.querySelectorAll(".menu .new");\ndocument.getElementById("newCount").textContent = newItems.length;' },
    { text: '`#menuTitle` says **Our Menu (6 drinks)**', pts: 1,
      test: c => c.ok(same(c.text('#menuTitle'), 'Our Menu (6 drinks)'), '#menuTitle shows ' + q2(c.text('#menuTitle'))),
      explain: 'A template literal (backticks) puts a value into text: `` `Our Menu (${items.length} drinks)` ``.',
      fix: 'document.getElementById("menuTitle").textContent = `Our Menu (${items.length} drinks)`;' },
    { text: 'The numbers follow the page: after a new drink is added, `countMenu()` shows 7 drinks and 3 new', pts: 2,
      test: c => { if (!c.fn('countMenu')) return c.ok(false, 'no function named countMenu');
        const li = c.doc.createElement('li'); li.className = 'new'; li.textContent = 'Honey Oat Latte'; c.q('.menu').appendChild(li);
        c.call('countMenu');
        return c.ok(c.text('#itemCount') === '7' && c.text('#newCount') === '3' && same(c.text('#menuTitle'), 'Our Menu (7 drinks)'),
          'after adding one new drink: #itemCount ' + q2(c.text('#itemCount')) + ', #newCount ' + q2(c.text('#newCount')) + ', #menuTitle ' + q2(c.text('#menuTitle'))); },
      explain: 'Count with `.length` **inside** the function, so each call looks at the page as it is now. A typed `6`, or a NodeList found once outside the function, does not see drinks added later.',
      fix: 'function countMenu() {\n  const items = document.querySelectorAll(".menu li");\n  …\n}' }
  ],
  quiz: [
    { q: 'What does `document.querySelector("li")` give back when the page has six `<li>` elements?',
      options: ['All six, in a NodeList', 'Only the first `<li>`', 'The number 6', 'The last `<li>`'],
      answer: 1, explain: '`querySelector` stops at the first match. Use `querySelectorAll` for every match.' },
    { q: 'What does `document.getElementById("mesage")` give back when the id on the page is `message`?',
      options: ['The `#message` element anyway', 'An empty string', '`null`, so `.textContent` on it stops the script with an error', '`undefined`, which is harmless'],
      answer: 2, explain: 'No element has the id `mesage`, so the result is `null`. **Cannot set properties of null** almost always means a misspelt id (or a script that runs before the HTML exists).' }
  ]
},

/* ================================================================ 3. style + classList */
{
  id: 3, module: 'Stage 3', topic: 'style and classList', edit: 'js', art: 'img/roaster.png',
  title: 'Feature Today\'s Roast',
  story: 'The roaster wants today\'s beans to stand out and the "fresh beans" banner to appear. JavaScript can change an element\'s look in two ways: one property at a time with `.style`, or by adding and removing **classes** that the CSS already styles. Classes keep the design in the CSS, so prefer them.',
  steps: [
    { text: 'Find `#roastTitle` and change its look with `.style`. CSS names with a dash are written in **camelCase** in JavaScript (`font-size` becomes `fontSize`):', code: 'const roastTitle = document.getElementById("roastTitle");\nroastTitle.style.color = "#96603a";\nroastTitle.style.fontSize = "32px";' },
    'Find `#ethiopia` and add the class `featured` to it with `classList.add("featured")` (no dot: it is a class **name**, not a selector).',
    'Find `#banner` and **remove** its class `hidden`, so the banner appears.',
    'Find `#message`: remove the class `info` and add the class `win`, so it turns green.',
    'Set the text of `#message` to `Ethiopia is roasted and ready!`.'
  ],
  practise: ['style.property', 'camelCase', 'classList.add', 'classList.remove'],
  starter: {
    html: PAGE('Today\'s Roast', `    <p id="banner" class="banner hidden">Fresh beans roasted this morning!</p>
    <h2 id="roastTitle">Today's Roast</h2>
    <div id="ethiopia" class="card">Ethiopia Yirgacheffe · light roast</div>
    <div id="colombia" class="card">Colombia Huila · medium roast</div>
    <p id="message" class="info">Roast status: waiting</p>`),
    css: BASE_CSS + MESSAGE_CSS + `
.banner {
  padding: 8px;
  color: #3b261a;
  background-color: #deb887;
  border-radius: 6px;
}

.hidden {
  display: none;
}

.card {
  margin: 10px 0;
  padding: 14px;
  background-color: #ffffff;
  border: 2px solid #e1d2be;
  border-radius: 8px;
}

.card.featured {
  border: 3px solid #00796b;
  background-color: #eaf3f0;
  font-weight: bold;
}
`,
    js: `// Activity 3: Feature Today's Roast

// 1. #roastTitle: colour #96603a and font size 32px (use .style)


// 2. #ethiopia: add the class featured


// 3. #banner: remove the class hidden


// 4-5. #message: remove info, add win, and change its text

`
  },
  solution: {
    html: null, css: null,
    js: `// Activity 3: Feature Today's Roast

// 1. #roastTitle: colour #96603a and font size 32px (use .style)
const roastTitle = document.getElementById("roastTitle");
roastTitle.style.color = "#96603a";
roastTitle.style.fontSize = "32px";

// 2. #ethiopia: add the class featured
const ethiopia = document.getElementById("ethiopia");
ethiopia.classList.add("featured");

// 3. #banner: remove the class hidden
const banner = document.getElementById("banner");
banner.classList.remove("hidden");

// 4-5. #message: remove info, add win, and change its text
const message = document.getElementById("message");
message.classList.remove("info");
message.classList.add("win");
message.textContent = "Ethiopia is roasted and ready!";
`
  },
  checks: [
    { text: 'The script runs with no errors and changes the page', pts: 1,
      test: c => { const t = c.q('#roastTitle'); const st = t ? t.getAttribute('style') : null;
        return c.ok(!c.errors.length && !!st, c.errors.length ? noErr(c) : 'inline style on #roastTitle: ' + (st || 'none')); },
      explain: '`roastTitle.style.font-size = …` is a syntax error (JavaScript reads the dash as a minus), and one syntax error stops the whole script.',
      fix: 'roastTitle.style.fontSize = "32px";' },
    { text: '`#roastTitle` is copper (`#96603a`)', pts: 1,
      test: c => c.ok(c.cs('#roastTitle', 'color') === 'rgb(150, 96, 58)', '#roastTitle colour: ' + c.cs('#roastTitle', 'color')),
      explain: '`element.style.color = "…"` sets an inline style on that one element, like `style="color: …"` in the HTML.',
      fix: 'roastTitle.style.color = "#96603a";' },
    { text: '`#roastTitle` is 32px', pts: 2,
      test: c => c.ok(c.cs('#roastTitle', 'font-size') === '32px', '#roastTitle font size: ' + c.cs('#roastTitle', 'font-size')),
      explain: 'In JavaScript a CSS name with a dash is written in camelCase: `font-size` is `fontSize`, `background-color` is `backgroundColor`. The value is a string with its unit: `"32px"`.',
      fix: 'roastTitle.style.fontSize = "32px";' },
    { text: '`#ethiopia` has the class `featured` (and `#colombia` does not)', pts: 2,
      test: c => c.ok(classesOf(c, '#ethiopia').includes('featured') && !classesOf(c, '#colombia').includes('featured'), '#ethiopia: ' + classStr(c, '#ethiopia') + ', #colombia: ' + classStr(c, '#colombia')),
      explain: '`classList.add("featured")` adds a class **name**, so no dot. The CSS rule `.card.featured` then styles the card; `".featured"` with a dot would add a class literally called ".featured".',
      fix: 'document.getElementById("ethiopia").classList.add("featured");' },
    { text: 'The banner is visible (its class `hidden` is gone)', pts: 2,
      test: c => c.ok(c.has('#banner') && !classesOf(c, '#banner').includes('hidden') && c.cs('#banner', 'display') !== 'none', '#banner: ' + classStr(c, '#banner') + ', display: ' + c.cs('#banner', 'display')),
      explain: 'The CSS hides anything with the class `hidden`. Removing the class shows it again, and the design stays in the CSS file.',
      fix: 'document.getElementById("banner").classList.remove("hidden");' },
    { text: '`#message` has the class `win` and no longer `info`', pts: 2,
      test: c => { const k = classesOf(c, '#message'); return c.ok(k.includes('win') && !k.includes('info'), '#message: ' + classStr(c, '#message')); },
      explain: 'An element can have many classes. To switch from one look to another, remove the old class **and** add the new one.',
      fix: 'message.classList.remove("info");\nmessage.classList.add("win");' },
    { text: '`#message` says **Ethiopia is roasted and ready!**', pts: 1,
      test: c => c.ok(same(c.text('#message'), 'Ethiopia is roasted and ready!'), '#message shows ' + q2(c.text('#message'))),
      explain: 'Changing the class changes the look; `textContent` changes the words. Most updates need both.',
      fix: 'message.textContent = "Ethiopia is roasted and ready!";' }
  ],
  quiz: [
    { q: 'Which line makes a heading\'s background red?',
      options: ['`h.style.background-color = "red";`', '`h.style.backgroundColor = "red";`', '`h.backgroundColor = "red";`', '`h.style = backgroundColor("red");`'],
      answer: 1, explain: 'CSS properties live under `.style`, written in camelCase. With a dash, JavaScript sees a subtraction and the line fails.' },
    { q: 'Why add a class instead of setting several `.style` properties?',
      options: ['Classes are the only way to change colours', 'The look stays in the CSS file, and one line switches the whole design', '`.style` does not work on `<p>` elements', 'Classes run faster than any other JavaScript'],
      answer: 1, explain: 'With classes, designers change the CSS and the JavaScript only says **which** state the element is in (`win`, `lose`, `hidden`).' }
  ]
},

/* ================================================================ 4. attributes + a function */
{
  id: 4, module: 'Stage 3', topic: 'src, alt and a function', edit: 'js', art: 'img/beans.png',
  title: 'Show a Result in the Jar',
  story: 'The Bean Jar game needs one function that shows any result: the words, the colour, and a matching jar picture. An element\'s **attributes** are properties too: `jarImage.src` is the picture\'s file, and `jarImage.alt` is the text a screen reader says. The pictures are `img/jar-info.png`, `img/jar-too-many.png`, `img/jar-too-few.png`, `img/jar-win.png` and `img/jar-lose.png`.',
  steps: [
    'The elements `messageText` and `jarImage` are found for you at the top of the script.',
    { text: 'Write the function `showResult(text, type)`. Its second parameter is one of `info`, `too-many`, `too-few`, `win`, `lose`, which is both a CSS class and part of a picture name:', code: 'function showResult(text, type) {\n  messageText.textContent = text;\n  messageText.classList.remove("info", "too-many", "too-few", "win", "lose");\n  messageText.classList.add(type);\n  jarImage.src = `img/jar-${type}.png`;\n  jarImage.alt = text;\n}' },
    'Read each line: the text, then **all** the old classes removed (so only one stays), the new class, the picture, and the alt text.',
    'At the end of the script, call it once: `showResult("Too many beans! Go lower.", "too-many");`',
    'Try another call in your head: `showResult("Yes! You win.", "win")` should turn the message green and show the winning jar.'
  ],
  practise: ['functions with parameters', 'src', 'alt', 'classList.remove (several)'],
  starter: {
    html: PAGE('Bean Jar', `    <h2>The Bean Jar Challenge</h2>
    <img id="jarImage" src="img/jar-info.png" alt="A jar of coffee beans">
    <p id="message" class="info">How many beans are in the jar?</p>`),
    css: BASE_CSS + MESSAGE_CSS + `
#jarImage {
  width: 200px;
  height: 200px;
}
`,
    js: `// Activity 4: Show a Result in the Jar

// ---- given: the elements ----
const messageText = document.getElementById("message");
const jarImage = document.getElementById("jarImage");

// 1. showResult(text, type): text, class, picture (img/jar-TYPE.png) and alt


// 2. call it once: "Too many beans! Go lower." with the type "too-many"

`
  },
  solution: {
    html: null, css: null,
    js: `// Activity 4: Show a Result in the Jar

// ---- given: the elements ----
const messageText = document.getElementById("message");
const jarImage = document.getElementById("jarImage");

// 1. showResult(text, type): text, class, picture (img/jar-TYPE.png) and alt
function showResult(text, type) {
  messageText.textContent = text;
  messageText.classList.remove("info", "too-many", "too-few", "win", "lose");
  messageText.classList.add(type);
  jarImage.src = \`img/jar-\${type}.png\`;
  jarImage.alt = text;
}

// 2. call it once: "Too many beans! Go lower." with the type "too-many"
showResult("Too many beans! Go lower.", "too-many");
`
  },
  checks: [
    { text: 'The script runs with no errors and has a function `showResult(text, type)`', pts: 1,
      test: c => c.ok(!c.errors.length && c.fn('showResult'), c.errors.length ? noErr(c) : c.fn('showResult') ? 'showResult() found' : 'no function named showResult'),
      explain: 'One function used for every result means the game logic later only has to say **what** happened.',
      fix: 'function showResult(text, type) {\n  …\n}' },
    { text: 'On load, `#message` says **Too many beans! Go lower.** with the class `too-many`', pts: 2,
      test: c => c.ok(same(c.text('#message'), 'Too many beans! Go lower.') && classesOf(c, '#message').join(' ') === 'too-many', '#message shows ' + q2(c.text('#message')) + ', ' + classStr(c, '#message')),
      explain: 'A function does nothing until it is called. The call passes the text and the type as arguments.',
      fix: 'showResult("Too many beans! Go lower.", "too-many");' },
    { text: 'On load, the jar picture is `img/jar-too-many.png`', pts: 2,
      test: c => c.ok(/(^|\/)img\/jar-too-many\.png$/.test(srcOf(c, '#jarImage')), '#jarImage src="' + srcOf(c, '#jarImage') + '"'),
      explain: 'Setting `.src` changes the `src` attribute, and the browser loads the new picture. A template literal builds the file name from the type.',
      fix: 'jarImage.src = `img/jar-${type}.png`;' },
    { text: 'The picture\'s `alt` text is the message', pts: 1,
      test: c => c.ok(same(c.attr('#jarImage', 'alt'), c.text('#message')) && !same(c.attr('#jarImage', 'alt'), 'A jar of coffee beans'), 'alt="' + c.attr('#jarImage', 'alt') + '"'),
      explain: 'When the picture changes, its `alt` should change too, so screen reader users hear the same result.',
      fix: 'jarImage.alt = text;' },
    { text: '`showResult("Yes! You win.", "win")` shows the text, **only** the class `win`, and `img/jar-win.png`', pts: 3,
      test: c => { if (!c.fn('showResult')) return c.ok(false, 'no function named showResult');
        c.call('showResult', 'Yes! You win.', 'win');
        return c.ok(same(c.text('#message'), 'Yes! You win.') && classesOf(c, '#message').join(' ') === 'win' && /img\/jar-win\.png$/.test(srcOf(c, '#jarImage')),
          '#message shows ' + q2(c.text('#message')) + ', ' + classStr(c, '#message') + ', src="' + srcOf(c, '#jarImage') + '"'); },
      explain: 'Remove **every** result class before adding the new one. Otherwise `too-many` and `win` are both on the element, and the colour depends on which rule comes last in the CSS.',
      fix: 'messageText.classList.remove("info", "too-many", "too-few", "win", "lose");\nmessageText.classList.add(type);' },
    { text: '`showResult("Go higher!", "too-few")` works too', pts: 1,
      test: c => { if (!c.fn('showResult')) return c.ok(false, 'no function named showResult');
        c.call('showResult', 'Go higher!', 'too-few');
        return c.ok(same(c.text('#message'), 'Go higher!') && classesOf(c, '#message').join(' ') === 'too-few' && /img\/jar-too-few\.png$/.test(srcOf(c, '#jarImage')) && same(c.attr('#jarImage', 'alt'), 'Go higher!'),
          '#message shows ' + q2(c.text('#message')) + ', ' + classStr(c, '#message') + ', src="' + srcOf(c, '#jarImage') + '"'); },
      explain: 'Parameters make one function work for every case: the same lines show any text, any colour, and any picture.',
      fix: 'jarImage.src = `img/jar-${type}.png`;\njarImage.alt = text;' }
  ],
  quiz: [
    { q: 'What does `jarImage.src = "img/jar-win.png";` do?',
      options: ['Changes the CSS of the image', 'Changes the image\'s `src` attribute, so the browser shows the new picture', 'Downloads the picture into `index.html`', 'Nothing until the page is reloaded'],
      answer: 1, explain: 'HTML attributes such as `src`, `alt`, `href`, `disabled` and `value` are properties of the element object. Change one and the page updates at once.' },
    { q: 'Why does `showResult` remove all five classes before adding one?',
      options: ['`classList.add` fails if the element has a class', '`remove` must be called before every `add`', 'So exactly one result class is left, and the colour always matches the latest result', 'To make the picture load faster'],
      answer: 2, explain: 'Classes pile up. Removing the old ones first means the element is only ever in one state.' }
  ]
},

/* ================================================================ 5. addEventListener */
{
  id: 5, module: 'Stage 4', topic: 'Click events', edit: 'js', art: 'img/espresso.png',
  title: 'Count the Cups',
  story: 'The baristas want a big button that counts the cups they serve today, a reset button for the next morning, and a cheer when they reach 10 cups. So far your scripts ran once, from top to bottom. An **event listener** asks the browser to run a function **later**, every time something happens, such as a click.',
  steps: [
    'The elements are found for you, and `let cups = 0;` keeps the count.',
    'Write `function serveCup()`: add 1 to `cups` and write `cups` into `#cupCount`.',
    'In `serveCup()`, when `cups` is exactly `10`, set `#goal` to `Goal reached: 10 cups!` and add the class `win` to it.',
    'Write `function resetCups()`: set `cups` back to `0`, write it into `#cupCount`, and set `#goal` back to `Goal: 10 cups` (remove the class `win`).',
    { text: 'Connect the buttons. Pass the function **name**, without brackets: the browser calls it on each click.', code: 'serveButton.addEventListener("click", serveCup);\nresetButton.addEventListener("click", resetCups);' },
    'Click the buttons in the preview. The count should start at 0 and only change when you click.'
  ],
  practise: ['addEventListener', 'click', 'functions as values', 'let'],
  starter: {
    html: PAGE('Cups Served', `    <h2>Cups served today</h2>
    <p id="cupCount" class="big">0</p>
    <p id="goal" class="goal">Goal: 10 cups</p>
    <div class="row">
      <button id="serveButton">Serve a cup</button>
      <button id="resetButton" class="secondary">Reset</button>
    </div>`),
    css: BASE_CSS + `
.big {
  margin: 0;
  font-size: 72px;
  font-weight: bold;
  color: #96603a;
}

.goal {
  padding: 8px;
  border-radius: 6px;
  background-color: #f4f1ec;
}

.goal.win {
  color: #ffffff;
  background-color: #00796b;
  font-weight: bold;
}
`,
    js: `// Activity 5: Count the Cups

// ---- given: the elements and the count ----
const cupCount = document.getElementById("cupCount");
const goalText = document.getElementById("goal");
const serveButton = document.getElementById("serveButton");
const resetButton = document.getElementById("resetButton");
let cups = 0;

// 1-2. serveCup(): add 1 and show it; at 10 cups, show the goal message (class win)


// 3. resetCups(): back to 0, and the goal text back to "Goal: 10 cups"


// 4. connect the two buttons (no brackets after the function names)

`
  },
  solution: {
    html: null, css: null,
    js: `// Activity 5: Count the Cups

// ---- given: the elements and the count ----
const cupCount = document.getElementById("cupCount");
const goalText = document.getElementById("goal");
const serveButton = document.getElementById("serveButton");
const resetButton = document.getElementById("resetButton");
let cups = 0;

// 1-2. serveCup(): add 1 and show it; at 10 cups, show the goal message (class win)
function serveCup() {
  cups = cups + 1;
  cupCount.textContent = cups;
  if (cups === 10) {
    goalText.textContent = "Goal reached: 10 cups!";
    goalText.classList.add("win");
  }
}

// 3. resetCups(): back to 0, and the goal text back to "Goal: 10 cups"
function resetCups() {
  cups = 0;
  cupCount.textContent = cups;
  goalText.textContent = "Goal: 10 cups";
  goalText.classList.remove("win");
}

// 4. connect the two buttons (no brackets after the function names)
serveButton.addEventListener("click", serveCup);
resetButton.addEventListener("click", resetCups);
`
  },
  checks: [
    { text: 'The script runs with no errors and has `serveCup()` and `resetCups()`', pts: 1,
      test: c => c.ok(!c.errors.length && c.fn('serveCup') && c.fn('resetCups'), c.errors.length ? noErr(c) : ['serveCup', 'resetCups'].map(n => n + (c.fn(n) ? ' found' : ' missing')).join(', ')),
      explain: 'Event listeners call functions, so each button needs a function of its own.',
      fix: 'function serveCup() {\n  …\n}\n\nfunction resetCups() {\n  …\n}' },
    { text: 'The page starts at **0**: nothing is counted before a click', pts: 1,
      test: c => c.ok(c.fn('serveCup') && c.text('#cupCount') === '0', '#cupCount shows ' + q2(c.text('#cupCount')) + ' when the page opens'),
      explain: '`addEventListener("click", serveCup())` (with brackets) calls `serveCup` once while the page loads and hands its result (`undefined`) to the listener, so clicks do nothing. Pass the function itself: `serveCup`.',
      fix: 'serveButton.addEventListener("click", serveCup);' },
    { text: 'Three clicks on **Serve a cup** add 3', pts: 3,
      test: c => { const before = Number(c.text('#cupCount'));
        for (let i = 0; i < 3; i++) c.click('#serveButton');
        return c.ok(Number(c.text('#cupCount')) === before + 3, q2(before) + ' became ' + q2(c.text('#cupCount')) + ' after 3 clicks'); },
      explain: 'The listener runs `serveCup` on **every** click. `cups` is a `let` outside the function, so it remembers the count between clicks.',
      fix: 'function serveCup() {\n  cups = cups + 1;\n  cupCount.textContent = cups;\n}' },
    { text: '**Reset** sets the count to 0, and the next click shows 1', pts: 2,
      test: c => { c.click('#serveButton'); c.click('#resetButton'); const r = c.text('#cupCount'); c.click('#serveButton');
        return c.ok(r === '0' && c.text('#cupCount') === '1', 'after Reset: ' + q2(r) + ', then one more click: ' + q2(c.text('#cupCount'))); },
      explain: 'Resetting must change the variable `cups`, not only the text. If only the text goes back to 0, the next click continues from the old number.',
      fix: 'function resetCups() {\n  cups = 0;\n  cupCount.textContent = cups;\n}' },
    { text: 'The 10th cup shows **Goal reached: 10 cups!** with the class `win`', pts: 2,
      test: c => { c.click('#resetButton'); for (let i = 0; i < 10; i++) c.click('#serveButton');
        return c.ok(same(c.text('#goal'), 'Goal reached: 10 cups!') && classesOf(c, '#goal').includes('win'), 'after Reset and 10 clicks: #goal shows ' + q2(c.text('#goal')) + ', ' + classStr(c, '#goal')); },
      explain: 'An `if` inside the event function checks the new count after each click.',
      fix: 'if (cups === 10) {\n  goalText.textContent = "Goal reached: 10 cups!";\n  goalText.classList.add("win");\n}' },
    { text: '**Reset** also puts the goal back to **Goal: 10 cups** (no class `win`)', pts: 1,
      test: c => { c.click('#resetButton'); for (let i = 0; i < 10; i++) c.click('#serveButton'); const reached = classesOf(c, '#goal').includes('win'); c.click('#resetButton');
        return c.ok(reached && same(c.text('#goal'), 'Goal: 10 cups') && !classesOf(c, '#goal').includes('win'), reached ? 'after Reset: #goal shows ' + q2(c.text('#goal')) + ', ' + classStr(c, '#goal') : 'the goal message never appeared'); },
      explain: 'A reset puts **everything** back the way the page started: the number, the text, and the classes.',
      fix: 'goalText.textContent = "Goal: 10 cups";\ngoalText.classList.remove("win");' }
  ],
  quiz: [
    { q: 'What goes wrong with `serveButton.addEventListener("click", serveCup());`?',
      options: ['Nothing, the brackets are optional', 'Every click runs `serveCup` twice', '`serveCup` runs once while the page loads, and clicks do nothing', 'The button disappears'],
      answer: 2, explain: 'With brackets you **call** the function now and pass its result. Without brackets you pass the function, and the browser calls it later.' },
    { q: 'Why is `let cups = 0;` written **outside** `serveCup()`?',
      options: ['So the count is kept between clicks; inside, it would start at 0 on every click', 'Variables must always be at the top of a file', '`let` does not work inside functions', 'So that CSS can read it'],
      answer: 0, explain: 'A variable made inside a function is created again each time the function runs.' }
  ]
},

/* ================================================================ 6. input .value + Number */
{
  id: 6, module: 'Stage 4', topic: 'Reading an input box', edit: 'js', art: 'img/bags.png',
  title: 'Restock the Beans',
  story: 'When a delivery arrives, the roaster types how many grams came in and clicks **Add beans**. Reading a box is one property: `.value`. But `.value` is always **text**, even in a number box, and `"250" + "40"` is `"25040"`. `Number()` turns the text into a number first.',
  steps: [
    'The elements are found for you, and `let stock = 250;` holds the grams in stock.',
    { text: 'Write `function addBeans()`. Read the box and turn the text into a number:', code: 'const amount = Number(amountInput.value);' },
    'Add `amount` to `stock` and write `stock` into `#stock`.',
    'Set `#message` to a sentence like `Added 40 g. Stock is now 290 g.` (use a template literal with `amount` and `stock`).',
    'Empty the box (`amountInput.value = "";`) and put the cursor back in it with `amountInput.focus();`.',
    'Connect `#addButton` to `addBeans` with a click listener, then try 40 in the preview.'
  ],
  practise: ['.value', 'Number()', 'focus()', 'template literals'],
  starter: {
    html: PAGE('Bean Stock', `    <h2>Beans in stock</h2>
    <p class="big"><span id="stock">250</span> g</p>
    <div class="row">
      <label for="amountInput">Grams delivered:</label>
      <input type="number" id="amountInput" min="1">
      <button id="addButton">Add beans</button>
    </div>
    <p id="message" class="note">Type the grams that arrived.</p>`),
    css: BASE_CSS + `
.big {
  margin: 0;
  font-size: 56px;
  font-weight: bold;
  color: #96603a;
}

.note {
  padding: 10px;
  background-color: #f4f1ec;
  border-radius: 6px;
}
`,
    js: `// Activity 6: Restock the Beans

// ---- given: the elements and the stock ----
const stockText = document.getElementById("stock");
const amountInput = document.getElementById("amountInput");
const addButton = document.getElementById("addButton");
const messageText = document.getElementById("message");
let stock = 250;

// 1-4. addBeans(): read the box as a number, add it, show the stock and the message,
//      empty the box and focus it


// 5. connect #addButton

`
  },
  solution: {
    html: null, css: null,
    js: `// Activity 6: Restock the Beans

// ---- given: the elements and the stock ----
const stockText = document.getElementById("stock");
const amountInput = document.getElementById("amountInput");
const addButton = document.getElementById("addButton");
const messageText = document.getElementById("message");
let stock = 250;

// 1-4. addBeans(): read the box as a number, add it, show the stock and the message,
//      empty the box and focus it
function addBeans() {
  const amount = Number(amountInput.value);
  stock = stock + amount;
  stockText.textContent = stock;
  messageText.textContent = \`Added \${amount} g. Stock is now \${stock} g.\`;
  amountInput.value = "";
  amountInput.focus();
}

// 5. connect #addButton
addButton.addEventListener("click", addBeans);
`
  },
  checks: [
    { text: 'The script runs with no errors and has a function `addBeans()`', pts: 1,
      test: c => c.ok(!c.errors.length && c.fn('addBeans'), c.errors.length ? noErr(c) : c.fn('addBeans') ? 'addBeans() found' : 'no function named addBeans'),
      explain: 'The click listener needs a function to call.',
      fix: 'function addBeans() {\n  …\n}' },
    { text: 'Typing **40** and clicking **Add beans** adds 40 grams (250 becomes 290)', pts: 3,
      test: c => { const before = Number(c.text('#stock')); tryValue(c, '#amountInput', '#addButton', '40');
        return c.ok(c.text('#stock') === String(before + 40), q2(before) + ' became ' + q2(c.text('#stock'))); },
      explain: '`.value` is always a string. `stock + "40"` joins text (`"25040"`); `Number(amountInput.value)` turns it into `40` first, so `+` adds.',
      fix: 'const amount = Number(amountInput.value);\nstock = stock + amount;\nstockText.textContent = stock;' },
    { text: 'The message says **Added 10 g. Stock is now … g.** with the new total', pts: 2,
      test: c => { const before = Number(c.text('#stock')); tryValue(c, '#amountInput', '#addButton', '10');
        return c.ok(same(c.text('#message'), `Added 10 g. Stock is now ${before + 10} g.`), 'after adding 10 to ' + before + ': ' + q2(c.text('#message'))); },
      explain: 'Write the message **after** changing `stock`, so it shows the new total.',
      fix: 'messageText.textContent = `Added ${amount} g. Stock is now ${stock} g.`;' },
    { text: 'The box is empty after each click', pts: 1,
      test: c => { tryValue(c, '#amountInput', '#addButton', '5'); const v = c.q('#amountInput') ? c.q('#amountInput').value : '(no box)';
        return c.ok(c.fn('addBeans') && v === '', 'the box holds ' + q2(v) + ' after a click'); },
      explain: 'Setting `.value` writes into the box, so `amountInput.value = "";` clears it for the next delivery.',
      fix: 'amountInput.value = "";' },
    { text: 'The cursor goes back into the box (`focus()`)', pts: 1,
      test: c => { tryValue(c, '#amountInput', '#addButton', '5'); const f = c.focused();
        return c.ok(!!f && f.id === 'amountInput', f && f.id ? 'focus is on #' + f.id : 'focus was not moved to the box'); },
      explain: '`element.focus()` puts the cursor in a box, so the user can type the next number without reaching for the mouse.',
      fix: 'amountInput.focus();' },
    { text: 'Two deliveries in a row add up (+15, then +35)', pts: 1,
      test: c => { const before = Number(c.text('#stock')); tryValue(c, '#amountInput', '#addButton', '15'); tryValue(c, '#amountInput', '#addButton', '35');
        return c.ok(c.text('#stock') === String(before + 50), q2(before) + ' became ' + q2(c.text('#stock')) + ' after +15 and +35'); },
      explain: '`stock` is a `let` outside the function, so each click adds to the latest total.',
      fix: 'stock = stock + amount;' }
  ],
  quiz: [
    { q: 'The box holds `40`. What is `amountInput.value + 10`?',
      options: ['`50`', '`NaN`', 'An error', '`"4010"`'],
      answer: 3, explain: '`.value` is the text `"40"`, so `+` joins it with 10 into `"4010"`. Use `Number(amountInput.value) + 10`.' },
    { q: 'What does `amountInput.value = "";` do?',
      options: ['Deletes the input box from the page', 'Empties what is typed in the box', 'Disables the box', 'Sets the box to the number 0'],
      answer: 1, explain: '`.value` can be read **and** written: writing an empty string clears the box.' }
  ]
},

/* ================================================================ 7. if / else if on the page + disabled */
{
  id: 7, module: 'Stage 5', topic: 'Decisions on the page', edit: 'js', art: 'img/pourover.png',
  title: 'Check the Brew Temperature',
  story: 'Pour-over coffee tastes best with water between **90** and **96** degrees. The barista types the temperature and clicks **Check**. This is your Module 8 `if / else if / else`, but the answer now appears on the page in colour instead of in the console. A helper `showMessage(text, type)` is given (it works like `showResult` from Activity 4).',
  steps: [
    'Write `function checkTemp()` and read the box as a number: `const temp = Number(tempInput.value);`',
    'If the box is empty (`tempInput.value === ""`) **or** `temp` is below 0 **or** above 100 (water boils at 100), show `Please type a temperature from 0 to 100.` with the type `info`.',
    'Else, if `temp` is below 90, show `85 degrees is too cold. Heat it up!` (with the real number) and the type `cold`.',
    'Else, if `temp` is above 96, show `100 degrees is too hot. Let it cool!` and the type `hot`.',
    'Else show `92 degrees is perfect for pour-over!` with the type `perfect`, and **disable** the box and the button: `tempInput.disabled = true;` (the same for `checkButton`).',
    'Connect `#checkButton` to `checkTemp`. Try 85, 100, 90, 96 and 92 in the preview.'
  ],
  practise: ['if / else if / else', '||', '.disabled', 'Number()'],
  starter: {
    html: PAGE('Brew Check', `    <h2>Pour-over temperature</h2>
    <div class="row">
      <label for="tempInput">Water (degrees C):</label>
      <input type="number" id="tempInput">
      <button id="checkButton">Check</button>
    </div>
    <p id="message" class="info">The best water is 90 to 96 degrees.</p>`),
    css: BASE_CSS + `
#message {
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  border-radius: 6px;
}

.info { color: #3b261a; background-color: #f4f1ec; }
.cold { color: #ffffff; background-color: #2f6db5; }
.hot { color: #ffffff; background-color: #c0392b; }
.perfect { color: #ffffff; background-color: #00796b; }
`,
    js: `// Activity 7: Check the Brew Temperature

// ---- given: the elements and showMessage() ----
const tempInput = document.getElementById("tempInput");
const checkButton = document.getElementById("checkButton");
const messageText = document.getElementById("message");

// Shows text in #message with one class: info, cold, hot or perfect
function showMessage(text, type) {
  messageText.textContent = text;
  messageText.classList.remove("info", "cold", "hot", "perfect");
  messageText.classList.add(type);
}

// 1-5. checkTemp(): empty or outside 0-100, too cold (< 90), too hot (> 96), perfect


// 6. connect #checkButton

`
  },
  solution: {
    html: null, css: null,
    js: `// Activity 7: Check the Brew Temperature

// ---- given: the elements and showMessage() ----
const tempInput = document.getElementById("tempInput");
const checkButton = document.getElementById("checkButton");
const messageText = document.getElementById("message");

// Shows text in #message with one class: info, cold, hot or perfect
function showMessage(text, type) {
  messageText.textContent = text;
  messageText.classList.remove("info", "cold", "hot", "perfect");
  messageText.classList.add(type);
}

// 1-5. checkTemp(): empty or outside 0-100, too cold (< 90), too hot (> 96), perfect
function checkTemp() {
  const temp = Number(tempInput.value);

  if (tempInput.value === "" || temp < 0 || temp > 100) {
    showMessage("Please type a temperature from 0 to 100.", "info");
  } else if (temp < 90) {
    showMessage(\`\${temp} degrees is too cold. Heat it up!\`, "cold");
  } else if (temp > 96) {
    showMessage(\`\${temp} degrees is too hot. Let it cool!\`, "hot");
  } else {
    showMessage(\`\${temp} degrees is perfect for pour-over!\`, "perfect");
    tempInput.disabled = true;
    checkButton.disabled = true;
  }
}

// 6. connect #checkButton
checkButton.addEventListener("click", checkTemp);
`
  },
  checks: [
    { text: 'The script runs with no errors and has a function `checkTemp()`', pts: 1,
      test: c => c.ok(!c.errors.length && c.fn('checkTemp'), c.errors.length ? noErr(c) : c.fn('checkTemp') ? 'checkTemp() found' : 'no function named checkTemp'),
      explain: 'All the decisions live in one function that runs on each click.',
      fix: 'function checkTemp() {\n  const temp = Number(tempInput.value);\n  …\n}' },
    { text: '**85** shows **85 degrees is too cold. Heat it up!** in the `cold` style', pts: 2,
      test: c => { tryValue(c, '#tempInput', '#checkButton', '85');
        return c.ok(same(c.text('#message'), '85 degrees is too cold. Heat it up!') && classesOf(c, '#message').join(' ') === 'cold', 'for 85: ' + q2(c.text('#message')) + ', ' + classStr(c, '#message')); },
      explain: 'Read the box with `Number(…)`, then compare. A template literal puts the typed number into the sentence.',
      fix: '} else if (temp < 90) {\n  showMessage(`${temp} degrees is too cold. Heat it up!`, "cold");' },
    { text: '**100** shows **100 degrees is too hot. Let it cool!** in the `hot` style', pts: 2,
      test: c => { tryValue(c, '#tempInput', '#checkButton', '100');
        return c.ok(same(c.text('#message'), '100 degrees is too hot. Let it cool!') && classesOf(c, '#message').join(' ') === 'hot', 'for 100: ' + q2(c.text('#message')) + ', ' + classStr(c, '#message')); },
      explain: '`else if` is only tested when the conditions above it were false, so exactly one message is shown.',
      fix: '} else if (temp > 96) {\n  showMessage(`${temp} degrees is too hot. Let it cool!`, "hot");' },
    { text: 'An empty box and **120** both show **Please type a temperature from 0 to 100.**', pts: 2,
      test: c => { tryValue(c, '#tempInput', '#checkButton', ''); const a = c.text('#message'); tryValue(c, '#tempInput', '#checkButton', '120'); const b = c.text('#message');
        const want = 'Please type a temperature from 0 to 100.';
        return c.ok(same(a, want) && same(b, want), 'empty box: ' + q2(a) + ', 120: ' + q2(b)); },
      explain: '`Number("")` is `0`, so without a test an empty box reads as ice-cold water: **0 degrees is too cold**. Check `tempInput.value === ""` first, joined with `||` to the range test.',
      fix: 'if (tempInput.value === "" || temp < 0 || temp > 100) {\n  showMessage("Please type a temperature from 0 to 100.", "info");' },
    { text: 'The edges count as perfect: **90** and **96** both show the `perfect` style', pts: 2,
      test: c => { tryValue(c, '#tempInput', '#checkButton', '90'); const a = classStr(c, '#message'); tryValue(c, '#tempInput', '#checkButton', '96'); const b = classStr(c, '#message');
        return c.ok(a === 'class="perfect"' && b === 'class="perfect"', '90: ' + a + ', 96: ' + b); },
      explain: '"Below 90" is `temp < 90`, not `<=`. Test the numbers at the edge of each range: they catch most mistakes in conditions.',
      fix: '} else if (temp < 90) {\n…\n} else if (temp > 96) {' },
    { text: '**92** shows **92 degrees is perfect for pour-over!** and disables the box and the button', pts: 2,
      test: c => { tryValue(c, '#tempInput', '#checkButton', '92'); const i = c.q('#tempInput'), b = c.q('#checkButton');
        return c.ok(same(c.text('#message'), '92 degrees is perfect for pour-over!') && i && i.disabled && b && b.disabled, 'for 92: ' + q2(c.text('#message')) + '; box ' + (i && i.disabled ? 'disabled' : 'enabled') + ', button ' + (b && b.disabled ? 'disabled' : 'enabled')); },
      explain: '`disabled` is an attribute you can set from JavaScript. A disabled button ignores clicks, and the CSS greys it out with `button:disabled`.',
      fix: 'tempInput.disabled = true;\ncheckButton.disabled = true;' },
    { text: 'A wrong temperature does **not** disable anything', pts: 1,
      test: c => { tryValue(c, '#tempInput', '#checkButton', '85'); const i = c.q('#tempInput'), b = c.q('#checkButton');
        return c.ok(c.fn('checkTemp') && same(c.text('#message'), '85 degrees is too cold. Heat it up!') && i && !i.disabled && b && !b.disabled, 'after 85: box ' + (i && i.disabled ? 'disabled' : 'enabled') + ', button ' + (b && b.disabled ? 'disabled' : 'enabled')); },
      explain: 'Only the `else` block (the perfect temperature) ends the check. Lines outside the `if` run for every temperature.',
      fix: '} else {\n  showMessage(`${temp} degrees is perfect for pour-over!`, "perfect");\n  tempInput.disabled = true;\n  checkButton.disabled = true;\n}' }
  ],
  quiz: [
    { q: 'What is `Number("")`, the value of an empty box?',
      options: ['`NaN`', '`""`', '`0`', '`undefined`'],
      answer: 2, explain: 'An empty string becomes `0`, a real temperature here, which is why the empty box is tested separately with `tempInput.value === ""`.' },
    { q: 'After `checkButton.disabled = true;`, what happens when the user clicks the button?',
      options: ['Nothing: a disabled button does not fire click events', 'The click listener runs as usual', 'The page reloads', 'The button is removed from the DOM'],
      answer: 0, explain: 'Disabled controls ignore clicks and typing until `disabled` is set back to `false`.' }
  ]
},

/* ================================================================ 8. createElement + appendChild + reset */
{
  id: 8, module: 'Stages 6–7', topic: 'Creating elements', edit: 'js', art: 'img/chai.png',
  title: 'The Order Queue',
  story: 'Orders pile up at the counter. The cashier types a drink and clicks **Add order**, and a new line appears in the queue. That line does not exist in the HTML: JavaScript **creates** it. Three steps every time: create the element, fill it, attach it to a parent that is already on the page. **Clear all** empties the queue at closing time.',
  steps: [
    'The elements are found for you, and `let orders = 0;` counts the orders.',
    { text: 'Write `function addOrder()`. Read the box; if it is empty, do nothing (`return;`). Otherwise create, fill, attach:', code: 'const drink = drinkInput.value;\nif (drink === "") {\n  return;\n}\nconst item = document.createElement("li");\nitem.textContent = drink;\norderList.appendChild(item);' },
    'Still in `addOrder()`: add 1 to `orders`, write it into `#orderCount`, empty the box and `focus()` it.',
    'Write `function clearOrders()`: remove every order with `orderList.innerHTML = "";`, set `orders` to 0 and show it.',
    'Connect `#addButton` to `addOrder` and `#clearButton` to `clearOrders`.',
    'Try it: add three drinks, clear, add one more. The count should always match the list.'
  ],
  practise: ['createElement', 'appendChild', 'innerHTML = ""', 'return'],
  starter: {
    html: PAGE('Order Queue', `    <h2>Order queue</h2>
    <div class="row">
      <label for="drinkInput">Drink:</label>
      <input type="text" id="drinkInput">
      <button id="addButton">Add order</button>
    </div>
    <p>Orders waiting: <span id="orderCount">0</span></p>
    <ol id="orderList"></ol>
    <button id="clearButton" class="secondary">Clear all</button>`),
    css: BASE_CSS + `
#drinkInput {
  width: 180px;
}

#orderList {
  max-width: 300px;
  margin: 10px auto 16px;
  text-align: left;
}

#orderList li {
  margin: 6px 0;
  padding: 6px 10px;
  background-color: #f4f1ec;
  border-left: 4px solid #96603a;
}
`,
    js: `// Activity 8: The Order Queue

// ---- given: the elements and the count ----
const drinkInput = document.getElementById("drinkInput");
const addButton = document.getElementById("addButton");
const orderList = document.getElementById("orderList");
const orderCount = document.getElementById("orderCount");
const clearButton = document.getElementById("clearButton");
let orders = 0;

// 1-2. addOrder(): ignore an empty box; create an li, fill it, attach it to #orderList;
//      count it, empty the box and focus it


// 3. clearOrders(): empty the list and set the count to 0


// 4. connect both buttons

`
  },
  solution: {
    html: null, css: null,
    js: `// Activity 8: The Order Queue

// ---- given: the elements and the count ----
const drinkInput = document.getElementById("drinkInput");
const addButton = document.getElementById("addButton");
const orderList = document.getElementById("orderList");
const orderCount = document.getElementById("orderCount");
const clearButton = document.getElementById("clearButton");
let orders = 0;

// 1-2. addOrder(): ignore an empty box; create an li, fill it, attach it to #orderList;
//      count it, empty the box and focus it
function addOrder() {
  const drink = drinkInput.value;
  if (drink === "") {
    return;
  }
  const item = document.createElement("li");
  item.textContent = drink;
  orderList.appendChild(item);

  orders = orders + 1;
  orderCount.textContent = orders;
  drinkInput.value = "";
  drinkInput.focus();
}

// 3. clearOrders(): empty the list and set the count to 0
function clearOrders() {
  orderList.innerHTML = "";
  orders = 0;
  orderCount.textContent = orders;
}

// 4. connect both buttons
addButton.addEventListener("click", addOrder);
clearButton.addEventListener("click", clearOrders);
`
  },
  checks: [
    { text: 'The script runs with no errors and has `addOrder()` and `clearOrders()`', pts: 1,
      test: c => c.ok(!c.errors.length && c.fn('addOrder') && c.fn('clearOrders'), c.errors.length ? noErr(c) : ['addOrder', 'clearOrders'].map(n => n + (c.fn(n) ? ' found' : ' missing')).join(', ')),
      explain: 'One function per button keeps each job small.',
      fix: 'function addOrder() {\n  …\n}\n\nfunction clearOrders() {\n  …\n}' },
    { text: 'Adding **Maple Latte** puts a new `<li>` with that text in `#orderList`', pts: 3,
      test: c => { const n = c.qa('#orderList li').length; tryValue(c, '#drinkInput', '#addButton', 'Maple Latte'); const li = c.qa('#orderList li');
        return c.ok(li.length === n + 1 && same(li[li.length - 1].textContent, 'Maple Latte'), li.length + ' item(s) in the list' + (li.length ? ', the last says ' + q2(li[li.length - 1].textContent) : '')); },
      explain: '`createElement("li")` makes an element that is not on the page yet. It appears only after `appendChild` attaches it to a parent that is.',
      fix: 'const item = document.createElement("li");\nitem.textContent = drink;\norderList.appendChild(item);' },
    { text: 'A second order goes **at the end** of the list', pts: 1,
      test: c => { tryValue(c, '#drinkInput', '#addButton', 'Espresso'); tryValue(c, '#drinkInput', '#addButton', 'Chai Latte'); const li = c.qa('#orderList li');
        return c.ok(li.length >= 2 && same(li[li.length - 2].textContent, 'Espresso') && same(li[li.length - 1].textContent, 'Chai Latte'), 'the list: ' + (li.map(x => q2(x.textContent.trim())).join(', ') || 'empty')); },
      explain: '`appendChild` adds the new element as the **last** child, so the queue keeps its order.',
      fix: 'orderList.appendChild(item);' },
    { text: 'An empty box adds nothing', pts: 1,
      test: c => { const n = c.qa('#orderList li').length; const before = c.text('#orderCount'); tryValue(c, '#drinkInput', '#addButton', '');
        return c.ok(n > 0 && c.qa('#orderList li').length === n && c.text('#orderCount') === before, 'list ' + n + ' → ' + c.qa('#orderList li').length + ' item(s), count ' + q2(before) + ' → ' + q2(c.text('#orderCount'))); },
      explain: '`return;` leaves the function at once, so nothing below it runs for an empty box.',
      fix: 'if (drink === "") {\n  return;\n}' },
    { text: '`#orderCount` always matches the number of orders in the list', pts: 1,
      test: c => { tryValue(c, '#drinkInput', '#addButton', 'Cold Brew'); const n = c.qa('#orderList li').length;
        return c.ok(n > 0 && c.text('#orderCount') === String(n), n + ' item(s) in the list, #orderCount shows ' + q2(c.text('#orderCount'))); },
      explain: 'Update the number in the same function that adds the item, so the two never drift apart.',
      fix: 'orders = orders + 1;\norderCount.textContent = orders;' },
    { text: 'The box is empty and focused after adding an order', pts: 1,
      test: c => { tryValue(c, '#drinkInput', '#addButton', 'Flat White'); const v = c.q('#drinkInput') ? c.q('#drinkInput').value : '(no box)'; const f = c.focused();
        return c.ok(v === '' && !!f && f.id === 'drinkInput', 'the box holds ' + q2(v) + (f && f.id ? ', focus on #' + f.id : ', focus not moved')); },
      explain: 'Clearing and focusing the box lets the cashier type the next drink straight away.',
      fix: 'drinkInput.value = "";\ndrinkInput.focus();' },
    { text: '**Clear all** removes every order and shows 0; the next order counts as 1', pts: 2,
      test: c => { tryValue(c, '#drinkInput', '#addButton', 'Mocha'); c.click('#clearButton'); const n = c.qa('#orderList li').length, z = c.text('#orderCount');
        tryValue(c, '#drinkInput', '#addButton', 'Latte');
        return c.ok(n === 0 && z === '0' && c.text('#orderCount') === '1' && c.qa('#orderList li').length === 1, 'after Clear all: ' + n + ' item(s), count ' + q2(z) + '; after one more order: count ' + q2(c.text('#orderCount'))); },
      explain: '`innerHTML = ""` removes everything inside an element. Reset the variable `orders` too, or the count carries on from the old number.',
      fix: 'function clearOrders() {\n  orderList.innerHTML = "";\n  orders = 0;\n  orderCount.textContent = orders;\n}' }
  ],
  quiz: [
    { q: 'You wrote `const item = document.createElement("li"); item.textContent = "Mocha";` and nothing appears. Why?',
      options: ['`li` elements need a class', '`textContent` does not work on new elements', 'The page must be reloaded', 'The new element is not attached to the page yet: it needs `appendChild`'],
      answer: 3, explain: 'Create, fill, **attach**. Until it has a parent in the DOM, the element exists only in JavaScript.' },
    { q: 'Which line removes every `<li>` from `#orderList`?',
      options: ['`orderList.innerHTML = "";`', '`orderList = "";`', '`orderList.remove("li");`', '`orderList.length = 0;`'],
      answer: 0, explain: 'Setting `innerHTML` to an empty string replaces all the children with nothing. Assigning to the constant `orderList` itself is an error.' }
  ]
},

/* ================================================================ 9. Date + setInterval */
{
  id: 9, module: 'Stage 8', topic: 'Date and setInterval', edit: 'js', art: 'img/coldbrew.png',
  title: 'The Shop Clock',
  story: 'The café screen needs a live clock in the header and an **Open / Closed** sign. Trailhead is open from **7:00** until **18:00** (6 pm). `new Date()` is the moment it is made, and `setInterval` runs a function again and again, so the clock ticks.',
  steps: [
    { text: 'Write `function updateClock()`. Make a date for **now**, and turn it into readable text:', code: 'const now = new Date();\nconst date = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });\nconst time = now.toLocaleTimeString("en-US");\nclockText.textContent = `${date} | ${time}`;' },
    'The header then shows something like `Monday, November 23, 2026 | 8:30:05 AM`.',
    'Still in `updateClock()`: read the hour with `now.getHours()` (0 to 23). From 7 up to (not including) 18, set `#openStatus` to `We are open` with the class `open`; otherwise `Sorry, we are closed` with the class `closed` (remove the other class each time).',
    { text: 'At the end of the script, show the time once, then every 1000 milliseconds. Pass the function name without brackets:', code: 'updateClock();\nsetInterval(updateClock, 1000);' },
    'Watch the seconds tick in the preview.'
  ],
  practise: ['new Date()', 'toLocaleDateString', 'getHours()', 'setInterval'],
  starter: {
    html: PAGE('Shop Clock', `    <h2>Welcome to Trailhead</h2>
    <p id="openStatus" class="status">...</p>
    <p class="hours">Open every day, 7:00 to 18:00</p>`, '<p id="clock">...</p>'),
    css: BASE_CSS + `
#clock {
  margin: 0;
  font-size: 15px;
}

.status {
  display: inline-block;
  padding: 12px 22px;
  font-size: 24px;
  font-weight: bold;
  border-radius: 8px;
  background-color: #f4f1ec;
}

.open {
  color: #ffffff;
  background-color: #00796b;
}

.closed {
  color: #ffffff;
  background-color: #5f5f5f;
}

.hours {
  color: #6b5a4e;
}
`,
    js: `// Activity 9: The Shop Clock

// ---- given: the elements ----
const clockText = document.getElementById("clock");
const statusText = document.getElementById("openStatus");

// 1-3. updateClock(): the date and time in #clock, and the open/closed sign


// 4. show it now, then every second

`
  },
  solution: {
    html: null, css: null,
    js: `// Activity 9: The Shop Clock

// ---- given: the elements ----
const clockText = document.getElementById("clock");
const statusText = document.getElementById("openStatus");

// 1-3. updateClock(): the date and time in #clock, and the open/closed sign
function updateClock() {
  const now = new Date();
  const date = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const time = now.toLocaleTimeString("en-US");
  clockText.textContent = \`\${date} | \${time}\`;

  const hour = now.getHours();
  if (hour >= 7 && hour < 18) {
    statusText.textContent = "We are open";
    statusText.classList.remove("closed");
    statusText.classList.add("open");
  } else {
    statusText.textContent = "Sorry, we are closed";
    statusText.classList.remove("open");
    statusText.classList.add("closed");
  }
}

// 4. show it now, then every second
updateClock();
setInterval(updateClock, 1000);
`
  },
  checks: [
    { text: 'The script runs with no errors and has a function `updateClock()`', pts: 1,
      test: c => c.ok(!c.errors.length && c.fn('updateClock'), c.errors.length ? noErr(c) : c.fn('updateClock') ? 'updateClock() found' : 'no function named updateClock'),
      explain: '`setInterval` needs a function to call again and again.',
      fix: 'function updateClock() {\n  const now = new Date();\n  …\n}' },
    { text: 'When the page opens, `#clock` shows today\'s date (weekday, month, day and year)', pts: 2,
      test: c => { const want = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }); const t = c.text('#clock');
        return c.ok(tidy(t).startsWith(tidy(want)), '#clock shows ' + q2(t)); },
      explain: '`toLocaleDateString("en-US", { … })` writes the date in words. The options pick the parts: `weekday`, `month: "long"`, `day` and `year`.',
      fix: 'const date = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });' },
    { text: 'The clock ticks: one second later it shows a new time', pts: 2,
      test: async c => { realDate(c); const a = c.text('#clock'); await c.settle(1150); const b = c.text('#clock');
        return c.ok(c.fn('updateClock') && a !== b && /\d:\d\d:\d\d/.test(b), q2(a) + ' → ' + q2(b) + ' one second later'); },
      explain: '`setInterval(updateClock, 1000)` calls `updateClock` every 1000 ms. With brackets, `setInterval(updateClock(), 1000)` runs it once and then has nothing to repeat.',
      fix: 'updateClock();\nsetInterval(updateClock, 1000);' },
    { text: 'At 8:30:05 am on November 23, 2026, `#clock` says **Monday, November 23, 2026 | 8:30:05 AM**', pts: 2,
      test: c => { if (!c.fn('updateClock')) return c.ok(false, 'no function named updateClock');
        fakeDate(c, 2026, 10, 23, 8, 30, 5); c.call('updateClock'); const t = c.text('#clock'); realDate(c);
        return c.ok(tidy(t) === tidy('Monday, November 23, 2026 | 8:30:05 AM'), '#clock shows ' + q2(t)); },
      explain: 'The date and the time are two strings joined with ` | ` in a template literal. `toLocaleTimeString("en-US")` gives hours, minutes, seconds and AM/PM.',
      fix: 'clockText.textContent = `${date} | ${time}`;' },
    { text: 'At 8:30 am the sign says **We are open** with the class `open`', pts: 1,
      test: c => { if (!c.fn('updateClock')) return c.ok(false, 'no function named updateClock');
        fakeDate(c, 2026, 10, 23, 8, 30, 5); c.call('updateClock'); realDate(c);
        return c.ok(same(c.text('#openStatus'), 'We are open') && classesOf(c, '#openStatus').includes('open') && !classesOf(c, '#openStatus').includes('closed'), 'at 8:30: ' + q2(c.text('#openStatus')) + ', ' + classStr(c, '#openStatus')); },
      explain: '`getHours()` gives the hour from 0 to 23. Open hours are `hour >= 7 && hour < 18`.',
      fix: 'const hour = now.getHours();\nif (hour >= 7 && hour < 18) {\n  statusText.textContent = "We are open";\n  …' },
    { text: 'At 18:00 and at 6:59 the sign says **Sorry, we are closed** with the class `closed` (and not `open`)', pts: 2,
      test: c => { if (!c.fn('updateClock')) return c.ok(false, 'no function named updateClock');
        fakeDate(c, 2026, 10, 23, 8, 30, 0); c.call('updateClock');
        fakeDate(c, 2026, 10, 23, 18, 0, 0); c.call('updateClock'); const a = c.text('#openStatus'), ka = classesOf(c, '#openStatus');
        fakeDate(c, 2026, 10, 23, 6, 59, 0); c.call('updateClock'); const b = c.text('#openStatus'), kb = classesOf(c, '#openStatus'); realDate(c);
        const good = (t, k) => same(t, 'Sorry, we are closed') && k.includes('closed') && !k.includes('open');
        return c.ok(good(a, ka) && good(b, kb), 'at 18:00: ' + q2(a) + ' (' + ka.join(' ') + '); at 6:59: ' + q2(b) + ' (' + kb.join(' ') + ')'); },
      explain: 'At exactly 18:00 the shop has closed, so the test is `hour < 18`, not `<= 18`. Remove `open` when you add `closed`, or the sign keeps both classes after closing time.',
      fix: '} else {\n  statusText.textContent = "Sorry, we are closed";\n  statusText.classList.remove("open");\n  statusText.classList.add("closed");\n}' }
  ],
  quiz: [
    { q: 'What does `setInterval(updateClock, 1000)` do?',
      options: ['Calls `updateClock` once, after 1000 seconds', 'Waits 1 second before the script continues', 'Calls `updateClock` every 1000 milliseconds (every second)', 'Shows the time 1000 times'],
      answer: 2, explain: 'The time is in milliseconds, and the function is called again and again until the page closes (or `clearInterval` stops it).' },
    { q: 'It is 3:15 pm. What does `new Date().getHours()` give?',
      options: ['`3`', '`15`', '`"3:15 PM"`', '`315`'],
      answer: 1, explain: '`getHours()` uses the 24-hour clock (0 to 23), which makes comparisons like `hour < 18` easy.' }
  ]
},

/* ================================================================ 10. capstone: dice board */
{
  id: 10, module: 'Stages 2–8', topic: 'Putting it together', edit: 'js', art: 'img/cupping.png',
  title: 'The Trailhead Dice Board',
  story: 'For customer appreciation day, Trailhead runs a dice game: roll two dice, and a total of **8 or more** wins a free cookie. Every roll is listed under the board. This page uses everything in the lab: finding elements, text, classes, `src` and `alt`, clicks, `createElement`, and a reset. The dice pictures are `img/dice1.png` to `img/dice6.png`.',
  steps: [
    'Find the elements you need (`#die1`, `#die2`, `#total`, `#message`, `#history`, `#rollButton`, `#newButton`).',
    'Write `function rollDie()` that **returns** a random whole number from 1 to 6: `Math.floor(Math.random() * 6) + 1`.',
    'Write `function rollDice()`: roll two dice (`die1`, `die2`) with `rollDie()`, and show each one\'s picture (`img/dice3.png` for a 3) with an `alt` like `Die showing 3`.',
    'In `rollDice()`, set `#total` to `Total: 9` (the real total). If the total is **8 or more**, show `You win a free cookie!` in `#message` with **only** the class `won`; otherwise `Under 8. Try again!` with **only** the class `lost`.',
    'In `rollDice()`, add an `<li>` to `#history` that says `3 + 6 = 9` (create, fill, attach).',
    'Write `function newGame()`: empty `#history`, set `#total` to `Total: 0`, `#message` to `Roll the dice!` with only the class `info`, and both dice back to `img/dice1.png` (alt `Die showing 1`).',
    'Connect `#rollButton` to `rollDice` and `#newButton` to `newGame`.'
  ],
  practise: ['Math.random', 'src / alt', 'classList', 'createElement', 'events', 'reset'],
  starter: {
    html: PAGE('Dice Board', `    <h2>Roll 8 or more to win a free cookie</h2>
    <div class="dice">
      <img id="die1" src="img/dice1.png" alt="Die showing 1">
      <img id="die2" src="img/dice1.png" alt="Die showing 1">
    </div>
    <p id="total" class="total">Total: 0</p>
    <p id="message" class="info">Roll the dice!</p>
    <div class="row">
      <button id="rollButton">Roll</button>
      <button id="newButton" class="secondary">New game</button>
    </div>
    <h3>Rolls</h3>
    <ul id="history"></ul>`),
    css: BASE_CSS + `
.dice {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.dice img {
  width: 100px;
  height: 100px;
}

.total {
  font-size: 26px;
  font-weight: bold;
}

#message {
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  border-radius: 6px;
}

.info { color: #3b261a; background-color: #f4f1ec; }
.won { color: #ffffff; background-color: #00796b; }
.lost { color: #ffffff; background-color: #5f5f5f; }

#history {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

#history li {
  padding: 4px 12px;
  background-color: #f4f1ec;
  border: 1px solid #c9b8a6;
  border-radius: 14px;
}
`,
    js: `// Activity 10: The Trailhead Dice Board

// 1. find the elements you need: #die1, #die2, #total, #message, #history, #rollButton, #newButton


// 2. rollDie(): return a random whole number from 1 to 6


// 3-5. rollDice(): two dice, their pictures and alt, the total, win (8+) or lose, and a history item


// 6. newGame(): empty the history, Total: 0, "Roll the dice!" (class info), both dice back to 1


// 7. connect #rollButton and #newButton

`
  },
  solution: {
    html: null, css: null,
    js: `// Activity 10: The Trailhead Dice Board

// 1. find the elements you need: #die1, #die2, #total, #message, #history, #rollButton, #newButton
const die1Image = document.getElementById("die1");
const die2Image = document.getElementById("die2");
const totalText = document.getElementById("total");
const messageText = document.getElementById("message");
const historyList = document.getElementById("history");
const rollButton = document.getElementById("rollButton");
const newButton = document.getElementById("newButton");

// 2. rollDie(): return a random whole number from 1 to 6
function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

// 3-5. rollDice(): two dice, their pictures and alt, the total, win (8+) or lose, and a history item
function rollDice() {
  const die1 = rollDie();
  const die2 = rollDie();
  const total = die1 + die2;

  die1Image.src = \`img/dice\${die1}.png\`;
  die1Image.alt = \`Die showing \${die1}\`;
  die2Image.src = \`img/dice\${die2}.png\`;
  die2Image.alt = \`Die showing \${die2}\`;
  totalText.textContent = \`Total: \${total}\`;

  messageText.classList.remove("info", "won", "lost");
  if (total >= 8) {
    messageText.textContent = "You win a free cookie!";
    messageText.classList.add("won");
  } else {
    messageText.textContent = "Under 8. Try again!";
    messageText.classList.add("lost");
  }

  const item = document.createElement("li");
  item.textContent = \`\${die1} + \${die2} = \${total}\`;
  historyList.appendChild(item);
}

// 6. newGame(): empty the history, Total: 0, "Roll the dice!" (class info), both dice back to 1
function newGame() {
  historyList.innerHTML = "";
  totalText.textContent = "Total: 0";
  messageText.textContent = "Roll the dice!";
  messageText.classList.remove("won", "lost");
  messageText.classList.add("info");
  die1Image.src = "img/dice1.png";
  die1Image.alt = "Die showing 1";
  die2Image.src = "img/dice1.png";
  die2Image.alt = "Die showing 1";
}

// 7. connect #rollButton and #newButton
rollButton.addEventListener("click", rollDice);
newButton.addEventListener("click", newGame);
`
  },
  checks: [
    { text: 'The script runs with no errors and has `rollDie()`, `rollDice()` and `newGame()`', pts: 1,
      test: c => c.ok(!c.errors.length && ['rollDie', 'rollDice', 'newGame'].every(n => c.fn(n)), c.errors.length ? noErr(c) : ['rollDie', 'rollDice', 'newGame'].map(n => n + (c.fn(n) ? ' found' : ' missing')).join(', ')),
      explain: 'Small functions, each with one job, are easier to test and to reuse.',
      fix: 'function rollDie() { … }\nfunction rollDice() { … }\nfunction newGame() { … }' },
    { text: '`rollDie()` gives 1 for the smallest random number and 6 for the largest', pts: 2,
      test: c => { if (!c.fn('rollDie')) return c.ok(false, 'no function named rollDie');
        c.random(0); const lo = c.call('rollDie'); c.random(0.9999); const hi = c.call('rollDie');
        return c.ok(lo === 1 && hi === 6, 'Math.random() = 0 gave ' + JSON.stringify(lo) + ', 0.9999 gave ' + JSON.stringify(hi)); },
      explain: '`Math.random()` is from 0 up to (not including) 1. Times 6 and `Math.floor` gives 0 to 5, so `+ 1` makes 1 to 6. `Math.round` would make 0 and 7 possible.',
      fix: 'function rollDie() {\n  return Math.floor(Math.random() * 6) + 1;\n}' },
    { text: 'Rolling a 3 and a 6 shows `img/dice3.png` and `img/dice6.png`, with alt **Die showing 3** / **Die showing 6**', pts: 2,
      test: c => { c.random(0.4, 0.9); c.click('#rollButton');
        const s1 = srcOf(c, '#die1'), s2 = srcOf(c, '#die2');
        return c.ok(/img\/dice3\.png$/.test(s1) && /img\/dice6\.png$/.test(s2) && same(c.attr('#die1', 'alt'), 'Die showing 3') && same(c.attr('#die2', 'alt'), 'Die showing 6'),
          'die1 src="' + s1 + '" alt="' + c.attr('#die1', 'alt') + '", die2 src="' + s2 + '" alt="' + c.attr('#die2', 'alt') + '"'); },
      explain: 'Build the file name from the number: `` `img/dice${die1}.png` ``. Change the `alt` too, so the picture still makes sense without sight.',
      fix: 'die1Image.src = `img/dice${die1}.png`;\ndie1Image.alt = `Die showing ${die1}`;' },
    { text: 'A 3 and a 6 show **Total: 9** and **You win a free cookie!** with only the class `won`', pts: 2,
      test: c => { c.random(0.4, 0.9); c.click('#rollButton');
        return c.ok(same(c.text('#total'), 'Total: 9') && same(c.text('#message'), 'You win a free cookie!') && classesOf(c, '#message').join(' ') === 'won',
          '#total ' + q2(c.text('#total')) + ', #message ' + q2(c.text('#message')) + ', ' + classStr(c, '#message')); },
      explain: 'Add the two numbers (they are numbers already, from `rollDie`), then `if (total >= 8)`. Remove the old classes before adding the new one.',
      fix: 'const total = die1 + die2;\ntotalText.textContent = `Total: ${total}`;\nif (total >= 8) { … }' },
    { text: 'A 1 and a 2 show **Total: 3** and **Under 8. Try again!** with only the class `lost`', pts: 2,
      test: c => { c.random(0, 0.2); c.click('#rollButton');
        return c.ok(same(c.text('#total'), 'Total: 3') && same(c.text('#message'), 'Under 8. Try again!') && classesOf(c, '#message').join(' ') === 'lost',
          '#total ' + q2(c.text('#total')) + ', #message ' + q2(c.text('#message')) + ', ' + classStr(c, '#message')); },
      explain: 'Without `classList.remove`, a loss after a win keeps `won` as well as `lost`.',
      fix: 'messageText.classList.remove("info", "won", "lost");\n…\nmessageText.classList.add("lost");' },
    { text: 'Exactly 8 (a 2 and a 6) wins', pts: 1,
      test: c => { c.random(0.2, 0.9); c.click('#rollButton');
        return c.ok(same(c.text('#total'), 'Total: 8') && classesOf(c, '#message').join(' ') === 'won', '#total ' + q2(c.text('#total')) + ', ' + classStr(c, '#message')); },
      explain: '"8 or more" is `total >= 8`. `total > 8` would turn the winning 8 into a loss.',
      fix: 'if (total >= 8) {' },
    { text: 'Each roll adds an item like **3 + 6 = 9** at the end of `#history`', pts: 2,
      test: c => { const n = c.qa('#history li').length; c.random(0.4, 0.9); c.click('#rollButton'); const li = c.qa('#history li');
        return c.ok(li.length === n + 1 && tidy(li[li.length - 1].textContent).replace(/\s/g, '') === '3+6=9', li.length + ' item(s)' + (li.length ? ', the last says ' + q2(li[li.length - 1].textContent) : '')); },
      explain: 'Create the `li`, fill it with a template literal, and `appendChild` it to the list: the same three steps as the order queue.',
      fix: 'const item = document.createElement("li");\nitem.textContent = `${die1} + ${die2} = ${total}`;\nhistoryList.appendChild(item);' },
    { text: '**New game** empties the history and resets the total, the message (class `info`) and both dice', pts: 2,
      test: c => { c.random(0.4, 0.9); c.click('#rollButton'); c.click('#newButton');
        const ok = c.qa('#history li').length === 0 && same(c.text('#total'), 'Total: 0') && same(c.text('#message'), 'Roll the dice!') && classesOf(c, '#message').join(' ') === 'info' && /img\/dice1\.png$/.test(srcOf(c, '#die1')) && /img\/dice1\.png$/.test(srcOf(c, '#die2'));
        return c.ok(c.fn('newGame') && ok, c.qa('#history li').length + ' history item(s), #total ' + q2(c.text('#total')) + ', #message ' + q2(c.text('#message')) + ' ' + classStr(c, '#message') + ', dice ' + srcOf(c, '#die1') + ' / ' + srcOf(c, '#die2')); },
      explain: 'A reset puts every part of the page back the way it started: lists, text, classes and pictures.',
      fix: 'historyList.innerHTML = "";\ntotalText.textContent = "Total: 0";\n…\ndie1Image.src = "img/dice1.png";' }
  ],
  quiz: [
    { q: 'Which expression gives a whole number from 1 to 6?',
      options: ['`Math.random() * 6`', '`Math.round(Math.random() * 6)`', '`Math.floor(Math.random() * 7)`', '`Math.floor(Math.random() * 6) + 1`'],
      answer: 3, explain: '`Math.floor(Math.random() * 6)` is 0 to 5; `+ 1` shifts it to 1 to 6. The others give decimals, or include 0 (and 7).' },
    { q: 'Your script is linked in the `<head>` instead of at the end of `<body>`, and `document.getElementById("rollButton")` gives `null`. Why?',
      options: ['The id is misspelt', 'The script ran before the browser had built the button in the DOM', '`getElementById` does not work in the head', 'Buttons cannot have ids'],
      answer: 1, explain: 'The browser builds the DOM from top to bottom. A script at the end of `<body>` runs after every element above it exists.' }
  ]
}
];

/* Files the student does not edit are the same in starter and solution. */
ACTIVITIES.forEach(a => {
  for (const f of ['html', 'css', 'js']) if (a.solution[f] == null && a.starter[f] != null) a.solution[f] = a.starter[f];
});
