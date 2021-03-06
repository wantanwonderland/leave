import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CostCentreFormService } from 'src/services/cost-centre-setup/cost-centre-form.service';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cost-centre-setup-form',
  templateUrl: './cost-centre-setup-form.page.html',
  styleUrls: ['./cost-centre-setup-form.page.scss'],
  providers: [CostCentreFormService]
})
export class CostCentreSetupFormPage implements OnInit {
  subscription: Subscription;
  checkModeSubscription: Subscription;

  constructor(
    private _activatedRouter: ActivatedRoute,
    private _router: Router,
    private _costCentreFormService: CostCentreFormService
    ) { }

  get form(): FormGroup {
      return this._costCentreFormService.form;
  }

  ngOnInit() {
    const id = this._activatedRouter.snapshot.paramMap.get('id');

    // set the form mode
   this.checkModeSubscription = this._costCentreFormService.checkEditMode(id).subscribe(() => {
        this._costCentreFormService.loadDataForEdit(id);
    });
  }

  onSubmit() {
    let data: any;
        if (this._costCentreFormService.isEditMode) {
            // call the update method
            data = this._costCentreFormService.updateCostCentre();
        } else {
            // call the insert method
            data = this._costCentreFormService.saveCostCentre();
        }

        // tslint:disable-next-line:no-shadowed-variable
        this.subscription = data.subscribe(data => {
            if (data.status === 200) {
                this._router.navigate(['tabs/cost-centre-setup']);
            }
        });
  }

  ionViewWillLeave() {
      this.checkModeSubscription.unsubscribe();
  }

}
