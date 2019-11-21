import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MapsAPILoader } from '@agm/core';

declare var google: any;
declare var $: any;
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})


export class FormComponent implements OnInit {

  private zoom: Number = 20;

  private autoCompleteOrigin;
  private autoCompleteDestination;
  private validAddress = false;

  public renderOptions = {
    suppressMarkers: true,
  }

  dir = undefined;

  @ViewChild('origin', { static: false })
  public searchOrigin: ElementRef

  @ViewChild('destination', { static: false })
  public searchDestination: ElementRef;

  searchControl: FormControl;

  private user = {
    name: null,
    hourValue: null,
    transport: null,
    origin: null,
    destination: null
    
  }

  private transportId;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.getDirection()
    this.setSearch();
  }


  public getDirection() {

    this.dir = {
      origin: { lat: -28.667240, lng: -49.424080 },
      destination: { lat: -28.718700, lng: -49.297670 }
    }

  }

  setSearch() {
    this.searchControl = new FormControl();

    this.mapsAPILoader.load().then(() => {
      if (!this.autoCompleteOrigin) {
        this.autoCompleteOrigin = new google.maps.places.Autocomplete(this.searchOrigin.nativeElement);
      }

      const gmapsComponent = this;

      this.autoCompleteOrigin.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place = this.autoCompleteOrigin.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            this.validAddress = false
            return;
          }

          this.validAddress = true
          let origin = { lat: Number(place.geometry.location.lat()), lng: Number(place.geometry.location.lng()) }
          this.dir.origin = origin;
          this.changeDetector.detectChanges();

        });
      });
    });


    this.mapsAPILoader.load().then(() => {
      if (!this.autoCompleteDestination) {
        this.autoCompleteDestination = new google.maps.places.Autocomplete(this.searchDestination.nativeElement);
      }

      const gmapsComponent = this;

      this.autoCompleteDestination.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place = this.autoCompleteDestination.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            this.validAddress = false
            return;
          }
          console.log(place.geometry.location.lat());

          this.validAddress = true
          let destination = { lat: Number(place.geometry.location.lat()), lng: Number(place.geometry.location.lng()) }
          this.dir.destination = destination;
          this.changeDetector.detectChanges();

        });
      });
    });
  }

  changeTransport(){
      this.user.transport = this.transportId;
  }

  submit(){
    this.user.destination = this.dir.destination;
    this.user.origin = this.dir.origin;
    console.log(this.user);
  }

}
