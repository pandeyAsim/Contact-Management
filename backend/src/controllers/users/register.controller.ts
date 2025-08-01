import { ApiError, ApiResponse } from "../../utils";
import { EmailVerification, Role, User } from "../../models";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import sendMail from "../../utils/mailHelper";
import { v4 as uuidv4 } from "uuid";

const register = async (req: Request, res: Response) => {
  // Step 1: Get the data from the request body
  const { email, password } = req.body;

  // Step 3: Password Hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  const userRole = await Role.findOne({
    where: {
      title: "user",
    },
  });

  if (!userRole) {
    throw new ApiError({
      status: 500,
      message: "User role not found",
    });
  }

  // Step 4: Create a new user in the database
  const user = await User.create({
    email: email,
    password: hashedPassword,
    roleId: userRole.id!,
  });

  // send verification email
  const token = uuidv4();
  const expiryDate = new Date(
    new Date().getTime() + 5 * 60 * 1000 // 5 minutes
  );

  await EmailVerification.create({
    userId: user.id!,
    token,
    expiresAt: expiryDate,
  });

  //   Send Email Verification
  await sendMail({
    to: email,
    subject: "Email Verification",
    body: `<p>Click <a href="http://localhost:8080/api/auth/verify/${token}">here</a> to verify your email.</p>`,
  });

  const createdUser = await User.findOne({
    where: { id: user.id },
    attributes: ["id", "email", "roleId", "createdAt", "updatedAt"],
    include: [
      {
        model: Role,
        attributes: ["id", "title"],
      },
    ],
  });

  // Step 5: Send a response back to the client
  new ApiResponse({
    status: 201,
    message: "User created successfully",
    data: createdUser,
  }).send(res);
};

export default register;
