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

module.exports = {
  createClinic,
  getAllClinic,
  getDetailClinicById,
};
