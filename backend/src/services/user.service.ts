import md5 from 'md5';
import DB from '../databases';
import { HttpException } from '../exceptions/HttpException';
import { User, UserResponse, UpdateUserReq, UserReq } from '../interfaces/user.interface';
import { getUnixTimestamp, DefaultPassword } from '../utils';
import { 
  generateSignToken, 
  TokenSecretKey, 
  TokenExpired
} from '../utils/util'

class UserService {
  public User = DB.Users;
  public Token = DB.Token;
  public UserRole = DB.UserRole;
  public Role = DB.Role;
  public now = getUnixTimestamp()

  public async findAll(query: any): Promise<UserResponse> {
    const { count, rows }  = await this.User.findAndCountAll(query);
    return { data: rows, count: count };
  }

  public async findUserById({id}:{id: number}): Promise<User> {
    const findUser: User | null = await this.User.findOne({ where: { id } });
    if (!findUser) throw new HttpException(409, "You're not user");
    return findUser;
  }

  public async findUserAndRoleById({id}:{id: number}): Promise<any> {
    const findUser: User | null = await this.User.findOne({ where: { id } });
    // 查user信息
    if (!findUser) throw new HttpException(409, "You're not user");
    // 查user关联的roleId信息
    const user = findUser.user;
    const findUserRole: any[] = await this.UserRole.findAll({ where: { user } });
    // 查roleList信息
    const roleIds = findUserRole.map((item: any) => item.role_id); 
    const roleList = await this.Role.findAll({ where: { id: roleIds } });
    return {
      userInfo: findUser,
      roleList
    }
  }

  public async findUserByUsername({user, namespace}:{user: string, namespace: string}): Promise<User | null> {
    const findUser: User | null = await this.User.findOne({
      where: { user, namespace },
      raw: true
    });
    return findUser
  }

  public async checkUsernameExists(namespace: string, user: string): Promise<boolean | null> {
    const result = await this.User.findOne({
      where: { user, namespace }
    })
    return result !== null
  }

  public async checkEmailExists(email: string): Promise<boolean | null> {
    const user = await this.User.findOne({
      where: { email }
    })
    return user !== null
  }

  public async login(Data: any): Promise<any> {
    const { id, user, namespace } = Data;
    // TODO: 先检查当前的有效期是否过期，如果不过期则取最新的值
    const jwtToken = generateSignToken({id, user, namespace, create_time: this.now }, TokenSecretKey, TokenExpired)
    const expired = this.now + 8 * 60 * 60
    if(jwtToken) {
      try{
        await this.Token.create({
          token: jwtToken,
          user,
          expired_at: expired,
          create_time: this.now,
          update_time: this.now
        })
        return { jwtToken }
      }catch(err) {
        console.log("err", err)
        return { jwtToken: '' }
      }
    }
    return { jwtToken: '' }
  }

  public async createUser(Data: User): Promise<User> {
    const { job } = Data;
    const createUser: User = await this.User.create({ ...Data, job });
    return createUser;
  }

  public async updateUser(Data: any, Id: number): Promise<any> {
    const res: any = await this.User.update({...Data}, {where: {id: Id}})
    return res
  }

  // 写入邮件验证
  // public async createAuthCode(Data: AuthCode): Promise<any> {
  //   console.log("AuthCode", Data)
  //   const res: any = await this.AuthCode.create(Data)
  //   return res
  // }

  // 读取邮件验证码
  // public async checkAuthCode(email: string, AuthCode: string): Promise<any> {
  //   const res: any = await this.AuthCode.findOne({
  //     where: {
  //       email,
  //       code: AuthCode,
  //     }
  //   })
  //   console.log("res", res)
  //   // 判断下时间是否已经过了有效期
  //   return true
  // }
  // getUserList
  public async getUserList(query: any): Promise<any> {
    const { count, rows }  = await this.User.findAndCountAll({
      where: {
        ...query
      },
      attributes: {
        exclude: ['password']
      }
    });
    return { data: rows, count: count };
  }
  // createUser
  public async createInnerUser(Data: UserReq): Promise<any> {
    const { namespace, user, name, job, password=DefaultPassword, email, phone_number, role_ids, operator } = Data;
    const t = await DB.sequelize.transaction();
    try {
      // insert user info
      const userInfo: any = await this.User.create({
        namespace,
        user,
        name,
        job,
        password: md5(password),
        email,
        phone_number
      }, { transaction: t });
      // if role_ids.length = 0
      if(Array.isArray(role_ids) && role_ids.length > 0){
        const batchRoles = role_ids.map((item: any) => {
          return {
            namespace,
            user,
            role_id: item,
            status: 1,
            operator,
            create_time: this.now,
            update_time: this.now
          }
        })
        await this.UserRole.bulkCreate(batchRoles, { transaction: t });
      }
      t.commit();
      return userInfo;
    }catch(err){
      console.log("err", err)
      t.rollback();
      return err
    }
  }
  // updateInnerUser
  public async updateInnerUser(Data: UpdateUserReq): Promise<any> {
    const { namespace, id, user, role_ids, operator, ...params } = Data;
    const t = await DB.sequelize.transaction();
    try {
      await this.User.update({
        ...params
      }, { where: { id, namespace, user } }, { transaction: t });
      // 更新角色信息
      if(Array.isArray(role_ids) && role_ids.length > 0){
        await this.UserRole.destroy({where: {
          namespace,
          user
        }}, { transaction: t })
        await this.UserRole.bulkCreate(role_ids.map((item: number) => {
          return {
            namespace,
            user,
            role_id: item,
            status: 1,
            operator,
            create_time: this.now,
            update_time: this.now
          }
        }), { transaction: t })
      }
      t.commit();
      return true
    }catch(err){
      console.log("err", err)
      t.rollback();
      return err;
    }
  }
  // deleteUser
  public async deleteUser({id, namespace, user}:{ id: number, namespace: string, user: string}): Promise<any> {
    const res: any = await this.User.destroy({where: {
      id, namespace, user
    }})
    return res
  }
}

export default UserService;
