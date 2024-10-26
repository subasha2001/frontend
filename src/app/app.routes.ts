import { Routes } from '@angular/router';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { AdminPageComponent } from './components/pages/admin-page/admin-page.component';
import { ProductPageComponent } from './components/pages/product-page/product-page.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterPageComponent } from './components/pages/register/register.component';
import { HomeComponent } from './components/pages/home/home.component';
import { GoldJewelsComponent } from './components/pages/gold-jewels/gold-jewels.component';
import { SilverJewelsComponent } from './components/pages/silver-jewels/silver-jewels.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { CartPageComponent } from './components/pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './components/pages/checkout-page/checkout-page.component';
import { CoinsComponent } from './components/pages/coins/coins.component';
import { SchemesComponent } from './components/pages/schemes/schemes.component';
import { DiamondJewelsComponent } from './components/pages/diamond-jewels/diamond-jewels.component';
import { TermsConditionsComponent } from './components/pages/terms-conditions/terms-conditions.component';
import { AdminLoginComponent } from './components/pages/admin-login/admin-login.component';
import { adminauthGuard } from './auth/guards/adminauth.guard';
import { PaymentPageComponent } from './components/pages/payment-page/payment-page.component';

export const routes: Routes = [
    {path:'', component:HomePageComponent},
    {path:'admin', component:AdminPageComponent, canActivate:[adminauthGuard]},
    {path:'search/:searchTerm', component:HomeComponent},
    {path:'product/:id', component:ProductPageComponent},
    {path:'metalType/:metalTypeName', component:HomeComponent},
    {path:'category/:categoryName', component:HomeComponent},
    {path:'category/gold/:categoryName', component:GoldJewelsComponent},
    {path:'category/coin/:categoryName', component:CoinsComponent},
    {path:'category/silver/:categoryName', component:SilverJewelsComponent},
    {path:'category/diamond/:categoryName', component:DiamondJewelsComponent},
    {path:'delete/:id', component:HomePageComponent},
    {path:'contact', component:ContactComponent},
    {path:'login', component:LoginComponent},
    {path:'register', component:RegisterPageComponent},
    {path:'cart', component:CartPageComponent},
    {path:'checkout', component:CheckoutPageComponent, canActivate:[AuthGuard]},
    {path:'schemes', component:SchemesComponent},
    {path:'terms-conditions', component:TermsConditionsComponent},
    {path:'admin-login', component:AdminLoginComponent},
    {path:'payment', component:PaymentPageComponent}
];
