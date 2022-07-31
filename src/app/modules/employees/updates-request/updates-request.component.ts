import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { DialogPosition, MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { Subscription } from "rxjs";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { UserLocationComponent } from "../user-locations/user-location.component";
import { ICustomerEditResponse } from "../../operations/models/cutomer-editmanage/ICustomerEditResponse.interface";
import { customerUpdateManageService } from "../../operations/services/customer-update-manage.service";
import { ICustomerEditManageSearch } from "../../operations/models/cutomer-editmanage/ICustomerEditManageSearch.interface";
import { ViewimagesForCustomerComponent } from "../../operations/components/customer-update-manage/update-datatable/viewimages/viewimages.component";
@Component({
	selector: 'update-request',
	templateUrl: './updates-request.component.html',
	styleUrls: ['./updates-request.component.scss']
})

export class UpdateRequestComponent {

	@Output() edit: EventEmitter<LookUpModel> = new EventEmitter();
	NameForAdd: string;
	currentSelected: LookUpModel;

	displayedColumns: string[] = ['customerCode','customerName',
	'RequestDate',
	'UpdatedTypeName',
	'UpdatedTypeSysName'];

	dataSource: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	userdata: IUserData;
	private unsubscribe: Subscription[] = [];

	constructor(
		private service: customerUpdateManageService,
		public dialog: MatDialog,
		private route: ActivatedRoute
	) {

		this.route.paramMap.subscribe((data: ParamMap) => {
			this.getallData(+data.get('employeeId')!);
		});

	}

	openDialogDisplayImages(imagePath: string) {
		console.log(imagePath);
				// const dialogPosition: DialogPosition = {
				// 	top: '0px',
				// 	right: '0px'
				// };
		
				const dialogRef = this.dialog.open(ViewimagesForCustomerComponent,
					{
						/*maxWidth: '50vw',
						maxHeight: '100vh',*/
						maxHeight: '100vh',
						minHeight: '50%',
						width: '50%',
		
						//panelClass: 'full-screen-modal',*/
						// position: dialogPosition,
						data: { imagePath: imagePath }
					});
			}
	// getting data and initialize data Source and Paginator
	getallData(employeeId: number) {

        let modelSearch : ICustomerEditManageSearch = {CustomerId:0,AreaId:0,BlockId:0,BranchId:0,CustomerCode:'',Employee_id:employeeId,EndDate:'',StartDate:'',UpdatingTypeId:0};
		
		this.service.searchCustomerUpdate(modelSearch).subscribe(
			(data: ICustomerEditResponse[]) => {
				console.log(data);
				this.dataSource = new MatTableDataSource<ICustomerEditResponse>(data);
				this.dataSource.paginator = this.paginator;
			}
		);

	}

	currentLocation(x:number,y:number){

		const dialogPosition: DialogPosition = {
			top:'0px',
			right:'0px'
		  };

		const dialogRef = this.dialog.open(UserLocationComponent,
			{
				/*maxWidth: '50vw',
				maxHeight: '100vh',*/
				maxHeight: '100vh',
				height: '100%',

				//panelClass: 'full-screen-modal',*/
				position:dialogPosition,
				data: { x: x,y:y}
			});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});	}


	//filter from search Box
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}

}