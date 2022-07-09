var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import BaseComponent from './BaseComponent.js';
import { autobind } from '../utils/autobind.js';
import { ProgectAppState, ProjectStatus } from '../states/appState.js';
import ListItem from './ListItem.js';
export default class AppList extends BaseComponent {
    constructor(state) {
        super("project-list", "app", "beforeend", `${state}-projects`);
        this.state = state;
        this.assignedProjects = [];
        this.configApp();
        this.renderListContent();
    }
    renderListItems() {
        const listElem = this.templateInnerEmelent.querySelector("ul");
        listElem.innerHTML = "";
        for (const project of this.assignedProjects) {
            new ListItem(listElem.id, project);
        }
    }
    renderListContent() {
        const listCaption = this.templateInnerEmelent.querySelector("h2");
        const listContainer = this.templateInnerEmelent.querySelector("ul");
        listCaption.textContent = `${this.state.toUpperCase()} - PROJECT`;
        listContainer.id = `${this.state}-projects-list`;
    }
    configApp() {
        this.templateInnerEmelent.addEventListener("dragover", this.dragOver);
        this.templateInnerEmelent.addEventListener("dragleave", this.dragLeave);
        this.templateInnerEmelent.addEventListener("drop", this.dropHandler);
        ProgectAppState.addListener((propjects) => {
            const relativeProjects = propjects.filter(project => {
                if (this.state === "active") {
                    return project.status === ProjectStatus.Active;
                }
                else {
                    return project.status === ProjectStatus.Finished;
                }
            });
            this.assignedProjects = relativeProjects;
            this.renderListItems();
        });
    }
    renderContent() { }
    dragOver(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault();
            const listContainer = this.templateInnerEmelent.querySelector("ul");
            listContainer.classList.add('droppable');
        }
    }
    dragLeave(event) {
        const listContainer = this.templateInnerEmelent.querySelector("ul");
        listContainer === null || listContainer === void 0 ? void 0 : listContainer.classList.remove("droppable");
        //console.log("Drag leav", event);
    }
    dropHandler(event) {
        var _a;
        console.log("Drop", event);
        const projectToMoveId = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("text/plain");
        if (projectToMoveId) {
            ProgectAppState.moveListener(projectToMoveId, this.state === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
        }
    }
}
__decorate([
    autobind
], AppList.prototype, "dragOver", null);
__decorate([
    autobind
], AppList.prototype, "dragLeave", null);
__decorate([
    autobind
], AppList.prototype, "dropHandler", null);
