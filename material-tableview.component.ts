import { Component, OnInit, Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ReportHistory } from '../reportHistory';
import { ReportHistoryFilter } from '../reportHistory';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as _ from 'lodash';
import { ReportHistorySearchPipe } from './filter.pipe';
import { ReportHistoryService } from '../reporthistory.service';



@Component({
  selector: 'app-report-history-tableview',
  templateUrl: './report-history-tableview.component.html',
  styleUrls: ['./report-history-tableview.component.less'],
  providers: [ReportHistorySearchPipe]
})
export class ReportHistoryTableviewComponent implements OnInit, AfterViewInit {
  @Input() reportHistoryData: any[] = [];
  @Input() allReportHistoryData: any[] = [];
  @Input() isReportManagementAccess = false;
  displayedColumns;
  isAllReportView = false;
  dataSource = new MatTableDataSource<any>();
  tableData: any[] = [];
  filter: ReportHistoryFilter = new ReportHistoryFilter;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  origin = document.location.origin;
  resultsLength = 0;
  constructor(private searchFilterPipe: ReportHistorySearchPipe,
    private reportHistoryService: ReportHistoryService,
    private router: Router) { }

  ngOnInit() {
    this.isAllReportView = this.reportHistoryService.getSelectedReportView();
    if (this.isAllReportView) {
      this.allReportDetails();
    } else {
      this.myReportDetails();
    }
    this.applySelectedFilter();
  }

  applySelectedFilter() {
    if (this.reportHistoryService.state.selectedFilter) {
      this.filter = this.reportHistoryService.state.selectedFilter;
      this.applyFilter();
    }
  }
  myReportDetails() {
    this.displayedColumns = ['reportId', 'title', 'submitDate', 'flightNumber',
      'flightDate', 'departureStation', 'arrivalStation', 'status'];
    this.tableData = this.reportHistoryData;
    this.getTableproperties();
  }
  allReportDetails() {
    this.displayedColumns = ['reportId', 'title', 'employeeId', 'empName', 'submitDate', 'eventDate', 'flightNumber',
      'flightDate', 'base', 'departureStation', 'arrivalStation', 'event', 'status', 'DaysOpen'];
    this.tableData = this.allReportHistoryData;
    this.getTableproperties();
  }
  getTableproperties() {
    this.dataSource = new MatTableDataSource<any>();
    this.dataSource = new MatTableDataSource(this.tableData);
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0
    });
    this.resultsLength = this.tableData.length;
    this.applySelectedFilter();
    this.clearSort();
  }
  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }
  ngAfterViewInit() {
    this.initializeTableProperties();
  }
  initializeTableProperties() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter() {
    this.dataSource.data = this.searchFilterPipe.transform(this.tableData, this.filter);
  }

  clearAllFilter() {
    this.filter = new ReportHistoryFilter;
    this.dataSource.data = this.tableData;
  }

  showMyReports() {
    this.isAllReportView = false;
    this.myReportDetails();
    this.clearAllFilter();
    this.initializeTableProperties();
    this.reportHistoryService.setSelectedReportView(this.isAllReportView);
  }
  showAllReports() {
    this.isAllReportView = true;
    this.allReportDetails();
    this.clearAllFilter();
    this.initializeTableProperties();
    this.reportHistoryService.setSelectedReportView(this.isAllReportView);
  }

  gotoReportSummary(reportHistory) {
    this.reportHistoryService.setSelectedFilter(this.filter);
    if (reportHistory != null) {
      const reportIdString = reportHistory.reportId;
      this.router.navigate([`reporthistory/${reportIdString}/summary`]);
    }
  }
}

