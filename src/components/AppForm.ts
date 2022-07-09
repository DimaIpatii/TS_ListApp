import BaseComponent from "./BaseComponent.js";
import { autobind } from "../utils/autobind.js";
import { ProgectAppState } from "../states/appState.js";
console.log("Running")
export default class AppForm extends BaseComponent<HTMLDivElement, HTMLFormElement>{
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;
    
    constructor(){
        super("project-input", "app", "afterbegin", "user-input");
        this.titleInput =  this.templateInnerEmelent.querySelector("#title") as HTMLInputElement;
        this.descriptionInput =  this.templateInnerEmelent.querySelector("#description") as HTMLInputElement;
        this.peopleInput =  this.templateInnerEmelent.querySelector("#people") as HTMLInputElement;

        this.configApp();
    }

    configApp(){
        this.templateInnerEmelent.addEventListener("submit", this.onSubmit);
    }

    renderContent(){}


    private checkFields (): [string, string, number] | void{
        const title = this.titleInput.value;
        const description = this.descriptionInput.value;
        const peopleNumber = Number(this.peopleInput.value);
        const titleMessage = document.querySelector("#title-message") as HTMLParagraphElement;
        const descriptionMessage = document.querySelector("#description-message") as HTMLParagraphElement;
        const peopleNumberMessage = document.querySelector("#people-message") as HTMLParagraphElement;

        
        if(title.trim().length === 0){
            titleMessage.style.color = "red";
            titleMessage.textContent = "A title must be provided!";
        }else{
            titleMessage.textContent = "";
        }

        if(description.trim().length === 0){
            descriptionMessage.style.color = "red";
            descriptionMessage.textContent = "A Description must be provided!";
        }else{
            descriptionMessage.textContent = "";
        }

        if((isNaN(peopleNumber) || peopleNumber === 0)){
            peopleNumberMessage
            peopleNumberMessage.style.color = "red";

            if(isNaN(peopleNumber)){
                peopleNumberMessage.textContent = "A number must be provided!";
            }else if(peopleNumber === 0){
                peopleNumberMessage.textContent = "A number must be bigger than 0!";
            }
        }else{
            peopleNumberMessage.textContent = "";
        }

        if(title.trim().length === 0 || description.trim().length === 0 || (isNaN(peopleNumber) || peopleNumber === 0)){
            
            return
        }else{
            return [title, description, peopleNumber]
        }
    };

    private clearFileds () {
        this.titleInput.value = "";
        this.descriptionInput.value = "";
        this.peopleInput.value = "";
    }

    @autobind
    private onSubmit(event: Event){
        event.preventDefault();
        const allFieldsValid = this.checkFields();

        if(Array.isArray(allFieldsValid)){
            console.log("Submit the values: ", allFieldsValid);
            const [title, description, people] = allFieldsValid;
            ProgectAppState.addNewProject(title, description, people);

            this.clearFileds()
        }
    }
}