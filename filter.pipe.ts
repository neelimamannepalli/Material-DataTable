import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';

@Pipe({
  name: 'ReportHistorySearchPipe'
})

@Injectable()
export class ReportHistorySearchPipe implements PipeTransform {
  constructor(private datepipe: DatePipe) { }
  transform(dataList: any[], filter: any): any[] {
    const filterKeys = Object.keys(filter);

    if (!dataList) {
      return [];
    }

    return dataList.filter(item =>
      filterKeys.reduce((memo, keyName) =>
        memo && this.formatValue(item, keyName).toLowerCase().indexOf(filter[keyName].toLowerCase()) >= 0, true));
  }

  formatValue(item, keyName) {
    if (keyName === 'submitDate' || keyName === 'flightDate' || keyName === 'eventDate') {
      return this.datepipe.transform(item[keyName], 'MM/dd/yyyy') || '';
    } else {
      return '' + item[keyName];
    }
  }
}
