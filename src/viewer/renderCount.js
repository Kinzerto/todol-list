import { countFilter } from "../controllers/countControllers.js";
// import { Project } from "../models/Project.js";

export const count = document.querySelectorAll('.primaryButton button .count');

export function renderCount() {
    count.forEach((cn) => {
        switch (cn.classList[0]) {
            case 'homeCount':
                cn.textContent = countFilter('homeCount')
                break;

            case 'todayCount':
                cn.textContent = countFilter('todayCount')
                cn.style.color = 'red';
                break;

            case 'upcomingCount':
                cn.textContent = countFilter('upcomingCount')
                break;

            case 'importantCount':
                cn.textContent = countFilter('importantCount')
                break;

            case 'completedCount':
                cn.textContent = countFilter('completedCount')
                break;

            default:
                break;
        }
    });
}