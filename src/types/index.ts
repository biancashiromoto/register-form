export interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  phone: string;
  countryCode: string;
}

export interface CountryType {
  code: string;
  nameEng: string;
  flag: {
    src: string;
    altText: string;
  };
  iso: string;
}
