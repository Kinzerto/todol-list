import { createElement } from "../utils/createElement.js";
import '../styles/style.scss';

import dark from '../assets/images/dark_mode.svg';

export function display() {
    const container = document.querySelector('.container');
    const header = document.querySelector('header');
    
    //Title
    const title = createElement('h1', '', 'TODO LIST', header);
    
    

}