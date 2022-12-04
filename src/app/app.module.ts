import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {EngineComponent} from './engine/engine.component';
import {UiInfobarBottomComponent} from './ui/ui-infobar-bottom/ui-infobar-bottom.component';
import {UiInfobarTopComponent} from './ui/ui-infobar-top/ui-infobar-top.component';
import {UiSidebarLeftComponent} from './ui/ui-sidebar-left/ui-sidebar-left.component';
import {UiSidebarRightComponent} from './ui/ui-sidebar-right/ui-sidebar-right.component';
import {UiComponent} from './ui/ui.component';
import { ControlsComponent } from './controls/controls.component';
import { SliderComponent } from './controls/slider/slider.component';
import { LightningComponent } from './lightning/lightning.component';
import { BakingComponent } from './baking/baking.component';
import { ThreeTemplateComponent } from './three-template/three-template.component';


@NgModule({
  declarations: [
    AppComponent,
    EngineComponent,
    UiComponent,
    UiInfobarBottomComponent,
    UiInfobarTopComponent,
    UiSidebarLeftComponent,
    UiSidebarRightComponent,
    ControlsComponent,
    SliderComponent,
    LightningComponent,
    BakingComponent,
    ThreeTemplateComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
