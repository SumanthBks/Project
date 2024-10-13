import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;
  secretKey!: CryptoKey;
  iv: Uint8Array = crypto.getRandomValues(new Uint8Array(12));

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
    });
  }

  async generateSecretKey() {
    this.secretKey = await crypto.subtle.generateKey({
      name: 'AES-GCM',
      length: 256
    },
      true,
      ['encrypt', 'decrypt']
    )
  }

  ngOnInit(): void {
    this.generateSecretKey();
  }

  async encryptPassword(password: string): Promise<String> {
    const encodePassword = new TextEncoder().encode(password);
    console.log(this.secretKey);
    const encrypted = await crypto.subtle.encrypt({
      name: 'AES-GCM',
      iv: this.iv
    },
      this.secretKey,
      encodePassword
    );

    const bytes = new Uint8Array(encrypted);
    const binary = String.fromCharCode(...bytes);
    return window.btoa(binary);
  }

  async onLogin() {
    if (this.loginForm.valid) {
      console.log('Login Successful!', this.loginForm.value);

      const encryptedPassword = await this.encryptPassword(this.loginForm.value.password);

      const loginRequestPayload = {
        username: this.loginForm.value.username,
        passKey: encryptedPassword
      }

      console.log(loginRequestPayload);

      this.router.navigate(['/userProfile']);
    } else {
      console.log('Form Invalid');
    }
  }

  fieldValidation(field: string) {
    if (this.loginForm.get(field)?.invalid && this.loginForm.get(field)?.touched) {
      return true;
    }
    return false;
  }

  submitDisabled() {
    if (this.loginForm.invalid) {
      return true;
    }
    return false;
  }

}
