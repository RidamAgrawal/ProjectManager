import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';


export function minDateValidator(minNgbDate: NgbDate): ValidatorFn {
  return (control: AbstractControl<NgbDate>): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate if no date is entered
    }
    const selectedDate = new NgbDate(control.value.year,control.value.month,control.value.day);
    
    if (selectedDate.year < minNgbDate.year && selectedDate.month < minNgbDate.month && selectedDate.day < minNgbDate.day) {
      return { minNgbDate: { actual: selectedDate, required: minNgbDate } };
    }
    return null;
  };
}

@Directive({
  selector: '[appMinDate]',
  providers:[{provide: NG_VALIDATORS, useExisting: MinDateDirective, multi: true}],
})
export class MinDateDirective implements Validator{
  @Input({required:true,alias:'appMinDate'}) inputDate!:NgbDate;
  constructor() { }
  validate(control: AbstractControl): ValidationErrors | null {
      return this.inputDate
      ? minDateValidator
      :null;
  }
}
