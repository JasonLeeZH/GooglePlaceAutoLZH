interface GooglePlaceAutoRespItemTermsParams {
  offset: number;
  value: string;
}

export interface GooglePlaceAutoRespItemParams {
  description: string;
  matched_substrings: [{length: number; offset: number}];
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    main_text_matched_substrings: [{length: number; offset: number}];
    secondary_text: string;
  };
  terms: GooglePlaceAutoRespItemTermsParams[];
  types: string[];
}

export interface GooglePlaceAutoRespParams {
  status: string;
  predictions: GooglePlaceAutoRespItemParams[];
}
