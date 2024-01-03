export interface PersonalizedOffer {
  id: string;
  cache?: {
    ttl: number;
  };
  title?: string;
  description?: string;
  action?: {
    redirect: string;
  };
  attributes?: {
    [key: string]: any;
  };
}
