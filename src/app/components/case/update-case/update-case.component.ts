import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CaseService } from '../../../services/case.service';
import { Case } from '../../../models/model.case';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-case',
  templateUrl: './update-case.component.html',
  styleUrl: './update-case.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
})
export class UpdateCaseComponent implements OnInit {
  @Input() caseData!: Case;
  @Input() caseId!: string;
  @Output() caseUpdated = new EventEmitter<boolean>();

  updateForm!: FormGroup;
  errorMessage: string = '';
  loading: boolean = true;

  constructor(private fb: FormBuilder, private caseService: CaseService) {}

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['' , Validators.required],
      priority: ['', Validators.required]
    });

    this.caseService.getCaseById(this.caseId).subscribe({
      next: (data: any) => {
        this.updateForm.patchValue({
          title: data.case.title,
          description: data.case.description,
          status: data.case.status,
          priority: data.case.priority
        });
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Error fetching case data';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.updateForm.invalid) return;

    this.caseService.updateCase(this.caseId, this.updateForm.value).subscribe({
      next: () => {
        this.caseUpdated.emit(true); 
        
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Error updating case';
        this.caseUpdated.emit(false);
      },
    });
  }
}
