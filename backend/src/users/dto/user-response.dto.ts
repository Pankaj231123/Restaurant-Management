
export class UserResponseDto {
    id: number;
    name: string;
  
    // You can also create a constructor if you'd like to make sure the object is properly formatted
    constructor(user: any) {
      this.id = user.id;
      this.name = user.name;
    }
  }
  