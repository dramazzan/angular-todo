export interface User {
    user: User | null;
    _id?: string; 
    name: string;
    email: string;
    login: string;
    password: string;
    role?: string; 
  }
  

export interface UserLoginDto{
    login:string,
    password: string,
}

export interface UserRegisterDto{
    name: string,
    email: string,
    login: string,
    password: string,
}