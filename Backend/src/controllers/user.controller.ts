import { Request, Response } from 'express';
import User from '../models/user.model';
import * as service from '../services/user.service';
import bcrypt from "bcrypt";
import { ROLE } from '../utils/role.util';
import jwt from 'jsonwebtoken';
import jwtConfig from '../configs/jwt.config';

export const signup = async (request: Request, response: Response) => {
    try {
        const { fullName, email, password, type } = request.body;

        const hash = await bcrypt.hash(password, 10);

        const newUser = new User({
                fullName: fullName,
                email: email,
                password: hash,
                type: type,
        });
       
        const add = await service.AddUser(newUser);
        
        response.status(201).json({
            message: `Successful registration ${add.fullName} OK.`
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Registration error"
        });
    }
};

export const addOwner = async (request: Request, response: Response) => {
    try {
        const { fullName, email, password } = request.body;

        const hash = await bcrypt.hash(password, 10);

        const newUser = new User({
                fullName: fullName,
                email: email,
                password: hash,
                type: ROLE.OWNER,
        });
        const user = await service.signup(newUser);

        response.status(201).json({
            message: "Owner ajouté avec succès"
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Owner registration error"
        });
    }
};

export const addSpecialist = async (request: Request, response: Response) => {
    try {
        const { fullName, email, password } = request.body;

        const hash = await bcrypt.hash(password, 10);

        const newUser = new User({
                fullName: fullName,
                email: email,
                password: hash,
                type: ROLE.OWNER,
        });
        const user = await service.signup(newUser);

        response.status(201).json({
            message: "Specialist ajouté avec succès"
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Specialist registration error"
        });
    }
};

export const login = async (request: Request, response: Response) => {
    try {
        const { email: loginEmail, password } = request.body;

        const authenticatedUser = await service.login(loginEmail, password);

        if (!authenticatedUser) {
            return response.status(401).json({
                message: "Invalid email and/or password"
            })
        }

        const { _id, fullName, email, type } = authenticatedUser.user!;

        return response.status(200).json({
            user: authenticatedUser.user,
            token: jwt.sign({
                userId: _id,
                fullName,
                email,
                role: type
            }, jwtConfig.jwt.secret!, {
                expiresIn: '2h'
            })
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: error
        })
    }
};

// crud admin

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await service.findUserById(req.params['id']);
        res.json(user);
    } catch (error) {
        res.status(400).json(error);
    }
};
export const updateUserById = async (req: Request, res: Response) => {
    try {
        const updatedUser = await service.updateUserById(req.params['id'], req.body);
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json(error);
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        await service.deleteUserById(req.params['id']);
        res.status(204).send();
        res.status(204).json({
            message: 'Utilisateur supprimer avec success'
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const User = await service.findAllUsers();
        res.json(User);
    } catch (error) {
        res.status(500).json(error);
    }
};

