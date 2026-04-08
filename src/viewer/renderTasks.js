import { createElement, findProjectNameByTaskId } from "../utils/tools.js";
import { state } from "../state.js";
import { tasks, addButton, headerTitle } from "../index.js";
import { showDetailsForm } from "../scripts/list.js";
import { Project } from "../models/Project.js";

const projectNames = document.getElementById('project');


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
            projectNames.replaceChildren();
            state.currentProjectName = findProjectNameByTaskId(taskWrap.dataset.id);
            for (let key in Project.allProjects) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = key;
                projectNames.appendChild(option);
            }
            detailsModal.classList.add('active');
            state.currentDivId = task.id;

            console.log(state.currentProjectName);

            showDetailsForm.elements['project'].value = state.currentProjectName.name;
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

    });

}