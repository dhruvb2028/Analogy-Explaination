export type AudienceLevel = 'Kid' | 'Beginner' | 'Intermediate' | 'Expert';

export interface AnalogyRequest {
  concept: string;
  audienceLevel: AudienceLevel;
  domain?: string;
}

export interface AnalogyResponse {
  concept: string;
  decomposition: {
    components: string[];
    relationships: string[];
    processes: string[];
  };
  mainAnalogy: {
    domain: string;
    story: string;
    mapping: { from: string; to: string }[];
  };
  explanation: string;
  limitations: string[];
  alternatives: {
    domain: string;
    explanation: string;
  }[];
}
