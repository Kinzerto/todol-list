//projectController.js
import { Project } from "../models/Project.js"
import { AddTask } from "../models/Tasks.js"//delete later
import { renderProject } from "../viewer/renderProject.js";
import { state } from "../state.js";
import { renderTasks } from "../viewer/renderTasks.js";
import { filterTask } from "./filterTaskController.js";
// this Elmemt  shows ALL you projects you input(PS: its a container/wrapper) 
export const addedProjects = document.querySelector('.addedProjects');

// CREATE PROJECT MODAL FORM SUBMISSION
export function createProject(name) {
    if (!name) return;
    const newProject = new Project(name);

    return newProject;
}

export function displayProject() {
    addedProjects.replaceChildren();
    const proj = Project.allProjects;
    for (let key in proj) {
        renderProject(proj[key]);
    }
}

createProject('Home');
const testProject = createProject('Test 1');
const testProject2 = createProject('Test 2');

testProject.addTask(new AddTask('Task 1', 'desc 1', '', 'high', true));

testProject.addTask(new AddTask('Task 2', 'desc 2', '', 'high'));
testProject.addTask(new AddTask('Task 3', 'desc 3', '', ''));

testProject2.addTask(new AddTask('Task 4', 'desc 4', '', 'high'));
testProject2.addTask(new AddTask('Task 5', 'desc 5', '', '', true));

export const openModal = document.getElementById('openModal');
export const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeModal');
const overlay = document.querySelector('.modal-overlay');
const inputNewProject = document.querySelector('#newProject');
const form = document.getElementById('projectForm');

const minimize = document.querySelector('.minimize');

minimize.addEventListener('click', () => {
    addedProjects.classList.toggle('hide');
    const icon = minimize.querySelector('span');

    if (addedProjects.classList.contains('hide')) {
        icon.textContent = 'keyboard_arrow_right'; // collapsed
    } else {
        icon.textContent = 'keyboard_arrow_down'; // expanded
    }

})

// Event listeners for opening and closing the modal
openModal.addEventListener('click', () => {
    modal.classList.add('active');
});
// Close modal when clicking the close button or overlay
closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});
// Close modal when clicking outside the modal content
overlay.addEventListener('click', () => {
    modal.classList.remove('active');
});

// a form modal that submits what you type and send it to function createProject 

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = inputNewProject.value;
    if (state.editingTaskName) {
        Project.renameProject(state.editingTaskName, val);
        if (state.currentView === 'project') {
            renderTasks()
        } else {
            filterTask()
        }
        console.log(state.currentView);
        state.editingTaskName = null;
    } else {
        createProject(val);
    }
    displayProject();
    form.reset();
    modal.classList.remove('active');
});
// }