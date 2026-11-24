/*
   Lab settings: everything that makes this lab yours. The engine (app.js, checker.js) reads
   these values; the activities themselves live in activities.js.
   Image paths are relative to index.html. Any image can be null: the app then draws a
   coloured banner instead.
*/
const LAB = {
  title: 'Trailhead DOM Lab',                    // big title on the home page and in the browser tab
  brand: 'DOM Lab',                    // short name beside the logo in the top bar, e.g. "Code Lab"
  kicker: 'CSIS 1280 · Module 9 · The DOM',                  // small line above the title, e.g. "CSIS 1280 · Modules 1 to 6"
  scope: 'Module 9',                    // used in sentences, e.g. "Modules 1–6"
  lead: 'Ten short web pages for Trailhead Coffee Roasters. Write the JavaScript that finds elements, changes them, and reacts to clicks, then submit and see exactly what to fix, with the proper code beside yours.',                      // one or two sentences under the title
  footer: 'CSIS 1280 · Multimedia Web Development',                  // footer text, e.g. "CSIS 1280 · Web Design"
  storageKey: 'codeLab.trailhead-dom-lab.v2',         // unique per lab, so two labs never share progress
  author: { name: 'Reza Ghaeli', url: 'https://github.com/RezaGhaeli' },                          // credit, e.g. { name: 'Reza Ghaeli', url: 'https://github.com/RezaGhaeli' }: home byline, footer, printed results

  logo: 'img/logo.png',                            // e.g. 'img/logo.png' (wide logo for the dark top bar)
  heroArt: 'img/hero.png',                         // e.g. 'img/hero.png' (wide picture on the home page)
  heroAlt: 'Illustration of a mountain trail at sunrise with a steaming mug of coffee',
  summaryArt: 'img/trail.png',                      // picture on the final results page
  how: [                                 // the four "How it works" cards; img may be null
    { img: 'img/beans.png', title: 'Read the task', text: 'Each activity tells a short Trailhead story and lists the steps. The page (HTML and CSS) is given.' },
    { img: 'img/pourover.png', title: 'Write the JavaScript', text: 'You write script.js: find elements, change them, and react to clicks.' },
    { img: 'img/cupping.png', title: 'Try your page', text: 'The page runs as you type. Click its buttons, type in its boxes, and compare with the Goal.' },
    { img: 'img/bags.png', title: 'Learn from the report', text: 'See each mistake, why it matters, the proper code, and your score.' }
  ],
  guide: null,                           // e.g. 'guide/Student_Guide.pdf' adds a "Student guide" button

  files: { html: 'index.html', css: 'style.css', js: 'script.js' },   // names on the editor tabs and in <link>/<script src>
  jsx: false,                            // true: compile the JS file from JSX with Babel (React labs); see the React section of the authoring guide
  express: false,                        // true: the JS file is an Express server (server.js) run in the browser; see "Express labs" in the authoring guide
  apiTester: false,                      // Express labs: true adds a method menu (GET/POST/PUT/PATCH/DELETE), a JSON body box and a Send button to the mini browser (REST API labs)
  mongo: null,                           // Express labs with MongoDB: { env: { MONGODB_URI: '…' }, seed: { movies: [ {...} ] } } (see the authoring guide)
  console: false,                        // true: a console lab (console.log, prompt, loops; no page to look at): the preview shows the program's console,
                                         // prompt() is answered from each activity's `answers` (a box students can edit), and endless loops are stopped.
                                         // false: student code runs exactly as in a browser. See "Console programs" in the authoring guide
  readySelector: null,                   // grading waits until this element has children (default '#root' when jsx is true)

  python: false,                    // true: students write Python (lab.py) run by Pyodide; set files to { py: 'lab.py' }
  pyPackages: ['numpy', 'pandas', 'scikit-learn'],   // loaded when Python starts (matplotlib loads on first import)
  pyData: [],                            // data files students read by name, e.g. ['data/diabetes.csv'] → pd.read_csv('diabetes.csv')
  pyTimeout: 60000,                      // stop a run after this many milliseconds

  /* Exam mode (null = a practice lab). A timed, one-sitting exam: students enter name + id and start a timer;
     all activities ("sections") are open; nothing is graded or shown until they finish (or time runs out);
     then they download a Word report (.docx) carrying their code, which grade.html re-grades in bulk.
     Keep solutions OUT of activities.js in an exam: see "Exams" in references/authoring-activities.md. e.g.
     { minutes: 40, idLabel: 'Student number', accessCode: null, review: false, rules: ['Work alone.', …] } */
  exam: null,

  chromeOnly: false,                     // true: the lab opens only in Google Chrome (other browsers see a 'please use Chrome' page)
  attempts: { max: 3, penalty: 10 },     // practice labs: 3 attempts per activity, attempt k worth (100 - 10k)% of its points; best attempt counts (null = unlimited)
  passMark: 80,                          // "redo anything below this" advice on the results page
  desktopWidth: 960,                     // width of the hidden grading frame for desktop checks
  phoneWidth: 400                        // width used for csN()/rectN() checks and the Phone preview
};
