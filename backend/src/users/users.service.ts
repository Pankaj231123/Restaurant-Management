import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  // In-memory OTP cache (for demo only)
  private otpCache: Record<string, string> = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailer: MailerService,
    
  ) {}

  /** Create a new user with hashed password */
  async saveData(data: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      ...data,
      password: await bcrypt.hash(data.password, await bcrypt.genSalt()),
    });
    return this.userRepository.save(user);
  }
  





  /**  Retrieve all users */
  allData(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**  Get a user by ID */
  async getId(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  /**  Delete a user by ID */
  async deleteId(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`User ${id} not found`);
  }

  /**  Update user data with optional password re-hashing */
  async updateData(id: number, data: UpdateUserDto): Promise<User> {
    const user = await this.getId(id);
    if (data.password) {
      data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());
    }
    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  /**  Find a user by username */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  /**  Find a user by ID */
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**  Find a user by email and include password */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'password'],
    });
  }

  /**  Generate OTP, log to file, and send via email */
  async generateAndSendOtp(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    if (!user) {
      console.error(`[OTP]  No user found with email: ${email}`);
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    this.otpCache[email] = otp;

    //  Log OTP to file (dev only)
    const logDir = path.join(__dirname, '../../logs');
    const logFile = path.join(logDir, 'otp-log.txt');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
    fs.appendFileSync(logFile, `OTP for ${email}: ${otp}\n`);

    console.log(`[OTP]  Generated OTP ${otp} for ${email}`);
    console.log(`[OTP]  Attempting to send email to ${email}...`);

    try {
      await this.mailer.sendMail({
        to: email,
        subject: 'Your One-Time Password',
        text: `Hello ${user.username},\n\nYour OTP code is: ${otp}\nIt will expire in 5 minutes.`,
      });

      console.log(`[OTP]  Email sent to ${email}`);
      return 'OTP sent successfully';
    } catch (error) {
      console.error(`[OTP]  Failed to send OTP email to ${email}`);
      console.error(error);
      throw new Error('Failed to send OTP email');
    }
  }

  /**
 * Send the OTP via email using the injected MailerService.
 */
async sendOtpEmail(email: string, otp: string): Promise<void> {
  await this.mailer.sendMail({
    to: email,
    subject: 'Your One-Time Password',
    text: `Your OTP code is: ${otp}`,
  });
}


  /** Verify the OTP from the cache */
  verifyOtp(email: string, otp: string): boolean {
    const expected = this.otpCache[email];
    if (expected && expected === otp) {
      delete this.otpCache[email]; // Invalidate OTP after use
      return true;
    }
    return false;
  }
}
