import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CommonHttpService } from "src/app/core-module/httpServices/CommonHttpService.service";
import { HttpPaths } from "src/app/modules/auth/Enums/HttpPaths.enum";
import { LookUpModel } from "src/app/shared-module/models/lookup";
import { ICompany } from "../models/ICompany";
import { ICompanyDisplayData } from "../models/ICompanyDisplayData";

@Injectable({
	providedIn: 'root'
})

export class CompanyService {
	bSubject = new BehaviorSubject(true);

	constructor(private http: CommonHttpService) { }

	getCompanyData(): Observable<ICompanyDisplayData[]> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_COMPANY_GETALL}`)
			.pipe(map(Items => Items.map((Item: ICompanyDisplayData) => ({
				id: Item.id,
				companyName: Item.companyName,
				address: Item.address,
				code: Item.code,
				activity: Item.activity,
				phoneNumber: Item.phoneNumber,
				logoWeb: Item.logoWeb,
				logoPrint: Item.logoPrint,
				hasDirectTransferForStocks: Item.hasDirectTransferForStocks,
				email: Item.email,
				isActive: Item.isActive,
				mobileUserNumber: Item.mobileUserNumber,
				region: Item.region,
				managerName: Item.managerName,
				managerPosition: Item.managerPosition,


			}) as ICompanyDisplayData)));
	}

	getCompanyDataById(id:number): Observable<ICompany> {
		return this.http.CommonGetRequests(`${localStorage.getItem("companyLink")}${HttpPaths.API_COMPANY_GETBYID}${id}`);
	}

	DeleteCompanyData(id: number): Observable<any> {
		return this.http.CommonDeleteRequest(`${localStorage.getItem("companyLink")}${HttpPaths.API_COMPANY_DELETE}${id}`);
	}

	PostCompanyData(model: any): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_COMPANY_ADD}`);
	}

	UpdateCompanyData(model: ICompany): Observable<any> {
		return this.http.CommonPutRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_COMPANY_UPDATE}${model.id}`);
	}

	changeLogoWebData(model:any): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_COMPANY_CHANGELOGOWEB}`);
	}

	changeLogoPrint(model: any): Observable<any> {
		return this.http.CommonPostRequests(model, `${localStorage.getItem("companyLink")}${HttpPaths.API_COMPANY_CHANGELOGOPRINT}`);
	}


}