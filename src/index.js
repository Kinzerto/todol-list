import './styles/reset.scss';
import './styles/style.scss';

import { state } from "./state.js"
import { filterTask } from './controllers/filterTaskController.js';
import { Project } from "./models/Project.js";
import { renderTasks } from "./viewer/renderTasks.js";
import { findProjectNameByTaskId } from './utils/tools.js';
import { AddTask } from './models/Tasks.js';
import { displayProject } from './controllers/projectController.js';
import { countData } from './controllers/count.js';
import { format } from 'date-fns';

const content = document.querySelector('.content');
const wrapper = content.querySelector('.wrapper');

export const headerTitle = document.querySelector('.title');
export const tasks = wrapper.querySelector('.tasks');
export const addButton = wrapper.querySelector('.addButton');

document.addEventListener('DOMContentLoaded', function display() {
    state.currentView = 'home';
    displayProject();
    countData();
    filterTask();
});

export const projectNames = document.getElementById('project');

const primary = document.querySelector('.primaryButton');

primary.addEventListener('click', (e) => {
    e.stopPropagation();
    const btn = e.target.closest('button');
    if (!btn) return;
    // console.log(btn.classList[0]);
    const className = btn.classList[0];

    switch (className) {
        case 'add':
            deleteDetail.textContent = 'Cancel'
            showDetailsForm.reset();
            detailsModal.classList.add('active');
            saveChange.textContent = 'Add Task'
            state.adding = true
            projectNames.replaceChildren();

            formatInput();

            break;

        case 'home':
            state.currentView = 'home';
            filterTask();
            break;

        case 'todayTask':
            state.currentView = 'today';

            filterTask();
            break;

        case 'upcomingTask':
            state.currentView = 'upcoming';
            filterTask();
            break;

        case 'completeTask':
            state.currentView = 'completed';
            filterTask();
            break;

        case 'importantTask':
            state.currentView = 'important';
            filterTask();
            break;

        default:
            break;
    }


})

export function formatInput() {
    for (let key in Project.allProjects) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        projectNames.appendChild(option);
    }
    if (state.currentView === 'today') {
        showDetailsForm.elements['date'].value = format(new Date(), 'yyyy-MM-dd');

    } else if (state.currentView === 'important') {
        showDetailsForm.elements['priority'].value = 'high';

    } else if (state.currentView === 'project' && state.currentProject) {
        showDetailsForm.elements['project'].value = state.currentProjectName;
    }
}

const detailsModal = document.querySelector('.detailsModal');
const detailsContent = detailsModal.querySelector('.modal-content');
export const showDetailsForm = detailsContent.querySelector('form.showDetailsForm');


const modalOverlay = detailsModal.querySelector('.modalOverlay');
export const saveChange = document.querySelector('#saveChange');
const closeDetailsModal = detailsContent.querySelector('#closeDetailsModal');
export const deleteDetail = showDetailsForm.querySelector('#delete');

[modalOverlay, closeDetailsModal].forEach((el) => {
    el.addEventListener('click', () => {
        detailsModal.classList.remove('active')
    });
})


showDetailsForm.addEventListener('submit', (e) => {
    saveChange.textContent = 'Update'
    e.preventDefault();

    const formDataDetail = new FormData(showDetailsForm);
    const to = formDataDetail.get("project");

    const inputData = {
        project: formDataDetail.get("project"),
        title: formDataDetail.get("title"),
        description: formDataDetail.get("descrip"),
        dueDate: formDataDetail.get("date"),
        priority: formDataDetail.get("priority")
    };

    if (!inputData.title) return;

    const projectName = findProjectNameByTaskId(state.currentDivId);

    // 🔥 EDIT MODE
    if (!state.adding) {

        const updatedData = {
            title: inputData.title,
            description: inputData.description,
            dueDate: inputData.dueDate,
            priority: inputData.priority
        };

        if (state.currentProjectName.name === to) {
            // same project → just edit
            projectName.editTask(state.currentDivId, updatedData);
        } else {
            // different project → move + update
            projectName.moveTask(
                state.currentDivId,
                state.currentProjectName.name,
                to,
                updatedData
            );
        }
    }

    // ADD MODE
    if (state.adding) {
        const newTask = new AddTask(
            inputData.title,
            inputData.description,
            inputData.dueDate,
            inputData.priority
        );

        Project.addTask(to, newTask);
        countData();
    }

    // 🔄 Re-render
    if (state.currentView === 'project') {
        renderTasks();
    } else {
        filterTask();
    }

    // close modal
    countData();
    detailsModal.classList.remove('active');

});

deleteDetail.addEventListener('click', (e) => {
    e.preventDefault();
    if (!state.adding) {
        state.currentProjectName.removeTask(state.currentDivId);

        // renderTasks();
        if (state.currentView === 'project') {
            renderTasks()
        } else {
            filterTask()
        }
    }
    detailsModal.classList.remove('active');
    countData();

});















