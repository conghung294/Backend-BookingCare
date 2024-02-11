import db from '../models/index';

let createClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter',
        });
      } else {
        await db.Clinic.create({
          image: data.imageBase64,
          name: data.name,
          address: data.address,
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

let getAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll();
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

let getDetailClinicById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter',
        });
      } else {
        let data = await db.Clinic.findOne({
          where: { id: inputId },
          attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown'],
        });

        if (data) {
          let doctorClinic = [];

          doctorClinic = await db.Doctor_Info.findAll({
            where: { clinicId: inputId },
            attributes: ['doctorId', 'provinceId'],
          });
          data.doctorClinic = doctorClinic;
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

let deleteClinic = async (id) => {
  try {
    let clinic = await db.Clinic.findOne({
      where: { id: id },
    });
    if (!clinic) {
      return {
        errCode: 2,
        errMessage: 'User not exist',
      };
    }

    await db.Clinic.destroy({
      where: { id: id },
    });

    return {
      errCode: 0,
      message: 'Clinic deleted',
    };
  } catch (err) {
    console.error(err);
  }
};

let updateClinicData = async (data) => {
  try {
    if (!data.id) {
      return {
        errCode: 2,
        errMessage: 'Missing parameter',
      };
    }
    let clinic = await db.Clinic.findOne({
      where: { id: data.id },
      raw: false,
    });
    if (clinic) {
      clinic.name = data.name;
      clinic.address = data.address;
      clinic.descriptionHTML = data.descriptionHTML;
      clinic.descriptionMarkdown = data.descriptionMarkdown;
      clinic.image = data.image;

      await clinic.save();
      return {
        errCode: 0,
        errMessage: 'Updated successfully',
      };
    } else {
      return {
        errCode: 1,
        errMessage: 'Clinic not found',
      };
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  createClinic,
  getAllClinic,
  getDetailClinicById,
  deleteClinic,
  updateClinicData,
};
