import BucketListItem from "./BucketListItem";

export interface UserData{
    name: string;
    bucketList: BucketListItem[];
    themes: string[];
}