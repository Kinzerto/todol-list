import { Project, createProject, AddTask} from "./scripts/list.js";
import { createElement } from "./utils/createElement.js";


const projects = document.querySelector('.projects');
const tasks = document.querySelector('.tasks');
const projectButton = document.querySelector('button');


createProject(projectButton);






