// This file extends the AdapterConfig type from "@types/iobroker"

import { PathFlavor } from '../types';

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
    namespace ioBroker {
        interface AdapterConfig {
            ipAddress: string;
            username: string;
            password: string;
            pollingInterval: number;
            pathFlavor: PathFlavor;
            removeWhitespace: true;
        }
    }
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};
