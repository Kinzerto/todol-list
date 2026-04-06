// index.js

// import { Project, createProject, AddTask } from "./scripts/list.js";

// import { Project } from "./models/Project.js";
// import { AddTask } from "./models/Tasks.js";
// import {createProject} from "./controllers/projectController.js"


import { createElement } from "./utils/createElement.js";
// import { display } from "./scripts/display.js";

import './styles/reset.scss';
import './styles/style.scss';
import { createProject } from "./controllers/projectController.js"


const content = document.querySelector('.content');
const wrapper = content.querySelector('.wrapper');

export const headerTitle = document.querySelector('.title');
export const tasks = wrapper.querySelector('.tasks');
export const addButton = wrapper.querySelector('.addButton');




document.addEventListener('DOMContentLoaded', function display() {
    const container = document.querySelector('.container');
    const header = document.querySelector('header');
});













