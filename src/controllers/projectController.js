//projectController.js
import { Project } from "../models/Project.js"
import { AddTask } from "../models/Tasks.js"//delete later
import { createElement } from "../utils/tools.js";


import { tasksDisplay } from "../controllers/taskController.js";
import { renderTasks, filterTask } from "../scripts/list.js";
import { state } from "../state.js";

// this Elmemt  shows ALL you projects you input(PS: its a container/wrapper) 
const addedProjects = document.querySelector('.addedProjects');

// CREATE PROJECT MODAL FORM SUBMISSION
export function createProject(name) {
    if (!name) return;
    const newProject = new Project(name);
    renderProject(newProject)

    return newProject;
}

function renderProject(newProject) {
    console.log(newProject);
    const DOMButtons = createElement('button', 'project', '', addedProjects);

    DOMButtons.dataset.projName = newProject.name;

    const spanHash = createElement('span', 'hash', '#', DOMButtons);

    const projName = createElement('span', 'projName', newProject.name, DOMButtons);
    // DOMButtons.append(newProject.name);

    const deleteIcon = createElement('span', 'material-symbols-outlined', 'delete', DOMButtons);

    deleteIcon.addEventListener('click', (e) => {
        console.log('click');
        e.stopPropagation();
        Project.removeProject(newProject.name);
        state.currentView = 'allTasks';
        filterTask()
        DOMButtons.remove();
        console.log(Project.allProjects);

    })

    DOMButtons.addEventListener('click', () => {
        state.currentProject = newProject
        tasksDisplay();

        // console.log(currentProject);

    });

}
const testProject = createProject('Test 1');
const testProject2 = createProject('Test 2');

console.log(testProject);
testProject.addTask(new AddTask('Task 1', 'desc 1', '', 'high', true));

testProject.addTask(new AddTask('Task 2', 'desc 2', '', 'high'));
testProject.addTask(new AddTask('Task 3', 'desc 3', '', ''));

testProject2.addTask(new AddTask('Task 4', 'desc 4', '', 'high'));
testProject2.addTask(new AddTask('Task 5', 'desc 5', '', '', true));

const openModal = document.getElementById('openModal');
const modal = document.getElementById('modal');
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
    createProject(val)
    console.log(val);
    form.reset();

    modal.classList.remove('active');
});