export class NewUser {
    public username: string;
    public first_name: string;
    public last_name: string;
    public email: string;
    public password: string;
    public tel: string;
    constructor(username, first_name: string, last_name: string, email: string, password: string, tel: string) {
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.tel = tel;
    }
}