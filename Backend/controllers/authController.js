import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

export const  login = async (req, res) => {
    try {
    const { email, password } = req.body;

    //check if user exists
    const user = await prisma.user.findUnique({
         where: { email } 
    });

    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    //create token
    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    //send response
    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
        });

    }catch (error) {
    res.status(500).json({ error: error.message });
};

}

