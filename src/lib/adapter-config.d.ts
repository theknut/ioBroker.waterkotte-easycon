// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
    namespace ioBroker {
        interface AdapterConfig {
            ipAddress: string;
            username: string;
            password: string;
            pollStatesOf: string[];
            pollingInterval: number;
        }
    }
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};
