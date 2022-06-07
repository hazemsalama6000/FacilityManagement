import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { catchError, EMPTY } from "rxjs";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { StatesService } from "src/app/modules/share/Services/state.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { LookupService } from "src/app/shared-module/Services/Lookup.service";
import { IBranch } from "../../../models/IBranch";
import { BranchService } from "../../../services/branch.service";
@Component({
	selector: 'branch_list_content',
	templateUrl: './branch_list_content.component.html',
	styleUrls: ['./branch_list_content.component.scss']
})

export class BranchListContentComponent {

    currentSelected:LookUpModel;
    companyId : number ;
    @Input() set _companyId (value:number){
		//subscribe here to invoke when insert done in upsert component
		this.companyId=value;
		this.service.selectFromStore().subscribe(data => {
			this.getallData(value);
		});
	};

	displayedColumns: string[] = ['name', 'address','salesLoginState' , 'state' , 'action'];

	dataSource:any;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private service: BranchService, private toaster: toasterService) {
	console.log('cocococ');

		this.currentSelected={Id:0,Name:'',company_Id:0};
	}

	toggleActiveDeactive(element:IBranch){
		this.service.toggleActiveDeactive(element).subscribe(
			(data: HttpReponseModel) => {
				this.toaster.openSuccessSnackBar(data.message);
				this.getallData(this.companyId);
			},
			(error:any) => {
				console.log(error);
			 });
	}


	toggleSalesPersonActiveDeactive(element:IBranch){
		this.service.toggleActiveDeactive(element).subscribe(
			(data: HttpReponseModel) => {
				this.toaster.openSuccessSnackBar(data.message);
				this.getallData(this.companyId);
			},
			(error:any) => {
				console.log(error);
			 });
	}

	
	/*
	Submit(model: IBranch) {

		model.company_Id = 1;
        model.isActive=true;
		if (model.Id == 0) {
			model.Id=0;
			this.service.PostLookupData(model).
				subscribe(
					(data: HttpReponseModel) => {

						if(data.isSuccess){
							this.toaster.openSuccessSnackBar(data.message);
							this.service.bSubject.next(true);	
						}
						else if(data.isExists){
							this.toaster.openWarningSnackBar(data.message);
						}
					},
					(error: any) => {
						this.toaster.openWarningSnackBar(error);
					}
				);

		}

		else {
			this.service.UpdateLookupData(model).subscribe(
				(data: any) => {
					this.toaster.openSuccessSnackBar(data.message);
					this.service.bSubject.next(true);
				},
				(error: any) => {
					this.toaster.openWarningSnackBar(error);
				});

		}

	}*/


// getting data and initialize data Source and Paginator
	getallData(companyId : number) {

		this.service.getBranchData(companyId).subscribe(
			(data: IBranch[]) => {
				this.dataSource = new MatTableDataSource<IBranch>(data);
				this.dataSource.paginator = this.paginator;	
			}
		);

	}


//filter from search Box
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

}