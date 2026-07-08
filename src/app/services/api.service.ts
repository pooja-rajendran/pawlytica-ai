import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
 providedIn:'root'
})
export class ApiService {

 constructor(
  private http: HttpClient
 ){}

sendMessage(message:string){

 const token =
 localStorage.getItem('token');


 return this.http.post(

 'http://localhost:3000/chat',

 {
  message:message
 },

 {
  headers:{
   Authorization:
   `Bearer ${token}`
  }
 }

 );

}

getPets(){

 const token =
 localStorage.getItem('token');

 return this.http.get(

  'http://localhost:3000/pets',

  {
   headers:{
    Authorization:
    `Bearer ${token}`
   }
  }

 );

}

getPet(id:string){

 const token =
 localStorage.getItem('token');

 return this.http.get(

  `http://localhost:3000/pets/${id}`,

  {
   headers:{
    Authorization:
    `Bearer ${token}`
   }
  }

 );

}

addPet(pet: any) {

  const token =
    localStorage.getItem('token');

  return this.http.post(

    'http://localhost:3000/pets',

    pet,

    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }

  );

}

getPetSummary(pet: any) {

  const token = localStorage.getItem('token');

  return this.http.post(

    'http://localhost:3000/ai/pet-summary',

    pet,

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

  );

}

checkSymptoms(pet: any, symptoms: string[]) {

  const token = localStorage.getItem('token');

  return this.http.post(

    'http://localhost:3000/ai/symptom-check',

    {
      pet,
      symptoms
    },

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

  );

}


getHistory(){

 const token =
 localStorage.getItem('token');

 return this.http.get(

  'http://localhost:3000/chat/history',

  {
   headers:{
    Authorization:
    `Bearer ${token}`
   }
  }

 );

}


deletePet(id:string){

 const token =
 localStorage.getItem('token');

 return this.http.delete(

  `http://localhost:3000/pets/${id}`,

  {
   headers:{
    Authorization:
    `Bearer ${token}`
   }
  }

 );

}

updatePet(
 id:string,
 pet:any
){

 const token =
 localStorage.getItem('token');

 return this.http.put(

  `http://localhost:3000/pets/${id}`,

  pet,

  {
   headers:{
    Authorization:
    `Bearer ${token}`
   }
  }

 );

}

generateDietPlan(pet: any) {

  const token = localStorage.getItem('token');

  return this.http.post(

    'http://localhost:3000/ai/diet-plan',

    pet,

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

  );

}

uploadImage(
 file:File
){

 const formData =
 new FormData();

 formData.append(
  'image',
  file
 );

 return this.http.post(

  'http://localhost:3000/upload',

  formData

 );

}


}