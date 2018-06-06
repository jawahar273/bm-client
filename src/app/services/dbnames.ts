
export interface DBNames extends DataTableDBNames, UserDBNames, UploadDBNames {
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

interface DataTableDBNames {
    dashTable: string;
}