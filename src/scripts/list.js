import { createElement, findProjectNameByTaskId } from "../utils/tools.js";
import { Project } from "../models/Project.js";
import { AddTask } from "../models/Tasks.js";
import { state } from "../state.js";
import { renderTasks } from "../viewer/renderTasks.js";

import { tasks, addButton, headerTitle } from '../index.js';


const detailsModal = document.querySelector('.detailsModal');
const modalOverlay = detailsModal.querySelector('.modalOverlay');
const detailsContent = detailsModal.querySelector('.modal-content');
export const showDetailsForm = detailsContent.querySelector('form.showDetailsForm');
const closeDetailsModal = detailsContent.querySelector('#closeDetailsModal');
export const deleteDetail = showDetailsForm.querySelector('#delete');

const groupRadioTitleDesc = showDetailsForm.querySelector('.groupRadioTitleDesc');
const select = showDetailsForm.querySelector('.buttons .ProjectName #project');

export const saveChange = document.querySelector('#saveChange');
const add = document.querySelector('.add');
const completed = document.querySelector('.completeTask');
const important = document.querySelector('button.importantTask');
const allTasks = document.querySelector('.allTasks');

const projectNames = document.getElementById('project');

add.addEventListener('click', () => {
    deleteDetail.textContent = 'Cancel'
    showDetailsForm.reset();
    detailsModal.classList.add('active');
    saveChange.textContent = 'Add Task'
    state.adding = true
    console.log(state.currentView);
    projectNames.replaceChildren();

    for (let key in Project.allProjects) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        projectNames.appendChild(option);
    }
    if (state.currentView === 'project') {
        renderTasks()
    } else {
        filterTask()
    }

})
completed.addEventListener('click', () => {
    state.currentView = 'completed';
    filterTask();
});

important.addEventListener('click', () => {
    state.currentView = 'important';
    filterTask();
});

allTasks.addEventListener('click', () => {
    state.currentView = 'allTasks';
    filterTask();
    console.log(Project.allProjects);
})


export function filterTask() {
    // console.log(state.currentProject);
    tasks.replaceChildren();
    console.log(state.currentView);
    headerTitle.textContent = state.currentView === 'allTasks' ? 'all tasks' : state.currentView;
    addButton.replaceChildren();

    const projects = Project.allProjects;

    for (const [projectName, project] of Object.entries(projects)) {
        let filtered = null
        // ✅ filter ONLY this project's completed tasks
        if (state.currentView === 'completed') {
            filtered = project.showList.filter(task => task.completed);
        } else if (state.currentView === 'important') {
            filtered = project.showList.filter(task => task.priority === 'high' && !task.completed);
        } else if (state.currentView === 'allTasks') {
            filtered = project.showList.filter(task => !task.completed);
        }

        // ❗ skip empty projects
        if (filtered.length === 0) continue;

        // ✅ create section per project
        const section = createElement('div', 'projectSection', '', tasks);
        section.dataset.project = projectName; // for potential future use


        // ✅ render tasks INSIDE this section
        renderTasks(filtered, section, true);
        const projectHeader = createElement('div', 'projectHeader', '', section);

        const projectNameSpan = createElement('span', 'projectNameSpan', projectName, projectHeader);
        section.prepend(projectHeader);


        const collapse = document.createElement('span');
        collapse.classList.add('material-symbols-outlined', 'collapse');
        collapse.textContent = 'keyboard_arrow_down';
        projectHeader.prepend(collapse);
        // const collapse = createElement('span', 'collapse', '▼', projectHeader);

        collapse.addEventListener('click', (e) => {
            collapse.textContent = collapse.textContent === 'keyboard_arrow_down' ? 'keyboard_arrow_right' : 'keyboard_arrow_down';
            e.stopPropagation();
            section.classList.toggle('collapsed');

        });
    }
    console.log(Project.allProjects);
}

// details
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
    }

    // 🔄 Re-render
    if (state.currentView === 'project') {
        renderTasks();
    } else {
        filterTask();
    }

    // close modal
    detailsModal.classList.remove('active');

});

deleteDetail.addEventListener('click', (e) => {
    e.preventDefault();
    if (!state.adding) {
        console.log('runned');
        state.currentProjectName.removeTask(state.currentDivId);

        // renderTasks();
        if (state.currentView === 'project') {
            renderTasks()
        } else {
            filterTask()
        }
    }
    detailsModal.classList.remove('active');

});


