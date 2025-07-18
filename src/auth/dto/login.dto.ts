import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginDto{
    @ApiProperty()
    @IsNotEmpty()
    email : string
    
    @ApiPropertyOptional()
    password: string
    
}