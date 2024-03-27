import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class LoginDto {
    @IsNotEmpty()
    readonly login: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string
}