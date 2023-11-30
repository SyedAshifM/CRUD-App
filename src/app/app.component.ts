import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { EmployeeService } from './services/employee.service';
import { OnInit, ViewChild} from '@angular/core';
import {MatPaginator } from '@angular/material/paginator';
import {MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CoreService } from './core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  displayedColumns: string[] = [
    'id', 
    'firstName', 
    'lastName', 
    'email',
    'dob', 
    'gender', 
    'education',
    'company', 
    'experience',
    'package',
    'action',
  ];
  dataSource !: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
input: any;

  constructor(
    private _dialog:MatDialog,
    private _empService:EmployeeService,
    private _CoreService:CoreService,
  ){}
  
  ngOnInit(): void {
    this.getEmployeeList();
  }
  
  openAddEditEmpForm(){
    const dialogRef = this._dialog.open(EmpAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) =>{
        if(val){
          this.getEmployeeList();
        }
      },
    });
  }

  getEmployeeList(){
    this._empService.getEmployeeList().subscribe({
      next:(res) =>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      },
      error: console.log,
    });
  }


  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  applyFilter(column: string, event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    
    // Use the correct input field based on the column
    if (column === 'firstName') {
      this.dataSource.filterPredicate = (data, filter) => {
        return data.firstName.toLowerCase().includes(filter);
      };
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else if (column === 'lastName') {
      this.dataSource.filterPredicate = (data, filter) => {
        return data.lastName.toLowerCase().includes(filter);
      };
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }


  deleteEmployee(id:number){
    this._empService.deleteEmployee(id).subscribe({
      next:(res) =>{
         this._CoreService.openSnackBar('Employee deleted!', 'done')
         this.getEmployeeList();
      },
      error:console.log
    })
  }

  openEditForm(data:any){
    const dialogRef = this._dialog.open(EmpAddEditComponent,{
      data: data
    });

    dialogRef.afterClosed().subscribe({
      next: (val) =>{
        if(val){
          this.getEmployeeList();
        }
      },
    });
    
  }
}