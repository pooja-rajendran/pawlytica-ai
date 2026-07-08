import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
selector: 'app-home',
templateUrl: './home.component.html',
styleUrls: ['./home.component.css'],
imports: [
FormsModule,
CommonModule
]
})
export class HomeComponent implements OnInit {

message = '';

messages: any[] = [];

pets: any[] = [];

searchText = '';

isTyping = false;

showPetDetails = false;

selectedPet: any = null;

showSymptomChecker = false;

selectedSymptomPet:any = null;

selectedSymptoms:string[] = [];

selectedFile: File | null = null;

editSelectedFile: File | null = null;

imagePath = '';

symptomResult:any = null;

isCheckingSymptoms = false;

aiResult:any = null;

dietPlan = '';

isGeneratingDiet = false;

selectedDietPet: any = null;

allVaccines = [
  'Rabies',
  'DHPP',
  'Parvovirus',
  'Leptospirosis',
  'Bordetella'
];

newPet = {
petName: '',
species: '',
breed: '',
age: 0,
vaccines: [] as string[],
nextVaccineDate:''
};

vaccinesInput = '';

editingPetId = '';

editPet = {

  petName:'',
  species:'',
  breed:'',
  age:0,
  vaccines:[] as string[],
  image:'',
  nextVaccineDate:''

};

editVaccinesInput = '';

stats = {

 totalPets:0,

 dogs:0,

 cats:0,

 vaccinated:0

};

constructor(

private api:ApiService,

private router:Router

){}

ngOnInit() {


this.loadPets();

this.loadHistory();


}

loadPets() {


this.api.getPets()
  .subscribe((res: any) => {

    this.pets = res;

this.stats.totalPets = res.length;

this.stats.dogs = res.filter(
 (p:any)=>
 p.species?.toLowerCase() === 'dog'
).length;

this.stats.cats = res.filter(
 (p:any)=>
 p.species?.toLowerCase() === 'cat'
).length;

this.stats.vaccinated = res.filter(
 (p:any)=>
 p.vaccines &&
 p.vaccines.length > 0
).length;

  });


}

viewPet(pet: any) {

  this.selectedPet = pet;

  this.selectedDietPet = pet;

  this.dietPlan = '';

  this.aiResult = null;

  this.showPetDetails = true;

  this.api.getPetSummary(pet).subscribe({

    next: (res: any) => {

      console.log("AI RESULT:", res);

      this.aiResult = res;

    },

    error: (err) => {

      console.log("AI ERROR:", err);

      alert("Unable to generate AI Health Summary.");

    }

  });

}

closePetDetails(){

  this.showPetDetails = false;

  this.selectedPet = null;

  this.aiResult = null;

}

generateDietPlan() {

  console.log("BUTTON CLICKED");

  if (!this.selectedDietPet) {
    console.log("No selected pet");
    return;
  }

  this.isGeneratingDiet = true;
  this.dietPlan = '';

  this.api.generateDietPlan(this.selectedDietPet)
    .subscribe({

      next: (res: any) => {

        console.log("DIET RESPONSE:", res);

        this.dietPlan = res.dietPlan;

        this.isGeneratingDiet = false;

      },

      error: (err) => {

        console.log("DIET ERROR:", err);

        this.isGeneratingDiet = false;

      }

    });

}

downloadReport() {

  if (!this.selectedPet || !this.aiResult) {
    alert("Generate the AI Health Summary first.");
    return;
  }

  const doc = new jsPDF();

doc.setFontSize(24);
doc.setTextColor(88, 28, 255);
doc.setFont("helvetica", "bold");
doc.text("Pawlytica AI", 20, 22);

doc.setFontSize(13);
doc.setTextColor(120);
doc.text("Smart Pet Healthcare Platform", 20, 30);

  autoTable(doc, {

    startY: 40,

    head: [['Pet Information','']],

    body: [

      ['Name', this.selectedPet.petName],
      ['Species', this.selectedPet.species],
      ['Breed', this.selectedPet.breed],
      ['Age', this.selectedPet.age + ' years'],
      ['Vaccines', this.selectedPet.vaccines.join(', ')],
      ['Next Vaccine',
        new Date(this.selectedPet.nextVaccineDate)
        .toLocaleDateString()
      ]

    ]

  });

  autoTable(doc, {

    startY: (doc as any).lastAutoTable.finalY + 10,

    head: [['AI Health Summary']],

    body: [[this.aiResult.summary]]

  });

  autoTable(doc, {

    startY: (doc as any).lastAutoTable.finalY + 10,

    head: [['Diet Recommendation']],

    body: [[this.aiResult.diet]]

  });

  autoTable(doc, {

    startY: (doc as any).lastAutoTable.finalY + 10,

    head: [['Exercise Recommendation']],

    body: [[this.aiResult.exercise]]

  });

  autoTable(doc, {

    startY: (doc as any).lastAutoTable.finalY + 10,

    head: [['Vaccination Advice']],

    body: [[this.aiResult.vaccination]]

  });

  autoTable(doc, {

    startY: (doc as any).lastAutoTable.finalY + 10,

    head: [['Risk Level']],

    body: [[this.aiResult.risk]]

  });

  doc.save(
    `${this.selectedPet.petName}-Health-Report.pdf`
  );

}

openSymptomChecker(pet:any){

  this.selectedSymptomPet = pet;

  this.selectedSymptoms = [];

  this.showSymptomChecker = true;

}

closeSymptomChecker(){

  this.showSymptomChecker = false;

}

toggleSymptom(event:any){

  if(event.target.checked){

    this.selectedSymptoms.push(
      event.target.value
    );

  }

  else{

    this.selectedSymptoms =

      this.selectedSymptoms.filter(

        x=>x!==event.target.value

      );

  }

}

analyzeSymptoms() {

  if (this.selectedSymptoms.length === 0) {

    alert("Please select at least one symptom.");

    return;

  }

  this.isCheckingSymptoms = true;

  this.symptomResult = null;

  this.api.checkSymptoms(

    this.selectedSymptomPet,

    this.selectedSymptoms

  ).subscribe({

    next: (res: any) => {

      this.symptomResult = res;

      this.isCheckingSymptoms = false;

    },

    error: (err) => {

      console.log(err);

      this.isCheckingSymptoms = false;

      alert("Unable to analyze symptoms.");

    }

  });

}

get filteredPets() {

  return this.pets.filter(p =>
    p.petName
      .toLowerCase()
      .includes(
        this.searchText.toLowerCase()
      )
  );

}

onFileSelected(event: any) {


this.selectedFile =
  event.target.files[0];


}


getDueVaccines(){

 const today = new Date();

 return this.pets.filter((pet:any)=>{

  if(!pet.nextVaccineDate){
   return false;
  }

  const vaccineDate =
   new Date(pet.nextVaccineDate);

  const diffDays = Math.ceil(

   (vaccineDate.getTime() -
    today.getTime())

   /

   (1000 * 60 * 60 * 24)

  );

  return diffDays <= 7;

 });

}

getVaccinationProgress(pet: any): number {

  const completed = this.allVaccines.filter(v =>
    this.isVaccinated(pet, v)
  ).length;

  return Math.round(
    (completed / this.allVaccines.length) * 100
  );

}

isVaccinated(pet: any, vaccine: string): boolean {

  if (!pet.vaccines) {
    return false;
  }

  return pet.vaccines.some(
    (v: string) =>
      v.trim().toLowerCase() === vaccine.trim().toLowerCase()
  );

}


send() {


if (!this.message.trim()) {
  return;
}

this.messages.push({
  role: 'user',
  text: this.message
});

const msg = this.message;

this.message = '';

this.isTyping = true;

this.api.sendMessage(msg)
  .subscribe({

    next: (res: any) => {

      console.log(
        'CHAT RESPONSE:',
        res
      );

      this.isTyping = false;

      this.messages.push({
        role: 'ai',
        text: res.reply
      });

    },

    error: (err) => {

      console.log(
        'CHAT ERROR:',
        err
      );

      this.isTyping = false;

      this.messages.push({
        role: 'ai',
        text: 'Error contacting server'
      });

    }

  });


}

addPet() {


if (!this.selectedFile) {

  alert(
    'Select an image'
  );

  return;

}

this.api
  .uploadImage(
    this.selectedFile
  )
  .subscribe((uploadRes: any) => {

    this.newPet.vaccines =

      this.vaccinesInput
        .split(',')
        .map(v => v.trim())
        .filter(v => v);

    const petData = {

      ...this.newPet,

      image:
        uploadRes.image

    };

    this.api.addPet(
      petData
    )
    .subscribe((res: any) => {

      console.log(
        'Pet Added:',
        res
      );

      alert(
        'Pet added successfully'
      );

      this.loadPets();

      this.newPet = {

  petName: '',
  species: '',
  breed: '',
  age: 0,
  vaccines: [],
  nextVaccineDate: ''

};

      this.vaccinesInput = '';

      this.selectedFile = null;

    });

  });


}



deletePet(id: string) {


if (
  !confirm(
    'Delete this pet?'
  )
) {
  return;
}

this.api.deletePet(id)
  .subscribe(() => {

    alert(
      'Pet deleted'
    );

    this.loadPets();

  });


}

onEditFileSelected(event:any){

  this.editSelectedFile =
    event.target.files[0];

}

startEdit(pet: any) {


this.editingPetId =
  pet._id;

this.editPet = {

  petName: pet.petName,
  species: pet.species,
  breed: pet.breed,
  age: pet.age,
  vaccines: [...pet.vaccines],
  image: pet.image || '',
  nextVaccineDate: pet.nextVaccineDate
    ? new Date(pet.nextVaccineDate)
        .toISOString()
        .split('T')[0]
    : ''

};

this.editVaccinesInput =
  pet.vaccines.join(', ');


}

saveEdit(){

  this.editPet.vaccines =

  this.editVaccinesInput
  .split(',')
  .map(v => v.trim())
  .filter(v => v);

  if(this.editSelectedFile){

    this.api.uploadImage(
      this.editSelectedFile
    )
    .subscribe((imgRes:any)=>{

      console.log(
    'UPLOAD RESPONSE:',
    imgRes
  );

      this.editPet.image =
        imgRes.image;

        console.log(imgRes);

      this.api.updatePet(

        this.editingPetId,

        this.editPet

      ).subscribe(()=>{

        alert('Pet updated');

        this.editingPetId = '';

        this.editSelectedFile = null;

        this.loadPets();

      });

    });

  }

  else{

    this.api.updatePet(

      this.editingPetId,

      this.editPet

    ).subscribe(()=>{

      alert('Pet updated');

      this.editingPetId = '';

      this.loadPets();

    });

  }

}

cancelEdit() {


this.editingPetId = '';


}

loadHistory() {


this.api.getHistory()
  .subscribe((res: any) => {

    this.messages =

      res.messages.map(
        (m: any) => ({

          role:
            m.role === 'assistant'
              ? 'ai'
              : 'user',

          text:
            m.content

        })
      );

  });


}

logout() {


localStorage.removeItem(
  'token'
);

window.location.reload();


}

}
