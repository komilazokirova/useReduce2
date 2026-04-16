import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);

// ✅ ENG MUHIM QISM
export const db = getDatabase(app);