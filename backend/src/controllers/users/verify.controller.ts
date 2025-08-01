import { EmailVerification, User } from "../../models";
import { Request, Response } from "express";
import env from "../../config/env.config";

const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const emailVerification = await EmailVerification.findOne({
      where: {
        token,
      },
    });

    if (!emailVerification) {
      return res.redirect(`${env.FRONTEND_URL}/login?error=invalid-verification-token`);
    }

    // Check if token has expired
    if (emailVerification.expiresAt < new Date()) {
      return res.redirect(`${env.FRONTEND_URL}/login?error=verification-token-expired`);
    }

    await User.update(
      { isEmailVerified: true },
      {
        where: {
          id: emailVerification.userId,
        },
      }
    );

    // Delete the verification token after successful verification
    await emailVerification.destroy();

    res.redirect(`${env.FRONTEND_URL}/login?verified=true`);
  } catch (error) {
    console.error('Email verification error:', error);
    res.redirect(`${env.FRONTEND_URL}/login?error=verification-failed`);
  }
};

export default verifyEmail;
