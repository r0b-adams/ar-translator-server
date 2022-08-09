import bcrypt from 'bcrypt';
import { model, Model, Schema, Document } from 'mongoose';
import { validate, PayloadType, Constants } from './userValidation';

const { MAX_LENGTH, MIN_LENGTH, SALT_ROUNDS } = Constants;
const { USERNAME, PASSWORD, EMAIL } = PayloadType;

interface User extends Document {
  username: string;
  password: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: [true, 'username is required'],
      trim: true,
      maxlength: [MAX_LENGTH, 'password must be less than 32 chars'],
      validate: {
        validator: validate(USERNAME),
        message: (_props) => 'invalid username',
      },
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      trim: true,
      maxlength: [MAX_LENGTH, 'password must be less than 32 chars'],
      validate: {
        validator: validate(EMAIL),
        message: (_props) => `invalid email`,
      },
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      trim: true,
      minlength: [MIN_LENGTH, 'password must be at least 12 chars'],
      maxlength: [MAX_LENGTH, 'password must be less than 32 chars'],
      validate: {
        validator: validate(PASSWORD),
        message: (_props) => 'invalid password',
      },
    },
  },
  // options
  { timestamps: true }
);

userSchema.pre<User>('save', async function () {
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

const User: Model<User> = model('User', userSchema);

export default User;
