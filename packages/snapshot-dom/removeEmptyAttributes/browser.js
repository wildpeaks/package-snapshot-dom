"use strict";window.snapshotRemoveEmptyAttributes=function t(s){if(Array.isArray(s.childNodes)&&(s.childNodes=s.childNodes.map(t)),s&&s.attributes){const t=[];for(const e in s.attributes)s.attributes[e]||t.push(e);t.forEach(t=>delete s.attributes[t])}return s};