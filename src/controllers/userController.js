import userService from '../services/userService';

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: 'Missing input value',
    });
  }

  let userData = await userService.handleUserLogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

let handleGetAllUsers = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let data = await userService.getUserWithPagination(+page, +limit);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let id = req.query.id;
      let users = await userService.getAllUsers(id);
      return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users,
      });
    }
  } catch (e) {
    return res.status(500).json({
      EM: 'error from sever',
      EC: '-1',
      DT: '',
    });
  }
};

let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);

  return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUserData(data);
  return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(500).json({
      errCode: 1,
      errMessage: 'Missing parameter',
    });
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message);
};

let getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: 'Error from server',
    });
  }
};

module.exports = {
  handleLogin,
  handleGetAllUsers,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
  getAllCode,
};
