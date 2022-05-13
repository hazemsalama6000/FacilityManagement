import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
// #fake-start#
import { FakeAPIService } from './_fake/fake-api.service';
import { AuthInterceptor } from './modules/auth/Interceptors/AuthInterceptor.interceptor';
import { LoggingInterceptor } from './modules/auth/Interceptors/LoggingInterceptor.interceptor';
import { CachingInterceptor } from './modules/auth/Interceptors/CachingInterceptor.interceptor';
import { ErrorInterceptor } from './modules/auth/Interceptors/ErrorInterceptor.interceptor';
import { SharedModule } from './shared-module/shared-module.module';
// #fake-end#

function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      //@ts-ignore
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
	SharedModule,
    // #fake-start#
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
          passThruUnknownUrl: true,
          dataEncapsulation: false,
        })
      : [],
    // #fake-end#
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
	{
		provide:HTTP_INTERCEPTORS,
		useClass:AuthInterceptor,
		multi:true
	  }
	  ,
	   {
		 provide:HTTP_INTERCEPTORS,
		 useClass:LoggingInterceptor,
		 multi:true
	   },
	  {
	  provide:HTTP_INTERCEPTORS,
	  useClass:CachingInterceptor,
	  multi:true
	  },
	  {
		provide:HTTP_INTERCEPTORS,
		useClass:ErrorInterceptor,
		multi:true
	  }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
