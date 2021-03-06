import { map } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BranchModel } from 'src/models/main/branch.model';
import { CRUD } from '../base/crud.service';

@Injectable({
    providedIn: 'root'
})
export class BranchService extends CRUD {
    private _branchData: BehaviorSubject<BranchModel[]> = new BehaviorSubject([]);
    public readonly branchData: Observable<BranchModel[]> = this._branchData.asObservable();

    constructor(
        injector: Injector) {
            super(injector);
        }

    public getBranchList() {
        return this.read('main_branch', 'filter=ACTIVE_FLAG=1')
                .pipe(map(data => {
                    let branchData = new Array<BranchModel>();
                    branchData = data['resource'];

                    this._branchData.next(branchData);
                    return this.branchData;
                }));

    }

    public removeBranch(branchId: string) {

        // get the leave data
        this.read('main_branch', 'filter=BRANCH_GUID=' + branchId)
            .pipe(map(data => {

                // set the ACTIVE_FLAG to 0
                data['resource'][0].ACTIVE_FLAG = 0;

                return data;
            }))
            .subscribe(data => {
                this.delete(data['resource'], 'main_branch', this.getBranchList());
            });

    }
}
