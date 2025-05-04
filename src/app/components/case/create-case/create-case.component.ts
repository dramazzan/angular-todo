import { CommonModule } from '@angular/common';
import { CaseService } from './../../../services/case.service';
import { Component, EventEmitter, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-case',
  imports: [CommonModule, ReactiveFormsModule , FormsModule],
  templateUrl: './create-case.component.html',
  styleUrl: './create-case.component.css'
})
export class CreateCaseComponent {
  @Output()
  caseCreated: any = new EventEmitter<void>();
  createForm: FormGroup
  errorMessage: string = ""
 

  constructor(private fb: FormBuilder,private caseService: CaseService , private router: Router){
    this.createForm = this.fb.group({
      title: ['' ,  Validators.required],
      description: ['' , Validators.required]
    })
  }

  onSubmit(){
    if (this.createForm.invalid )return

    this.caseService.createCase(this.createForm.value).subscribe({
        next: ()=>{
          this.caseCreated.emit(true)
        },
        error: (err)=>{
          this.errorMessage = err.error.message || "Error creating case"
          this.caseCreated.emit(false)
        }

    })
  }



}
