import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@shared';
import { AuthenticationService } from './authentication.service';

const log = new Logger('Login');

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  version: string | null = environment.version;
  error: string | undefined;
  email: string = '';
  username: string = '';
  password: string = '';
  loginForm: FormGroup;
  places: any;

  constructor(private authService: AuthenticationService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm && this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe(
        (response) => {
          console.log('Login successful');
          this.fetchPlaces();
        },
        (error) => {
          console.error('Login error:', error);
          this.error = error;
        }
      );
    }
  }

  private fetchPlaces(): void {
    this.authService.getPlaces().subscribe(
      (data) => {
        this.places = data;
        console.log('Places:', this.places);
      },
      (error) => {
        console.error('Error fetching places:', error);
        this.error = error;
      }
    );
  }
}
