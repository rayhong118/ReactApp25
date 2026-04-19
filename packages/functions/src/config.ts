import { setGlobalOptions } from "firebase-functions/v2";

// This will now apply to all v2 functions globally
setGlobalOptions({ maxInstances: 10, region: "us-west2" });
