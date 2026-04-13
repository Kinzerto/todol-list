//projectController.js
import { Project } from "../models/Project.js"
import { AddTask } from "../models/Tasks.js"//delete later
import { renderProject } from "../viewer/renderProject.js";
import { state } from "../state.js";
import { renderTasks } from "../viewer/renderTasks.js";
import { filterTask } from "./filterTaskController.js";
import { saveProjects } from "./localStorage.js";
import { addDays, format } from 'date-fns';

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
GettingStarted();


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
    saveProjects();
    modal.classList.remove('active');
});

function GettingStarted() {

    const daily = createProject('Daily');
    const dateNow = new Date();
    const dailyFormat = format(dateNow, "yyyy-MM-dd");

    daily.addTask(new AddTask('Walk Waffle', 'Walk my dog name Waffle that is so cute', dailyFormat, 'high', '', '3'));

    daily.addTask(new AddTask('Go to Gym', 'Workout for Chest Day', dailyFormat, '', '', '4'));


    const school = createProject('School');
    const sevenDay = addDays(new Date(), 7);
    const seven = format(sevenDay, "yyyy-MM-dd");

    const tomorrow = addDays(new Date(), 1);
    const formatTom = format(tomorrow, "yyyy-MM-dd");

    school.addTask(new AddTask('Make Presentation', 'Presentation about Bears(Griz, Panda, Ice Bear)', formatTom, 'high', '', '1'));

    school.addTask(new AddTask('Exam Review', 'Review notes for upcoming Exam', seven, 'medium', '', '2'));



}
console.log('djdj');
