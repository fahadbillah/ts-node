import { NextFunction } from "express";
import * as mongoose from "mongoose";
import User from "../models/User";

class UserService {
    private next: NextFunction;
    // private excludedProp: string = "-password -token -contact -oldPasswords -updateHistory -__v";
    private excludedProp: object = {
        __v: 0,
        contact: 0,
        oldPasswords: 0,
        password: 0,
        token: 0,
        updateHistory: 0,
    };
    // public constructor() {}

    public createUser(userData: object): any {
        // testing
        const user = new User(userData);
        user.save((err, createdUser) => {
            if (err) {
                return this.next(err);
            }
            return createdUser;
        });
    }

    public updateUser() {
        // testing
    }

    public deleteUser() {
        // testing
    }

    public readSingleUser(filter: object): any {
        return User
        .findOne(filter)
        .select(this.excludedProp)
        .exec();
    }

    public readMultipleUser(filter: object, skip: number, limit: number ): any {
        return User
        .aggregate([
            {
                $match: filter,
            },
            {
                $project: this.excludedProp,
            },
            {
                $group: {
                    _id: null,
                    data: { $push: "$$ROOT" },
                    totalResult: {
                        $sum: 1,
                    },
                },
            },
            {
                $project: {
                    _id: false,
                    data: {
                        $slice: ["$data", skip, limit],
                    },
                    totalResult: "$totalResult",
                },
            },
        ])
        .exec();
    }
}

export default new UserService();
