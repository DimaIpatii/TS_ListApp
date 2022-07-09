var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import BaseComponent from "./BaseComponent.js";
import { autobind } from "../utils/autobind.js";
import { ProgectAppState } from "../states/appState.js";
console.log("Running");
export default class AppForm extends BaseComponent {
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
