import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({

 selector:'app-login',

 standalone:true,

 templateUrl:'./login.component.html',

 styleUrls:[
  './login.component.css'
 ],

 imports:[
  FormsModule,
  CommonModule
 ]

})

export class LoginComponent {

 email='';
 password='';

 isRegisterMode = false;

 name='';

 confirmPassword='';

 constructor(
  private auth:AuthService
 ){}

 login(){

  if(!this.email){

   alert('Email required');
   return;

  }

  if(!this.password){

   alert('Password required');
   return;

  }

  this.auth.login({

   email:this.email,

   password:this.password

  })

  .subscribe({

   next:(res:any)=>{

    this.auth.saveToken(
     res.token
    );

    alert(
     'Login successful'
    );

    window.location.reload();

   },

   error:()=>{

    alert(
     'Invalid email or password'
    );

   }

  });

 }

 register(){

  if(!this.name){

   alert('Name required');
   return;

  }

  if(!this.email){

   alert('Email required');
   return;

  }

  if(this.password.length < 6){

   alert(
    'Password must be at least 6 characters'
   );

   return;

  }

  if(
   this.password !==
   this.confirmPassword
  ){

   alert(
    'Passwords do not match'
   );

   return;

  }

  this.auth.register({

   name:this.name,

   email:this.email,

   password:this.password

  })

  .subscribe({

   next:()=>{

    alert(
     'Registration successful'
    );

    this.isRegisterMode = false;

   },

   error:(err)=>{

    alert(

     err.error?.error ||

     'Registration failed'

    );

   }

  });

 }

}