import { createElement } from '../utils/tools.js';
import { renderTasks } from './renderTasks.js';
import { tasks } from '../index.js';
export function renderFilteredTask(projectName, filtered) {

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

    collapse.addEventListener('click', (e) => {
        collapse.textContent = collapse.textContent === 'keyboard_arrow_down' ? 'keyboard_arrow_right' : 'keyboard_arrow_down';
        e.stopPropagation();
        section.classList.toggle('collapsed');

    });
}