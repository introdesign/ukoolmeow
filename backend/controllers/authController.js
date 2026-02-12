const fs = require("fs");
const admin = require("firebase-admin");

const getServiceAccount = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const raw = fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf8");
    return JSON.parse(raw);
  }

  return null;
};

const getAdminApp = () => {
  if (admin.apps.length) {
    return admin;
  }

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    throw new Error(
      "Missing Firebase service account. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH."
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
  });

  return admin;
};

const verifyGoogle = async (req, res) => {
  const { idToken } = req.body || {};
  if (!idToken) {
    return res.status(400).json({ message: "Missing idToken" });
  }

  try {
    const firebaseAdmin = getAdminApp();
    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);

    const user = {
      id: decoded.uid,
      name: decoded.name || decoded.email || "Unknown",
      email: decoded.email || "",
      role: "user",
    };

    return res.json({
      user,
      sessionToken: "mock-session-token",
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid Google token" });
  }
};

module.exports = {
  verifyGoogle,
};
