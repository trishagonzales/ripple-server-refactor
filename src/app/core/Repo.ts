import { pick } from 'lodash';

type RepoUnsavedProps<T> = (keyof T)[] | 'all';

export interface SaveModelArg<T> {
  model: T;
  unsavedProps: RepoUnsavedProps<T>;
}

export interface RollbackConfig<T> {
  previousData: T | null;
  updateToPrevious(previousData: T): Promise<void>;
  deleteNewlyCreated(): Promise<void>;
}

export abstract class Repo {
  /**
   * Filter model (data object in db format)
   * and pick only properties whose field names
   * are included in unsavedProps array
   *
   * @example
   * const profileModel = {
   *   id: 'jd82fnal15ptf',
   *   username: johndoe,
   *   name: 'John Doe',
   *   age: 25
   * }
   * const unsavedProps = ['username', 'age']
   *
   * const dataToSave = pickUnsavedPropsFromModel(profileModel, unsavedProps);
   */
  protected pickUnsavedPropsFromModel<T>(
    model: T,
    unsavedProps: RepoUnsavedProps<T>,
  ) {
    return unsavedProps === 'all' ? model : pick(model, unsavedProps);
  }

  protected noPropsWereModified(unsavedProps: string[] | 'all'): boolean {
    if (unsavedProps === 'all') return false;
    return unsavedProps.length === 0;
  }

  /**
   * Create rollback function to revert database mutations
   * if other mutations also fail
   *
   * @example
   * const config = {
   *   previousData: await userRepo.getOne(id),
   *
   *   callbackForExistingRecord:
   *     (previousData) => await userRepo.save(previousData),
   *
   *   callbackForNewlyCreatedRecord:
   *     (id) => await userRepo.deleteOne(id)
   * }
   *
   * const rollback = createRollbackFunction(config)
   *
   * try {
   *   await avatarRepo.save(avatar);
   * } catch(e) {
   *   await rollback.execute();
   * }
   */
  protected createRollbackFunction<T = unknown>(config: RollbackConfig<T>) {
    const { previousData, updateToPrevious, deleteNewlyCreated } = config;

    async function execute() {
      if (previousData) {
        await updateToPrevious(previousData);
      } else {
        await deleteNewlyCreated();
      }
    }

    return { execute };
  }
}
