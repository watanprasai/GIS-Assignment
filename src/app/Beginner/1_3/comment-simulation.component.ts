import { Component } from "@angular/core";

@Component({
    selector: 'comment-simulation',
    templateUrl: './comment-simulation.component.html',
    styleUrls: ['./comment-simulation.component.scss']
})
export class CommentSimulationComponent {
    name: string = ''
    comment: string = ''
    comments: {name:string , comment:string ,timestamp:string}[] = []
    editState: boolean = false
    editIndex: number = 0
    submit() {
        this.comments.push({ name: this.name, comment: this.comment ,timestamp: this.dateFormat()});
        this.name = '';
        this.comment = '';
    }

    update() {
        this.comments[this.editIndex] =({ name: this.name, comment: this.comment ,timestamp: this.dateFormat()});
        this.editState = false;
    }

    edit(index:number) {
        this.name = this.comments[index].name
        this.comment = this.comments[index].comment
        this.editIndex = index
        this.editState = true
    }

    delete(index:number) {
        this.comments.splice(index,1)
    }

    dateFormat() {
        const currentDate = new Date();
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };
        const formattedDate = currentDate.toLocaleString('en-US', options);
        return formattedDate
    }
}