import { tasks, addButton, headerTitle } from '../index.js';
import { Project } from '../models/Project.js';
import { state } from '../state.js';
import { renderFilteredTask } from '../viewer/renderFilteredTask.js';
import { compareAsc, isToday } from "date-fns";
import folder from '../assets/images/folder.png';

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
        if (filtered.length === 0)continue;
        hasResults = true;
        renderFilteredTask(projectName, filtered);
    }
    console.log(hasResults);
    if (!hasResults) {
        const img = document.createElement('img');
        img.src = folder;
        tasks.appendChild(img);
    }

}
