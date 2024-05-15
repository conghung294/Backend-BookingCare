import { where } from 'sequelize';
import db from '../models/index';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      let isExistUserEmail = await checkUserEmail(email);
      if (isExistUserEmail) {
        let user = await db.User.findOne({
          attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
          where: { email: email },
          raw: true,
        });
        if (user) {
          const passwordDb = user.password;
          let check = await bcrypt.compareSync(password, passwordDb);

          if (check) {
            userData.errCode = 0;
            userData.errMessage = 'OK';
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = 'wrong password';
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = 'User not found';
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = 'Your email is not existing';
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (useremail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: useremail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getUserWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;

    let { count, rows } = await db.User.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'address',
        'phoneNumber',
        'gender',
        'image',
        'positionId',
      ],
      include: [
        {
          model: db.Allcode,
          as: 'roleData',
          // attributes: ['name', 'description', 'id'],
        },
      ],
      order: [['id', 'DESC']],
      raw: true,
      nest: true,
    });

    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      users: rows,
    };

    return {
      EM: 'Get data successfully',
      EC: 0,
      DT: data,
    };
  } catch (e) {
    console.log(e);
  }
};

let getAllUsers = async (userId) => {
  try {
    let users = '';
    if (userId === 'ALL') {
      users = db.User.findAll({
        attributes: {
          exclude: ['password'],
        },
      });
    }
    if (userId && userId !== 'ALL') {
      users = db.User.findOne({
        where: { id: userId },
        attributes: {
          exclude: ['password'],
        },
      });
    }
    return users;
  } catch (e) {
    console.log(e);
  }
};

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);

      if (check === true) {
        resolve({
          errCode: '1',
          errMessage: 'Your email has already been, please try other email',
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
          image: data.avatar,
        });
      }

      resolve({
        errCode: 0,
        message: 'OK',
      });
    } catch (e) {
      reject(e);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = async (id) => {
  try {
    let user = await db.User.findOne({
      where: { id: id },
    });
    if (!user) {
      return {
        errCode: 2,
        errMessage: 'User not exist',
      };
    }

    await db.User.destroy({
      where: { id: id },
    });

    return {
      errCode: 0,
      message: 'User deleted',
    };
  } catch (err) {
    console.error(err);
  }
};

let updateUserData = async (data) => {
  try {
    if (!data.id) {
      return {
        errCode: 2,
        errMessage: 'Missing parameter',
      };
    }
    let user = await db.User.findOne({
      where: { id: data.id },
      raw: false,
    });
    if (user) {
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.address = data.address;
      user.roleId = data.roleId;
      user.positionId = data.positionId;
      user.gender = data.gender;
      user.phoneNumber = data.phoneNumber;
      user.image = data.avatar;

      await user.save();
      return {
        errCode: 0,
        message: 'Updated successfully',
      };
    } else {
      return {
        errCode: 1,
        errMessage: 'User not found',
      };
    }
  } catch (e) {
    console.log(e);
  }
};

let getAllCodeService = async (type) => {
  try {
    if (!type) {
      return {
        errCode: 1,
        errMessage: 'Missing required parameter',
      };
    } else {
      handleUserLogin;
      let data = await db.Allcode.findAll({
        where: { type: type },
      });

      return {
        errCode: 0,
        data: data,
      };
    }
  } catch (e) {
    return e;
  }
};

module.exports = {
  handleUserLogin,
  getAllUsers,
  createNewUser,
  deleteUser,
  updateUserData,
  getAllCodeService,
  getUserWithPagination,
};
