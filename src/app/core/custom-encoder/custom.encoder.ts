import { HttpParameterCodec } from '@angular/common/http'

export class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key)
  }
  encodeValue(key: string): string {
    return encodeURIComponent(key)
  }
  decodeKey(key: string): string {
    return decodeURIComponent(key)
  }
  decodeValue(key: string) {
    return decodeURIComponent(key)
  }
}
