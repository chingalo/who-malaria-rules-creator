const request = require('request');
const Promise = require('promise');
const _ = require('lodash');

const sourceHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'Basic ' + new Buffer('admin:district').toString('base64')
};

const destinationHeaders = {
  'Content-Type': 'application/json',
  Authorization:
    'Basic ' + new Buffer('chingalo:Chingalo@111987').toString('base64')
};

const sourceInstance = 'https://scorecard-dev.dhis2.org/dev';
const destinationInstance = 'https://hisptz.info/dev';

const mappers = getOuMappers();
const periods = getPeriods();

startDataMigrationProcess();

async function startDataMigrationProcess() {
  let imported = 0;
  let updated = 0;
  let ignored = 0;
  let total = 0;
  for (let period of _.reverse(periods)) {
    const { startDate } = period;
    const { endDate } = period;
    console.log('Discovering data from ' + startDate + ' to ' + endDate);
    let dataValuesToImport = [];
    const dataValues = await getDataValuesFromSource(
      sourceInstance,
      startDate,
      endDate
    );
    if (dataValues && dataValues.length > 0) {
      for (mapper of mappers) {
        dataValuesToImport = _.concat(
          dataValuesToImport,
          _.map(dataValues, dataValue => {
            const orgUnit = mapper[dataValue.orgUnit]
              ? mapper[dataValue.orgUnit]
              : 'ImspTQPwCqd';
            return {
              ...dataValue,
              orgUnit: orgUnit,
              categoryOptionCombo: '',
              attributeOptionCombo: '',
              storedBy: 'admin'
            };
          })
        );
      }
      total += dataValuesToImport.length;
      console.log(
        'Uploading data from ' +
          startDate +
          ' to ' +
          endDate +
          ' : (' +
          dataValuesToImport.length +
          ')'
      );
      const { importCount, status, conflicts } = await uploadDataValues({
        dataValues: dataValuesToImport
      });
      imported += importCount.imported;
      updated += importCount.updated;
      ignored += importCount.imported;
    }
  }
  console.log('imported : ', imported);
  console.log('updated : ', updated);
  console.log('ignored : ', ignored);
  console.log('total : ', total);
}

async function getDataValuesFromSource(sourceInstance, startDate, endDate) {
  return new Promise(resolve => {
    const url =
      sourceInstance +
      '/api/dataValueSets.json?dataSet=O34y2Kyxx6P&dataSet=VEM58nY22sO&orgUnit=GD7TowwI46c&children=true&startDate=' +
      startDate +
      '&endDate=' +
      endDate;
    request(
      {
        headers: sourceHeaders,
        uri: url,
        method: 'GET'
      },
      (error, response, body) => {
        if (!error && response && response.statusCode === 200) {
          body = JSON.parse(body);
          const { dataValues } = body;
          resolve(
            _.filter(dataValues, dataValue => {
              return dataValue.value !== '0';
            })
          );
        } else {
          resolve([]);
        }
      }
    );
  });
}

async function uploadDataValues(payLoad) {
  return new Promise(resolve => {
    request(
      {
        headers: destinationHeaders,
        uri: destinationInstance + '/api/dataValueSets.json',
        method: 'POST',
        body: JSON.stringify(payLoad)
      },
      (error, response, body) => {
        body = JSON.parse(body);
        const { status } = body;
        const { importCount } = body;
        const { conflicts } = body;
        resolve({
          conflicts,
          importCount,
          status
        });
      }
    );
  });
}

function getPeriods() {
  return [
    { startDate: '2018-01-01', endDate: '2018-06-30' },
    { startDate: '2018-07-01', endDate: '2018-12-31' },
    { startDate: '2017-01-01', endDate: '2017-06-30' },
    { startDate: '2017-07-01', endDate: '2017-12-31' },
    { startDate: '2016-01-01', endDate: '2016-06-30' },
    { startDate: '2016-07-01', endDate: '2016-12-31' },
    { startDate: '2015-01-01', endDate: '2015-06-30' },
    { startDate: '2015-07-01', endDate: '2015-12-31' }
  ];
}

function getOuMappers() {
  return [
    {
      Hq1ZHMHGvQE: 'fdc6uOvgoji',
      P8hBn1kPPau: 'lc3eMKXaEfw',
      WZBBfmci0Hi: 'PMa2VCrupOd',
      U51HyyjrIjK: 'kJq2mPyFEHo',
      I33odCYFs58: 'qhqAxPSTUXp',
      LpDbqIl6guV: 'jmIPBj66vD6',
      RFAMBnKbnZe: 'TEQlaapDQoK',
      R7TPl8q81Ft: 'bL4ooGhyHRQ',
      qo2afflttVq: 'ImspTQPwCqd',
      Ffm4RpW79MF: 'at6UHUQatSo'
    },
    {
      Hq1ZHMHGvQE: 'jUb8gELQApl',
      P8hBn1kPPau: 'YuQRtpLP10I',
      WZBBfmci0Hi: 'vWbkYPRmKyS',
      U51HyyjrIjK: 'O6uvpzGd5pu',
      I33odCYFs58: 'dGheVylzol6',
      LpDbqIl6guV: 'zFDYIgyGmXG',
      RFAMBnKbnZe: 'BGGmAwx33dj',
      qo2afflttVq: 'bL4ooGhyHRQ',
      Ffm4RpW79MF: 'eIQbndfxQMb'
    },
    {
      Hq1ZHMHGvQE: 'daJPPxtIrQn',
      P8hBn1kPPau: 'YmmeuGbqOwR',
      WZBBfmci0Hi: 'U6Kr7Gtpidn',
      U51HyyjrIjK: 'JdhagCUEMbj',
      I33odCYFs58: 'kU8vhUkAGaT',
      LpDbqIl6guV: 'I4jWcnFmgEC',
      RFAMBnKbnZe: 'KctpIIucige',
      qo2afflttVq: 'sxRd2XOzFbz',
      Ffm4RpW79MF: 'npWGUj37qDe'
    },
    {
      Hq1ZHMHGvQE: 'ARZ4y5i4reU',
      P8hBn1kPPau: 'DiszpKrYNg8',
      WZBBfmci0Hi: 'g8upMTyEZGZ',
      U51HyyjrIjK: 'C9uduqDZr9d',
      I33odCYFs58: 'qtr8GGlm4gg',
      LpDbqIl6guV: 'Rp268JB6Ne4',
      RFAMBnKbnZe: 'cDw53Ej8rju',
      qo2afflttVq: 'dQggcljEImF',
      Ffm4RpW79MF: 'ImspTQPwCqd'
    }
  ];
}
