// /pages/api/auth/update-session.js

export default async function handler(req, res) {
    if (req.method === "POST") {
      const cookies = req.cookies;
  
      // Check if the "isNewUser" flag exists in the cookies
      if (cookies.isNewUser === "true") {
        // Set the "isNewUser" cookie to "false"
        res.setHeader("Set-Cookie", `isNewUser=false; Path=/; HttpOnly; Secure=${process.env.NODE_ENV === "production"}; SameSite=Strict; Max-Age=31536000`);
        return res.status(200).json({ success: true, message: "Session flag updated" });
      }
  
      return res.status(200).json({ success: true, message: "Session flag was already false" });
    }
  
    return res.status(405).json({ error: "Method not allowed" });
  }
  