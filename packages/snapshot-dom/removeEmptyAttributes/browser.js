"use strict";window.snapshotRemoveEmptyAttributes=function t(e){if("object"==typeof e&&null!==e&&(Array.isArray(e.childNodes)&&(e.childNodes=e.childNodes.map(t)),e&&e.attributes)){const t=[];for(const s in e.attributes)e.attributes[s]||t.push(s);t.forEach(t=>delete e.attributes[t])}return e};