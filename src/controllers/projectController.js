//projectController.js
import { Project } from "../models/Project.js"
import { AddTask } from "../models/Tasks.js"
import { createElement } from "../utils/createElement.js";

import { tasksDisplay } from "../controllers/taskController.js";
import { state } from "../state.js";

// this Elmemt  shows ALL you projects you input(PS: its a container/wrapper) 
const addedProjects = document.querySelector('.addedProjects');

// CREATE PROJECT MODAL FORM SUBMISSION
export function createProject(name) {
    if (!name) return;
    const newProject = new Project(name);
    // projectDisplay(newProject);

    const DOMButtons = createElement('button', 'project', '', addedProjects);
    const spanHash = createElement('span', 'hash', '', DOMButtons);
    DOMButtons.append(newProject.name);

    DOMButtons.addEventListener('click', () => {
        state.currentProject = newProject
        tasksDisplay();
        // console.log(currentProject);

    });

    return newProject;
}
const testProject = createProject('Test');
const testProject2 = createProject('Test 2');
testProject.addTask(new AddTask('Task 1', 'desc 1', '', '', true));

testProject.addTask(new AddTask('Task 2', 'desc 2', '', ''));
testProject.addTask(new AddTask('Task 3', 'desc 3', '', ''));
testProject2.addTask(new AddTask('Task 4', 'desc 4', '', ''));
testProject2.addTask(new AddTask('Task 5', 'desc 5', '', ''));

const openModal = document.getElementById('openModal');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeModal');
const overlay = document.querySelector('.modal-overlay');
const inputNewProject = document.querySelector('#newProject');
const form = document.getElementById('projectForm');

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
    createProject(val)
    console.log(val);
    form.reset();

    modal.classList.remove('active');
});