import { Component, OnInit } from '@angular/core';
import { Case } from '../../../models/model.case';
import { CaseService } from '../../../services/case.service';
import { CommonModule } from '@angular/common';
import { CreateCaseComponent } from "../create-case/create-case.component";
import { UpdateCaseComponent } from '../update-case/update-case.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-case-list',
  standalone: true, 
  imports: [CommonModule, CreateCaseComponent, UpdateCaseComponent, FormsModule],
  templateUrl: './case-list.component.html',
  styleUrl: './case-list.component.css'
})
export class CaseListComponent implements OnInit {
  caseList: Case[] = [];
  filteredCaseList: Case[] = [];
  errorMessage: string = "";

  isModalOpen: boolean = false;
  modalType: string = "";
  modalProps: any;

  // Поисковый запрос
  searchQuery: string = '';
  
  // Фильтры
  statusFilter: string = 'all';
  priorityFilter: string = 'all';
  tagFilter: string = '';
  favoriteFilter: boolean | null = null;
  
  // Сортировка
  sortField: string = 'createdAt';
  sortDirection: string = 'desc';
  
  // Доступные опции для фильтров
  availableTags: string[] = [];

  isFavorite: boolean = false

  constructor(private caseService: CaseService) {}

  openModal(modalType: string, ...props: any) {
    this.modalProps = props;
    this.modalType = modalType; 
    this.isModalOpen = true;
  }

  closeModal() {
    this.modalProps = null;
    this.modalType = "";
    this.isModalOpen = false; 
  }

  closeModalWhenSuccess(success: boolean) {
    if (success) {
      this.modalProps = null;
      this.modalType = "";
      this.isModalOpen = false; 
      this.ngOnInit();
    }
  }

  toggleFavorite(caseID: string ){
    this.caseService.toggleFavorite(caseID).subscribe({
      next: (res) => {
        const updated = this.caseList.find(c => c._id === caseID);
        if (updated) {
          updated.favorite = !updated.favorite;
        }
        this.applyFiltersAndSort(); // Обновим отображение
      },
      error: (err) => {
        console.log("toggle failed: ", err);
        this.errorMessage = err.error.message || "toggle failed";
      }
    });
  }
  

  handleDelete(caseID: string) {
    console.log(caseID);
    this.caseService.deleteCase(caseID).subscribe({
      next: () => {
        this.ngOnInit();
      },
      error: (err) => {
        this.errorMessage = err.error.message || "Error Deleting Case";
      }
    });
  }

  ngOnInit(): void {
    this.loadCases();
  }

  loadCases(): void {
    this.caseService.getAllCases().subscribe({
      next: (data: any) => {
        this.caseList = data.cases;
        this.extractAvailableTags();
        this.applyFiltersAndSort();
      },
      error: (err) => {
        this.errorMessage = err.error.message || "Error fetching cases";
      }
    });
  }

  // Извлекаем все уникальные теги для фильтра
  extractAvailableTags(): void {
    const tagsSet = new Set<string>();
    this.caseList.forEach(caseItem => {
      if (caseItem.tags && caseItem.tags.length > 0) {
        caseItem.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    this.availableTags = Array.from(tagsSet).sort();
  }

  // Обработчик изменения поиска
  onSearchChange(): void {
    this.applyFiltersAndSort();
  }

  // Обработчик изменения фильтров
  onFilterChange(): void {
    this.applyFiltersAndSort();
  }

  // Обработчик изменения сортировки
  onSortChange(field: string): void {
    if (this.sortField === field) {
      // Если поле то же самое, меняем направление сортировки
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Если новое поле, устанавливаем его и сортировку по умолчанию
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSort();
  }

  // Обработчик переключения избранного
  toggleFavoriteFilter(): void {
    if (this.favoriteFilter === null) {
      this.favoriteFilter = true;
    } else if (this.favoriteFilter === true) {
      this.favoriteFilter = false;
    } else {
      this.favoriteFilter = null;
    }
    this.applyFiltersAndSort();
  }

  // Применяем фильтры и сортировку
  applyFiltersAndSort(): void {
    // Сначала применяем фильтры
    this.filteredCaseList = this.caseList.filter(caseItem => {
      // Поиск по заголовку или описанию
      const matchesSearch = !this.searchQuery || 
        caseItem.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        caseItem.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      // Фильтр по статусу
      const matchesStatus = this.statusFilter === 'all' || caseItem.status === this.statusFilter;
      
      // Фильтр по приоритету
      const matchesPriority = this.priorityFilter === 'all' || caseItem.priority === this.priorityFilter;
      
      // Фильтр по тегам
      const matchesTag = !this.tagFilter || 
        (caseItem.tags && caseItem.tags.includes(this.tagFilter));
      
      // Фильтр по избранному
      const matchesFavorite = this.favoriteFilter === null || 
        caseItem.favorite === this.favoriteFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesTag && matchesFavorite;
    });
    
    // Затем сортируем результаты
    this.filteredCaseList.sort((a, b) => {
      let fieldA: any = a[this.sortField as keyof Case];
      let fieldB: any = b[this.sortField as keyof Case];
      
      // Для дат нужно особое сравнение
      if (fieldA instanceof Date && fieldB instanceof Date) {
        fieldA = fieldA.getTime();
        fieldB = fieldB.getTime();
      } else if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        // Для строк используем локализованное сравнение
        return this.sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      }
      
      // Для остальных типов простое сравнение
      if (this.sortDirection === 'asc') {
        return fieldA > fieldB ? 1 : (fieldA < fieldB ? -1 : 0);
      } else {
        return fieldA < fieldB ? 1 : (fieldA > fieldB ? -1 : 0);
      }
    });
  }

  // Форматирование даты для отображения
  formatDate(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString();
  }
}