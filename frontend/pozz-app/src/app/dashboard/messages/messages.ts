import { Component } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './messages.html',
})
export class MessagesComponent {}
