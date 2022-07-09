export interface Dragable{
    dragStart(event: DragEvent): void,
    dragEnd(event: DragEvent): void
}

export interface Droppable{
    dragOver(event: DragEvent): void,
    dragLeave(event: DragEvent): void,
    dropHandler(event: DragEvent): void
    
}