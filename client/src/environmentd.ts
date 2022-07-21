declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_NODE_ENV: string;
      REACT_APP_PROD_SERVER: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
