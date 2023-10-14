import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DefUserI, UserI } from 'src/app/interfaces/user/user.interface';
import { BackService } from 'src/app/services/back.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css']
})
export class UserStatsComponent implements OnInit {
  @Input() userId: number;
  userInfos: any = null;
  constructor(
    private backService: BackService,
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  userInfosSource: MatTableDataSource<any>;

  ngOnInit() {
    if (!this.userId){
      this.userInfos = null;
      return;
    }
    this.backService.req("GET", "/game/user-stats/" + this.userId)
    .then((res) => {
      if (!res.length) this.userInfos = null;
      else {
        this.userInfos = res;
        this.userInfosSource = new MatTableDataSource<any>(res);
        this.userInfosSource.paginator = this.paginator;
      }

    })
    .catch((err) => {
      this.userInfos = null;
    });
  }

  ngOnChanges() {
    if (this.userInfos?.id == this.userId) return;
    this.ngOnInit();
  }
}
