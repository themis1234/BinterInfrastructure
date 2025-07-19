export const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`

export interface User{
    email: string
    firstName: string
    lastName: string
    role: string

}