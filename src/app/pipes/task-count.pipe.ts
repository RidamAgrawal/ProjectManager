import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskCount',
  pure:false,
})
export class TaskCountPipe implements PipeTransform {

  transform(count:number): string {
    return (count) ? (count === 1) ? "1 Task" : `${count} Tasks` : "No Tasks";;
  }

}
