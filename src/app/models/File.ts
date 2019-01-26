export class File{

    public idfile;
    public name;
    public user_id;
    public datefile;
    public content;

    constructor(idfile, name, user_id, datefile, content) {
        this.idfile = idfile;
        this.name = name;
        this.user_id = user_id;
        this.datefile = datefile;
        this.content = content;
    }

    public date(): string {
        const date = (new Date(this.datefile));
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }

    public timestamp(): number {
        return Number(new Date(this.datefile));
    }
}