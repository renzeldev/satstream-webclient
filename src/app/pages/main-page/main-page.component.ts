import { Component, OnInit, Inject } from '@angular/core';
import { CustomerStreamModel } from 'src/share/model/CustomerStreamModel';
import StreamStatus from 'src/share/model/StreamStatus';
import { DepositModel } from 'src/share/model/DepositModel';
import { CustomerInfoModel } from 'src/share/model/CustomerInfoModel';
import { WebSocketService } from 'src/app/service/web-socket.service';
import { SatStreamService } from 'src/app/service/sat-stream.service';
import { Resolve, ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  title: string = 'satstream-webclient'
  CustomerId: any
  customerInfo: CustomerInfoModel
  selectedStreamId: any = ""
  selectedStream: CustomerStreamModel | null
  selectedStreamInfo: string = ""
  depositInfo: string = ""
  deposit: DepositModel | null
  depositId: any = ""
  newDepositAmount: number | null
  newDepositQRCode: string
  streamStatus = ["", "Initiated", "Confirmed", "Streaming", "Stream Stopped"]
  spinner: boolean = false;
  deposited: boolean = false;
  deposits: DepositModel[] = [

  ]
  streams: CustomerStreamModel[] = [
  ]
  constructor(
    private webSocketService: WebSocketService,
    private satStreamService: SatStreamService,
    private router: ActivatedRoute,
    private route: Router
  ) { }


  ngOnInit(): void {
    this.router.paramMap.subscribe((query: any) => {
      console.log(query.params.CustomerId);
      if (query.params.CustomerId) {
        this.CustomerId = query.params.CustomerId
        this.webSocketService.listen("TestNotification").subscribe((response) => {
          console.log(response, 'Test');
        })
        this.webSocketService.listen("StreamNotification").subscribe((response) => {
          this.selectedStream = null;
          this.selectedStreamId = "";
          if( response.CustomerId == this.CustomerId) {
            if (this.streams.filter(stream => stream.StreamId == response.StreamId).length === 0) {
              let newStream: CustomerStreamModel = { ...response }
              this.streams.unshift(newStream);
            } else {
              for (var i = 0; i < this.streams.length; i++) {
                if (this.streams[i].StreamId == response.StreamId) {
                  this.streams[i] = { ...this.streams[i], ...response };
                  this.streams.unshift(this.streams[i]);
                  this.streams.splice(i + 1, 1);
                  break;
                }
              }
            }
          } 
        })
        this.webSocketService.listen("DepositNotification").subscribe((response: any) => {
          this.depositId = ""
          this.deposit = null;
          if(this.deposits.filter(deposit => deposit.DepositId == response.DepositId).length > 0) {
            for (var i = 0; i < this.deposits.length; i++) {
              if (this.deposits[i].DepositId == response.DepositId) {
                this.deposit = null;
                this.depositId = "";
                this.deposits[i] = { ...this.deposits[i], ...response };
                this.deposits.unshift(this.deposits[i]);
                this.deposits.splice(i+1, 1);
                this.deposits = this.deposits.sort((a: any, b: any) => b.DepositId-a.DepositId);
                break;
              }
            }
          } else {
            this.deposits.unshift(response);
            this.deposits = this.deposits.sort((a: any, b: any) => b.DepositId-a.DepositId);
            this.deposited = true;
          }          
        })
        this.webSocketService.listen("CustomerBalanceNotification").subscribe((response: any) => {
          if (this.customerInfo.CustomerId == response.CustomerId) {
            this.customerInfo.SatBalance = response.balance;
          }
        })
        this.satStreamService.getCustomerData(this.CustomerId).subscribe((response: string) => {
          this.customerInfo = JSON.parse(response);
          if(this.customerInfo) {
            this.satStreamService.getCustomerStreams(this.CustomerId).subscribe((response: string) => {
              let streams = JSON.parse(response);
              streams.sort((a: any,b: any) => new Date(b.CreatedDate).getTime()-new Date(a.CreatedDate).getTime())
              streams.sort((a: any,b: any) => new Date(b.UpdateDate).getTime()-new Date(a.UpdateDate).getTime())
              this.streams = streams;
            })
            this.satStreamService.getCustomerDeposits(this.CustomerId).subscribe((response: string) => {
              this.deposits = JSON.parse(response);
              this.deposits = this.deposits.sort((a: any, b: any) => b.DepositId-a.DepositId);
            })
          }
        })
      } else {
        // this.route.navigateByUrl("/1");
        // this.route.navigate(['/1']);
      }
    })

  }

  async selectStream($event: any) {
    this.selectedStreamId = $event.target.value;
    this.selectedStreamInfo = "";
    if (this.selectedStreamId) {
      this.selectedStream = await this.streams.filter(stream => stream.StreamId == Number(this.selectedStreamId))[0];
      this.selectedStream.CreatedDate = this.selectedStream.CreatedDate ? new Date(this.selectedStream.CreatedDate).toLocaleString() : null;
      this.selectedStream.UpdateDate = this.selectedStream.UpdateDate ? new Date(this.selectedStream.UpdateDate).toLocaleString() : null;
    } else {
      this.selectedStream = null;
    }
  }

  async viewDeposit($event: any) {
    this.depositId = $event.target.value;
    this.depositInfo = "";
    if (this.depositId) {
      this.deposit = await this.deposits.filter(deposit => deposit.DepositId == this.depositId)[0];
      this.deposit.CreationDate = new Date(this.deposit.CreationDate).toLocaleString();
      this.deposit.UpdateDate = this.deposit.UpdateDate ? new Date(this.deposit.UpdateDate).toLocaleString() : null;
    } else {
      this.deposit = null;
    }
  }

  playStream(streamId: any): void {
    const selectedStream = this.streams.filter(i => i.StreamId == streamId)[0];
    if (selectedStream) {
      this.satStreamService.doStreamAction(selectedStream)
        .subscribe((response) => {
          if (response) {
            for (var i = 0; i < this.streams.length; i++) {
              if (this.streams[i].StreamId == streamId) {
                this.streams[i].StreamStatusId = 2;
              }
            }
          }
        })
    }
  }

  stopStream(streamId: any): void {
    const selectedStream = this.streams.filter(i => i.StreamId == streamId)[0];
    if (selectedStream) {
      this.satStreamService.doStreamAction(selectedStream)
        .subscribe((response) => {
          if (response) {
            for (var i = 0; i < this.streams.length; i++) {
              if (this.streams[i].StreamId == streamId) {
                this.streams[i].StreamStatusId = 4;
              }
            }
          }
        })
    }
  }

  clickNewDepositBtn(): void {
    this.newDepositAmount = null;
  }

  async createDeposit(): Promise<void> {
    this.newDepositQRCode = "";
    this.deposited = false;
    if (this.newDepositAmount) {
      this.spinner = true;
      var modal = document.getElementById('newDeposit');
      if (modal) modal.style.display = 'none';
      var backdrop = document.querySelector('.modal-backdrop.show');
      backdrop?.remove()
      await this.satStreamService.createDeposit(this.newDepositAmount, this.CustomerId).subscribe((response: string) => {
        this.newDepositQRCode = response;
        this.spinner = false;
      })
      document.getElementById("qrBtn")?.click();
    }
  }

  // getStreamStatus(StreamId: any): any {
  //   return this.streams.filter(i => i.StreamId == StreamId)[0].StreamStatusId;
  // }

}
