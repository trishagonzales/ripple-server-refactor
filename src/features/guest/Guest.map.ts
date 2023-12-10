import { Guest, GuestPlainData, GuestDTO } from '.';

export class GuestMap {
  static domainToCache(guest: Guest): string {
    return JSON.stringify(guest.plainData);
  }

  static cacheToDomain(data: GuestPlainData): Guest {
    return Guest.Parse(data);
  }

  static domainToDTO(guest: Guest): GuestDTO {
    return {
      id: guest.id,
      username: guest.username,
    };
  }
}
