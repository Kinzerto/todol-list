import { createElement } from "../utils/createElement.js";
import { Project } from "../models/Project.js";
import { AddTask } from "../models/Tasks.js";
import { state } from "../state.js";

import { tasks, addButton, headerTitle } from '../index.js';








// For adding task(MODAL) elements


// for details
const detailsModal = document.querySelector('.detailsModal');
const modalOverlay = detailsModal.querySelector('.modalOverlay');
const detailsContent = detailsModal.querySelector('.modal-content');
const showDetailsForm = detailsContent.querySelector('form.showDetailsForm');
const closeDetailsModal = detailsContent.querySelector('#closeDetailsModal');
const deleteDetail = showDetailsForm.querySelector('#delete');

const groupRadioTitleDesc = showDetailsForm.querySelector('.groupRadioTitleDesc');


// export let state.currentProject = null;// Current project state(to know which project is currently active)
// state.currentView = 'project';
// creating project


// display tasks

let plus = 1;
// render tasks function with option to hide add button and show only completed tasks
export function renderTasks(taskList = state.currentProject.showList, parentContainer = tasks, hideAddBtn = false) {
    console.log(state.currentProject);

    console.log(hideAddBtn);
    plus++;
    console.log(plus);
    parentContainer.replaceChildren(); // clear container


    if (hideAddBtn === false) {
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

    console.log(taskList);

    taskList.forEach((task) => {
        const allTasks = createElement('div', 'allTasks', '', parentContainer);
        const taskContainer = createElement('div', 'taskContainer', '', allTasks);
        taskContainer.dataset.id = task.id;

        taskContainer.addEventListener('click', (e) => {
            detailsModal.classList.add('active');
            currentDivId = task.id;

            showDetailsForm.elements['title'].value = task.title;
            showDetailsForm.elements['descrip'].value = task.description || '';
            showDetailsForm.elements['date'].value = task.dueDate || '';
            showDetailsForm.elements['priority'].value = task.priority || '';
        });

        const radio = createElement('input', '', '', taskContainer);
        radio.type = 'radio';
        radio.checked = task.completed;
        // add priority class color to radio button based on task priority
        if (task.priority) radio.classList.add(task.priority);

        //radio button to toggle task completion
        radio.addEventListener('click', (e) => {
            e.stopPropagation();
            state.currentProject.toggleTaskCompletion(task.id);
            taskTitle.classList.add('completed');
            if (!hideAddBtn) {
                renderTasks()
            } else {
                completedTask()
            }
        });

        // task title
        const taskTitle = createElement('div', 'taskTitle', task.title, taskContainer);
        // toggle completed class based on task completion status
        taskTitle.classList.toggle('completed', task.completed);

        // if (hideAddBtn) return
        //container for edt and delete button
        if (hideAddBtn) return
        const buttonContainer = createElement('div', 'buttonContainer', '', taskContainer);

        // edit button
        const editBtn = createElement('button', 'editBtn', 'Edit', buttonContainer);
        // delete button
        const deleteBtn = createElement('button', 'deleteBtn', 'Delete', buttonContainer);

        // delete a task

        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addButton.classList.add('hideAddButton');
            addTaskModalContainer.classList.remove('show');
            addTaskModalContainer.classList.add('edit-modal');

            // Disable add button while editing
            if (state.editingTaskId) return; // Prevent multiple edit modals
            // Clone the modal and insert it above the task

            const modalClone = addTaskModalContainer.cloneNode(true);
            modalClone.classList.add('show', 'edit-modal');

            taskContainer.parentNode.insertBefore(modalClone, taskContainer);
            taskContainer.style.display = 'none'; // Hide the task while editing
            // Disable delete button while editing
            // Add a class to style the edit modal differently if needed

            state.editingTaskId = task.id;  // Set edit mode

            // Populate form with existing task data
            const form = modalClone.querySelector('.AddTaskForm');
            form.elements['title'].value = task.title;
            form.elements['descrip'].value = task.description || '';
            form.elements['date'].value = task.dueDate || '';
            form.elements['priority'].value = task.priority || '';

            // Update modal UI for editing
            form.querySelector('button[type="submit"]').textContent = 'Update';
            // Handle cancel
            const cancelBtn = modalClone.querySelector('#cancel');
            cancelBtn.addEventListener('click', (e) => {
                addButton.classList.remove('hideAddButton');
                e.preventDefault();
                modalClone.remove();
                state.editingTaskId = null;
                taskContainer.style.display = ''; // Show the task again after canceling
            });

            // Handle form submission for this modal
            form.addEventListener('submit', function (e) {
                addButton.classList.remove('hideAddButton');
                e.preventDefault();
                const formData = new FormData(form);
                const inputData = {
                    title: formData.get("title"),
                    description: formData.get("descrip"),
                    dueDate: formData.get("date"),
                    priority: formData.get("priority")
                };
                if (!inputData.title) return;

                state.currentProject.editTask(state.editingTaskId, inputData);
                modalClone.remove();
                if (!hideAddBtn) {
                    renderTasks()
                } else {
                    completedTask()
                }
                state.editingTaskId = null;
                taskContainer.style.display = ''; // Show the task again after editing
            });
        });
        
        // delete a task
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (state.editingTaskId) return; // Prevent deletion while editing
            state.currentProject.removeTask(task.id);
            if (!hideAddBtn) {
                renderTasks()
            } else {
                completedTask()

            }
        });
    });

}


//MODALS






// COMPLETED BUTTON
const completed = document.querySelector('.completeTask');

completed.addEventListener('click', completedTask);


function completedTask() {
    state.currentView = 'completed';

    tasks.replaceChildren();
    headerTitle.textContent = 'Completed';
    addButton.replaceChildren();

    const completedContainer = createElement('div', 'completedContainer', '', tasks);

    const projects = Project.allProjects;

    for (const [projectName, project] of Object.entries(projects)) {

        // ✅ filter ONLY this project's completed tasks
        const completedTasks = project.showList.filter(task => task.completed);

        // ❗ skip empty projects
        if (completedTasks.length === 0) continue;

        // ✅ create section per project
        const section = createElement('div', 'projectSection', '', completedContainer);
        section.dataset.project = projectName; // for potential future use


        // ✅ render tasks INSIDE this section
        renderTasks(completedTasks, section, true);
        const projectHeader = createElement('div', 'projectHeader', projectName, section);
        section.prepend(projectHeader);


        const collapse = createElement('button', 'collapse', '▼', projectHeader);
        collapse.addEventListener('click', (e) => {
            collapse.textContent = collapse.textContent === '▼' ? '▶' : '▼';
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

let currentDivId = null;
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
    state.currentProject.editTask(currentDivId, inputData);
    detailsModal.classList.remove('active');
    if (state.currentView === 'project') {
        renderTasks()
    } else {
        completedTask()
    }
    console.log(Project.allProjects);
});

deleteDetail.addEventListener('click', (e) => {
    e.preventDefault();
    state.currentProject.removeTask(currentDivId);
    detailsModal.classList.remove('active');
    if (state.currentView === 'project') {
        renderTasks()
    } else {
        completedTask()
    }
});


