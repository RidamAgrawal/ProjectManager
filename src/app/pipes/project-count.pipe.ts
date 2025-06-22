import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'projectCount',
  pure:false,
})
export class ProjectCountPipe implements PipeTransform {
  constructor(private translate:TranslateService){}
  transform(count: number): string {
    if (count === 0) {
      return this.translate.instant('projects.none');
    } else if (count === 1) {
      return this.translate.instant('projects.single');
    } else {
      return this.translate.instant('projects.multiple', { count });
    }
  }

}
