import { greetings } from "./welcome.js";
import "./style.scss";

document.addEventListener('DOMContentLoaded', () => {
    document.body.textContent = greetings;
})  