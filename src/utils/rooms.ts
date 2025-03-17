import { Room } from './room';
import { User } from './user';

export default class Rooms {
    private static instance: Rooms;
    private roomsData: Map<string, Room>;

    private constructor() {
        this.roomsData = new Map<string, Room>();
    }

    public new(roomID: string, password: string) {
        if (this.roomsData.has(roomID)) throw new Error('This room already exists');
        const newRoom = new Room(roomID, password);  // Create room with password
        this.roomsData.set(roomID, newRoom);
        return newRoom;
    }    
    
    public getRoomsData() {
        return this.roomsData;
    }

    public add(roomID: string, user: User) {
        if (!this.roomsData.has(roomID)) throw new Error('This room does not exist');
        return this.roomsData.get(roomID)?.addMember(user);
    }

    public get(roomID: string): Room | undefined {
        return this.roomsData.get(roomID);
    }

    public delete(roomID: string) {
        if (!this.roomsData.has(roomID)) throw new Error('This room does not exist');
        return this.roomsData.delete(roomID);
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Rooms();
        }
        return this.instance;
    }
}
