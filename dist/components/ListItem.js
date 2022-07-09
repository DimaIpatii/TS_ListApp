var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import BaseComponent from "./BaseComponent.js";
import { autobind } from "../utils/autobind.js";
export default class ListItem extends BaseComponent {
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
