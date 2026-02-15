import { Project } from "./scripts/list.js";
import { AddTask } from "./scripts/list.js";
import { createElement } from "./utils/createElement.js";

const projects = document.querySelector('.projects');
const tasks = document.querySelector('.tasks');
const createProject = document.querySelector('button');


createProject.addEventListener('click', (e) => {
    const inp = prompt();
    if(!inp) return;
    const newProject = new Project(inp);
    addFunctionality(newProject);
});

function addFunctionality (data) {

    const DOMButtons = createElement('button',data.name,data.name, projects)
    DOMButtons.addEventListener('click', (e) => {
        const inp = prompt();
        data.addTask(inp)
        console.log(data.showList);
        console.log(Project.allProjects);
    })

    
}






