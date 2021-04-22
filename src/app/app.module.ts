import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MaterialModule } from "./material-module";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from "@angular/platform-browser/animations";
import { CdkTableModule } from "@angular/cdk/table";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { PlatformModule } from "@angular/cdk/platform";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatTableModule } from "@angular/material/table";
import { HighchartsChartModule } from "highcharts-angular";
import { NgxGaugeModule } from "ngx-gauge";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LaboratoriosComponent } from "./dashboard/laboratorios/laboratorios.component";
import { GraficoComponent } from "./dashboard/grafico/grafico.component";
import { Grafico2Component } from "./dashboard/grafico2/grafico2.component";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LaboratoriosComponent,
    GraficoComponent,
    Grafico2Component
  ],
  imports: [
    MatTableModule,
    FlexLayoutModule,
    ScrollingModule,
    PlatformModule,
    AngularFireDatabaseModule,
    AngularFireModule,
    AngularFireModule.initializeApp(environment.firebase),
    HttpClientModule,
    ClipboardModule,
    CdkTableModule,
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HighchartsChartModule,
    NgxGaugeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
