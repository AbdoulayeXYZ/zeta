import { User } from './../../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-table-adminzeta',
  templateUrl: './table-adminzeta.component.html',
  styleUrl: './table-adminzeta.component.css'
})

export class TableAdminzetaComponent implements OnInit {
  adminzeta: User[] = [];
  userForm!: FormGroup;
  showForm: boolean = false;
  selectedUser: User | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      type: ['', Validators.required],
    });
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log('Loaded users:', data);
        this.adminzeta = data.filter(user => user.type === 'AdminZeta');
      },
      error: (error) => {
        console.error('Error loading adminzeta', error);
      }
    });
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.userForm.patchValue({
      fullName: user.fullName,
      email: user.email,
      type: user.type,
    });
    this.showForm = true;
  }

  saveUser(): void {
    if (this.userForm.valid && this.selectedUser && this.selectedUser._id) {
      const updatedUser = { ...this.userForm.value, _id: this.selectedUser._id };
      this.userService.updateUser(this.selectedUser._id, updatedUser).subscribe({
        next: () => {
          this.loadUsers();
          this.showForm = false;
          this.selectedUser = null;
        },
        error: (error) => console.error('Failed to update adminzeta', error)
      });
    } else {
      console.error('Form is invalid or no user selected');
    }
  }

  deleteUser(userId: string): void {
    if (!userId) {
      console.error('User ID is undefined');
      return;
    }
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.adminzeta = this.adminzeta.filter(user => user._id !== userId);
        console.log('adminzeta deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting adminzeta', error);
      }
    });
  }
}