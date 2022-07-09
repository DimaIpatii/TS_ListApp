import { ProjectStatus } from "../states/appState.js";

export class Project {
    constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
    ){

    }
}