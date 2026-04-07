import { createElement } from "../utils/createElement.js";
import { Project } from "../models/Project.js";
import { AddTask } from "../models/Tasks.js";
import { state } from "../state.js";

import { tasks, addButton, headerTitle } from '../index.js';

// display tasks
// let state.state.currentDivId = null;
// let state.state.currentProjectName  = null;

// render tasks function with option to hide add button and show only completed tasks
export function renderTasks(taskList = state.currentProject.showList, parentContainer = tasks, hideAddBtn = false) {
    parentContainer.replaceChildren(); // clear container

    if (hideAddBtn === false) {
        state.currentProjectName = state.currentProject.name;
        addButton.replaceChildren();
        headerTitle.textContent = state.currentProject.name;
        const addButtonContainer = createElement('div', 'addButtonContainer', '', addButton);
        //ADD TASK BUTTON
        createElement('div', 'plusIcon', "\uFF0B", addButtonContainer);
        createElement('button', 'addTaskBtn', 'Add Task', addButtonContainer);

        //open modal
        addButtonContainer.addEventListener('click', () => {
            addTaskModalContainer.classList.add('show')
            addButton.classList.add('hideAddButton');
        });

        taskList = taskList.filter((task) => !task.completed)
    }

    taskList.forEach((task) => {
        const allTasks = createElement('div', 'allTasks', '', parentContainer);
        const taskWrap = createElement('div', 'taskWrap', '', allTasks);
        taskWrap.dataset.id = task.id;



        taskWrap.addEventListener('click', (e) => {
            console.log(state.currentView);
            state.currentProjectName = findProjectNameByTaskId(taskWrap.dataset.id);

            detailsModal.classList.add('active');
            state.currentDivId = task.id;

            // console.log(state.currentProjectName );


            showDetailsForm.elements['title'].value = task.title;
            showDetailsForm.elements['descrip'].value = task.description || '';
            showDetailsForm.elements['date'].value = task.dueDate || '';
            showDetailsForm.elements['priority'].value = task.priority || '';
        });

        const radio = createElement('input', '', '', taskWrap);
        radio.type = 'radio';
        radio.checked = task.completed;
        // add priority class color to radio button based on task priority
        if (task.priority) radio.classList.add(task.priority);

        //radio button to toggle task completion
        radio.addEventListener('click', (e) => {
            e.stopPropagation();
            const state = findProjectNameByTaskId(task.id);
            console.log(state);
            state.toggleTaskCompletion(task.id)
            // state.currentProject.toggleTaskCompletion(task.id);
            taskTitle.classList.add('completed');
            if (!hideAddBtn) {
                renderTasks()
            } else {
                filterTask()
            }
        });

        // task title
        const taskTitle = createElement('div', 'taskTitle', task.title, taskWrap);
        const description = createElement('div', 'description', task.description, taskWrap);
        const date = createElement('div', 'date', task.dueDate, taskWrap);
        // toggle completed class based on task completion status
        // taskTitle.classList.toggle('completed', task.completed);

    });

}


//MODALS


const detailsModal = document.querySelector('.detailsModal');
const modalOverlay = detailsModal.querySelector('.modalOverlay');
const detailsContent = detailsModal.querySelector('.modal-content');
const showDetailsForm = detailsContent.querySelector('form.showDetailsForm');
const closeDetailsModal = detailsContent.querySelector('#closeDetailsModal');
const deleteDetail = showDetailsForm.querySelector('#delete');

const groupRadioTitleDesc = showDetailsForm.querySelector('.groupRadioTitleDesc');

const completed = document.querySelector('.completeTask');
const important = document.querySelector('button.importantTask');
const allTasks = document.querySelector('.allTasks');

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
})


function filterTask() {
    tasks.replaceChildren();
    headerTitle.textContent = state.currentView;
    addButton.replaceChildren();

    const completedContainer = createElement('div', 'completedContainer', '', tasks);

    const projects = Project.allProjects;

    for (const [projectName, project] of Object.entries(projects)) {
        let completedTasks = null
        // ✅ filter ONLY this project's completed tasks
        if (state.currentView === 'completed') {
            completedTasks = project.showList.filter(task => task.completed);
        } else if (state.currentView === 'important') {
            completedTasks = project.showList.filter(task => task.priority === 'high' && !task.completed);
        } else if (state.currentView === 'allTasks') {
            completedTasks = project.showList.filter(task => !task.completed);
        }

        // ❗ skip empty projects
        if (completedTasks.length === 0) continue;

        // ✅ create section per project
        const section = createElement('div', 'projectSection', '', completedContainer);
        section.dataset.project = projectName; // for potential future use


        // ✅ render tasks INSIDE this section
        renderTasks(completedTasks, section, true);
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
}

// details
[modalOverlay, closeDetailsModal].forEach((el) => {
    el.addEventListener('click', () => {
        detailsModal.classList.remove('active')
    });
})


showDetailsForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const formDataDetail = new FormData(showDetailsForm);
    const inputData = {
        title: formDataDetail.get("title"),
        description: formDataDetail.get("descrip"),
        dueDate: formDataDetail.get("date"),
        priority: formDataDetail.get("priority")
    };
    if (!inputData.title) return;
    const projectName = findProjectNameByTaskId(state.currentDivId);
    projectName.editTask(state.currentDivId, inputData);

    if (state.currentView === 'project') {
        renderTasks()
    } else {
        filterTask()
    }

    detailsModal.classList.remove('active');


});

deleteDetail.addEventListener('click', (e) => {
    console.log(state.currentProjectName);
    e.preventDefault();
    state.currentProjectName.removeTask(state.currentDivId);




    detailsModal.classList.remove('active');
    // renderTasks();
    if (state.currentView === 'project') {
        renderTasks()
    } else {
        filterTask()
    }

    console.log(Project.allProjects);
});


function findProjectNameByTaskId(targetId) {
    for (const [projectName, project] of Object.entries(Project.allProjects)) {
        const found = project.showList.find(task => task.id === targetId);
        // console.log(found);
        if (found) {
            return Project.allProjects[projectName]
        }
    }
    return null;
}



// function importantTasks() {
//     console.log(Project.allProjects);
//     state.currentView = 'completed';

//     tasks.replaceChildren();
//     headerTitle.textContent = 'Important';
//     addButton.replaceChildren();

//     const completedContainer = createElement('div', 'completedContainer', '', tasks);

//     const projects = Project.allProjects;

//     for (const [projectName, project] of Object.entries(projects)) {

//         // ✅ filter ONLY this project's completed tasks
//         const completedTasks = project.showList.filter(task => task.priority === 'high');

//         // ❗ skip empty projects
//         if (completedTasks.length === 0) continue;

//         // ✅ create section per project
//         const section = createElement('div', 'projectSection', '', completedContainer);
//         section.dataset.project = projectName; // for potential future use


//         // ✅ render tasks INSIDE this section
//         renderTasks(completedTasks, section, true);
//         const projectHeader = createElement('div', 'projectHeader', projectName, section);
//         section.prepend(projectHeader);


//         const collapse = createElement('button', 'collapse', '▼', projectHeader);
//         collapse.addEventListener('click', (e) => {
//             collapse.textContent = collapse.textContent === '▼' ? '▶' : '▼';
//             e.stopPropagation();
//             section.classList.toggle('collapsed');

//         });

//     }
// }