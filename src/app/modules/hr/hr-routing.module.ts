import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LookupIdNameComponent } from 'src/app/shared-module/Components/lookupId_name/lookupId_name.component';
import { CompanyComponent } from './components/companyProfile/company.component';

const routes: Routes = [
	{path:'jobs' , component:LookupIdNameComponent},
	{path:'company',component:CompanyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
