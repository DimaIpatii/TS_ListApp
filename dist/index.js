"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const autobind = (_target, _methodName, descriptor) => {
    const tragetMethod = descriptor.value;
    const adjustedDescriptor = {
        configurable: true,
        get() {
            return tragetMethod.bind(this);
        }
    };
    return adjustedDescriptor;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
;
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class AppState {
    constructor() {
        this.projects = [];
        this.listeners = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            this.instance = new AppState();
            return this.instance;
        }
    }
    addNewProject(title, description, people) {
        const newProject = new Project(String(new Date().getTime()), title, description, people, ProjectStatus.Active);
        this.projects.push(newProject);
        this.updateState();
    }
    addListener(inputFunction) {
        this.listeners.push(inputFunction);
    }
    moveListener(projectId, newStatus) {
        const projectToMove = this.projects.find(project => project.id === projectId);
        if (projectToMove && projectToMove.status !== newStatus) {
            projectToMove.status = newStatus;
            this.updateState();
        }
    }
    updateState() {
        for (const listenerFunction of this.listeners) {
            listenerFunction(this.projects.slice());
        }
    }
}
const ProgectAppState = AppState.getInstance();
class BaseComponent {
    constructor(templateElementId, rootElementId, insertPosition, templateElementInnerId) {
        this.rootElement = document.getElementById(rootElementId);
        this.templateEmelent = document.getElementById(templateElementId);
        const templateContentNode = document.importNode(this.templateEmelent.content, true);
        this.templateInnerEmelent = templateContentNode.firstElementChild;
        if (templateElementInnerId) {
            this.templateInnerEmelent.id = templateElementInnerId;
        }
        this.rederComponent(insertPosition);
    }
    rederComponent(insertPosition) {
        this.rootElement.insertAdjacentElement(insertPosition, this.templateInnerEmelent);
    }
}
class AppForm extends BaseComponent {
    constructor() {
        super("project-input", "app", "afterbegin", "user-input");
        this.titleInput = this.templateInnerEmelent.querySelector("#title");
        this.descriptionInput = this.templateInnerEmelent.querySelector("#description");
        this.peopleInput = this.templateInnerEmelent.querySelector("#people");
        this.configApp();
    }
    configApp() {
        this.templateInnerEmelent.addEventListener("submit", this.onSubmit);
    }
    renderContent() { }
    checkFields() {
        const title = this.titleInput.value;
        const description = this.descriptionInput.value;
        const peopleNumber = Number(this.peopleInput.value);
        const titleMessage = document.querySelector("#title-message");
        const descriptionMessage = document.querySelector("#description-message");
        const peopleNumberMessage = document.querySelector("#people-message");
        if (title.trim().length === 0) {
            titleMessage.style.color = "red";
            titleMessage.textContent = "A title must be provided!";
        }
        else {
            titleMessage.textContent = "";
        }
        if (description.trim().length === 0) {
            descriptionMessage.style.color = "red";
            descriptionMessage.textContent = "A Description must be provided!";
        }
        else {
            descriptionMessage.textContent = "";
        }
        if ((isNaN(peopleNumber) || peopleNumber === 0)) {
            peopleNumberMessage;
            peopleNumberMessage.style.color = "red";
            if (isNaN(peopleNumber)) {
                peopleNumberMessage.textContent = "A number must be provided!";
            }
            else if (peopleNumber === 0) {
                peopleNumberMessage.textContent = "A number must be bigger than 0!";
            }
        }
        else {
            peopleNumberMessage.textContent = "";
        }
        if (title.trim().length === 0 || description.trim().length === 0 || (isNaN(peopleNumber) || peopleNumber === 0)) {
            return;
        }
        else {
            return [title, description, peopleNumber];
        }
    }
    ;
    clearFileds() {
        this.titleInput.value = "";
        this.descriptionInput.value = "";
        this.peopleInput.value = "";
    }
    onSubmit(event) {
        event.preventDefault();
        const allFieldsValid = this.checkFields();
        if (Array.isArray(allFieldsValid)) {
            console.log("Submit the values: ", allFieldsValid);
            const [title, description, people] = allFieldsValid;
            ProgectAppState.addNewProject(title, description, people);
            this.clearFileds();
        }
    }
}
__decorate([
    autobind
], AppForm.prototype, "onSubmit", null);
class ListItem extends BaseComponent {
    constructor(rootId, project) {
        super("single-project", rootId, "afterbegin", project.id);
        this.project = project;
        this.configApp();
        this.renderContent();
    }
    get persones() {
        if (this.project.people === 1) {
            return "1 person";
        }
        else {
            return `${this.project.people} persones`;
        }
    }
    ;
    configApp() {
        this.templateInnerEmelent.addEventListener("dragstart", this.dragStart);
        this.templateInnerEmelent.addEventListener("dragend", this.dragEnd);
    }
    renderContent() {
        this.templateInnerEmelent.querySelector("h2").textContent = this.project.title;
        this.templateInnerEmelent.querySelector("h3").textContent = this.persones + " assigned";
        this.templateInnerEmelent.querySelector("p").textContent = this.project.description;
    }
    dragStart(event) {
        event.dataTransfer.setData("text/plain", this.project.id);
        event.dataTransfer.effectAllowed = "move";
        console.log("Start drag", event);
    }
    dragEnd(event) {
        console.log("Drag end", event);
    }
}
__decorate([
    autobind
], ListItem.prototype, "dragStart", null);
__decorate([
    autobind
], ListItem.prototype, "dragEnd", null);
class AppList extends BaseComponent {
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
const appForm = new AppForm();
const appActiveList = new AppList("active");
const appFinishedList = new AppList("finished");
