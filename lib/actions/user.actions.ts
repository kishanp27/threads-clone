"use server";

import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  userId: string;
  name: string;
  username: string ;
  bio: string;
  path: string;
  image: string;
}

export async function updateUser({
  userId,
  name,
  username,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB();

  await User.findOneAndUpdate(
    { id: userId },
    {
      username: username.toLowerCase(),
      name,
      bio,
      image,
      onboarded: true,
    },
    { upsert: true }
  );

}

export async function fetchUser(userId: string){
  try{
    connectToDB();

    return await User.findOne({ id: userId })
    // .populate({
    //   path: 'communities',
    //   model: Community
    // })

  } catch(error: any){
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
}
