import './styles/reset.scss';
import './styles/style.scss';
import { createProject } from "./controllers/projectController.js"

import { state } from "./state.js"
import { filterTask } from './scripts/list.js';


const content = document.querySelector('.content');
const wrapper = content.querySelector('.wrapper');

export const headerTitle = document.querySelector('.title');
export const tasks = wrapper.querySelector('.tasks');
export const addButton = wrapper.querySelector('.addButton');




document.addEventListener('DOMContentLoaded', function display() {
    const container = document.querySelector('.container');
    const header = document.querySelector('header');

    state.currentView = 'allTasks';
    filterTask();
});













