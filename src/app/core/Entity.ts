import { omit } from 'lodash';
import { v4 } from 'uuid';

export abstract class Entity<Props extends { id: string }> {
  private _id: string;
  protected _props: Omit<Props, 'id'>;
  /**
   *  Used for tracking which props are modified
   *  and needs saving in persistence
   */
  protected _unsavedProps: (keyof Props)[];

  constructor(props: Props) {
    this._id = props.id;
    this._props = omit(props, 'id');
    this._unsavedProps = [];
  }

  static GenerateId() {
    return v4();
  }

  get id() {
    return this._id;
  }
  get unsavedProps() {
    return this._unsavedProps;
  }

  protected _includeFieldToUnsavedProps(propsModified: (keyof Props)[]) {
    this._unsavedProps.concat(propsModified);
  }

  protected _includeAllFieldsToUnsavedProps() {
    this.resetUnsavedProps();
    this._unsavedProps = ['id', ...Object.keys(this._props)] as (keyof Props)[];
  }

  resetUnsavedProps() {
    this._unsavedProps = [];
  }
}
