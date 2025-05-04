import { Component, OnInit } from '@angular/core';
import { Case } from '../../../models/model.case';
import { CaseService } from '../../../services/case.service';
import { CommonModule } from '@angular/common';
import { CreateCaseComponent } from "../create-case/create-case.component";
import { UpdateCaseComponent } from '../update-case/update-case.component';

@Component({
  selector: 'app-case-list',
  standalone: true, 
  imports: [CommonModule, CreateCaseComponent, UpdateCaseComponent],
  templateUrl: './case-list.component.html',
  styleUrl: './case-list.component.css'
})
export class CaseListComponent implements OnInit{
  caseList!: Case[]
  errorMessage: string = ""

  isModalOpen: boolean = false;
  modalType : string= "";
  modalProps !: any;

  constructor(private caseService: CaseService){}


  openModal(modalType: string, ...props: any){
      this.modalProps = props;
      this.modalType = modalType; 
      this.isModalOpen = true;
  }

  closeModal(){
      this.modalProps = null;
      this.modalType = "";
      this.isModalOpen = false; 
  }

  closeModalWhenSuccess(success: boolean){
    if (success){
      this.modalProps = null;
      this.modalType = "";
      this.isModalOpen = false; 
      this.ngOnInit()
    }
}

  handleDelete(caseID : string){
    console.log(caseID)
    this.caseService.deleteCase(caseID).subscribe({
      next:()=>{
        this.ngOnInit()
      },
      error: (err)=>{
        this.errorMessage = err.error.message || "Error Deleting Case"
      }
    })
  }

  ngOnInit(): void {
      this.caseService.getAllCases().subscribe({

        next: (data: any)=>{
          this.caseList = data.cases
        },
        error: (err)=>{
          this.errorMessage = err.error.message || "Error fetching cases"
        }
      })
  }

}
