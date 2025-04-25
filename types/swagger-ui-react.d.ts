declare module 'swagger-ui-react' {
  interface SwaggerUIProps {
    spec: any;
    url?: string;
    docExpansion?: 'list' | 'full' | 'none';
    defaultModelExpandDepth?: number;
    defaultModelsExpandDepth?: number;
    filter?: boolean | string;
    validatorUrl?: string | null;
    onComplete?: () => void;
    requestInterceptor?: (req: any) => any;
    responseInterceptor?: (res: any) => any;
  }

  const SwaggerUI: React.FC<SwaggerUIProps>;
  export default SwaggerUI;
} 