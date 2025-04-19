const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// ✅ Create user and store info
exports.createUserAndNotify = functions
  .region("us-central1")
  .https
  .onCall(async (data, context) => {
    const {
      email,
      password,
      firstName,
      lastName,
      address,
      city,
      state,
      country,
      zip,
    } = data;

    try {
      // ✅ Prevent duplicate users
      const existingUser = await admin.auth().getUserByEmail(email).catch(() => null);
      if (existingUser) {
        throw new functions.https.HttpsError("already-exists", "Email is already in use.");
      }

      // ✅ Create Firebase Auth user
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      });

      // ✅ Save to Firestore
      await db.collection("users").doc(userRecord.uid).set({
        uid: userRecord.uid,
        email,
        firstName,
        lastName,
        address,
        city,
        state,
        country,
        zip,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // ✅ Send email
      const mailOptions = {
        from: gmailEmail,
        to: email,
        subject: "Your MSdesigns Login Credentials",
        text: `Hello ${firstName},\n\nYour account has been approved.\n\nEmail: ${email}\nPassword: ${password}\n\nBest,\nMSdesigns Team`,
      };

      await transporter.sendMail(mailOptions);
      return { success: true, uid: userRecord.uid };
    } catch (error) {
      console.error("Error creating user and sending email:", error);
      throw new functions.https.HttpsError("internal", error.message);
    }
  });

// ✅ List users (excluding admin)
exports.listUsers = functions
  .region("us-central1")
  .https
  .onCall(async (data, context) => {
    try {
      const listUsersResult = await admin.auth().listUsers(1000);
      const users = listUsersResult.users.map((user) => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
      }));

      // ✅ Exclude specific admin email
      const filtered = users.filter(
        (u) => u.email !== "manjot@admin.msdesigns"
      );

      return filtered;
    } catch (error) {
      throw new functions.https.HttpsError("internal", error.message);
    }
  });

// ✅ Delete user by UID
exports.deleteUserByUid = functions
  .region("us-central1")
  .https
  .onCall(async (data, context) => {
    const { uid } = data;

    try {
      await admin.auth().deleteUser(uid);
      return { success: true };
    } catch (error) {
      throw new functions.https.HttpsError("internal", error.message);
    }
  });
