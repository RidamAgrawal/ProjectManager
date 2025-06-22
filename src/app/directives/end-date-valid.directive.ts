import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export function endDateValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startDate=group.get('startDate')?.value;
    const endDate=group.get('endDate')?.value;
    
    if(!startDate||!endDate){
        return null;
    }
    if (endDate.year <= startDate.year && endDate.month <= startDate.month && endDate.day < startDate.day) {
      return { endBeforeStart: true  };
    }
    return null;
  };
}

@Directive({
  selector: '[appEndDateValid]'
})
export class EndDateValidDirective {

  constructor() { }

}
