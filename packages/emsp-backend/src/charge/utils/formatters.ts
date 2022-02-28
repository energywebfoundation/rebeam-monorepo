import * as moment from 'moment';

export const formatCurrency = (
  countryCode: string,
  cost: number,
  currency: string
) => {
  const currencyLookup = {
    DE: 'de-DE',
  };
  const formattedCost = new Intl.NumberFormat(
    `${currencyLookup[countryCode]}`,
    { style: 'currency', currency: currency }
  ).format(cost);
  return formattedCost;
};

export const formatStartTime = (startTime: Date) => {
  const m = moment(startTime);
  const formattedStartTime = m.format('MMMM Do, YYYY h:mma');
  console.log(formattedStartTime, 'THE FORMATTED TIME');
  return formattedStartTime;
};
