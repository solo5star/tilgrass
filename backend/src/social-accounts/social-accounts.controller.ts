import { Controller, Get } from '@nestjs/common';
import { SocialAccountsService } from './social-accounts.service';

@Controller('social-accounts')
export class SocialAccountsController {
  constructor(
    private readonly socialAccountsService: SocialAccountsService,
  ) {}

  @Get()
  findAll() {
    return this.socialAccountsService.findAll();
  }
}
