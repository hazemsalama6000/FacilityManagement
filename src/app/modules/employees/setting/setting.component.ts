import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { IEmployee } from '../models/employee.interface';
import { EmployeeService } from '../services/employee.service';
import { TechnitianService } from '../services/technitian.service';
import { AddTechnitianLogComponent } from './Add-technitian-Log/add-technitian-Log.component';

@Component({
	selector: 'app-setting',
	templateUrl: './setting.component.html',
	providers: [TechnitianService]
})
export class SettingComponent implements OnInit {
	@HostBinding('class') class =
		'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
	@HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

	employeeProfile: IEmployee = {} as IEmployee;

	@Input() set _Employee(value: IEmployee) {
		this.employeeProfile = value;
		console.log(this.employeeProfile.imagePath);
	}

	constructor(private service: EmployeeService, private dialog: MatDialog, private technicianService: TechnitianService, private toaster: toasterService) { }

	ngOnInit(): void {
	}

	toggleActive() {
		this.service.toggleActive(this.employeeProfile.id).subscribe(
			(data: HttpReponseModel) => {
				this.toaster.openSuccessSnackBar(data.message);
				this.employeeProfile.isActive = !this.employeeProfile.isActive;
			},
			(error) => {
				this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
			}
		)
	}


	toggleIsTechnician() {

		if (this.employeeProfile.is_Technical == true) {

			this.technicianService.toggleIsTechnician(this.employeeProfile.id).subscribe(
				(data: HttpReponseModel) => {
					this.toaster.openSuccessSnackBar(data.message);
					this.employeeProfile.is_Technical = false;
				}, (error) => {
					this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
					this.employeeProfile.is_Technical = false;
				}
			)

		}

		else {
			this.openDialog();
		}

	}


	openDialog() {
		const dialogPosition: DialogPosition = {
			top: '0px',
			right: '0px'
		};

		const dialogRef = this.dialog.open(AddTechnitianLogComponent,
			{
				/*maxWidth: '50vw',
				maxHeight: '100vh',*/
				maxHeight: '100vh',
				height: '100%',

				//panelClass: 'full-screen-modal',*/
				position: dialogPosition,
				data: { employeeId: this.employeeProfile.id }
			});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});

	}

}
