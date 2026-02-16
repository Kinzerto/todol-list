import { createElement } from "../utils/createElement.js";
import '../styles/style.scss';

import dark from '../assets/images/dark_mode.svg';

export function display() {
    const body = document.querySelector('body');

    const container = createElement('div', 'container', '', body);
    const header = createElement('header', '', '', container);
    const title = createElement('h1', '', 'TODO LIST', header);

    const headerSecond = createElement('div', 'headerSecond', '', header);

    //search bar
    const search = createElement('input', 'search', '', headerSecond);
    search.placeholder = 'Search todo...';

    //dropdown
    const dropdown = document.createElement('select');
    dropdown.className = 'dropdown';
    const option1 = document.createElement('option');
    option1.textContent = 'All';
    dropdown.appendChild(option1);
    headerSecond.appendChild(dropdown);

    const darkLight = createElement('button', 'darkLight', '', headerSecond);
    darkLight.innerHTML = `<img src="${dark}" alt="Dark Mode">`;

}