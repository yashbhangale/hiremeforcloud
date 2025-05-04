interface Window {
  initWidget: (config: {
    waifuPath: string;
    cdnPath: string;
    tools: string[];
    tips?: {
      welcome?: string;
      copy?: string;
      screenshot?: string;
      hitokoto?: string;
      close?: string;
      info?: string;
      switch_model?: string;
      switch_texture?: string;
      photo?: string;
      quit?: string;
    };
    hitokotoAPI?: string;
    hitokotoText?: string;
    hitokotoError?: string;
    hitokotoSuccess?: string;
    hitokotoTimeout?: string;
    hitokotoEmpty?: string;
    hitokotoLoading?: string;
    hitokotoLoaded?: string;
    hitokotoFailed?: string;
    hitokotoRetry?: string;
    hitokotoRetryMax?: string;
    hitokotoRetryTimeout?: string;
    hitokotoRetryError?: string;
    hitokotoRetrySuccess?: string;
    hitokotoRetryEmpty?: string;
    hitokotoRetryLoading?: string;
    hitokotoRetryLoaded?: string;
    hitokotoRetryFailed?: string;
  }) => void;
} 