export interface Transfer{

    id: number;
    playerLogoUrl: string;
    playerFullName: string;
    transferFeeInMillions: number;
    fromTeam: string;
    fromTeamLogoUrl: string;
    toTeam: string;
    toTeamLogoUrl: string;
    numberOfLikes: number;
}
export interface Comment{
    id: number;
    user: User;
    comment: string;
    transfer: Transfer;
    numberOfLikes: number;
}

export interface Role{
    id: number;
    name: string;
}

export interface User{
    id: number;
    username: string;
    email: string;
    profileLogoUrl: string;
}

export interface ProfileLogo{
    id: number;
    profileLogoName: string;
    profileLogoUrl: string;
}