import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { IRegion } from "src/app/modules/share/models/IRegion.interface";
import { RegionService } from "src/app/modules/share/Services/region.service";
import { StatesService } from "src/app/modules/share/Services/state.service";
import { LookUpModel } from "src/app/shared-module/models/lookup";


interface ClientError {
	code: string;
	description: string;
}

@Component({
	selector: 'section-upsert',
	templateUrl: './section-upsert.component.html',
	styleUrls: ['./section-upsert.component.scss']
})

export class SectionUpsertComponent {
	
	currentStateId:number;

	messageErrors: string;

	toggleAddEditButton: boolean;

	UpsertForm: FormGroup;

//setter for binded model to update
	@Input() set Editmodel(value: any) {
		if (value) {
			this.UpsertForm.setValue(value);
			this.toggleAddEditButton = false;
		}
	}

	constructor(private fb: FormBuilder, private toaster: toasterService, private service: RegionService ,private StatesService:StatesService) { }


	ngOnInit(): void {
		this.messageErrors = "";
		this.toggleAddEditButton = true;
		this.initForm();

		this.StatesService.getStateIdObservable().subscribe((data:LookUpModel) => {
			this.currentStateId=data.Id;
		});
		
	}

// initialize Form With Validations
	initForm() {
		this.UpsertForm = this.fb.group({
			id: [0],
			state_Id:[0],
			name: ['', Validators.compose([
				Validators.required
			])]
		});
	}


	closeEdit() {
		this.toggleAddEditButton = true;
		this.UpsertForm.setValue({ id: 0, name: '' ,state_Id:0});
	}


// for Insert And Delete distingush them with model.id

	Submit(model: IRegion) {
model.state_Id=this.currentStateId;
		if (model.id == 0) {

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
						this.messageErrors="";
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

	}


}