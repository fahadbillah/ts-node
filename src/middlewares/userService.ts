import { NextFunction } from "express";
import * as mongoose from "mongoose";
import User from "../models/User";

class UserService {
    private next: NextFunction;
    private excludedProp: string = "-password -token -contact -oldPasswords -updateHistory -__v";
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

    public readMultipleUser(filter: object): any {
        return User
        // .find(filter)
        // .select(this.excludedProp)
        .aggregate([
            {
                $match: { userType: "user" } ,
            },
            {
                $group: {
                    _id: {
                        accountStatus: "$accountStatus",
                        userName: "$userName",
                    },
                },
            },
            { $limit : 1 },
            {
                $group: {
                    _id: "counting",
                    data: { $push: "$_id" },
                    totalResult: {
                        $sum: 1,
                    },
                },
            },
            // {
            //     $group: {
            //         _id: null,
            //         data: "$counting.data",
            //         limitedResult: {
            //             $sum: 1,
            //         },
            //         totalResult: "$counting.totalResult",
            //     },
            // },
        ])
        .exec();
    }
}

export default new UserService();
