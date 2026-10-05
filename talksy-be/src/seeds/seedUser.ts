import 'dotenv/config';

import { DataSource } from "typeorm";
import { User } from "../user/entities/user.js"
import * as bcrypt from "bcrypt"

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [User],
    synchronize: true,

});


const  seedAdmin=async()=>{
    await AppDataSource.initialize()
    const user=AppDataSource.getRepository(User)

    const user1={
        email:"user@example.com",
        password:await bcrypt.hash("1234",10),
        role:"admin"
    }

    const created=await user.save(user1)
    console.log(created)
}

seedAdmin()