export function createElement (element, className, text, parent){
    const el = document.createElement(element);
    if(className) el.className = className;
    if(text) el.textContent = text;
    if(parent) parent.appendChild(el);
    return el;

}