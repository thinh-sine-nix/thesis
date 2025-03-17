import { User } from './user';
import { v4 as uuidv4 } from 'uuid';
import WSMessage from './wsMessage';

export class Room {
    private id: string;
    private member: User[];
    private secretKey: string;
    private updatedAt: Date;
    private createdAt: Date;
    private startTime: Date | null = null;
    private password: string;  // Store room password
    
    constructor(id: string, password: string) {
        this.member = [];
        this.secretKey = uuidv4();
        this.id = id;
        this.updatedAt = new Date();
        this.password = password;
        this.createdAt = new Date();
        this.startTime = null;
    }

    public getId() {
        return this.id;
    }

    public getPassword() {
        return this.password;
    }

    public checkPassword(password: string) {
        return this.password === password;
    }

    public getSecretKey() {
        return this.secretKey;
    }

    public getMember() {
        return this.member;
    }

    public getMemberWithoutSocket() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return this.member.map(({ socket, ...rest }) => rest);
    }

    public addMember(user: User) {
        this.updatedAt = new Date();
        if (!this.startTime) {
            this.startTime = new Date(); // Set start time when first person enters
        }
        return this.member.push(user);
    }

    public getStartTime() {
        return this.startTime;
    }

    public removeMember(id: string) {
        this.updatedAt = new Date();
        this.member = this.member.filter(({ peerId }) => peerId !== id);
        return this.member;
    }

    boardcast(message: WSMessage) {
        const listClients = this.member;
        listClients?.forEach((client) => client.socket.send(JSON.stringify(message)));
    }

    public getCreatedAt() {
        return this.createdAt;
    }

    public getUpdatedAt() {
        return this.updatedAt;
    }
}
