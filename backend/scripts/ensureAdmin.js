import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ensureAdmin = async () => {
  try {
    const adminName = process.env.ADMIN_NAME ? process.env.ADMIN_NAME.trim() : null;
    const adminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.toLowerCase().trim() : null;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminName || !adminEmail || !adminPassword) {
      throw new Error(
        'ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be configured in environment variables.'
      );
    }

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be configured in environment variables.');
    }

    await mongoose.connect(process.env.MONGO_URI);
    const usersColl = mongoose.connection.collection('users');

    const existingAdmin = await usersColl.findOne({
      $or: [{ email: adminEmail }, { name: adminName }]
    });

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (existingAdmin) {
      await usersColl.updateOne(
        { _id: existingAdmin._id },
        {
          $set: {
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            updatedAt: new Date()
          }
        }
      );
      console.log(`👑 [Admin Initializer]: Admin account (${adminEmail}) verified and synchronized.`);
    } else {
      await usersColl.insertOne({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`👑 [Admin Initializer]: Admin account (${adminEmail}) initialized successfully.`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ [Admin Initializer Error]:', err.message);
    process.exit(1);
  }
};

ensureAdmin();
