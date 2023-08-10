"use server";

import Thread from "../models/thread.model";
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

export async function fetchUserPosts(userId: string){
  try{
    connectToDB();

    const threads = await User.findOne({ id: userId}).populate({
      path: 'threads',
      model: Thread,
      populate: {
        path: 'children',
        model: Thread,
        populate: {
          path: 'author',
          model: User,
          select: 'name image id'
        }
      }
    })

    return threads;

  } catch(error: any) {
    throw new Error(`error: `+error.message)
  }
}