export class CustomerStreamModel {
    public StreamId: number
    public CustomerId: number
    public MerchantId: number
    public AmountProcessed: number
    public StreamStatusId: number
    public CreatedDate?: string | null
    public UpdateDate?: string | null
    public ProductId?: number | null
    public AmountRate?: number | null
    public Description: string | null
    // constructor(stream: any) {
    //     this.StreamId =  stream.StreamId
    //     this.CustomerId =  stream.CustomerId
    //     this.MerchantId =  stream.MerchantId
    //     this.AmountProcessed =  stream.AmountProcessed
    //     switch(stream.StreamStatusId) {
    //         case 0:
    //             this.StreamStatusId = "Initiated"
    //             break;
    //         case 1:
    //             this.StreamStatusId = "Confirmed"
    //             break;
    //         case 2:
    //             this.StreamStatusId = "Streaming"
    //             break;
    //         default:
    //             this.StreamStatusId = "Stopped"
    //             break;
    //     }
    //     // this.StreamStatusId =  stream.StreamStatusId
    //     this.CreatedDate =  stream?.CreatedDate ?? null
    //     this.UpdateDate =  stream?.UpdateDate ?? null
    //     this.ProductId =  stream?.ProductId ?? null
    //     this.AmountRate =  stream?.AmountRate ?? null
    //     this.Description =  stream?.Description??''
    // }
}


export class UpcomingStreamModel {
    public StreamId: number
    public CustomerId: number
    public MerchantId: number
    public AmountProcessed: number
    public StreamStatusId: number
    public Description: string | null
}