import { createElement, findProjectNameByTaskId, formatSmartDate } from "../utils/tools.js";
import { state } from "../state.js";
import { tasks, addButton, headerTitle } from "../index.js";
// import { showDetailsForm } from "../scripts/list.js";
import { Project } from "../models/Project.js";
import { saveChange, deleteDetail, showDetailsForm } from "../index.js";
import { filterTask } from "../controllers/filterTaskController.js";
import { addTaskModalContainer } from "../controllers/taskController.js";
import { format } from "date-fns";
import { countData } from "../controllers/count.js";
import { addTaskForm } from "../controllers/taskController.js";

const projectNames = document.getElementById('project');

//function for rendering app
export function renderTasks(taskList = state.currentProject.showList, parentContainer = tasks, hideAddBtn = false) {
    parentContainer.replaceChildren(); // clear container
    addTaskModalContainer.classList.remove('show')
    addButton.classList.remove('hideAddButton');
    addTaskForm.reset()
    if (!hideAddBtn) {
        addButton.replaceChildren();
        state.currentProjectName = state.currentProject.name;
        addButton.replaceChildren();
        headerTitle.textContent = state.currentProject.name;
        const addButtonContainer = createElement('div', 'addButtonContainer', '', addButton);
        //ADD TASK BUTTON
        createElement('span', 'material-symbols-outlined', 'add', addButtonContainer);
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

        const taskTitle = createElement('div', 'taskTitle', task.title, taskWrap);
        taskTitle.classList.toggle('completed', task.completed);

        taskWrap.addEventListener('click', (e) => {
            saveChange.textContent = 'Update'
            deleteDetail.textContent = 'Delete'
            state.adding = false
            console.log(taskWrap.dataset.id);
            projectNames.replaceChildren();
            state.currentProjectName = findProjectNameByTaskId(taskWrap.dataset.id);
            console.log(state.currentProjectName);
            for (let key in Project.allProjects) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = key;
                projectNames.appendChild(option);
            }
            detailsModal.classList.add('active');
            state.currentDivId = task.id;

            showDetailsForm.elements['project'].value = state.currentProjectName.name;
            showDetailsForm.elements['title'].value = task.title;
            showDetailsForm.elements['descrip'].value = task.description || '';
            showDetailsForm.elements['date'].value = task.dueDate || '';
            showDetailsForm.elements['priority'].value = task.priority || '';
        });
        const description = createElement('div', 'description', task.description, taskWrap);

        let due = '';

        if (task.dueDate) {
            // format date to smart date
            const due = formatSmartDate(task.dueDate)
            const weeks = new Date(task.dueDate);
            const dayName = format(weeks, 'EEEE');

            const date = createElement('div', 'date', due, taskWrap);
            if (due === 'Today') {
                date.style.color = 'green';
            } else if (due === 'Tomorrow') {
                date.style.color = 'orange';
                console.log(dayName);
            } else if (due === dayName) {
                date.style.color = 'blue';
            }
            else {
                date.style.color = 'color: rgba(0, 0, 0, 0.479)';
            }
            const dateIcon = document.createElement('span');
            dateIcon.classList.add('material-symbols-outlined');
            dateIcon.textContent = 'date_range';

            date.prepend(dateIcon); // replace parent with your container
        }

        const radio = createElement('input', '', '', taskWrap);
        radio.type = 'radio';
        radio.checked = task.completed;
        // add priority class color to radio button based on task priority
        if (task.priority) radio.classList.add(task.priority);

        //radio button to toggle task completion
        radio.addEventListener('click', (e) => {
            countData();
            e.stopPropagation();
            const state = findProjectNameByTaskId(task.id);
            console.log(state);
            state.toggleTaskCompletion(task.id)
            if (!hideAddBtn) {
                renderTasks()
            } else {
                filterTask()
            }
            countData();
        });
    });
    countData();
}