import { tasks, addButton, headerTitle, showDetailsForm } from '../index.js';
import { Project } from '../models/Project.js';
import { state } from '../state.js';
import { renderFilteredTask } from '../viewer/renderFilteredTask.js';
import { compareAsc, isToday } from "date-fns";
import { createElement } from '../utils/tools.js';
import { deleteDetail, projectNames } from '../index.js';
import { format } from 'date-fns';
import { formatInput } from '../index.js';


export function filterTask() {
    // console.log(state.currentProject);
    addTaskModalContainer.classList.remove('show')
    addButton.classList.remove('hideAddButton');
    tasks.replaceChildren();
    headerTitle.textContent = state.currentView === 'allTasks' ? 'all tasks' : state.currentView;
    addButton.replaceChildren();

    const projects = Project.allProjects;
    let filtered = null
    let hasResults = false
    for (const [projectName, project] of Object.entries(projects)) {

        // ✅ filter ONLY this project's completed tasks
        if (state.currentView === 'completed') {
            filtered = project.showList.filter(task => task.completed);
        } else if (state.currentView === 'important') {
            filtered = project.showList.filter(task => task.priority === 'high' && !task.completed);
        } else if (state.currentView === 'home') {
            filtered = project.showList.filter(task => !task.completed);
        } else if (state.currentView === 'today') {
            filtered = project.showList.filter((task) => {
                return !task.completed && task.dueDate && isToday(new Date(task.dueDate));
            });
        } else if (state.currentView === 'upcoming') {
            filtered = project.showList
                .filter(task => !task.completed && task.dueDate && !isToday(new Date(task.dueDate)))
                .sort((a, b) => compareAsc(new Date(a.dueDate), new Date(b.dueDate)));
        }
        // ❗ skip empty projects
        if (filtered.length === 0) continue;
        hasResults = true;
        renderFilteredTask(projectName, filtered);
    }
    console.log(hasResults);
    if (!hasResults && state.currentView !== 'completed') {
        const emptyStateDiv = createElement('div', 'empty_state', '', tasks);
        const iconFace = createElement('span', 'material-symbols-outlined', 'sentiment_content', emptyStateDiv);
        const emptyText = createElement('p', 'empty_text', "You don't have any tasks here yet. Add a new task to get started and stay organized.", emptyStateDiv);
        const contain = createElement('button', 'contain', '', emptyStateDiv);
        const plus = createElement('span', 'material-symbols-outlined', 'add', contain);
        const addNew = createElement('span', 'addNew', 'Add Task', contain);
        tasks.appendChild(emptyStateDiv);

        contain.addEventListener('click', () => {
            detailsModal.classList.add('active');
            deleteDetail.textContent = 'Cancel'
            showDetailsForm.reset();
            detailsModal.classList.add('active');
            saveChange.textContent = 'Add Task'
            state.adding = true
            projectNames.replaceChildren();
            formatInput();
        });

    }

}
