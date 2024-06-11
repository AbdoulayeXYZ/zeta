import { User } from './../../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-table-owner',
  templateUrl: './table-owner.component.html',
  styleUrl: './table-owner.component.css'
})

export class TableOwnerComponent implements OnInit {
  owner: User[] = [];
  userForm!: FormGroup;
  addUserForm!: FormGroup; // Separate form for adding users
  showForm: boolean = false;
  selectedUser: User | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      type: ['', Validators.required],
    });

    this.addUserForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['passer', Validators.required], // Assuming password is required for registration
      type: ['Owner', Validators.required],
    });

    this.loadFormateurs();
  }

  loadFormateurs(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log('Loaded users:', data);
        this.owner = data.filter(user => user.type === 'Owner');
      },
      error: (error) => {
        console.error('Error loading users', error);
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
          this.loadFormateurs();
          this.showForm = false;
          this.selectedUser = null;
        },
        error: (error) => console.error('Failed to update user', error)
      });
    } else if(this.addUserForm.valid) {
      this.userService.addUser(this.addUserForm.value).subscribe({
        next: () => {
          this.loadFormateurs();
          console.log('User registered successfully');
          this.loadFormateurs(); 
          this.addUserForm.reset(); 
        },
        error: (error) => console.error('Failed to register Owner', error)
      });
    } else {
      console.error('Form is invalid');
    }
  }

  deleteUser(userId: string): void {
    if (!userId) {
      console.error('User ID is undefined');
      return;
    }
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.owner = this.owner.filter(user => user._id !== userId);
        console.log('User deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting user', error);
      }
    });
  }
}
