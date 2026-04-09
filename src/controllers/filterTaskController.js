import { tasks, addButton, headerTitle } from '../index.js';
import { Project } from '../models/Project.js';
import { state } from '../state.js';
import { createElement, findProjectNameByTaskId } from '../utils/tools.js';
import { renderTasks } from '../viewer/renderTasks.js';
import { isToday } from "date-fns";


export function filterTask() {
    // console.log(state.currentProject);
    tasks.replaceChildren();
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
        } else if (state.currentView === 'today') {
            filtered = project.showList.filter((task) => {
                // console.log(task.due);
                return !task.completed && task.dueDate && isToday(new Date(task.dueDate));
            });
        } else if (state.currentView === 'upcoming') {
            filtered = project.showList.filter((task) => {
                // console.log(task.due);
                return !task.completed && task.dueDate && !isToday(new Date(task.dueDate));
            });
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
        // section.classList.add('collapsed');
        collapse.addEventListener('click', (e) => {
            collapse.textContent = collapse.textContent === 'keyboard_arrow_down' ? 'keyboard_arrow_right' : 'keyboard_arrow_down';
            e.stopPropagation();
            section.classList.toggle('collapsed');

        });
    }
}
