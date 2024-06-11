import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})

export class ManageUsersComponent implements OnInit {
  tabs: string[] = ['Users', 'Owner', 'Specialist', 'AdminZeta'];
  activatedIndex: number = 0;
  ngOnInit(): void {
  }
  changeTab(tabIndex: number): void{
    this.activatedIndex = tabIndex;
  }
}
