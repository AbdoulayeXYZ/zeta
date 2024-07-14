import { isOwnerGuard } from './../../../guards/is-owner.guard';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manageuser',
  templateUrl: './manageuser.component.html',
  styleUrls: ['./manageuser.component.css']
})
export class ManageuserComponent implements OnInit {
  specialists: User[] = [];
  userForm!: FormGroup;
  addUserForm!: FormGroup; // Separate form for adding users
  showForm: boolean = false;
  selectedSpecialist: User | null = null;
  showDeleteConfirmation: boolean = false; // Added property to manage delete confirmation

  constructor(private fb: FormBuilder, private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      type: ['', Validators.required],
      speciality: ['', Validators.required]
    });

    this.addUserForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['passer', Validators.required], // Assuming password is required for registration
      type: ['Specialist', Validators.required],
      speciality: ['', Validators.required],
      ownerID: [this.authService.getCurrentUser()?._id, Validators.required],
    });

    this.getSpecialists();
  }

  getSpecialists(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log('Loaded users:', data);
        this.specialists = data.filter(user => user.type === 'Specialist');
      },
      error: (error) => {
        console.error('Error loading users', error);
      }
    });
  }

  editSpecialist(specialist: User): void {
    this.selectedSpecialist = specialist;
    this.userForm.patchValue({
      fullName: specialist.fullName,
      email: specialist.email,
      type: specialist.type,
      speciality: specialist.speciality
    });
    this.showForm = true;
  }

  saveSpecialist(): void {
    if (this.userForm.valid && this.selectedSpecialist && this.selectedSpecialist._id) {
      const updatedSpecialist = { ...this.userForm.value, _id: this.selectedSpecialist._id };
      this.userService.updateUser(this.selectedSpecialist._id, updatedSpecialist).subscribe({
        next: () => {
          this.getSpecialists();
          this.showForm = false;
          this.selectedSpecialist = null;
        },
        error: (error) => console.error('Failed to update specialist', error)
      });
    } else if(this.addUserForm.valid) {
      this.userService.addUser(this.addUserForm.value).subscribe({
        next: () => {
          this.getSpecialists();
          console.log('Specialist registered successfully');
          this.addUserForm.reset(); 
        },
        error: (error) => console.error('Failed to register specialist', error)
      });
    } else {
      console.error('Form is invalid');
    }
  }

  deleteSpecialist(id: string): void {
    if (!id) {
      console.error('Specialist ID is undefined');
      return;
    }
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.specialists = this.specialists.filter(s => s._id !== id);
        console.log('Specialist deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting specialist', error);
      }
    });
  }

  clearSelection(): void {
    this.selectedSpecialist = null;
    this.showForm = false;
  }
}
