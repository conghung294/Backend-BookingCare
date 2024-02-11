import db from '../models/index';

let createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter',
        });
      } else {
        await db.Specialty.create({
          image: data.imageBase64,
          name: data.name,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });
        resolve({
          errCode: 0,
          errMessage: 'Successfully created',
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
      if (data && data.length > 0) {
        data.forEach((item) => {
          item.image = Buffer.from(item.image, 'base64').toString('binary');
        });
      }
      resolve({
        errCode: 0,
        errMessage: 'OK',
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailSpecialtyById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter',
        });
      } else {
        let data = await db.Specialty.findOne({
          where: { id: inputId },
          attributes: ['descriptionHTML', 'descriptionMarkdown'],
        });

        if (data) {
          let doctorSpecialty = [];
          if (location === 'ALL') {
            doctorSpecialty = await db.Doctor_Info.findAll({
              where: { specialtyId: inputId },
              attributes: ['doctorId', 'provinceId'],
            });
          } else {
            doctorSpecialty = await db.Doctor_Info.findAll({
              where: { specialtyId: inputId, provinceId: location },
              attributes: ['doctorId', 'provinceId'],
            });
          }
          data.doctorSpecialty = doctorSpecialty;
        } else {
          data = {};
        }
        resolve({
          errCode: 0,
          errMessage: 'OK',
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteSpecialty = async (id) => {
  try {
    let specialty = await db.Specialty.findOne({
      where: { id: id },
    });
    if (!specialty) {
      return {
        errCode: 2,
        errMessage: 'User not exist',
      };
    }

    await db.Specialty.destroy({
      where: { id: id },
    });

    return {
      errCode: 0,
      message: 'Specialty deleted',
    };
  } catch (err) {
    console.error(err);
  }
};

let updateSpecialtyData = async (data) => {
  try {
    if (!data.id) {
      return {
        errCode: 2,
        errMessage: 'Missing parameter',
      };
    }
    let specialty = await db.Specialty.findOne({
      where: { id: data.id },
      raw: false,
    });
    if (specialty) {
      specialty.name = data.name;
      specialty.descriptionHTML = data.descriptionHTML;
      specialty.descriptionMarkdown = data.descriptionMarkdown;
      specialty.image = data.image;

      await specialty.save();
      return {
        errCode: 0,
        errMessage: 'Updated successfully',
      };
    } else {
      return {
        errCode: 1,
        errMessage: 'Specialty not found',
      };
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  createSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
  deleteSpecialty,
  updateSpecialtyData,
};
