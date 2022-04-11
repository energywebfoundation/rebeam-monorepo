import { ISession } from '@energyweb/ocn-bridge';

export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

export const formatSessionforDb = (session: ISession) => {
  const {
    cdr_token: { uid },
  } = session;
  return Object.assign({}, session, {
    session_token: uid,
  });
};
