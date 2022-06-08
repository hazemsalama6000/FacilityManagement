import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { catchError, EMPTY } from "rxjs";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { IRegion } from "src/app/modules/share/models/IRegion.interface";
import { RegionService } from "src/app/modules/share/Services/region.service";
import { StatesService } from "src/app/modules/share/Services/state.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";

@Component({
	selector: 'region_list_content',
	templateUrl: './region_list_content.component.html',
	styleUrls: ['./region_list_content.component.scss']
})

export class RegionListContentComponent {

	currentStateId = 0;
	currentSelected: IRegion;
	NameForAdd: string;

	@Output() edit: EventEmitter<IRegion> = new EventEmitter();

	displayedColumns: string[] = ['name', 'state', 'action'];

	dataSource: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private service: RegionService, private toaster: toasterService, private StatesService: StatesService) {

		this.currentSelected = { id: 0, isActive: false, isEdit: false, isAdd: false, name: "", state_Id: 0 }

		//subscribe here to invoke when insert done in upsert component
		this.service.selectFromStore().subscribe(data => {
			this.getallData(this.currentStateId);
		});

		this.StatesService.getStateIdObservable().subscribe((data: LookUpModel) => {
			this.currentStateId = data.Id;
			console.log(this.currentStateId);
			this.getallData(this.currentStateId);
		});

	}

	rowClicked(model: IRegion) {
		this.currentSelected = model;
	}



	Submit(model: IRegion) {

		console.log(model);

		model.state_Id = this.currentStateId;

		if (model.id == 0) {
			model.id == 0;
			this.service.PostLookupData(model).
				subscribe(
					(data: HttpReponseModel) => {

						if (data.isSuccess) {
							this.toaster.openSuccessSnackBar(data.message);
							this.service.bSubject.next(true);
							this.service.addFlag.next(false);
						}
						else if (data.isExists) {
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
					//this.service.bSubject.next(true);
				},
				(error: any) => {
					this.toaster.openWarningSnackBar(error);
				});

		}

	}

	toggleActiveDeactive(element: IRegion) {
		this.service.toggleActiveDeactive(element).subscribe(
			(data: HttpReponseModel) => {
				this.toaster.openSuccessSnackBar(data.message);
				this.getallData(this.currentStateId);
			},
			(error: any) => {
				console.log(error);
			});
	}


	Remove(model: IRegion) {
		this.service.DeleteLookupData(model.id).subscribe(
			(data: HttpReponseModel) => {
				this.toaster.openSuccessSnackBar(data.message);
				this.getallData(this.currentStateId);
			},
			(error: any) => {
				this.toaster.openErrorSnackBar(error);
			});
	}

	addNewRow() {
		let Item: Array<IRegion> = this.dataSource.data.filter((a: IRegion) => a.id == 0);
		if (Item.length == 0) {
			let newRow: IRegion = { id: 0, name: "", isActive: true, isAdd: true, isEdit: false, state_Id:0 }
			this.dataSource.data = [newRow, ...this.dataSource.data];
			document.getElementById("NameForAdd")?.focus();
		}
	}

	deleteRow() {
		this.dataSource.data = this.dataSource.data.filter((a: IRegion) => a.id != 0);
	}

	// getting data and initialize data Source and Paginator
	getallData(stateId: number) {
		this.service.getLookupData(this.currentStateId).subscribe(
			(data: IRegion[]) => {
				this.dataSource = new MatTableDataSource<IRegion>(data);
				this.dataSource.paginator = this.paginator;
				this.service.addFlag.subscribe((data) => {
					if (data == true) {
						this.addNewRow();
					}
				});
			}

		);
	}

	//filter from search Box
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

}