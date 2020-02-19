# Snapshot

**Converts an HTMLElement to a JSON tree, useful for automated DOM tests.**

Install:

	npm install @wildpeaks/snapshot-dom


---
## Create a snapshot

The package provides a function to generate a JSON snapshot of the a DOM element:
 - in **Node**: `toJSON`
 - in **Browser**: `window.snapshotToJSON`


Using **jsDOM**:
````js
const {toJSON} = require("@wildpeaks/snapshot-dom");
const html = `<article class="class1 class2"><p>Hello</p><p>World</p></article>`;

const {window} = new JSDOM(`<!DOCTYPE html><html><head></head><body>${html}</body></html>`);
const snapshot = toJSON(window.document.body);
````


Using **Puppeteer**:
````js
const script = require.resolve("@wildpeaks/snapshot-dom/lib/browser.js");
const html = `<article class="class1 class2"><p>Hello</p><p>World</p></article>`;

let snapshot;
const browser = await puppeteer.launch();
try {
  const page = await browser.newPage();
  await page.setContent(`<!DOCTYPE html><html><head></head><body>${html}</body></html>`, {waitUntil: "load"});
  await page.addScriptTag({path: script});
  snapshot = await page.evaluate(() => window.snapshotToJSON(document.body));
} finally {
  await browser.close();
}
````


In both examples, `snapshot` contains:
````
{
  tagName: "body",
  childNodes: [
    {
      tagName: "article",
      attributes: {
        class: "class1 class2"
      },
      childNodes: [
        {
          tagName: "p",
          childNodes: [
            {
              nodeName: "#text",
              nodeValue: "Hello"
            }
          ]
        },
        {
          tagName: "p",
          childNodes: [
            {
              nodeName: "#text",
              nodeValue: "World"
            }
          ]
        }
      ]
    }
  ]
}
````


---
## Remove empty values

The package provides a transform function to remove empty values:
 - in **Node**: `removeEmptyAttributes`
 - in **Browser**: `window.snapshotRemoveEmptyAttributes`


Using **jsDOM**:
````js
const {toJSON} = require("@wildpeaks/snapshot-dom");
const {removeEmptyAttributes} = require("@wildpeaks/snapshot-dom/removeEmptyAttributes");
const html = `<img param1 param2="" param3="hello" />`;

const {window} = new JSDOM(`<!DOCTYPE html><html><head></head><body>${html}</body></html>`);
const snapshot = toJSON(window.document.body);
removeEmptyAttributes(snapshot);
````


Using **Puppeteer**:
````js
const script1 = require.resolve("@wildpeaks/snapshot-dom/lib/browser.js");
const script2 = require.resolve("@wildpeaks/snapshot-dom/removeEmptyAttributes/browser.js");
const html = `<img param1 param2="" param3="hello" />`;

let snapshot;
const browser = await puppeteer.launch();
try {
  const page = await browser.newPage();
  await page.setContent(`<!DOCTYPE html><html><head></head><body>${html}</body></html>`, {waitUntil: "load"});
  await page.addScriptTag({path: script1});
  await page.addScriptTag({path: script2});
  snapshot = await page.evaluate(() => {
    const snapshot_ = window.snapshotToJSON(document.body);
    window.snapshotRemoveEmptyAttributes(snapshot_);
    return snapshot_;
  });
} finally {
  await browser.close();
}
````


In both examples, `snapshot` contains:
````
{
  tagName: "body",
  childNodes: [
    {
      tagName: "img",
      attributes: {
        param3: "hello"
      }
    }
  ]
}
````

Note that `param1` and `param2` aren't in the tree because of the transform.


---
## Sort values

The package provides a transform function to sort values in space-separated attributes like `class`:
 - in **Node**: `sortAttributes`
 - in **Browser**: `window.snapshotSortAttributes`


Using **jsDOM**:
````js
const {toJSON} = require("@wildpeaks/snapshot-dom");
const {sortAttributes} = require("@wildpeaks/snapshot-dom/sortAttributes");
const html = `<article data-param1="sorted2 sorted1 sorted3" data-param2="unsorted2 unsorted1 unsorted3"></article>`;

const {window} = new JSDOM(`<!DOCTYPE html><html><head></head><body>${html}</body></html>`);
const snapshot = toJSON(window.document.body);
sortAttributes(snapshot, ["data-param1"]);
````


Using **Puppeteer**:
````js
const script1 = require.resolve("@wildpeaks/snapshot-dom/lib/browser.js");
const script2 = require.resolve("@wildpeaks/snapshot-dom/sortAttributes/browser.js");
const html = `<article data-param1="sorted2 sorted1 sorted3" data-param2="unsorted2 unsorted1 unsorted3"></article>`;

let snapshot;
const browser = await puppeteer.launch();
try {
  const page = await browser.newPage();
  await page.setContent(`<!DOCTYPE html><html><head></head><body>${html}</body></html>`, {waitUntil: "load"});
  await page.addScriptTag({path: script1});
  await page.addScriptTag({path: script2});
  snapshot = await page.evaluate(() => {
    const snapshot_ = window.snapshotToJSON(document.body);
    window.snapshotSortAttributes(snapshot_, ["data-param1"]);
    return snapshot_;
  });
} finally {
  await browser.close();
}
````


In both examples, `snapshot` contains:
````
{
  tagName: "body",
  childNodes: [
    {
      tagName: "article",
      attributes: {
        "data-param1": "sorted1 sorted2 sorted3",
        "data-param2": "unsorted2 unsorted1 unsorted3"
      }
    }
  ]
}
````

Note how values in `data-param1` are sorted whereas they remain unsorted in `data-param2`.

Also note that, because it rewrites the value, it trims and condenses consecutive whitespace.

---
## Migration from v1 to v2

**The second parameter has been removed**: use function `removeEmptyAttributes` to get
the same result as the parameter that was removed.
