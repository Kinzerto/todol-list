import { Project, createProject, AddTask} from "./scripts/list.js";
import { createElement } from "./utils/createElement.js";
import { display } from "./scripts/display.js";
import './styles/reset.scss';

const projects = document.querySelector('.projects');
const tasks = document.querySelector('.tasks');
const projectButton = document.querySelector('button');

const addProject = document.querySelector('.addProject');

createProject(addProject);

document.addEventListener('DOMContentLoaded',display);




