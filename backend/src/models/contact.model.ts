import { Optional } from "sequelize";
import {
  Model,
  Table,
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  DeletedAt,
} from "sequelize-typescript";
import { Category, User } from ".";

interface IContact {
  id?: number;
  fullName: string;
  company?: string;
  avatar?: string;
  phoneNumber: string;
  email: string;
  address?: string;
  gender?: string;
  department?: string;
  notes?: string;
  isStared?: boolean;
  viewsCount?: number;
  categoryId?: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

@Table({
  underscored: true,
  timestamps: true,
  paranoid: true, // Enables soft delete
})
class Contact extends Model<IContact, Optional<IContact, "id">> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id?: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  fullName!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  company?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  avatar?: string;

  @Column({
    type: DataType.STRING(15),
    allowNull: false,
  })
  phoneNumber!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  address?: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  gender?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  department?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isStared!: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  viewsCount!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User)
  user?: User;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    onDelete: "SET NULL",
  })
  categoryId?: number;

  @BelongsTo(() => Category)
  category?: Category;

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;

  @DeletedAt
  deletedAt?: Date;
}

export default Contact;
