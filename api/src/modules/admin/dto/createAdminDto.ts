export interface ICreateAdminDTO {
  email: string;
  password: string;
  name: string;
}

export interface ICreateAgentDTO {
  email: string;
  password: string;
  name: string;
  referalCode: string;
}
