
export interface DBNames extends UserDBNames, UploadDBNames {
    groupItemsDB: string;
    groupItemsNameOnlyDB: string;
    currency: string;
}


interface UserDBNames {
    userProfileURL: string;
    userEmail: string;
}

interface UploadDBNames {
    uploadTerms: string;
}