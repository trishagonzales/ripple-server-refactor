import { Entity } from '@app/core';
import { Profile } from '../profile/Profile';

interface Props {
  id: string;
  username: string;
  sessionRefreshToken?: string;
}

export type GuestPlainData = Props;

export class Guest extends Entity<Props> {
  private constructor(props: Props) {
    super(props);
  }

  static Create() {
    const props: Props = {
      id: Entity.GenerateId(),
      username: Profile.GenerateUsername(),
    };
    return new Guest(props);
  }

  static Parse(props: Props) {
    return new Guest(props);
  }

  get username() {
    return this._props.username;
  }
  get sessionRefreshToken() {
    return this._props.sessionRefreshToken;
  }
  get plainData(): GuestPlainData {
    return {
      id: this.id,
      ...this._props,
    };
  }

  setSessionRefreshToken(refreshToken: string) {
    this._props.sessionRefreshToken = refreshToken;
  }
}
