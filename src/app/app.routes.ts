import { Routes } from '@angular/router';
import { MainComponent } from './Modules/LayOut/Main/Main.component';
import { CompanyComponent } from './Modules/FactoryBase/Company/Company.component';
import { DepartComponent } from './Modules/FactoryBase/Depart/Depart.component';
import { PlaceComponent } from './Modules/FactoryBase/Place/Place.component';
import { MangementComponent } from './Modules/FactoryBase/Mangement/Mangement.component';
import { EmployesComponent } from './Modules/HR/Employes/Employes.component';
import { EffectInSystemComponent } from './Modules/HR/EffectInSystem/EffectInSystem.component';
import { ColumnEffectComponent } from './Modules/HR/ColumnEffect/ColumnEffect.component';
import { EffectComponent } from './Modules/HR/Effect/Effect.component';

export const routes: Routes = [
    { path: '', redirectTo: 'Main', title: "الرئيسية", pathMatch: "full" },
    {
        path: 'Main', title: "الرئيسية", component: MainComponent, children: [
            { path: 'EffectInSystem',title:'مؤثرات النظام', component: EffectInSystemComponent },
            { path: 'ColumnEffect',title:'بنود المؤثر', component: ColumnEffectComponent },
            { path: 'Mangements',title:'الهيكل الاداري', component: MangementComponent },
            { path: 'Employes',title:'الموظفين', component: EmployesComponent },
            { path: 'Companies',title:'الشركات', component: CompanyComponent },
            { path: 'Places',title:'اماكن العمل', component: PlaceComponent },
            { path: 'Effects',title:'المؤثرات', component: EffectComponent },
            { path: 'Departs',title:'الأقسام', component: DepartComponent },
        ]
    },
];
